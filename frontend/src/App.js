import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import NitrogenChart from './components/NitrogenChart';
import AddReadingForm from './components/AddReadingForm';
import AlertBanner from './components/AlertBanner';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

function App() {
  const [latestReadings, setLatestReadings] = useState([]);
  const [allReadings, setAllReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [latestResponse, allResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/readings/latest`),
        axios.get(`${API_BASE_URL}/readings`)
      ]);

      setLatestReadings(latestResponse.data.latestReadings);
      setAllReadings(allResponse.data.readings);
      
      // Check for alerts
      checkForAlerts(latestResponse.data.latestReadings);
    } catch (err) {
      setError('Failed to fetch sensor data. Make sure the backend server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check for alert conditions
  const checkForAlerts = (readings) => {
    const newAlerts = [];
    
    readings.forEach(reading => {
      if (reading.nitrogen > 200) {
        newAlerts.push({
          id: `nitrogen-${reading.deviceId}`,
          type: 'warning',
          message: `High nitrogen level detected on ${reading.deviceId}: ${reading.nitrogen} ppm`
        });
      }
      
      if (reading.ph < 6.0 || reading.ph > 7.0) {
        newAlerts.push({
          id: `ph-${reading.deviceId}`,
          type: 'warning',
          message: `pH out of range on ${reading.deviceId}: ${reading.ph} (should be 6.0-7.0)`
        });
      }
    });
    
    setAlerts(newAlerts);
  };

  // Handle new reading submission
  const handleNewReading = async (readingData) => {
    try {
      await axios.post(`${API_BASE_URL}/readings`, readingData);
      // Refresh data after successful submission
      await fetchData();
      return { success: true };
    } catch (err) {
      console.error('Error submitting reading:', err);
      return { 
        success: false, 
        error: err.response?.data?.details || ['Failed to submit reading'] 
      };
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    
    // Set up polling to refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="logo">🌱</div>
            <div className="brand-info">
              <h1>Sensor Dashboard</h1>
              <p>Agricultural monitoring system</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{latestReadings.length}</span>
              <span className="stat-label">Devices</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{allReadings.length}</span>
              <span className="stat-label">Readings</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{alerts.length}</span>
              <span className="stat-label">Alerts</span>
            </div>
          </div>
        </div>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={fetchData}>Retry Connection</button>
          </div>
        )}

        {alerts.length > 0 && (
          <AlertBanner alerts={alerts} />
        )}

        <Overview readings={latestReadings} alerts={alerts} />

        <div className="detailed-sections">
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                <div className="section-icon">📊</div>
                Detailed Sensor Data
              </h2>
            </div>
            <Dashboard readings={latestReadings} loading={loading} onRefresh={fetchData} />
          </section>

          <section className="chart-section">
            <div className="section-header">
              <h2 className="section-title">
                <div className="section-icon">📈</div>
                Nitrogen Trends Analysis
              </h2>
            </div>
            <NitrogenChart readings={allReadings} loading={loading} />
          </section>

          <section className="form-section">
            <div className="section-header">
              <h2 className="section-title">
                <div className="section-icon">➕</div>
                Add New Reading
              </h2>
            </div>
            <AddReadingForm onSubmit={handleNewReading} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
