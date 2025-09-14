import React from 'react';
import './AlertBanner.css';

const AlertBanner = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="alert-banner">
      <div className="alert-header">
        <span className="alert-icon">⚠️</span>
        <h3>System Alerts</h3>
        <span className="alert-count">{alerts.length}</span>
      </div>
      
      <div className="alert-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.type}`}>
            <span className="alert-message">{alert.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertBanner;
