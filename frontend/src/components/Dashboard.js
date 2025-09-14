import React, { useState } from 'react';
import './Dashboard.css';
import Pagination from './Pagination';

const Dashboard = ({ readings, loading, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p>Loading sensor data...</p>
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <div className="dashboard-empty">
        <div className="empty-icon">📊</div>
        <h3 className="empty-title">No sensor data available</h3>
        <p className="empty-description">
          Connect your sensors or add manual readings to get started.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(readings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReadings = readings.slice(startIndex, startIndex + itemsPerPage);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (reading) => {
    if (reading.nitrogen > 200 || reading.ph < 6.0 || reading.ph > 7.0) {
      return 'status-warning';
    }
    return 'status-normal';
  };

  const getTrendIndicator = (value, type) => {
    // Simple trend simulation based on value ranges
    if (type === 'nitrogen') {
      if (value > 180) return { trend: 'up', text: 'Rising' };
      if (value < 140) return { trend: 'down', text: 'Falling' };
      return { trend: 'stable', text: 'Stable' };
    }
    return { trend: 'stable', text: 'Normal' };
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="readings-count">{readings.length} active sensors</span>
        <button onClick={onRefresh} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </div>

      <div className="dashboard-grid">
        {paginatedReadings.map((reading) => {
          const nitrogenTrend = getTrendIndicator(reading.nitrogen, 'nitrogen');
          return (
            <div key={reading.deviceId} className={`reading-card ${getStatusColor(reading)}`}>
              <div className="card-header">
                <div className="device-info">
                  <div className="device-avatar">
                    {reading.deviceId.slice(-2)}
                  </div>
                  <div>
                    <h3>{reading.deviceId}</h3>
                    <div className="device-status">Online</div>
                  </div>
                </div>
                <span className="timestamp">
                  {formatTimestamp(reading.timestamp)}
                </span>
              </div>
              
              <div className="card-body">
                <div className="metric">
                  <span className="metric-label">Nitrogen</span>
                  <span className="metric-value">
                    {reading.nitrogen.toFixed(1)} <small>ppm</small>
                  </span>
                  <div className={`metric-trend trend-${nitrogenTrend.trend}`}>
                    {nitrogenTrend.text}
                  </div>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Phosphorus</span>
                  <span className="metric-value">
                    {reading.phosphorus.toFixed(1)} <small>ppm</small>
                  </span>
                  <div className="metric-trend trend-stable">
                    Normal
                  </div>
                </div>
                
                <div className="metric">
                  <span className="metric-label">pH Level</span>
                  <span className="metric-value">
                    {reading.ph.toFixed(2)}
                  </span>
                  <div className={`metric-trend ${reading.ph >= 6.0 && reading.ph <= 7.0 ? 'trend-stable' : 'trend-down'}`}>
                    {reading.ph >= 6.0 && reading.ph <= 7.0 ? 'Optimal' : 'Alert'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={readings.length}
      />
    </div>
  );
};

export default Dashboard;
