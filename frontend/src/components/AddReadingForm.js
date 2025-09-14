import React, { useState } from 'react';
import './AddReadingForm.css';

const AddReadingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    deviceId: '',
    nitrogen: '',
    phosphorus: '',
    ph: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
    if (success) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccess(false);

    // Client-side validation
    const validationErrors = [];
    
    if (!formData.deviceId.trim()) {
      validationErrors.push('Device ID is required');
    }
    
    const nitrogen = parseFloat(formData.nitrogen);
    if (isNaN(nitrogen) || nitrogen < 0 || nitrogen > 1000) {
      validationErrors.push('Nitrogen must be between 0 and 1000 ppm');
    }
    
    const phosphorus = parseFloat(formData.phosphorus);
    if (isNaN(phosphorus) || phosphorus < 0 || phosphorus > 500) {
      validationErrors.push('Phosphorus must be between 0 and 500 ppm');
    }
    
    const ph = parseFloat(formData.ph);
    if (isNaN(ph) || ph < 0 || ph > 14) {
      validationErrors.push('pH must be between 0 and 14');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    // Prepare submission data
    const submissionData = {
      deviceId: formData.deviceId.trim(),
      timestamp: new Date().toISOString(),
      nitrogen: nitrogen,
      phosphorus: phosphorus,
      ph: ph
    };

    try {
      const result = await onSubmit(submissionData);
      
      if (result.success) {
        setSuccess(true);
        setFormData({
          deviceId: '',
          nitrogen: '',
          phosphorus: '',
          ph: ''
        });
      } else {
        setErrors(result.error || ['Failed to submit reading']);
      }
    } catch (error) {
      setErrors(['An unexpected error occurred']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-reading-form">
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-message">❌ {error}</p>
            ))}
          </div>
        )}

        {success && (
          <div className="success-message">
            ✅ Reading submitted successfully!
          </div>
        )}

        <div className="form-group">
          <label htmlFor="deviceId">Device ID</label>
          <input
            type="text"
            id="deviceId"
            name="deviceId"
            value={formData.deviceId}
            onChange={handleChange}
            placeholder="e.g., GH001"
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nitrogen">Nitrogen (ppm)</label>
            <input
              type="number"
              id="nitrogen"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleChange}
              placeholder="0-1000"
              min="0"
              max="1000"
              step="0.1"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phosphorus">Phosphorus (ppm)</label>
            <input
              type="number"
              id="phosphorus"
              name="phosphorus"
              value={formData.phosphorus}
              onChange={handleChange}
              placeholder="0-500"
              min="0"
              max="500"
              step="0.1"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ph">pH Level</label>
            <input
              type="number"
              id="ph"
              name="ph"
              value={formData.ph}
              onChange={handleChange}
              placeholder="0-14"
              min="0"
              max="14"
              step="0.1"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-small"></span>
              Submitting...
            </>
          ) : (
            'Add Reading'
          )}
        </button>
      </form>

      <div className="form-info">
        <h4>Valid Ranges:</h4>
        <ul>
          <li>Nitrogen: 0-1000 ppm</li>
          <li>Phosphorus: 0-500 ppm</li>
          <li>pH: 0-14 (optimal: 6.0-7.0)</li>
        </ul>
        <p className="alert-info">
          ⚠️ Alerts will be triggered for nitrogen &gt; 200 ppm or pH outside 6.0-7.0 range
        </p>
      </div>
    </div>
  );
};

export default AddReadingForm;
