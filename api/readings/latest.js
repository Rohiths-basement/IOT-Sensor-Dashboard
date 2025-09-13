import { getDatabase } from '../db.js';

export default function handler(req, res) {
  const db = getDatabase();

  if (req.method === 'GET') {
    try {
      // Get the most recent reading for each device
      const latestReadings = db.prepare(`
        SELECT r1.* FROM readings r1
        INNER JOIN (
          SELECT deviceId, MAX(timestamp) as max_timestamp
          FROM readings
          GROUP BY deviceId
        ) r2 ON r1.deviceId = r2.deviceId AND r1.timestamp = r2.max_timestamp
        ORDER BY r1.deviceId
      `).all();

      res.status(200).json({
        latestReadings,
        count: latestReadings.length
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch latest readings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
