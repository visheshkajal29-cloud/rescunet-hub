import React, { useState, useEffect } from 'react';
import { 
  Flame, Waves, Mountain, Wind, AlertCircle, Radio, 
  MapPin, ShieldCheck, Send, Calendar, Shield, Database, LayoutDashboard
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Flood', label: 'Flood', icon: Waves },
  { id: 'Earthquake', label: 'Earthquake', icon: Mountain },
  { id: 'Cyclone', label: 'Cyclone', icon: Wind },
  { id: 'Landslide', label: 'Landslide', icon: Mountain },
  { id: 'Wildfire', label: 'Wildfire', icon: Flame },
  { id: 'Tsunami', label: 'Tsunami', icon: Waves },
  { id: 'Other', label: 'Other', icon: AlertCircle }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('report');
  const [disasterType, setDisasterType] = useState('Landslide');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('2026-08-29');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [reports, setReports] = useState(() => JSON.parse(localStorage.getItem('rescunet_reports') || '[]'));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`),
        () => setLocation('Location permission denied')
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: Date.now(),
      disasterType,
      location: location || 'Unspecified GPS Location',
      date,
      severity,
      description: description || 'No situation details specified.',
      timestamp: new Date().toLocaleTimeString()
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('rescunet_reports', JSON.stringify(updated));
    setDescription('');
    alert('Incident Report Sent Successfully!');
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header>
        <div className="brand">
          <div className="brand-icon"><Flame size={20} color="#fff" /></div>
          <span>DisasterReport</span>
        </div>
        <nav className="nav-center">
          <span className={`nav-link ${activeTab === 'report' ? 'active' : ''}`} onClick={() => setActiveTab('report')}>Report</span>
          <span className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</span>
          <span className="nav-link">How it works</span>
        </nav>
        <div className="header-right">
          <div className="status-badge"><Radio size={12} /> Online</div>
          <button className="report-now-btn" onClick={() => setActiveTab('report')}>Report now →</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <div className="hero-pill">
            <Radio size={14} /> Community Emergency Network
          </div>
          <h1 className="hero-title">Turn a warning<br />into action.</h1>
          <p className="hero-desc">
            Report natural disasters in seconds. Your information reaches the central dashboard and helps teams understand where incidents are happening.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setActiveTab('report')}>
              <Flame size={18} /> Report a disaster →
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} /> View dashboard
            </button>
          </div>
        </div>

        {/* Live Incident Radar Widget */}
        <div className="radar-box">
          <div className="radar-header">
            <span className="radar-title">INCIDENT RADAR</span>
            <span className="live-tag">● LIVE</span>
          </div>
          <div className="radar-circle">
            <div className="radar-line-v"></div>
            <div className="radar-line-h"></div>
            <div className="radar-dot dot-1"></div>
            <div className="radar-dot dot-2"></div>
            <div className="radar-dot dot-3"></div>
          </div>
          <div className="radar-footer">
            <Radio size={14} color="#10b981" /> 3 active signals detected
          </div>
        </div>
      </section>

      {/* Report Form Section */}
      {activeTab === 'report' && (
        <section className="form-card">
          <div className="form-header">
            <div className="form-title-group">
              <h3>ONE SIMPLE FORM</h3>
              <h2>Report an Incident</h2>
            </div>
            <div className="secure-badge"><ShieldCheck size={16} color="#10b981" /> Secure</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field-group" style={{ marginBottom: '16px' }}>
              <label>Disaster type</label>
              <div className="category-grid">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div 
                      key={cat.id} 
                      className={`category-item ${disasterType === cat.id ? 'selected' : ''}`}
                      onClick={() => setDisasterType(cat.id)}
                    >
                      <Icon size={20} color={disasterType === cat.id ? '#ea580c' : '#9ca3af'} />
                      <span>{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="input-row">
              <div className="field-group">
                <label>Location</label>
                <input 
                  type="text" 
                  className="input-box" 
                  placeholder="City, state or coordinates" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label>Date</label>
                <input 
                  type="date" 
                  className="input-box" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="severity-row field-group">
              <label>Severity</label>
              <div className="severity-picker">
                {['Low', 'Medium', 'High', 'Critical'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`severity-btn ${severity === s ? 'active' : ''} ${s === 'Critical' && severity === 'Critical' ? 'critical' : ''}`}
                    onClick={() => setSeverity(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group" style={{ marginBottom: '24px' }}>
              <label>Description</label>
              <textarea 
                rows="3" 
                className="input-box" 
                placeholder="What happened? Add useful details such as affected area, people at risk, or visible damage."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
              <Send size={18} /> Submit Report
            </button>
          </form>
        </section>
      )}

      {/* Dashboard Section */}
      {activeTab === 'dashboard' && (
        <section className="form-card">
          <div className="form-header">
            <div className="form-title-group">
              <h3>LIVE OPERATIONS</h3>
              <h2>Incident Dashboard</h2>
            </div>
            <div className="status-badge"><Radio size={14} /> Connected to server</div>
          </div>

          {reports.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No reports submitted yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {reports.map((r) => (
                <div key={r.id} style={{ background: '#181a20', padding: '20px', borderRadius: '12px', borderLeft: `5px solid ${r.severity === 'Critical' ? '#ef4444' : '#ea580c'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{r.disasterType} <span style={{ fontSize: '0.85rem', color: '#ea580c' }}>({r.severity})</span></strong>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{r.date} - {r.timestamp}</span>
                  </div>
                  <p style={{ color: '#d1d5db', marginBottom: '12px' }}>{r.description}</p>
                  <small style={{ color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {r.location}
                  </small>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Features Bottom Bar */}
      <section className="features-grid">
        <div className="feature-card">
          <Radio size={24} className="feature-icon" />
          <h4>Offline-first</h4>
          <p>Reports are queued locally when there is no connection. They sync automatically when internet access returns.</p>
        </div>
        <div className="feature-card">
          <Database size={24} className="feature-icon" />
          <h4>Central database</h4>
          <p>With the server running, submitted reports are stored safely and appear on the dashboard for your team.</p>
        </div>
        <div className="feature-card">
          <Shield size={24} className="feature-icon" />
          <h4>Simple & focused</h4>
          <p>A clean form reduces the time needed to send useful disaster information when every second counts.</p>
        </div>
      </section>
    </div>
  );
}