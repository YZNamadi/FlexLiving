import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const approvedPath = path.join(process.cwd(), 'data', 'approved_reviews.json');
  if (req.method === 'GET') {
    const approvedRaw = fs.readFileSync(approvedPath, 'utf-8');
    const approvedIds = JSON.parse(approvedRaw).approvedIds || [];
    res.status(200).json({ approvedIds });
    return;
  }
  if (req.method === 'POST') {
    const body = req.body || {};
    const id = body.id;
    const approved = !!body.approved;
    const approvedRaw = fs.readFileSync(approvedPath, 'utf-8');
    const obj = JSON.parse(approvedRaw);
    const set = new Set(obj.approvedIds || []);
    if (approved) set.add(id); else set.delete(id);
    fs.writeFileSync(approvedPath, JSON.stringify({ approvedIds: Array.from(set) }, null, 2));
    res.status(200).json({ approvedIds: Array.from(set) });
    return;
  }
  res.status(405).end();
}
