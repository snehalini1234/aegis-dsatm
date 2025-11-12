// In-memory profile storage (for demo - use a database in production)
const profiles = {};

export default function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    const profile = profiles[userId] || null;
    return res.status(200).json({ profile });
  }

  if (req.method === 'POST') {
    // Update profile
    if (!profiles[userId]) {
      profiles[userId] = { stats: {}, sessions: 0 };
    }
    profiles[userId] = { ...profiles[userId], ...req.body };
    return res.status(200).json({ profile: profiles[userId] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
