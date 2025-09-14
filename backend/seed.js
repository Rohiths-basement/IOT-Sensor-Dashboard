const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'sensor_data.db');
const db = new sqlite3.Database(dbPath);

// Generate comprehensive sample data
const generateSampleReadings = () => {
  const readings = [];
  const devices = ['GH001', 'GH002', 'GH003', 'GH004', 'GH005', 'GH006', 'GH007', 'GH008', 'GH009', 'GH010', 'GH011', 'GH012'];
  const now = new Date();
  
  // Generate readings for the last 7 days, every 2 hours per device
  for (let day = 6; day >= 0; day--) {
    for (let hour = 0; hour < 24; hour += 2) {
      for (const deviceId of devices) {
        const timestamp = new Date(now.getTime() - (day * 24 * 60 * 60 * 1000) - (hour * 60 * 60 * 1000));
        
        // Base values with device-specific characteristics
        const deviceBase = {
          'GH001': { nitrogen: 150, phosphorus: 45, ph: 6.5 },
          'GH002': { nitrogen: 170, phosphorus: 40, ph: 6.3 },
          'GH003': { nitrogen: 190, phosphorus: 50, ph: 6.7 },
          'GH004': { nitrogen: 140, phosphorus: 35, ph: 6.2 },
          'GH005': { nitrogen: 160, phosphorus: 42, ph: 6.4 },
          'GH006': { nitrogen: 180, phosphorus: 48, ph: 6.6 },
          'GH007': { nitrogen: 130, phosphorus: 38, ph: 6.1 },
          'GH008': { nitrogen: 200, phosphorus: 52, ph: 6.8 },
          'GH009': { nitrogen: 145, phosphorus: 44, ph: 6.3 },
          'GH010': { nitrogen: 175, phosphorus: 46, ph: 6.5 },
          'GH011': { nitrogen: 165, phosphorus: 41, ph: 6.4 },
          'GH012': { nitrogen: 155, phosphorus: 43, ph: 6.6 }
        };
        
        const base = deviceBase[deviceId];
        
        // Add realistic variations and trends
        const timeOfDay = hour / 24;
        const dayOfWeek = (7 - day) % 7;
        
        // Daily cycles (higher nutrients in morning, pH fluctuations)
        const dailyCycle = Math.sin(timeOfDay * 2 * Math.PI) * 0.1;
        const weekCycle = Math.sin(dayOfWeek * 2 * Math.PI / 7) * 0.05;
        
        // Random variations
        const nitrogenVariation = (Math.random() - 0.5) * 40;
        const phosphorusVariation = (Math.random() - 0.5) * 15;
        const phVariation = (Math.random() - 0.5) * 0.8;
        
        // Seasonal trend (gradual increase over time)
        const seasonalTrend = day * 0.5;
        
        // Calculate final values
        let nitrogen = base.nitrogen + nitrogenVariation + (dailyCycle * 20) + (weekCycle * 10) - seasonalTrend;
        let phosphorus = base.phosphorus + phosphorusVariation + (dailyCycle * 8) + (weekCycle * 5);
        let ph = base.ph + phVariation + (dailyCycle * 0.3) + (weekCycle * 0.2);
        
        // Introduce some alert conditions (about 15% of readings)
        if (Math.random() < 0.08) {
          nitrogen = Math.random() < 0.5 ? 220 + Math.random() * 80 : nitrogen; // High nitrogen
        }
        if (Math.random() < 0.07) {
          ph = Math.random() < 0.5 ? 5.2 + Math.random() * 0.6 : 7.2 + Math.random() * 0.6; // pH out of range
        }
        
        // Ensure values stay within realistic bounds
        nitrogen = Math.max(80, Math.min(350, nitrogen));
        phosphorus = Math.max(20, Math.min(80, phosphorus));
        ph = Math.max(4.5, Math.min(8.5, ph));
        
        // Only include readings from the last 24 hours for the main dataset
        // But add some older readings for historical context
        const hoursAgo = day * 24 + hour;
        if (hoursAgo <= 24 || Math.random() < 0.1) {
          readings.push({
            deviceId,
            timestamp: timestamp.toISOString(),
            nitrogen: Math.round(nitrogen * 10) / 10,
            phosphorus: Math.round(phosphorus * 10) / 10,
            ph: Math.round(ph * 100) / 100
          });
        }
      }
    }
  }
  
  // Add some recent high-frequency readings for the last 4 hours (every 30 minutes)
  for (let minutes = 240; minutes >= 0; minutes -= 30) {
    for (const deviceId of ['GH001', 'GH003', 'GH005', 'GH007', 'GH009', 'GH011']) { // Select devices for high-freq
      const timestamp = new Date(now.getTime() - (minutes * 60 * 1000));
      
      const deviceBase = {
        'GH001': { nitrogen: 150, phosphorus: 45, ph: 6.5 },
        'GH003': { nitrogen: 190, phosphorus: 50, ph: 6.7 },
        'GH005': { nitrogen: 160, phosphorus: 42, ph: 6.4 },
        'GH007': { nitrogen: 130, phosphorus: 38, ph: 6.1 },
        'GH009': { nitrogen: 145, phosphorus: 44, ph: 6.3 },
        'GH011': { nitrogen: 165, phosphorus: 41, ph: 6.4 }
      };
      
      const base = deviceBase[deviceId];
      const variation = (Math.random() - 0.5) * 20;
      
      let nitrogen = base.nitrogen + variation;
      let phosphorus = base.phosphorus + (Math.random() - 0.5) * 8;
      let ph = base.ph + (Math.random() - 0.5) * 0.4;
      
      // Occasional spikes for demonstration
      if (Math.random() < 0.1) {
        nitrogen = 210 + Math.random() * 40;
      }
      
      readings.push({
        deviceId,
        timestamp: timestamp.toISOString(),
        nitrogen: Math.round(nitrogen * 10) / 10,
        phosphorus: Math.round(phosphorus * 10) / 10,
        ph: Math.round(ph * 100) / 100
      });
    }
  }
  
  // Sort by timestamp
  return readings.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

const sampleReadings = generateSampleReadings();

console.log('Seeding database with sample data...');

db.serialize(() => {
  // Create table if it doesn't exist
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
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table created or already exists');
  });

  // Clear existing data
  db.run('DELETE FROM readings', (err) => {
    if (err) {
      console.error('Error clearing existing data:', err);
      return;
    }
    console.log('Cleared existing readings');
  });

  // Insert sample data
  const stmt = db.prepare(`
    INSERT INTO readings (deviceId, timestamp, nitrogen, phosphorus, ph) 
    VALUES (?, ?, ?, ?, ?)
  `);

  sampleReadings.forEach((reading, index) => {
    stmt.run([
      reading.deviceId,
      reading.timestamp,
      reading.nitrogen,
      reading.phosphorus,
      reading.ph
    ], (err) => {
      if (err) {
        console.error(`Error inserting reading ${index + 1}:`, err);
      } else {
        console.log(`✓ Inserted reading for ${reading.deviceId} at ${reading.timestamp}`);
      }
    });
  });

  stmt.finalize(() => {
    console.log(`\nSeeding completed! Inserted ${sampleReadings.length} sample readings.`);
    console.log('Devices included: GH001, GH002, GH003, GH004, GH005, GH006, GH007, GH008, GH009, GH010, GH011, GH012');
    console.log('Some readings include alert conditions (nitrogen > 200 or pH outside 6.0-7.0)');
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
});
