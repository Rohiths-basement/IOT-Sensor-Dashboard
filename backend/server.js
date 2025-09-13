const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const Joi = require('joi');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'sensor_data.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deviceId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      nitrogen REAL NOT NULL,
      phosphorus REAL NOT NULL,
      ph REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Validation schema
const readingSchema = Joi.object({
  deviceId: Joi.string().required().min(1).max(50),
  timestamp: Joi.string().isoDate().required(),
  nitrogen: Joi.number().min(0).max(1000).required(),
  phosphorus: Joi.number().min(0).max(500).required(),
  ph: Joi.number().min(0).max(14).required()
});

// Routes

// POST /api/readings - Submit a new sensor reading
app.post('/api/readings', (req, res) => {
  const { error, value } = readingSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(detail => detail.message)
    });
  }

  const { deviceId, timestamp, nitrogen, phosphorus, ph } = value;

  db.run(
    `INSERT INTO readings (deviceId, timestamp, nitrogen, phosphorus, ph) 
     VALUES (?, ?, ?, ?, ?)`,
    [deviceId, timestamp, nitrogen, phosphorus, ph],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save reading' });
      }
      
      res.status(201).json({
        id: this.lastID,
        deviceId,
        timestamp,
        nitrogen,
        phosphorus,
        ph,
        message: 'Reading saved successfully'
      });
    }
  );
});

// GET /api/readings - Get all readings (last 24 hours)
app.get('/api/readings', (req, res) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  db.all(
    `SELECT * FROM readings 
     WHERE timestamp >= ? 
     ORDER BY timestamp DESC`,
    [twentyFourHoursAgo],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch readings' });
      }
      
      res.json({
        readings: rows,
        count: rows.length,
        timeRange: '24 hours'
      });
    }
  );
});

// GET /api/readings/latest - Get the most recent reading for each device
app.get('/api/readings/latest', (req, res) => {
  db.all(
    `SELECT r1.* FROM readings r1
     INNER JOIN (
       SELECT deviceId, MAX(timestamp) as max_timestamp
       FROM readings
       GROUP BY deviceId
     ) r2 ON r1.deviceId = r2.deviceId AND r1.timestamp = r2.max_timestamp
     ORDER BY r1.timestamp DESC`,
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch latest readings' });
      }
      
      res.json({
        latestReadings: rows,
        count: rows.length
      });
    }
  );
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = app;
