import React from 'react';
import './MetricCard.css';

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  icon, 
  status = 'normal',
  subtitle,
  onClick 
}) => {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'stable': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div 
      className={`metric-card metric-card-${status} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <div className="metric-info">
          <h3 className="metric-title">{title}</h3>
          {subtitle && <p className="metric-subtitle">{subtitle}</p>}
        </div>
      </div>
      
      <div className="metric-value-container">
        <span className="metric-value">
          {value}
          {unit && <span className="metric-unit">{unit}</span>}
        </span>
        
        {trend && (
          <div className="metric-trend" style={{ color: getTrendColor(trend) }}>
            <span className="trend-icon">{getTrendIcon(trend)}</span>
            {trendValue && <span className="trend-value">{trendValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
