import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, AlertTriangle, Phone, CheckCircle, 
  Flame, CloudRain, Zap, Activity, Info, RefreshCw, Trash2, Home, Map as MapIcon, Settings, DollarSign 
} from 'lucide-react';

const INITIAL_STATS = { critical: 28, urgent: 54, assistance: 91, safe: 312 };

const DISASTER_TYPES = [
  { id: 'earthquake', label: 'Earthquake', icon: Activity },
  { id: 'flood', label: 'Flood', icon: CloudRain },
  { id: 'fire', label: 'Fire', icon: Flame },
  { id: 'cyclone', label: 'Cyclone', icon: Zap },
  { id: 'landslide', label: 'Landslide', icon: AlertTriangle },
  { id: 'heatwave', label: 'Heatwave', icon: Info },
  { id: 'industrial', label: 'Industrial Accident', icon: AlertTriangle },
  { id: 'other', label: 'Other', icon: Info }
];

const PRECAUTIONS = {
  earthquake: {
    during: ["Drop to hands and knees", "Cover head and neck under sturdy table", "Hold on until shaking stops"],
    after: ["Check for injuries", "Stay away from damaged buildings", "Move to an open safe area", "Send SOS if needed"]
  },
  flood: {
    during: ["Move immediately to higher ground", "Do not walk or drive through moving water", "Avoid electrical lines"],
    after: ["Listen to local authorities", "Return home only when safe", "Clean and disinfect everything touched by water"]
  },
  fire: {
    during: ["Stay low to the floor", "Check door handles for heat before opening", "Stop, Drop, and Roll if clothing catches fire"],
    after: ["Do not enter burned buildings", "Seek immediate medical treatment for burns", "Notify emergency responders"]
  }
};

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090, address: 'Detecting Location...' });
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('dm_user')) || null);
  const [complaints, setComplaints] = useState(() => JSON.parse(localStorage.getItem('dm_reports')) || []);
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('dm_stats')) || INITIAL_STATS);
  const [activeReport, setActiveReport] = useState({ type: '', condition: '' });
  const [holdTimer, setHoldTimer] = useState(null);

  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng, address: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E` });
        },
        () => setLocation({ lat: 28.6139, lng: 77.2090, address: 'New Delhi (Default Offline)' })
      );
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dm_reports', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('dm_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if ((screen === 'map' || screen === 'admin') && mapRef.current && window.L) {
      if (leafletMap.current) {
        leafletMap.current.remove();
      }
      const map = window.L.map(mapRef.current).setView([location.lat, location.lng], 13);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      window.L.marker([location.lat, location.lng]).addTo(map).bindPopup('My Location').openPopup();

      complaints.forEach((c) => {
        if (c.lat && c.lng) {
          window.L.marker([c.lat, c.lng]).addTo(map).bindPopup(`${c.type} (${c.condition})`);
        }
      });

      leafletMap.current = map;
    }
  }, [screen, location, complaints]);

  const handleSosHoldStart = () => {
    const timer = setTimeout(() => {
      triggerSos();
    }, 3000);
    setHoldTimer(timer);
  };

  const handleSosHoldEnd = () => {
    if (holdTimer) clearTimeout(holdTimer);
  };

  const triggerSos = () => {
    const newReport = {
      id: 'DM-' + Math.floor(1000 + Math.random() * 9000),
      type: activeReport.type || 'Emergency SOS',
      condition: activeReport.condition || 'CRITICAL',
      lat: location.lat,
      lng: location.lng,
      address: location.address,
      time: new Date().toLocaleTimeString(),
      status: 'Searching'
    };
    setComplaints([newReport, ...complaints]);
    setStats((prev) => ({ ...prev, critical: prev.critical + 1 }));
    setScreen('sos-active');
  };

  const handleDeleteComplaint = (id) => {
    setComplaints(complaints.filter((item) => item.id !== id));
  };

  const handleResetStats = () => {
    setStats(INITIAL_STATS);
    localStorage.setItem('dm_stats', JSON.stringify(INITIAL_STATS));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    setUser(userData);
    localStorage.setItem('dm_user', JSON.stringify(userData));
    setScreen('home');
  };

  return (
    <div className={screen === 'admin' ? 'admin-mode' : ''}>
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield color="#dc2626" size={24} />
          <strong style={{ fontSize: '1.1rem' }}>DisasterMesh</strong>
        </div>
        <span className={`network-badge ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
        </span>
      </header>

      {screen === 'landing' && (
        <div className="container" style={{ textAlign: 'center', justifyContent: 'center' }}>
          <Shield size={64} color="#dc2626" style={{ margin: '0 auto' }} />
          <h2>DISASTERMESH</h2>
          <p style={{ color: 'var(--muted)' }}>"When the Network Fails, We Stay Connected."</p>
          <p style={{ fontSize: '0.85rem' }}>Offline-first emergency communication and disaster response.</p>
          <button className="btn btn-primary" onClick={() => setScreen('register')}>GET STARTED</button>
          <button className="btn btn-outline" onClick={() => setScreen('login')}>LOGIN</button>
          <button className="btn btn-danger" onClick={() => setScreen('home')}>EMERGENCY ACCESS</button>
        </div>
      )}

      {screen === 'login' && (
        <div className="container">
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--muted)' }}>Access your DisasterMesh emergency profile</p>
          <form onSubmit={(e) => { e.preventDefault(); setScreen('home'); }}>
            <label>Mobile Number</label>
            <input className="input-field" type="tel" required />
            <label>PIN</label>
            <input className="input-field" type="password" required />
            <button className="btn btn-primary" type="submit">LOGIN</button>
          </form>
          <button className="btn btn-outline" onClick={() => setScreen('register')}>Don't have an account? SIGN UP</button>
          <button className="btn btn-danger" onClick={() => setScreen('home')}>EMERGENCY SOS</button>
        </div>
      )}

      {screen === 'register' && (
        <div className="container">
          <h2>Create Account</h2>
          <form onSubmit={handleRegister}>
            <label>Full Name</label>
            <input className="input-field" name="name" required />
            <label>Mobile Number</label>
            <input className="input-field" name="mobile" required />
            <label>Emergency Contact</label>
            <input className="input-field" name="emergency" required />
            <label>Set PIN</label>
            <input className="input-field" type="password" name="pin" required />
            <h3>Medical Info (Optional)</h3>
            <label>Blood Type</label>
            <input className="input-field" name="blood" placeholder="e.g. O+" />
            <button className="btn btn-primary" type="submit">CREATE ACCOUNT</button>
          </form>
          <button className="btn btn-outline" onClick={() => setScreen('login')}>Already have an account? LOGIN</button>
        </div>
      )}

      {screen === 'home' && (
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Are you safe?</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>HOLD FOR 3 SECONDS TO TRIGGER SOS</p>
            <div 
              className="sos-hold-btn"
              onMouseDown={handleSosHoldStart}
              onMouseUp={handleSosHoldEnd}
              onTouchStart={handleSosHoldStart}
              onTouchEnd={handleSosHoldEnd}
            >
              <AlertTriangle size={36} />
              <span>SOS</span>
            </div>
          </div>

          <div className="grid-2">
            <div className="card" onClick={() => setScreen('map')} style={{ cursor: 'pointer' }}>
              <MapIcon size={24} color="#0f172a" />
              <h4>Offline Map</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>View emergency map without internet.</p>
            </div>
            <div className="card" onClick={() => setScreen('helplines')} style={{ cursor: 'pointer' }}>
              <Phone size={24} color="#0f172a" />
              <h4>Emergency Help</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Hospitals, police, fire, shelters.</p>
            </div>
            <div className="card" onClick={() => setScreen('disaster-type')} style={{ cursor: 'pointer' }}>
              <AlertTriangle size={24} color="#dc2626" />
              <h4>Report Disaster</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Report fire, flood, earthquake hazard.</p>
            </div>
            <div className="card" onClick={() => setScreen('safe-status')} style={{ cursor: 'pointer' }}>
              <CheckCircle size={24} color="#16a34a" />
              <h4>I'm Safe</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Send safe status to contacts & rescue.</p>
            </div>
          </div>

          <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <h4>Support Relief Efforts</h4>
            <p style={{ fontSize: '0.8rem', margin: '0.25rem 0' }}>Donate via UPI to support disaster rescue operations.</p>
            <a href="upi://pay?pa=7082810840@mbk&pn=DisasterMeshRelief&cu=INR" className="btn btn-success" style={{ textDecoration: 'none' }}>
              <DollarSign size={18} /> Donate via UPI (7082810840@mbk)
            </a>
          </div>
        </div>
      )}

      {screen === 'disaster-type' && (
        <div className="container">
          <h2>What happened?</h2>
          <p style={{ color: 'var(--muted)' }}>Select the type of emergency you are reporting.</p>
          <div className="grid-2">
            {DISASTER_TYPES.map((d) => {
              const Icon = d.icon;
              return (
                <div 
                  key={d.id} 
                  className="card" 
                  style={{ 
                    textAlign: 'center', 
                    border: activeReport.type === d.label ? '2px solid var(--accent)' : '1px solid var(--border)',
                    cursor: 'pointer' 
                  }}
                  onClick={() => setActiveReport({ ...activeReport, type: d.label })}
                >
                  <Icon size={32} style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{d.label}</p>
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary" onClick={() => setScreen('victim-condition')} disabled={!activeReport.type}>Next</button>
        </div>
      )}

      {screen === 'victim-condition' && (
        <div className="container">
          <h2>How serious is your situation?</h2>
          {[
            { id: 'CRITICAL', title: 'CRITICAL', sub: 'Trapped or severe injury', class: 'btn-danger' },
            { id: 'URGENT', title: 'URGENT', sub: 'Medical assistance required', class: 'btn-outline' },
            { id: 'ASSISTANCE', title: 'NEED ASSISTANCE', sub: 'Food, water or shelter required', class: 'btn-outline' },
            { id: 'SAFE', title: 'SAFE', sub: 'No immediate assistance required', class: 'btn-success' }
          ].map((cond) => (
            <button 
              key={cond.id} 
              className={`btn ${cond.class}`} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem' }}
              onClick={() => {
                setActiveReport({ ...activeReport, condition: cond.id });
                triggerSos();
              }}
            >
              <strong>{cond.title}</strong>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{cond.sub}</span>
            </button>
          ))}
        </div>
      )}

      {screen === 'sos-active' && (
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="card" style={{ borderColor: 'var(--accent)' }}>
            <AlertTriangle size={48} color="#dc2626" style={{ margin: '0 auto' }} />
            <h2>SOS ACTIVE</h2>
            <p>Your emergency request has been saved.</p>
            <div style={{ textAlign: 'left', marginTop: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
              <p><strong>Location:</strong> {location.address}</p>
              <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
              <p><strong>Network:</strong> {isOnline ? 'Online' : 'Offline (Highlighted in red)'}</p>
              <p><strong>Status:</strong> Searching for nearby devices</p>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '1rem' }}>
              Your SOS will automatically synchronize when connectivity becomes available.
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => setScreen('home')}>Return to Dashboard</button>
        </div>
      )}

      {screen === 'map' && (
        <div className="container">
          <h3>Emergency Map</h3>
          <div className="map-container" ref={mapRef}></div>
          <div className="card">
            <h4>Nearest Safe Shelter</h4>
            <p>1.4 km away</p>
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>VIEW ROUTE</button>
          </div>
        </div>
      )}

      {screen === 'helplines' && (
        <div className="container">
          <h3>Emergency Helplines (India)</h3>
          <div className="card">
            <p><strong>National Emergency Number:</strong> <a href="tel:112">112</a></p>
            <p><strong>Police:</strong> <a href="tel:100">100</a></p>
            <p><strong>Fire:</strong> <a href="tel:101">101</a></p>
            <p><strong>Ambulance:</strong> <a href="tel:102">102</a></p>
            <p><strong>Disaster Management (NDRF):</strong> <a href="tel:1078">1078</a></p>
          </div>

          <h3>Disaster Precautions</h3>
          {Object.entries(PRECAUTIONS).map(([key, value]) => (
            <div key={key} className="card">
              <h4 style={{ textTransform: 'capitalize' }}>{key} Guide</h4>
              <p><strong>During:</strong></p>
              <ul>{value.during.map((p, i) => <li key={i}>{p}</li>)}</ul>
              <p style={{ marginTop: '0.5rem' }}><strong>After:</strong></p>
              <ul>{value.after.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      )}

      {screen === 'safe-status' && (
        <div className="container" style={{ textAlign: 'center' }}>
          <CheckCircle size={64} color="#16a34a" style={{ margin: '0 auto' }} />
          <h2>I'm Safe</h2>
          <p>Let others know you are safe.</p>
          <div className="card">
            <p>Your safe status can be synchronized with your emergency contacts and rescue system.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <button className="btn btn-success" onClick={() => setScreen('home')}>CONFIRM SAFE STATUS</button>
        </div>
      )}

      {screen === 'admin' && (
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Command Center</h2>
            <button className="btn btn-outline" style={{ width: 'auto' }} onClick={handleResetStats}>
              <RefreshCw size={16} /> Reset Numbers
            </button>
          </div>

          <div className="grid-4">
            <div className="stat-box stat-critical">
              <h3>{stats.critical}</h3>
              <span>Critical</span>
            </div>
            <div className="stat-box stat-urgent">
              <h3>{stats.urgent}</h3>
              <span>Urgent</span>
            </div>
            <div className="stat-box stat-assistance">
              <h3>{stats.assistance}</h3>
              <span>Assistance</span>
            </div>
            <div className="stat-box stat-safe">
              <h3>{stats.safe}</h3>
              <span>Safe</span>
            </div>
          </div>

          <div className="map-container" ref={mapRef}></div>

          <h3>Active Disaster Reports ({complaints.length})</h3>
          {complaints.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No reports recorded yet.</p>
          ) : (
            complaints.map((c) => (
              <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{c.id} - {c.type}</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    Condition: {c.condition} | Time: {c.time}
                  </p>
                  <p style={{ fontSize: '0.8rem' }}>{c.address}</p>
                </div>
                <button 
                  className="btn btn-danger" 
                  style={{ width: 'auto', padding: '0.5rem' }}
                  onClick={() => handleDeleteComplaint(c.id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {screen !== 'landing' && screen !== 'login' && screen !== 'register' && (
        <nav className="nav-bar">
          <button className={`nav-item ${screen === 'home' ? 'active' : ''}`} onClick={() => setScreen('home')}>
            <Home size={20} />
            Home
          </button>
          <button className={`nav-item ${screen === 'map' ? 'active' : ''}`} onClick={() => setScreen('map')}>
            <MapIcon size={20} />
            Map
          </button>
          <button className={`nav-item ${screen === 'helplines' ? 'active' : ''}`} onClick={() => setScreen('helplines')}>
            <Phone size={20} />
            Helplines
          </button>
          <button className={`nav-item ${screen === 'admin' ? 'active' : ''}`} onClick={() => setScreen('admin')}>
            <Settings size={20} />
            Admin
          </button>
        </nav>
      )}
    </div>
  );
}