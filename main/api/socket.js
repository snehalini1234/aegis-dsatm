// WebSocket handler for Vercel (using serverless functions)
// Note: Vercel's serverless functions don't support persistent WebSocket connections
// For real-time functionality, consider using:
// 1. Socket.io with Redis adapter
// 2. Supabase Realtime
// 3. A dedicated server on Railway/Render

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  return res.status(200).json({
    message: 'WebSocket endpoint - use a dedicated server for WebSocket connections',
    note: 'Vercel serverless functions do not support persistent WebSocket connections'
  });
}
