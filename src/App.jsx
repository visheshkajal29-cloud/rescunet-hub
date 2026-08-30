import React, { useState, useEffect } from 'react';
import { 
  Flame, Radio, Shield, MapPin, AlertTriangle, Activity, 
  User, Phone, Lock, HeartPulse, CheckCircle2, BookOpen, 
  Compass, Monitor, ArrowLeft, Navigation, BatteryCharging,
  Zap, Heart, RefreshCw, Send, LifeBuoy, Waves, Wind, Mountain
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

  // Automatic GPS & Reverse Geocoding Detection
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
        (error) => {
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

  // Indian Helplines List
  const HELPLINES = [
    { name: 'National Emergency Number', number: '112' },
    { name: 'Disaster Management (NDRF)', number: '1078' },
    { name: 'Police Helpline', number: '100' },
    { name: 'Fire Station', number: '101' },
    { name: 'Ambulance Medical', number: '102' },
    { name: 'Women Helpline', number: '1091' }
  ];

  // Disaster Types Data
  const DISASTERS = [
    { id: 'Flood', label: 'Flood', icon: Waves },
    { id: 'Earthquake', label: 'Earthquake', icon: AlertTriangle },
    { id: 'Cyclone', label: 'Cyclone', icon: Wind },
    { id: 'Landslide', label: 'Landslide', icon: Mountain },
    { id: 'Wildfire', label: 'Wildfire', icon: Flame },
    { id: 'Tsunami', label: 'Tsunami', icon: Activity },
    { id: 'Heatwave', label: 'Heatwave', icon: Zap },
    { id: 'Industrial', label: 'Industrial', icon: Shield }
  ];

  // Precautions Guides Data
  const GUIDES = {
    Earthquake: {
      during: ['Drop, Cover, and Hold On under sturdy furniture.', 'Stay away from windows, glass, and exterior walls.', 'If outdoors, move to an open area away from buildings and trees.'],
      after: ['Check yourself and others for injuries.', 'Stay away from damaged structures or fallen wires.', 'Listen to emergency broadcasts and send SOS if trapped.']
    },
    Flood: {
      during: ['Move to higher ground immediately.', 'Do not walk or drive through flowing floodwaters.', 'Disconnect electrical appliances if safe to do so.'],
      after: ['Avoid floodwater as it may be contaminated.', 'Return home only when authorities confirm safety.', 'Drink boiled or purified bottled water only.']
    },
    Cyclone: {
      during: ['Stay indoors away from windows and glass doors.', 'Keep emergency kit, flashlights, and power banks ready.', 'Turn off gas and main electricity switches.'],
      after: ['Remain indoors until official eye-of-storm clear notice.', 'Watch for fallen power poles and sharp debris.', 'Report damages to local rescue teams.']
    },
    Landslide: {
      during: ['Evacuate immediately if path of flow is near.', 'Curl into a tight ball and protect your head if trapped.', 'Listen for unusual sound like trees cracking.'],
      after: ['Stay clear of the slide area for secondary slides.', 'Check for injured or trapped persons without entering danger.']
    },
    Wildfire: {
      during: ['Evacuate immediately along designated safe routes.', 'Close all windows and doors to reduce drafts.', 'Wear long sleeves and heavy cotton clothes.'],
      after: ['Do not return until fire marshals declare safety.', 'Check roof and attic for lingering embers.']
    },
    Tsunami: {
      during: ['Move inland to high ground immediately if coastal shaking occurs.', 'Never stay to watch a tsunami wave arrive.'],
      after: ['Stay away from flooded coastal zones until all clear.']
    }
  };

  return (
    <div className="app-container" style={{ paddingBottom: '75px' }}>
      
      {/* HEADER / NAVBAR */}
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

      {/* SCREEN 1: LANDING & PORTAL WELCOME */}
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
              <p style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: '8px' }}>
                No account or internet required for emergency assistance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: LOGIN */}
      {screen === 'login' && (
        <div className="dark-card" style={{ maxWidth: '420px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('landing')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '0.85rem' }}>Access your DisasterMesh emergency profile</p>

          <div className="input-group">
            <label>Mobile Number</label>
            <input type="text" className="input-box" placeholder="+91 9876543210" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} />
          </div>

          <div className="input-group">
            <label>PIN Code</label>
            <input type="password" className="input-box" placeholder="••••" value={userProfile.pin} onChange={(e) => setUserProfile({...userProfile, pin: e.target.value})} />
          </div>

          <button className="btn-primary" style={{ marginTop: '12px' }} onClick={() => setScreen('home')}>LOGIN</button>
          
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#9ca3af' }}>
            Don't have an account? <span style={{ color: '#ea580c', cursor: 'pointer', fontWeight: '600' }} onClick={() => setScreen('signup')}>SIGN UP</span>
          </div>
        </div>
      )}

      {/* SCREEN 3: USER SIGNUP & MEDICAL PROFILE */}
      {screen === 'signup' && (
        <div className="dark-card" style={{ maxWidth: '460px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('landing')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '6px' }}>Create Your Account</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '0.85rem' }}>Set up your emergency profile</p>

          <div className="input-group">
            <label>Full Name</label>
            <input type="text" className="input-box" placeholder="Full Name" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Mobile Number</label>
            <input type="text" className="input-box" placeholder="Mobile Number" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Emergency Contact</label>
            <input type="text" className="input-box" placeholder="Contact Mobile" value={userProfile.emergencyPhone} onChange={(e) => setUserProfile({...userProfile, emergencyPhone: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Create PIN</label>
            <input type="password" className="input-box" placeholder="••••" value={userProfile.pin} onChange={(e) => setUserProfile({...userProfile, pin: e.target.value})} />
          </div>

          <h3 style={{ fontSize: '0.95rem', marginTop: '20px', marginBottom: '12px', color: '#ea580c' }}>Medical Information (Optional)</h3>

          <div className="input-group">
            <label>Blood Type</label>
            <input type="text" className="input-box" placeholder="e.g. O+, A-" value={userProfile.blood} onChange={(e) => setUserProfile({...userProfile, blood: e.target.value})} />
          </div>

          <div className="input-group">
            <label>Allergies & Medical Conditions</label>
            <input type="text" className="input-box" placeholder="e.g. Asthma, Penicillin" value={userProfile.allergies} onChange={(e) => setUserProfile({...userProfile, allergies: e.target.value})} />
          </div>

          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => {
            localStorage.setItem('dm_profile', JSON.stringify(userProfile));
            setScreen('home');
          }}>
            CREATE ACCOUNT
          </button>
        </div>
      )}

      {/* SCREEN 4: HOME EMERGENCY DASHBOARD & VIDEO RADAR UI */}
      {screen === 'home' && (
        <div>
          {/* VIDEO BACKGROUND UI SECTION: HERO RADAR + ACTION HEADING */}
          <div className="dark-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#ea580c', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '1px' }}>COMMUNITY EMERGENCY NETWORK</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0 12px', lineHeight: '1.1' }}>
                Turn a warning <br /><span style={{ color: '#ea580c' }}>into action.</span>
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '20px' }}>
                Report natural disasters in seconds. Your information reaches the central dashboard and rescue teams immediately.
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

            {/* VIDEO RADAR UI COMPONENT */}
            <div className="radar-box">
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span> LIVE RADAR
              </div>
              <div className="radar-sweep"></div>
              <div className="radar-circle radar-circle-1"></div>
              <div className="radar-circle radar-circle-2"></div>
              <div className="radar-circle radar-circle-3"></div>
              <div className="radar-blip" style={{ top: '35%', left: '42%' }}></div>
              <div className="radar-blip" style={{ top: '65%', left: '70%' }}></div>
              <div className="radar-blip" style={{ top: '25%', left: '78%' }}></div>
              <span style={{ position: 'absolute', bottom: '12px', left: '12px', color: '#6b7280', fontSize: '0.75rem' }}>
                3 active mesh signals detected
              </span>
            </div>
          </div>

          {/* MAIN ACTIONS GRID */}
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

            <div className="interactive-card" onClick={() => setScreen('guides')}>
              <BookOpen color="#ea580c" size={26} />
              <h3 style={{ margin: '10px 0 4px', fontSize: '1.05rem' }}>Safety Guides</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Offline disaster precautions and survival protocols.</p>
            </div>

            <div className="interactive-card" onClick={() => setScreen('helplines')}>
              <Phone color="#ea580c" size={26} />
              <h3 style={{ margin: '10px 0 4px', fontSize: '1.05rem' }}>Indian Helplines</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Direct emergency calling for NDRF, Police, Fire.</p>
            </div>

            <div className="interactive-card" onClick={() => setScreen('donate')}>
              <Heart color="#ec4899" size={26} />
              <h3 style={{ margin: '10px 0 4px', fontSize: '1.05rem' }}>Relief Fund</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Direct UPI contribution for relief resources.</p>
            </div>
          </div>

          {/* LOCAL REPORT DASHBOARD (Stored Locally) */}
          <div className="dark-card" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Local Emergency Broadcasts</h3>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{reports.length} Reports Saved</span>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
              {reports.map((r, idx) => (
                <div key={idx} style={{ background: '#181a20', padding: '14px', borderRadius: '10px', border: '1px solid #272a34', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.92rem' }}>{r.type}</strong>
                      <span style={{ background: r.severity === 'CRITICAL' ? '#451a1a' : '#3f2c13', color: r.severity === 'CRITICAL' ? '#ef4444' : '#f97316', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {r.severity}
                      </span>
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '4px' }}>{r.desc}</p>
                    <span style={{ color: '#6b7280', fontSize: '0.72rem' }}>📍 {r.location} • 🕒 {r.time}</span>
                  </div>
                  <button style={{ background: '#232733', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }} onClick={() => setScreen('sos_active')}>
                    View Mesh Payload
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5: EMERGENCY TYPE SELECTOR & DISASTER FORM */}
      {screen === 'disaster_type' && (
        <div className="dark-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '4px' }}>What happened?</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Select the disaster type you are reporting.</p>

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

          <div className="input-group" style={{ marginTop: '16px' }}>
            <label>Automatic Location Detection</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" className="input-box" value={address} readOnly />
              <button onClick={fetchLocation} style={{ background: '#181a20', border: '1px solid #272a34', color: '#ea580c', padding: '0 12px', borderRadius: '10px', cursor: 'pointer' }}>
                <RefreshCw size={16} className={isLocating ? 'spin' : ''} />
              </button>
            </div>
          </div>

          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => setScreen('victim_condition')}>
            Continue to Severity Status →
          </button>
        </div>
      )}

      {/* SCREEN 6: VICTIM SEVERITY CONDITION */}
      {screen === 'victim_condition' && (
        <div className="dark-card" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('disaster_type')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '4px' }}>How serious is your situation?</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '20px' }}>Your condition selection prioritizes rescue routing.</p>

          {[
            { id: 'CRITICAL', label: 'CRITICAL', desc: 'Trapped or severe life-threatening injury', color: '#ef4444' },
            { id: 'URGENT', label: 'URGENT', desc: 'Medical assistance required immediately', color: '#f97316' },
            { id: 'NEED ASSISTANCE', label: 'NEED ASSISTANCE', desc: 'Food, water or emergency shelter required', color: '#eab308' },
            { id: 'SAFE', label: 'SAFE', desc: 'No immediate assistance required', color: '#10b981' }
          ].map((c) => (
            <div 
              key={c.id} 
              className={`condition-card ${selectedSeverity === c.id ? 'active' : ''}`}
              onClick={() => setSelectedSeverity(c.id)}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.color, boxShadow: `0 0 10px ${c.color}` }}></div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem' }}>{c.label}</strong>
                <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{c.desc}</span>
              </div>
            </div>
          ))}

          <div className="input-group" style={{ marginTop: '16px' }}>
            <label>Additional Description / Notes</label>
            <input type="text" className="input-box" placeholder="e.g. 2 adults trapped, water rising..." value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} />
          </div>

          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={handleReportSubmit}>
            Broadcast Emergency Alert
          </button>
        </div>
      )}

      {/* SCREEN 7: ACTIVE MESH SOS TRACKING */}
      {screen === 'sos_active' && (
        <div className="dark-card" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#451a1a', color: '#fca5a5', padding: '6px 14px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '16px', border: '1px solid #ef4444' }}>
            🚨 SOS BROADCAST ACTIVE
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Your emergency request has been saved.</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '20px' }}>
            Waiting for a nearby DisasterMesh device to relay payload...
          </p>

          <div style={{ background: '#181a20', padding: '16px', borderRadius: '12px', textAlign: 'left', marginBottom: '16px', display: 'grid', gap: '10px', fontSize: '0.88rem', border: '1px solid #272a34' }}>
            <div><span style={{ color: '#9ca3af' }}>Location:</span> <strong>{address} ({coords.lat}° N, {coords.lng}° E)</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Time:</span> <strong>{new Date().toLocaleTimeString()}</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Network Status:</span> <strong style={{ color: '#ef4444' }}>Offline (Highlit in red)</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Mesh Status:</span> <strong style={{ color: '#f97316' }}>Searching for nearby devices...</strong></div>
          </div>

          {/* MESH ROUTING DIAGRAM */}
          <div style={{ background: '#181a20', padding: '14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #272a34' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#9ca3af' }}>
              <span>Your Phone</span> → <span>Nearby Device</span> → <span>Gateway</span> → <span>Rescue Center</span>
            </div>
          </div>

          <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '20px' }}>
            Your SOS will automatically synchronize when connectivity becomes available.
          </p>

          <button className="btn-primary" onClick={() => setScreen('home')}>
            Return to Dashboard
          </button>
        </div>
      )}

      {/* SCREEN 8: OFFLINE MAP & SHELTER NAVIGATOR */}
      {screen === 'map' && (
        <div className="dark-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Offline Emergency Map</h2>
            <span style={{ fontSize: '0.75rem', background: '#064e3b', color: '#34d399', padding: '4px 10px', borderRadius: '6px', border: '1px solid #059669' }}>100% Offline Cached</span>
          </div>

          {/* CACHED MAP CANVAS */}
          <div style={{ width: '100%', height: '260px', background: '#141822', borderRadius: '12px', border: '1px solid #272a34', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ position: 'absolute', color: '#232a3b', fontWeight: '800', fontSize: '2.5rem', letterSpacing: '4px' }}>VECTOR MAP</div>
            
            <div style={{ position: 'absolute', top: '20%', left: '25%', display: 'flex', alignItems: 'center', gap: '4px', background: '#0f172a', padding: '4px 8px', borderRadius: '6px', border: '1px solid #ef4444' }}>
              <HeartPulse size={12} color="#ef4444" />
              <span style={{ fontSize: '0.72rem', color: '#fff' }}>City Hospital</span>
            </div>

            <div style={{ position: 'absolute', top: '60%', left: '55%', display: 'flex', alignItems: 'center', gap: '4px', background: '#0f172a', padding: '4px 8px', borderRadius: '6px', border: '1px solid #10b981' }}>
              <Shield size={12} color="#10b981" />
              <span style={{ fontSize: '0.72rem', color: '#fff' }}>Shelter (1.4 km)</span>
            </div>

            <div style={{ position: 'absolute', top: '40%', left: '45%', display: 'flex', alignItems: 'center', gap: '4px', background: '#ea580c', padding: '4px 8px', borderRadius: '999px', boxShadow: '0 0 10px #ea580c' }}>
              <MapPin size={12} color="#fff" />
              <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: '700' }}>You</span>
            </div>
          </div>

          <div style={{ background: '#181a20', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Nearest Safe Shelter</strong>
              <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Sector 4 Community Relief Hub • 1.4 km away</span>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 18px' }} onClick={() => alert('Offline navigation route highlighted on map.')}>
              <Navigation size={16} /> VIEW ROUTE
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 9: EMERGENCY SAFETY GUIDES */}
      {screen === 'guides' && (
        <div className="dark-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Offline Safety Guides</h2>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px' }}>
            {Object.keys(GUIDES).map((g) => (
              <button 
                key={g} 
                style={{ background: activeGuide === g ? '#ea580c' : '#181a20', border: '1px solid #272a34', color: '#fff', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                onClick={() => setActiveGuide(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div style={{ background: '#181a20', padding: '18px', borderRadius: '12px', border: '1px solid #272a34' }}>
            <h3 style={{ color: '#ea580c', marginBottom: '12px', fontSize: '1.1rem' }}>{activeGuide} Precautions</h3>
            
            <strong style={{ display: 'block', color: '#f3f4f6', fontSize: '0.88rem', marginBottom: '6px' }}>During Event:</strong>
            <ul style={{ color: '#9ca3af', paddingLeft: '18px', display: 'grid', gap: '6px', fontSize: '0.85rem', marginBottom: '14px' }}>
              {GUIDES[activeGuide].during.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>

            <strong style={{ display: 'block', color: '#f3f4f6', fontSize: '0.88rem', marginBottom: '6px' }}>After Event:</strong>
            <ul style={{ color: '#9ca3af', paddingLeft: '18px', display: 'grid', gap: '6px', fontSize: '0.85rem' }}>
              {GUIDES[activeGuide].after.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* INDIAN EMERGENCY HELPLINES SCREEN */}
      {screen === 'helplines' && (
        <div className="dark-card" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Indian Emergency Helplines</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '16px' }}>Tap any helpline to call directly from your device.</p>

          <div style={{ display: 'grid', gap: '10px' }}>
            {HELPLINES.map((h, idx) => (
              <a 
                key={idx} 
                href={`tel:${h.number}`} 
                style={{ textDecoration: 'none', background: '#181a20', border: '1px solid #272a34', padding: '14px 18px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}
              >
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem' }}>{h.name}</strong>
                  <span style={{ color: '#ea580c', fontSize: '1.1rem', fontWeight: '800' }}>{h.number}</span>
                </div>
                <div style={{ background: '#064e3b', padding: '8px', borderRadius: '50%', color: '#34d399' }}>
                  <Phone size={18} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* SAFE STATUS SCREEN */}
      {screen === 'safe_status' && (
        <div className="dark-card" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>

          <CheckCircle2 color="#10b981" size={48} style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.6rem', marginBottom: '6px' }}>I'm Safe Status</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '20px' }}>
            Let others know you are safe. Your safe status can be synchronized with emergency contacts and rescue system.
          </p>

          <button 
            className="btn-primary" 
            style={{ background: safeStatusLogged ? '#059669' : '#ea580c', marginBottom: '16px' }}
            onClick={() => {
              setSafeStatusLogged(true);
              setLastSafeTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }}
          >
            {safeStatusLogged ? '✓ STATUS BROADCASTED' : 'Broadcast "I\'M SAFE"'}
          </button>

          <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>
            Last updated: {lastSafeTime}
          </span>
        </div>
      )}

      {/* UPI RELIEF DONATION SCREEN */}
      {screen === 'donate' && (
        <div className="dark-card" style={{ maxWidth: '460px', margin: '0 auto', textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>

          <Heart color="#ec4899" size={44} style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Disaster Relief Fund</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '20px' }}>
            Direct contribution for emergency food, water, and medical kits.
          </p>

          <div style={{ background: '#181a20', padding: '16px', borderRadius: '12px', border: '1px solid #272a34', marginBottom: '20px', textAlign: 'left' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>Verified UPI ID</span>
            <strong style={{ display: 'block', color: '#ea580c', fontSize: '1.1rem', marginTop: '2px' }}>7082810840@mbk</strong>
          </div>

          <a 
            href="upi://pay?pa=7082810840@mbk&pn=DisasterRelief&cu=INR" 
            style={{ textDecoration: 'none' }}
          >
            <button className="btn-primary">
              Pay via UPI App
            </button>
          </a>
        </div>
      )}

      {/* SCREEN 10: ADMIN COMMAND CENTER DASHBOARD & CASE DETAILS */}
      {screen === 'command_center' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>DisasterMesh Command Center</h2>
              <span style={{ color: '#34d399', fontSize: '0.78rem' }}>● LIVE Sync Active</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#ef4444', background: '#451a1a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700' }}>28 Critical</span>
              <span style={{ color: '#f97316', background: '#3f2c13', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700' }}>54 Urgent</span>
              <span style={{ color: '#10b981', background: '#064e3b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700' }}>312 Safe</span>
            </div>
          </div>

          {selectedCase ? (
            /* RESCUE CASE DETAILS SCREEN */
            <div className="dark-card" style={{ maxWidth: '520px', margin: '0 auto' }}>
              <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setSelectedCase(null)}>
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.3rem' }}>Rescue Case {selectedCase.id}</h3>
                <span style={{ color: '#ef4444', fontWeight: '800', background: '#451a1a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>{selectedCase.severity}</span>
              </div>

              <div style={{ background: '#181a20', padding: '16px', borderRadius: '12px', border: '1px solid #272a34', display: 'grid', gap: '10px', fontSize: '0.88rem', marginBottom: '20px' }}>
                <div><span style={{ color: '#9ca3af' }}>Type:</span> <strong>{selectedCase.type}</strong></div>
                <div><span style={{ color: '#9ca3af' }}>Condition:</span> <strong>{selectedCase.desc}</strong></div>
                <div><span style={{ color: '#9ca3af' }}>People:</span> <strong>{selectedCase.people} victim(s)</strong></div>
                <div><span style={{ color: '#9ca3af' }}>Location:</span> <strong>{selectedCase.location}</strong></div>
                <div><span style={{ color: '#9ca3af' }}>Distance:</span> <strong>{selectedCase.dist}</strong></div>
                <div><span style={{ color: '#9ca3af' }}>Battery Level:</span> <strong>24% (Low)</strong></div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <button className="btn-primary" onClick={() => alert(`Rescue Team assigned to ${selectedCase.id}`)}>ASSIGN RESCUE TEAM</button>
                <button className="btn-primary" style={{ background: '#181a20', border: '1px solid #272a34' }} onClick={() => alert('Opening route in map navigator...')}>OPEN ROUTE</button>
              </div>
            </div>
          ) : (
            /* PRIORITY CASES LIST */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {reports.map((c) => (
                <div key={c.id} className="dark-card" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>Case {c.id}</strong>
                    <span style={{ color: c.severity === 'CRITICAL' ? '#ef4444' : '#f97316', fontWeight: '700', fontSize: '0.75rem' }}>{c.severity}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '12px' }}>{c.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#6b7280', marginBottom: '14px' }}>
                    <span>Location: {c.location}</span>
                    <span>{c.dist}</span>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px', fontSize: '0.82rem' }} onClick={() => setSelectedCase(c)}>
                    Inspect & Assign Rescue
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOTTOM NAVIGATION TOOLBAR FOR MOBILE */}
      <div className="bottom-nav">
        <button className={`nav-item ${screen === 'home' ? 'active' : ''}`} onClick={() => setScreen('home')}>
          <Flame size={18} /> Home
        </button>
        <button className={`nav-item ${screen === 'map' ? 'active' : ''}`} onClick={() => setScreen('map')}>
          <Compass size={18} /> Map
        </button>
        <button className={`nav-item ${screen === 'guides' ? 'active' : ''}`} onClick={() => setScreen('guides')}>
          <BookOpen size={18} /> Guides
        </button>
        <button className={`nav-item ${screen === 'command_center' ? 'active' : ''}`} onClick={() => setScreen('command_center')}>
          <Monitor size={18} /> Admin
        </button>
      </div>

    </div>
  );
}