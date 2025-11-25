import fs from 'fs';
import path from 'path';

function normalizeEntry(entry, approvedIds) {
  const categories = {};
  if (Array.isArray(entry.reviewCategory)) {
    for (const c of entry.reviewCategory) {
      categories[c.category] = c.rating;
    }
  }
  const ratings = Object.values(categories);
  const hasRating = typeof entry.rating === 'number';
  const avg10 = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : hasRating ? entry.rating : null;
  const rating5 = typeof avg10 === 'number' ? Math.round((avg10 / 10) * 50) / 10 : null;
  return {
    id: entry.id,
    listingName: entry.listingName,
    type: entry.type,
    status: entry.status,
    channel: entry.channel || 'hostaway',
    rating10: avg10,
    rating5,
    text: entry.publicReview || '',
    categories,
    submittedAt: new Date(entry.submittedAt).toISOString(),
    guestName: entry.guestName || null,
    source: 'Hostaway',
    approved: approvedIds.includes(entry.id)
  };
}

function aggregateByListing(reviews) {
  const map = {};
  for (const r of reviews) {
    if (!map[r.listingName]) map[r.listingName] = { total: 0, avg10: 0, categories: {} };
    const m = map[r.listingName];
    m.total += 1;
    if (typeof r.rating10 === 'number') m.avg10 += r.rating10;
    for (const [k, v] of Object.entries(r.categories)) {
      if (!m.categories[k]) m.categories[k] = { sum: 0, count: 0 };
      m.categories[k].sum += v;
      m.categories[k].count += 1;
    }
  }
  const result = {};
  for (const [listing, m] of Object.entries(map)) {
    const cats = {};
    for (const [k, v] of Object.entries(m.categories)) {
      cats[k] = Math.round((v.sum / v.count) * 10) / 10;
    }
    result[listing] = {
      totalReviews: m.total,
      avg10: m.total ? Math.round((m.avg10 / m.total) * 10) / 10 : null,
      avg5: m.total ? Math.round(((m.avg10 / m.total) / 10) * 50) / 10 : null,
      categoryAverages: cats
    };
  }
  return result;
}

export default function handler(req, res) {
  const dataPath = path.join(process.cwd(), 'data', 'hostaway_reviews.json');
  const approvedPath = path.join(process.cwd(), 'data', 'approved_reviews.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const approvedRaw = fs.readFileSync(approvedPath, 'utf-8');
  const approvedIds = JSON.parse(approvedRaw).approvedIds || [];
  const payload = JSON.parse(raw);
  const reviews = Array.isArray(payload.result) ? payload.result.map(e => normalizeEntry(e, approvedIds)) : [];
  const listings = aggregateByListing(reviews);
  res.status(200).json({ status: 'success', data: { reviews, listings } });
}
