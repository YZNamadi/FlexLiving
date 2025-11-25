const express = require('express');
const path = require('path');
const fs = require('fs');

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

const app = express();
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('/api/reviews/hostaway', (req, res) => {
  const dataPath = path.join(process.cwd(), 'data', 'hostaway_reviews.json');
  const approvedPath = path.join(process.cwd(), 'data', 'approved_reviews.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const approvedRaw = fs.readFileSync(approvedPath, 'utf-8');
  const approvedIds = JSON.parse(approvedRaw).approvedIds || [];
  const payload = JSON.parse(raw);
  const reviews = Array.isArray(payload.result) ? payload.result.map(e => normalizeEntry(e, approvedIds)) : [];
  const listings = aggregateByListing(reviews);
  res.status(200).json({ status: 'success', data: { reviews, listings } });
});

app.get('/api/reviews/approved', (req, res) => {
  const approvedPath = path.join(process.cwd(), 'data', 'approved_reviews.json');
  const approvedRaw = fs.readFileSync(approvedPath, 'utf-8');
  const approvedIds = JSON.parse(approvedRaw).approvedIds || [];
  res.status(200).json({ approvedIds });
});

app.post('/api/reviews/approved', (req, res) => {
  const approvedPath = path.join(process.cwd(), 'data', 'approved_reviews.json');
  const body = req.body || {};
  const id = body.id;
  const approved = !!body.approved;
  const approvedRaw = fs.readFileSync(approvedPath, 'utf-8');
  const obj = JSON.parse(approvedRaw);
  const set = new Set(obj.approvedIds || []);
  if (approved) set.add(id); else set.delete(id);
  fs.writeFileSync(approvedPath, JSON.stringify({ approvedIds: Array.from(set) }, null, 2));
  res.status(200).json({ approvedIds: Array.from(set) });
});

app.get('/api/reviews/google', async (req, res) => {
  const key = process.env.GOOGLE_API_KEY;
  const placeId = req.query.placeId || '';
  if (!key || !placeId) {
    res.status(200).json({ status: 'disabled', reason: 'missing key or placeId', data: { reviews: [] } });
    return;
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews,rating,user_ratings_total&key=${key}`;
    const r = await fetch(url);
    const j = await r.json();
    const reviews = (j.result?.reviews || []).map(x => ({
      id: `${x.author_name}-${x.time}`,
      listingName: 'Google Place',
      type: 'guest-to-host',
      status: 'published',
      channel: 'google',
      rating10: Math.round((x.rating / 5) * 100) / 10,
      rating5: x.rating,
      text: x.text || '',
      categories: {},
      submittedAt: new Date(x.time * 1000).toISOString(),
      guestName: x.author_name || null,
      source: 'Google',
      approved: false
    }));
    res.status(200).json({ status: 'success', data: { reviews } });
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'google fetch failed' });
  }
});

app.get('*', (req, res) => {
  const indexFile = path.join(distPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
    return;
  }
  res.status(500).send('Frontend build missing. Run npm run build:frontend during deploy.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
