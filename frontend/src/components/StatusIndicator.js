import React from 'react';
import './StatusIndicator.css';

const StatusIndicator = ({ status, label, count }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'online':
        return { color: '#10b981', icon: '●', text: 'Online' };
      case 'warning':
        return { color: '#f59e0b', icon: '⚠', text: 'Warning' };
      case 'error':
        return { color: '#ef4444', icon: '●', text: 'Error' };
      case 'offline':
        return { color: '#6b7280', icon: '●', text: 'Offline' };
      default:
        return { color: '#6b7280', icon: '●', text: 'Unknown' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`status-indicator status-${status}`}>
      <div className="status-icon" style={{ color: config.color }}>
        {config.icon}
      </div>
      <div className="status-content">
        <span className="status-text">{config.text}</span>
        {label && <span className="status-label">{label}</span>}
        {count !== undefined && <span className="status-count">{count}</span>}
      </div>
    </div>
  );
};

export default StatusIndicator;
