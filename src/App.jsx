import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, Phone, CheckCircle, 
  Flame, CloudRain, Zap, Activity, Info, RefreshCw, Trash2, Home, Map as MapIcon, Settings, DollarSign, Bot, Send
} from 'lucide-react';

const INITIAL_STATS = { critical: 28, urgent: 54, assistance: 91, safe: 312 };

const EMERGENCY_NUMBERS = ["+917042831097", "+917082810840"];

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
    during: ["Drop to hands and knees immediately", "Cover head and neck under a sturdy desk or table", "Hold on until all shaking stops"],
    after: ["Check yourself and others for injuries", "Stay clear of damaged structures and electrical lines", "Move quickly to an open safe area", "Do not use elevators under any circumstances"]
  },
  flood: {
    during: ["Move immediately to higher ground", "Never walk or drive through moving floodwaters", "Stay away from power lines and electrical wires"],
    after: ["Listen to local emergency radio/broadcasts", "Return home only when declared safe by authorities", "Disinfect everything that touched floodwater"]
  },
  fire: {
    during: ["Stay low to the floor below smoke", "Check doors for heat before opening them", "Stop, Drop, and Roll if your clothes catch fire"],
    after: ["Do not re-enter burned buildings", "Seek immediate medical treatment for burns", "Wait for official firefighter clearance"]
  },
  cyclone: {
    during: ["Stay indoors away from windows and glass doors", "Turn off gas supply and main power switch", "Stay in the safest central room of the building"],
    after: ["Beware of fallen trees, debris, and downed power cables", "Drink stored clean or boiled water only", "Wait for official all-clear signals"]
  },
  landslide: {
    during: ["Move out of the path of debris rapidly", "Run to nearest high ground or sturdy shelter", "Curl into a tight ball if escape is impossible"],
    after: ["Stay clear of slide area (secondary slides can occur)", "Check for trapped or injured persons near edges"]
  },
  heatwave: {
    during: ["Drink plenty of water even if not feeling thirsty", "Avoid direct sun exposure during peak hours", "Wear lightweight, light-colored clothes"],
    after: ["Rest in cool ventilated areas", "Seek immediate aid if experiencing dizziness or nausea"]
  },
  industrial: {
    during: ["Evacuate upwind from gas or chemical leaks", "Cover mouth and nose with a damp cloth", "Seal doors and windows if trapped inside"],
    after: ["Follow official decontamination instructions", "Do not consume exposed food or water sources"]
  },
  other: {
    during: ["Stay calm and assess immediate physical surroundings", "Move to open ground away from high hazards", "Keep emergency contacts accessible"],
    after: ["Monitor local emergency channels", "Signal for rescue using whistles or light flashes"]
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

  // AI Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Offline Emergency AI Assistant. Ask me about first aid, disaster safety, helplines, or app features.' }
  ]);
  const chatBottomRef = useRef(null);

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

  useEffect(() => {
    if (screen === 'ai-chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, screen]);

  const generateAiResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('first aid') || text.includes('injury') || text.includes('bleed') || text.includes('burn')) {
      return "🚑 First Aid Basics:\n• Bleeding: Apply firm, direct pressure with a clean cloth.\n• Burns: Cool with running water for at least 10 minutes. Do not pop blisters.\n• Fractures: Immobilize the injured area. Do not attempt to realign bones.";
    }
    if (text.includes('earthquake') || text.includes('shake') || text.includes('tremor')) {
      return "🌋 Earthquake Guide:\n• Drop to your hands & knees.\n• Cover your head & neck under a sturdy desk/table.\n• Hold on until shaking stops. Move to open ground away from high-rises after.";
    }
    if (text.includes('flood') || text.includes('water') || text.includes('drown')) {
      return "🌊 Flood Guide:\n• Move to higher ground immediately.\n• Never walk or drive through moving water.\n• Stay away from electrical power lines and submerged outlets.";
    }
    if (text.includes('fire') || text.includes('smoke')) {
      return "🔥 Fire Guide:\n• Stay low to the ground below smoke.\n• Test doors for heat before opening.\n• If clothes catch fire: Stop, Drop, and Roll!";
    }
    if (text.includes('helpline') || text.includes('number') || text.includes('phone') || text.includes('call')) {
      return "📞 Emergency Numbers:\n• Primary Contacts: +91 7042831097, +91 7082810840\n• National Emergency: 112\n• Police: 100 | Fire: 101 | Ambulance: 102\n• NDRF Disaster Helpline: 1078";
    }
    if (text.includes('location') || text.includes('where am i') || text.includes('gps')) {
      return `📍 Your Current Detected Location is:\nLatitude: ${location.lat}\nLongitude: ${location.lng}\nAddress: ${location.address}`;
    }
    if (text.includes('sos') || text.includes('help me') || text.includes('emergency')) {
      return "🚨 To trigger an Emergency SOS, return to the Home screen and HOLD the red SOS button for 3 seconds. Your distress call will be logged and dispatched simultaneously to +91 7042831097 and +91 7082810840!";
    }
    if (text.includes('offline') || text.includes('internet') || text.includes('network')) {
      return "📡 DisasterMesh operates in 100% Offline Mode using browser LocalStorage and PWA Cache. All your data will sync once network connectivity returns.";
    }

    return "🤖 DisasterMesh AI Advice: Keep calm, evaluate your physical surroundings, move to an open safe area, and trigger the main SOS button on the Home tab if you need urgent rescue.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    const botReplyText = generateAiResponse(chatInput);
    const aiMsg = { sender: 'ai', text: botReplyText };

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
    setChatInput('');
  };

  const handleSosHoldStart = () => {
    const timer = setTimeout(() => {
      triggerSos();
    }, 3000);
    setHoldTimer(timer);
  };

  const handleSosHoldEnd = () => {
    if (holdTimer) clearTimeout(holdTimer);
  };

  // Broadcasts simultaneous SMS alerts to both +91 7042831097 and +91 7082810840
  const sendSmsAlerts = (report) => {
    const message = encodeURIComponent(
      `🚨 DISASTERMESH EMERGENCY ALERT!\n` +
      `Type: ${report.type}\n` +
      `Severity: ${report.condition}\n` +
      `Location: ${report.address}\n` +
      `Time: ${report.time}\n` +
      `Lat/Lng: ${report.lat}, ${report.lng}`
    );

    // iOS and Android cross-compatible multi-recipient SMS URL format
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const delimiter = isIOS ? '&' : '?';
    const recipients = EMERGENCY_NUMBERS.join(isIOS ? ';' : ',');
    const smsUrl = `sms:${recipients}${delimiter}body=${message}`;
    
    try {
      window.location.href = smsUrl;
    } catch (err) {
      console.log("SMS URI Triggered:", smsUrl);
    }
  };

  const triggerSos = () => {
    const newReport = {
      id: 'DM-' + Math.floor(1000 + Math.random() * 9000),
      type: activeReport.type || 'General Emergency',
      condition: activeReport.condition || 'CRITICAL',
      lat: location.lat,
      lng: location.lng,
      address: location.address,
      time: new Date().toLocaleTimeString(),
      status: 'Searching',
      recipients: EMERGENCY_NUMBERS
    };

    setComplaints([newReport, ...complaints]);
    setStats((prev) => ({ ...prev, critical: prev.critical + 1 }));
    
    // Automatically trigger SMS alert dispatch
    sendSmsAlerts(newReport);

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

  const getCurrentPrecautions = () => {
    const key = (activeReport.type || '').toLowerCase();
    if (key.includes('earthquake')) return { title: 'Earthquake', data: PRECAUTIONS.earthquake };
    if (key.includes('flood')) return { title: 'Flood', data: PRECAUTIONS.flood };
    if (key.includes('fire')) return { title: 'Fire', data: PRECAUTIONS.fire };
    if (key.includes('cyclone')) return { title: 'Cyclone', data: PRECAUTIONS.cyclone };
    if (key.includes('landslide')) return { title: 'Landslide', data: PRECAUTIONS.landslide };
    if (key.includes('heatwave')) return { title: 'Heatwave', data: PRECAUTIONS.heatwave };
    if (key.includes('industrial')) return { title: 'Industrial Accident', data: PRECAUTIONS.industrial };
    return { title: 'General Disaster Safety', data: PRECAUTIONS.other };
  };

  return (
    <div className={screen === 'admin' ? 'admin-mode' : ''}>
      {/* Top Navigation Header with Custom Logo */}
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/logo.png" alt="DisasterMesh Logo" className="header-logo" />
          <strong style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>DisasterMesh</strong>
        </div>
        <span className={`network-badge ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
        </span>
      </header>

      {screen === 'landing' && (
        <div className="container" style={{ textAlign: 'center', justifyContent: 'center' }}>
          {/* Main Landing Page Custom Logo */}
          <div className="landing-logo-wrapper">
            <img src="/logo.png" alt="DisasterMesh Main Logo" className="landing-logo" />
          </div>
          <p style={{ color: 'var(--muted)', margin: '0.5rem 0 1rem 0', fontWeight: '500' }}>
            "CONNECT • ALERT • SAVE"
          </p>

          <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#475569' }}>
            Offline-first emergency communication and disaster response system.
          </p>
          
          <button className="btn btn-primary" onClick={() => setScreen('register')}>GET STARTED</button>
          <button className="btn btn-outline" onClick={() => setScreen('login')}>LOGIN</button>
          
          {/* Large Emergency Access Button */}
          <button className="btn btn-danger btn-emergency-large" onClick={() => setScreen('home')}>
            <AlertTriangle size={24} /> EMERGENCY ACCESS
          </button>

          {/* UPI Donation Button Under Emergency Access Button */}
          <div className="card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', marginTop: '0.75rem' }}>
            <h4 style={{ color: '#166534', margin: 0, fontSize: '0.95rem' }}>Support Relief Efforts</h4>
            <p style={{ fontSize: '0.78rem', color: '#15803d', margin: '0.25rem 0 0.5rem 0' }}>Donate via UPI to support disaster rescue operations.</p>
            <a href="upi://pay?pa=7082810840@mbk&pn=DisasterMeshRelief&cu=INR" className="btn btn-success" style={{ textDecoration: 'none', padding: '0.65rem' }}>
              <DollarSign size={18} /> Donate via UPI (7082810840@mbk)
            </a>
          </div>

          {/* Animated Developed by Banner at Bottom of First Page */}
          <div className="resolvers-animated-banner" style={{ marginTop: '1.25rem', width: '100%', textAlign: 'center' }}>
            <span className="resolvers-text">DEVELOPED BY THE RESOLVERS</span>
          </div>
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
          <button className="btn btn-danger btn-emergency-large" style={{ marginTop: '0.5rem' }} onClick={() => setScreen('home')}>
            <AlertTriangle size={24} /> EMERGENCY ACCESS
          </button>
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
            <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.5rem', fontWeight: 'bold' }}>
              🚨 Broadcasts dual SMS simultaneously to +91 7042831097 & +91 7082810840
            </p>
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
        </div>
      )}

      {screen === 'ai-chat' && (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Bot size={24} color="#dc2626" />
            <h3 style={{ margin: 0 }}>Offline AI Assistant</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? '#dc2626' : '#f1f5f9',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              className="input-field" 
              style={{ margin: 0 }} 
              placeholder="Ask anything (e.g., first aid, flood guide)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" style={{ width: 'auto', padding: '0 1rem' }}>
              <Send size={18} />
            </button>
          </form>
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
        <div className="container">
          <div className="card" style={{ textAlign: 'center', borderColor: 'var(--accent)' }}>
            <AlertTriangle size={48} color="#dc2626" style={{ margin: '0 auto' }} />
            <h2 style={{ color: '#dc2626', margin: '0.5rem 0' }}>SOS TRANSMITTED</h2>
            <p style={{ fontWeight: '600' }}>Your distress signal has been logged & queued.</p>
            
            {/* Alert Sent Confirmation Box */}
            <div style={{ margin: '0.75rem 0', padding: '0.65rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 'bold', margin: 0 }}>
                📲 Simultaneous SMS Triggered To Primary Responders:
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <a href={`tel:+917042831097`} className="sms-number-tag">📞 +91 7042831097</a>
                <a href={`tel:+917082810840`} className="sms-number-tag">📞 +91 7082810840</a>
              </div>
            </div>

            <div style={{ textAlign: 'left', marginTop: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
              <p><strong>Emergency Type:</strong> {activeReport.type || 'General Emergency'}</p>
              <p><strong>Severity:</strong> {activeReport.condition || 'CRITICAL'}</p>
              <p><strong>Location:</strong> {location.address}</p>
              <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
              <p><strong>Network State:</strong> {isOnline ? 'ONLINE' : 'OFFLINE (Saved locally for Mesh Sync)'}</p>
            </div>

            {/* Manual Resend SMS Button */}
            <button 
              className="btn btn-danger" 
              style={{ marginTop: '0.75rem' }} 
              onClick={() => sendSmsAlerts(complaints[0] || { type: 'General Emergency', condition: 'CRITICAL', address: location.address, time: new Date().toLocaleTimeString(), lat: location.lat, lng: location.lng })}
            >
              <Send size={18} /> Resend SMS Alert to Both Numbers
            </button>
          </div>

          {(() => {
            const current = getCurrentPrecautions();
            return (
              <div className="card precautions-green-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d' }}>
                  <img src="/logo.png" alt="Logo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#166534', fontWeight: 'bold' }}>
                    Safety Precautions ({current.title})
                  </h4>
                </div>

                <div style={{ marginTop: '0.85rem' }}>
                  <p className="precautions-section-title">⚡ DURING DISASTER:</p>
                  <ul className="precautions-green-list">
                    {current.data.during.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>

                  <p className="precautions-section-title" style={{ marginTop: '0.75rem' }}>🛡️ AFTER / AWAITING RESCUE:</p>
                  <ul className="precautions-green-list">
                    {current.data.after.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}

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
            <p><strong>Primary Responders:</strong> <a href="tel:+917042831097">+91 7042831097</a> / <a href="tel:+917082810840">+91 7082810840</a></p>
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
                  <p style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 'bold' }}>Dispatched to: +91 7042831097, +91 7082810840</p>
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
          <button className={`nav-item ${screen === 'ai-chat' ? 'active' : ''}`} onClick={() => setScreen('ai-chat')}>
            <Bot size={20} />
            AI Chat
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