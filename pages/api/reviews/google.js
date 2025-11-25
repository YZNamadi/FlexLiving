export default async function handler(req, res) {
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
}
