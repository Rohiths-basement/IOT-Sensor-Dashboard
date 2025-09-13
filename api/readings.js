import { getDatabase } from './db.js';

export default function handler(req, res) {
  const db = getDatabase();

  if (req.method === 'GET') {
    try {
      // Get all readings from the last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const readings = db.prepare(`
        SELECT * FROM readings 
        WHERE timestamp >= ? 
        ORDER BY timestamp DESC
      `).all(twentyFourHoursAgo);

      res.status(200).json({
        readings,
        count: readings.length,
        timeRange: '24 hours'
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch readings' });
    }
  } else if (req.method === 'POST') {
    try {
      const { deviceId, timestamp, nitrogen, phosphorus, ph } = req.body;

      // Basic validation
      if (!deviceId || !timestamp || nitrogen === undefined || phosphorus === undefined || ph === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate ranges
      if (nitrogen < 0 || nitrogen > 1000) {
        return res.status(400).json({ error: 'Nitrogen must be between 0-1000 ppm' });
      }
      if (phosphorus < 0 || phosphorus > 500) {
        return res.status(400).json({ error: 'Phosphorus must be between 0-500 ppm' });
      }
      if (ph < 0 || ph > 14) {
        return res.status(400).json({ error: 'pH must be between 0-14' });
      }

      // Insert new reading
      const stmt = db.prepare(`
        INSERT INTO readings (deviceId, timestamp, nitrogen, phosphorus, ph) 
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run([deviceId, timestamp, nitrogen, phosphorus, ph]);

      res.status(201).json({
        message: 'Reading added successfully',
        id: result.lastInsertRowid
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to add reading' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
