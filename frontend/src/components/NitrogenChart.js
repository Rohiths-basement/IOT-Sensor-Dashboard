import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './NitrogenChart.css';

const NitrogenChart = ({ readings, loading }) => {
  const [selectedDevice, setSelectedDevice] = useState('all');
  
  // Get unique device IDs
  const deviceIds = useMemo(() => {
    if (!readings || readings.length === 0) return [];
    const ids = [...new Set(readings.map(r => r.deviceId))].sort();
    return ids;
  }, [readings]);

  // Filter readings based on selected device
  const filteredReadings = useMemo(() => {
    if (!readings || readings.length === 0) return [];
    if (selectedDevice === 'all') {
      return readings;
    }
    return readings.filter(r => r.deviceId === selectedDevice);
  }, [readings, selectedDevice]);

  if (loading) {
    return (
      <div className="chart-loading">
        <div className="spinner"></div>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (!readings || readings.length === 0) {
    return (
      <div className="chart-empty">
        <div className="chart-empty-icon">📈</div>
        <div className="chart-empty-message">No chart data available</div>
      </div>
    );
  }

  // Prepare data for the chart (removed unused variable)

  // Group readings by timestamp and device
  const deviceData = {};
  filteredReadings.forEach(reading => {
    if (!deviceData[reading.deviceId]) {
      deviceData[reading.deviceId] = [];
    }
    deviceData[reading.deviceId].push({
      timestamp: reading.timestamp,
      nitrogen: reading.nitrogen
    });
  });

  // Create time series data
  const allTimestamps = [...new Set(filteredReadings.map(r => r.timestamp))]
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(-30); // Show last 30 data points for better visualization

  const chartDataWithTime = allTimestamps.map(timestamp => {
    const dataPoint = {
      timestamp: new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      })
    };
    
    Object.keys(deviceData).forEach(deviceId => {
      const reading = deviceData[deviceId].find(r => r.timestamp === timestamp);
      dataPoint[deviceId] = reading ? reading.nitrogen : null;
    });
    
    return dataPoint;
  });

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const activeDeviceIds = Object.keys(deviceData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Time: ${label}`}</p>
          {payload.map((entry, index) => {
            const value = entry.value;
            const displayValue = (typeof value === 'number' && !isNaN(value)) ? value.toFixed(1) : 'N/A';
            return (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.dataKey}: ${displayValue} ppm`}
              </p>
            );
          })}
          <div className="alert-line">
            {payload.some(p => typeof p.value === 'number' && p.value > 200) && (
              <p style={{ color: '#ff6b35', fontWeight: 'bold' }}>
                ⚠️ High nitrogen alert level
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="nitrogen-chart">
      <div className="chart-header">
        <div className="chart-controls">
          <div className="device-selector">
            <label htmlFor="device-select">Filter by Device:</label>
            <select 
              id="device-select"
              value={selectedDevice} 
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="device-select"
            >
              <option value="all">All Devices</option>
              {deviceIds.map(deviceId => (
                <option key={deviceId} value={deviceId}>{deviceId}</option>
              ))}
            </select>
          </div>
          <div className="chart-info">
            <div className="chart-stat">
              <span className="stat-number">{chartDataWithTime.length}</span>
              <span className="stat-label">Data Points</span>
            </div>
            <div className="chart-stat">
              <span className="stat-number">{activeDeviceIds.length}</span>
              <span className="stat-label">Active Devices</span>
            </div>
          </div>
        </div>
        <div className="alert-threshold">
          <span className="threshold-icon">⚠️</span>
          Alert Threshold: 200 ppm
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartDataWithTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              angle={-45}
              textAnchor="end"
              height={80}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'Nitrogen (ppm)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Alert threshold line */}
            <ReferenceLine 
              y={200} 
              stroke="#ff6b35" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ value: "Alert Threshold", position: "topRight" }}
            />
            
            {activeDeviceIds.map((deviceId, index) => (
              <Line
                key={deviceId}
                type="monotone"
                dataKey={deviceId}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: colors[index % colors.length], strokeWidth: 3, fill: '#fff' }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <div className="legend-items">
          {deviceIds.map((deviceId, index) => (
            <div key={deviceId} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span>{deviceId}</span>
            </div>
          ))}
          <div className="legend-item">
            <div className="legend-color alert-line"></div>
            <span>Alert Threshold (200 ppm)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NitrogenChart;
