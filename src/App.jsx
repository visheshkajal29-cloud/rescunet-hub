import React, { useState, useEffect } from 'react';
import { 
  Flame, Radio, Shield, MapPin, AlertTriangle, Activity, 
  Phone, CheckCircle2, BookOpen, Compass, Monitor, ArrowLeft, 
  Navigation, Heart, RefreshCw, Waves, Wind, Mountain, Trash2, RotateCcw
} from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Location State
  const [coords, setCoords] = useState({ lat: '12.3456', lng: '78.9101' });
  const [address, setAddress] = useState('Fetching automatic location...');
  const [isLocating, setIsLocating] = useState(false);

  // Disaster Reporting Form State
  const [selectedDisaster, setSelectedDisaster] = useState('Earthquake');
  const [selectedSeverity, setSelectedSeverity] = useState('CRITICAL');
  const [reportDesc, setReportDesc] = useState('');
  
  // Storage States
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('dm_reports');
    return saved ? JSON.parse(saved) : [
      { id: '#1023', type: 'Earthquake', severity: 'CRITICAL', desc: 'Trapped in damaged structure', location: 'Delhi, India', time: '10:30 AM', people: 3, dist: '1.2 km' },
      { id: '#1024', type: 'Flood', severity: 'CRITICAL', desc: 'Rising water level on 1st floor', location: 'Patna, Bihar', time: '10:32 AM', people: 1, dist: '2.1 km' },
      { id: '#1025', type: 'Landslide', severity: 'URGENT', desc: 'Road blocked, medical help needed', location: 'Shimla, HP', time: '10:35 AM', people: 2, dist: '3.4 km' }
    ];
  });

  const [activeGuide, setActiveGuide] = useState('Earthquake');
  const [selectedCase, setSelectedCase] = useState(null);

  // User Profile State
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('dm_profile');
    return saved ? JSON.parse(saved) : { name: '', phone: '', emergencyPhone: '', pin: '', blood: '', allergies: '', conditions: '' };
  });

  // Safe Status Log
  const [safeStatusLogged, setSafeStatusLogged] = useState(false);
  const [lastSafeTime, setLastSafeTime] = useState('10:35 AM');

  // Monitor Network Connection Status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save Reports to LocalStorage
  useEffect(() => {
    localStorage.setItem('dm_reports', JSON.stringify(reports));
  }, [reports]);

  // Automatic GPS Location
  const fetchLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setCoords({ lat, lng });

          if (navigator.onLine) {
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
              const data = await res.json();
              setAddress(data.display_name || `${lat}° N, ${lng}° E`);
            } catch (err) {
              setAddress(`${lat}° N, ${lng}° E`);
            }
          } else {
            setAddress(`Cached Coords: ${lat}° N, ${lng}° E`);
          }
          setIsLocating(false);
        },
        () => {
          setAddress('Location permission denied / unavailable');
          setIsLocating(false);
        },
        { timeout: 10000 }
      );
    } else {
      setAddress('Geolocation not supported by device');
      setIsLocating(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Handle New Incident Report Submit
  const handleReportSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      type: selectedDisaster,
      severity: selectedSeverity,
      desc: reportDesc || 'Immediate emergency response requested.',
      location: address,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      people: 1,
      dist: '0.1 km'
    };
    setReports([newReport, ...reports]);
    setReportDesc('');
    setScreen('sos_active');
  };

  // Delete Complaint Function
  const handleDeleteReport = (id) => {
    const updated = reports.filter((report) => report.id !== id);
    setReports(updated);
    if (selectedCase && selectedCase.id === id) {
      setSelectedCase(null);
    }
  };

  // Reset System Counters and Complaints to 0
  const handleResetSystem = () => {
    if (window.confirm('Are you sure you want to reset all reported complaints and counters to 0?')) {
      setReports([]);
      setSelectedCase(null);
      localStorage.removeItem('dm_reports');
    }
  };

  // Calculated Counters for Admin Dashboard
  const criticalCount = reports.filter((r) => r.severity === 'CRITICAL').length;
  const urgentCount = reports.filter((r) => r.severity === 'URGENT').length;
  const safeCount = reports.filter((r) => r.severity === 'SAFE').length;

  const HELPLINES = [
    { name: 'National Emergency Number', number: '112' },
    { name: 'Disaster Management (NDRF)', number: '1078' },
    { name: 'Police Helpline', number: '100' },
    { name: 'Fire Station', number: '101' },
    { name: 'Ambulance Medical', number: '102' },
    { name: 'Women Helpline', number: '1091' }
  ];

  const DISASTERS = [
    { id: 'Flood', label: 'Flood', icon: Waves },
    { id: 'Earthquake', label: 'Earthquake', icon: AlertTriangle },
    { id: 'Cyclone', label: 'Cyclone', icon: Wind },
    { id: 'Landslide', label: 'Landslide', icon: Mountain },
    { id: 'Wildfire', label: 'Wildfire', icon: Flame },
    { id: 'Tsunami', label: 'Tsunami', icon: Activity }
  ];

  const GUIDES = {
    Earthquake: {
      during: ['Drop, Cover, and Hold On under sturdy furniture.', 'Stay away from windows and exterior walls.', 'If outdoors, move to an open area away from buildings.'],
      after: ['Check yourself and others for injuries.', 'Stay away from damaged structures.', 'Listen to emergency broadcasts and send SOS if trapped.']
    },
    Flood: {
      during: ['Move to higher ground immediately.', 'Do not walk or drive through flowing floodwaters.', 'Disconnect electrical appliances.'],
      after: ['Avoid floodwater as it may be contaminated.', 'Return home only when authorities confirm safety.']
    }
  };

  return (
    <div className="app-container" style={{ paddingBottom: '75px' }}>
      
      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand-logo" onClick={() => setScreen('home')}>
          <Flame color="#ea580c" size={26} />
          <span>DisasterMesh</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className={`badge-status ${!isOnline ? 'offline' : ''}`}>
            <Radio size={14} /> {isOnline ? 'Connected (Online)' : 'Offline Mesh Active'}
          </div>
          <button 
            style={{ background: '#181a20', border: '1px solid #272a34', color: '#fff', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}
            onClick={() => setScreen(screen === 'command_center' ? 'home' : 'command_center')}
          >
            <Monitor size={14} style={{ display: 'inline', marginRight: '4px' }} />
            {screen === 'command_center' ? 'App View' : 'Admin Hub'}
          </button>
        </div>
      </header>

      {/* LANDING SCREEN */}
      {screen === 'landing' && (
        <div className="dark-card" style={{ textAlign: 'center', maxWidth: '480px', margin: 'auto' }}>
          <Flame color="#ea580c" size={52} style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', marginBottom: '8px' }}>DISASTERMESH</h1>
          <p style={{ color: '#ea580c', fontStyle: 'italic', fontWeight: '600', marginBottom: '12px', fontSize: '0.95rem' }}>
            "When the Network Fails, We Stay Connected."
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '24px' }}>
            Offline-first emergency communication and disaster response network.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => setScreen('signup')}>GET STARTED</button>
            <button className="btn-primary" style={{ background: '#181a20', border: '1px solid #272a34' }} onClick={() => setScreen('login')}>LOGIN</button>
            
            <div style={{ marginTop: '16px', borderTop: '1px solid #232733', paddingTop: '16px' }}>
              <button className="btn-sos" onClick={() => setScreen('home')}>
                🚨 EMERGENCY ACCESS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN SCREEN */}
      {screen === 'login' && (
        <div className="dark-card" style={{ maxWidth: '420px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('landing')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '6px' }}>Welcome Back</h2>

          <div className="input-group">
            <label>Mobile Number</label>
            <input type="text" className="input-box" placeholder="+91 9876543210" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} />
          </div>

          <div className="input-group">
            <label>PIN Code</label>
            <input type="password" className="input-box" placeholder="••••" value={userProfile.pin} onChange={(e) => setUserProfile({...userProfile, pin: e.target.value})} />
          </div>

          <button className="btn-primary" style={{ marginTop: '12px' }} onClick={() => setScreen('home')}>LOGIN</button>
        </div>
      )}

      {/* SIGNUP SCREEN */}
      {screen === 'signup' && (
        <div className="dark-card" style={{ maxWidth: '460px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('landing')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '6px' }}>Create Account</h2>

          <div className="input-group">
            <label>Full Name</label>
            <input type="text" className="input-box" placeholder="Full Name" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Mobile Number</label>
            <input type="text" className="input-box" placeholder="Mobile Number" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} />
          </div>

          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => {
            localStorage.setItem('dm_profile', JSON.stringify(userProfile));
            setScreen('home');
          }}>
            CREATE ACCOUNT
          </button>
        </div>
      )}

      {/* HOME DASHBOARD */}
      {screen === 'home' && (
        <div>
          <div className="dark-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#ea580c', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '1px' }}>COMMUNITY EMERGENCY NETWORK</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0 12px', lineHeight: '1.1' }}>
                Turn a warning <br /><span style={{ color: '#ea580c' }}>into action.</span>
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '20px' }}>
                Report natural disasters in seconds. Your information reaches the central dashboard immediately.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn-sos" style={{ padding: '14px 20px', fontSize: '1rem', width: 'auto' }} onClick={() => setScreen('sos_active')}>
                  🚨 EMERGENCY SOS
                </button>
                <button className="btn-primary" style={{ background: '#181a20', border: '1px solid #272a34', width: 'auto', padding: '14px 20px' }} onClick={() => setScreen('disaster_type')}>
                  Report Incident
                </button>
              </div>
            </div>

            <div className="radar-box">
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>
                LIVE RADAR
              </div>
              <div className="radar-sweep"></div>
              <div className="radar-circle radar-circle-1"></div>
              <div className="radar-circle radar-circle-2"></div>
              <div className="radar-circle radar-circle-3"></div>
              <div className="radar-blip" style={{ top: '35%', left: '42%' }}></div>
              <div className="radar-blip" style={{ top: '65%', left: '70%' }}></div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="interactive-card" onClick={() => setScreen('disaster_type')}>
              <AlertTriangle color="#ea580c" size={26} />
              <h3 style={{ margin: '10px 0 4px', fontSize: '1.05rem' }}>Report Disaster</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Report flood, fire, earthquake, or landslide.</p>
            </div>

            <div className="interactive-card" onClick={() => setScreen('safe_status')}>
              <CheckCircle2 color="#10b981" size={26} />
              <h3 style={{ margin: '10px 0 4px', fontSize: '1.05rem' }}>I'm Safe</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Notify family & rescue system that you are safe.</p>
            </div>

            <div className="interactive-card" onClick={() => setScreen('map')}>
              <MapPin color="#ea580c" size={26} />
              <h3 style={{ margin: '10px 0 4px', fontSize: '1.05rem' }}>Offline Map</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Locate shelters, hospitals, and police offline.</p>
            </div>

            <div className="interactive-card" onClick={() => setScreen('helplines')}>
              <Phone color="#ea580c" size={26} />
              <h3 style={{ margin: '10px 0 4px', fontSize: '1.05rem' }}>Indian Helplines</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Direct emergency calling for NDRF, Police, Fire.</p>
            </div>
          </div>

          {/* USER BROADCASTS LIST WITH DELETE COMPLAINT OPTION */}
          <div className="dark-card" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Local Reported Complaints</h3>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{reports.length} Total Complaints</span>
            </div>

            {reports.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>No active complaints recorded.</p>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {reports.map((r) => (
                  <div key={r.id} style={{ background: '#181a20', padding: '14px', borderRadius: '10px', border: '1px solid #272a34', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '0.92rem' }}>{r.type} ({r.id})</strong>
                        <span style={{ background: r.severity === 'CRITICAL' ? '#451a1a' : '#3f2c13', color: r.severity === 'CRITICAL' ? '#ef4444' : '#f97316', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                          {r.severity}
                        </span>
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '4px' }}>{r.desc}</p>
                      <span style={{ color: '#6b7280', fontSize: '0.72rem' }}>📍 {r.location} • 🕒 {r.time}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        style={{ background: '#451a1a', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} 
                        onClick={() => handleDeleteReport(r.id)}
                      >
                        <Trash2 size={14} /> Delete Complaint
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPORT DISASTER */}
      {screen === 'disaster_type' && (
        <div className="dark-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '4px' }}>What happened?</h2>

          <div className="disaster-grid">
            {DISASTERS.map((d) => (
              <div 
                key={d.id} 
                className={`disaster-item ${selectedDisaster === d.id ? 'active' : ''}`}
                onClick={() => setSelectedDisaster(d.id)}
              >
                <d.icon size={26} color={selectedDisaster === d.id ? '#ea580c' : '#9ca3af'} style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>{d.label}</div>
              </div>
            ))}
          </div>

          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => setScreen('victim_condition')}>
            Continue to Severity Status →
          </button>
        </div>
      )}

      {/* VICTIM SEVERITY */}
      {screen === 'victim_condition' && (
        <div className="dark-card" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('disaster_type')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '4px' }}>How serious is your situation?</h2>

          {[
            { id: 'CRITICAL', label: 'CRITICAL', desc: 'Trapped or severe life-threatening injury', color: '#ef4444' },
            { id: 'URGENT', label: 'URGENT', desc: 'Medical assistance required immediately', color: '#f97316' },
            { id: 'SAFE', label: 'SAFE', desc: 'No immediate assistance required', color: '#10b981' }
          ].map((c) => (
            <div 
              key={c.id} 
              className={`condition-card ${selectedSeverity === c.id ? 'active' : ''}`}
              onClick={() => setSelectedSeverity(c.id)}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.color }}></div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>{c.label}</strong>
                <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{c.desc}</span>
              </div>
            </div>
          ))}

          <div className="input-group" style={{ marginTop: '16px' }}>
            <label>Complaint Details / Emergency Description</label>
            <input type="text" className="input-box" placeholder="e.g. Building damaged, water rising..." value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} />
          </div>

          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={handleReportSubmit}>
            Broadcast Emergency Alert
          </button>
        </div>
      )}

      {/* ACTIVE SOS */}
      {screen === 'sos_active' && (
        <div className="dark-card" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#451a1a', color: '#fca5a5', padding: '6px 14px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '16px', border: '1px solid #ef4444' }}>
            🚨 SOS BROADCAST ACTIVE
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Your complaint has been logged and broadcasted.</h2>

          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setScreen('home')}>
            Return to Dashboard
          </button>
        </div>
      )}

      {/* OFFLINE MAP */}
      {screen === 'map' && (
        <div className="dark-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Offline Map</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Map cached for offline emergency routing.</p>
        </div>
      )}

      {/* INDIAN HELPLINES */}
      {screen === 'helplines' && (
        <div className="dark-card" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Indian Emergency Helplines</h2>

          <div style={{ display: 'grid', gap: '10px' }}>
            {HELPLINES.map((h, idx) => (
              <a key={idx} href={`tel:${h.number}`} style={{ textDecoration: 'none', background: '#181a20', border: '1px solid #272a34', padding: '14px 18px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem' }}>{h.name}</strong>
                  <span style={{ color: '#ea580c', fontSize: '1.1rem', fontWeight: '800' }}>{h.number}</span>
                </div>
                <Phone size={18} color="#34d399" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* SAFE STATUS */}
      {screen === 'safe_status' && (
        <div className="dark-card" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <CheckCircle2 color="#10b981" size={48} style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>I'm Safe Status</h2>
          <button className="btn-primary" onClick={() => setSafeStatusLogged(true)}>
            {safeStatusLogged ? '✓ STATUS BROADCASTED' : 'Broadcast "I\'M SAFE"'}
          </button>
        </div>
      )}

      {/* SCREEN 10: ADMIN HUB WITH RESET TO 0, LIVE COMPLAINTS SHOW, AND DELETE COMPLAINT */}
      {screen === 'command_center' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>DisasterMesh Admin Hub</h2>
              <span style={{ color: '#34d399', fontSize: '0.78rem' }}>● Real-time Emergency Monitoring</span>
            </div>
            
            {/* COUNTER CARDS & RESET BUTTON */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: '#ef4444', background: '#451a1a', border: '1px solid #ef4444', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' }}>
                {criticalCount} Critical
              </span>
              <span style={{ color: '#f97316', background: '#3f2c13', border: '1px solid #f97316', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' }}>
                {urgentCount} Urgent
              </span>
              <span style={{ color: '#10b981', background: '#064e3b', border: '1px solid #10b981', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700' }}>
                {safeCount} Safe
              </span>

              {/* RESET NUMBER COUNTER TO 0 BUTTON */}
              <button 
                onClick={handleResetSystem}
                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={14} /> Reset System to 0
              </button>
            </div>
          </div>

          {/* REPORTED COMPLAINTS LIST IN ADMIN HUB */}
          <div className="dark-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Reported Complaints ({reports.length})</h3>
            </div>

            {reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                <p>All counters are at 0. No reported complaints currently active.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {reports.map((c) => (
                  <div key={c.id} style={{ background: '#181a20', padding: '16px', borderRadius: '12px', border: '1px solid #272a34', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1rem' }}>Complaint {c.id}</strong>
                        <span style={{ color: c.severity === 'CRITICAL' ? '#ef4444' : '#f97316', fontWeight: '800', fontSize: '0.75rem', background: c.severity === 'CRITICAL' ? '#451a1a' : '#3f2c13', padding: '2px 8px', borderRadius: '4px' }}>
                          {c.severity}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '0.85rem', color: '#f3f4f6', marginBottom: '8px' }}>
                        <strong>Type:</strong> {c.type}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '12px' }}>
                        <strong>Description:</strong> {c.desc}
                      </p>
                      
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '14px' }}>
                        <div>📍 Location: {c.location}</div>
                        <div>🕒 Reported: {c.time}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #272a34', paddingTop: '12px' }}>
                      <button 
                        className="btn-primary" 
                        style={{ padding: '8px', fontSize: '0.8rem' }}
                        onClick={() => alert(`Rescue team dispatched for Complaint ${c.id}`)}
                      >
                        Dispatch Rescue
                      </button>
                      
                      {/* DELETE COMPLAINT FROM ADMIN HUB */}
                      <button 
                        style={{ background: '#451a1a', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                        onClick={() => handleDeleteReport(c.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <div className="bottom-nav">
        <button className={`nav-item ${screen === 'home' ? 'active' : ''}`} onClick={() => setScreen('home')}>
          <Flame size={18} /> Home
        </button>
        <button className={`nav-item ${screen === 'map' ? 'active' : ''}`} onClick={() => setScreen('map')}>
          <Compass size={18} /> Map
        </button>
        <button className={`nav-item ${screen === 'command_center' ? 'active' : ''}`} onClick={() => setScreen('command_center')}>
          <Monitor size={18} /> Admin
        </button>
      </div>

    </div>
  );
}