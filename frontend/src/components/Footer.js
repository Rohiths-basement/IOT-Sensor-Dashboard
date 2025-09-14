import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <div className="footer-logo">🌱</div>
            <div>
              <h4>AgriSense Pro</h4>
              <p>Advanced Agricultural Monitoring</p>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h5>System Status</h5>
          <div className="status-items">
            <div className="status-item">
              <span className="status-dot online"></span>
              <span>API Services</span>
            </div>
            <div className="status-item">
              <span className="status-dot online"></span>
              <span>Database</span>
            </div>
            <div className="status-item">
              <span className="status-dot online"></span>
              <span>Real-time Updates</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h5>Quick Stats</h5>
          <div className="quick-stats">
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Monitoring</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h5>Support</h5>
          <div className="support-links">
            <a href="#" className="support-link">Documentation</a>
            <a href="#" className="support-link">API Reference</a>
            <a href="#" className="support-link">Contact Support</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 AgriSense Pro. All rights reserved.</p>
        <p>Built with precision for agricultural excellence</p>
      </div>
    </footer>
  );
};

export default Footer;
