import React from 'react';
import './Overview.css';

const Overview = ({ readings, alerts }) => {
  const calculateOverviewStats = () => {
    if (!readings || readings.length === 0) {
      return {
        totalDevices: 0,
        averageNitrogen: 0,
        averagePhosphorus: 0,
        averagePh: 0,
        alertCount: 0,
        onlineDevices: 0
      };
    }

    const totalDevices = readings.length;
    const onlineDevices = readings.length; // All readings are from online devices
    
    const avgNitrogen = readings.reduce((sum, r) => sum + r.nitrogen, 0) / totalDevices;
    const avgPhosphorus = readings.reduce((sum, r) => sum + r.phosphorus, 0) / totalDevices;
    const avgPh = readings.reduce((sum, r) => sum + r.ph, 0) / totalDevices;
    
    const alertCount = alerts ? alerts.length : 0;

    return {
      totalDevices,
      averageNitrogen: avgNitrogen.toFixed(1),
      averagePhosphorus: avgPhosphorus.toFixed(1),
      averagePh: avgPh.toFixed(2),
      alertCount,
      onlineDevices
    };
  };

  const stats = calculateOverviewStats();

  const getStatusColor = (value, type) => {
    switch (type) {
      case 'nitrogen':
        return value > 200 ? 'warning' : 'normal';
      case 'ph':
        return (value < 6.0 || value > 7.0) ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <div className="overview-section">
      <div className="overview-header">
        <h2>System Overview</h2>
        <p>Real-time agricultural sensor monitoring dashboard</p>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="card-icon devices">📡</div>
          <div className="card-content">
            <div className="card-value">{stats.totalDevices}</div>
            <div className="card-label">Active Devices</div>
            <div className="card-sublabel">{stats.onlineDevices} online</div>
          </div>
        </div>

        <div className={`overview-card ${getStatusColor(stats.averageNitrogen, 'nitrogen')}`}>
          <div className="card-icon nitrogen">🌱</div>
          <div className="card-content">
            <div className="card-value">{stats.averageNitrogen} <span className="unit">ppm</span></div>
            <div className="card-label">Avg Nitrogen</div>
            <div className="card-sublabel">Threshold: 200 ppm</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon phosphorus">⚗️</div>
          <div className="card-content">
            <div className="card-value">{stats.averagePhosphorus} <span className="unit">ppm</span></div>
            <div className="card-label">Avg Phosphorus</div>
            <div className="card-sublabel">Normal range</div>
          </div>
        </div>

        <div className={`overview-card ${getStatusColor(stats.averagePh, 'ph')}`}>
          <div className="card-icon ph">🧪</div>
          <div className="card-content">
            <div className="card-value">{stats.averagePh}</div>
            <div className="card-label">Avg pH Level</div>
            <div className="card-sublabel">Optimal: 6.0-7.0</div>
          </div>
        </div>

        <div className={`overview-card ${stats.alertCount > 0 ? 'warning' : 'normal'}`}>
          <div className="card-icon alerts">⚠️</div>
          <div className="card-content">
            <div className="card-value">{stats.alertCount}</div>
            <div className="card-label">Active Alerts</div>
            <div className="card-sublabel">{stats.alertCount > 0 ? 'Requires attention' : 'All systems normal'}</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon readings">📊</div>
          <div className="card-content">
            <div className="card-value">24h</div>
            <div className="card-label">Data Collection</div>
            <div className="card-sublabel">Continuous monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
