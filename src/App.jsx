import React, { useState } from 'react';
import { 
  Flame, Radio, Shield, MapPin, AlertTriangle, 
  Activity, User, Phone, Lock, HeartPulse, CheckCircle2,
  BookOpen, Compass, Monitor, ArrowLeft, Navigation, BatteryCharging
} from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [selectedDisaster, setSelectedDisaster] = useState('Earthquake');
  const [selectedCondition, setSelectedCondition] = useState('CRITICAL');
  const [activeGuide, setActiveGuide] = useState('Earthquake');

  const DISASTERS = [
    { id: 'Earthquake', label: 'Earthquake', icon: AlertTriangle },
    { id: 'Flood', label: 'Flood', icon: Activity },
    { id: 'Fire', label: 'Fire', icon: Flame },
    { id: 'Cyclone', label: 'Cyclone', icon: Activity },
    { id: 'Landslide', label: 'Landslide', icon: Shield },
    { id: 'Heatwave', label: 'Heatwave', icon: Flame },
    { id: 'Industrial', label: 'Industrial', icon: Shield },
    { id: 'Other', label: 'Other', icon: AlertTriangle }
  ];

  return (
    <div className="app-container" style={{ paddingBottom: '70px' }}>
      {/* Top Navbar Header */}
      <header className="navbar">
        <div className="brand-logo" onClick={() => setScreen('home')}>
          <Flame color="#ea580c" size={28} />
          <span>DisasterMesh</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="badge-status">
            <Radio size={14} /> Offline Mesh Active
          </div>
          <button 
            style={{ background: '#181a20', border: '1px solid #272a34', color: '#fff', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
            onClick={() => setScreen(screen === 'command_center' ? 'home' : 'command_center')}
          >
            <Monitor size={14} style={{ display: 'inline', marginRight: '4px' }} />
            {screen === 'command_center' ? 'App View' : 'Admin Hub'}
          </button>
        </div>
      </header>

      {/* SCREEN 1: LANDING PAGE */}
      {screen === 'landing' && (
        <div className="dark-card" style={{ textAlign: 'center', maxWidth: '500px', margin: 'auto' }}>
          <Flame color="#ea580c" size={56} style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>DISASTERMESH</h1>
          <p style={{ color: '#ea580c', fontStyle: 'italic', fontWeight: '600', marginBottom: '12px' }}>
            "When the Network Fails, We Stay Connected."
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '28px' }}>
            Offline-first emergency communication and disaster response network.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={() => setScreen('signup')}>GET STARTED</button>
            <button className="btn-primary" style={{ background: '#181a20', border: '1px solid #272a34' }} onClick={() => setScreen('login')}>LOGIN</button>
            
            <div style={{ marginTop: '16px', borderTop: '1px solid #232733', paddingTop: '16px' }}>
              <button className="btn-sos" onClick={() => setScreen('home')}>
                🚨 EMERGENCY ACCESS
              </button>
              <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '8px' }}>
                No account or internet required for emergency assistance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: LOGIN */}
      {screen === 'login' && (
        <div className="dark-card" style={{ maxWidth: '420px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '0.85rem' }}>Access your DisasterMesh emergency profile</p>

          <div className="input-group">
            <label>Mobile Number</label>
            <input type="text" className="input-box" placeholder="+1 (555) 000-0000" />
          </div>

          <div className="input-group">
            <label>PIN Code</label>
            <input type="password" className="input-box" placeholder="••••••••" />
          </div>

          <button className="btn-primary" style={{ marginTop: '12px' }} onClick={() => setScreen('home')}>LOGIN</button>
          
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#9ca3af' }}>
            Don't have an account? <span style={{ color: '#ea580c', cursor: 'pointer', fontWeight: '600' }} onClick={() => setScreen('signup')}>SIGN UP</span>
          </div>
        </div>
      )}

      {/* SCREEN 3: SIGNUP & MEDICAL PROFILE */}
      {screen === 'signup' && (
        <div className="dark-card" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Create Your Account</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '0.85rem' }}>Set up your emergency responder profile</p>

          <div className="input-group">
            <label>Full Name</label>
            <input type="text" className="input-box" placeholder="John Doe" />
          </div>

          <div className="input-group">
            <label>Mobile Number</label>
            <input type="text" className="input-box" placeholder="Mobile Number" />
          </div>

          <div className="input-group">
            <label>Emergency Contact</label>
            <input type="text" className="input-box" placeholder="Contact Mobile" />
          </div>

          <div className="input-group">
            <label>Create PIN</label>
            <input type="password" className="input-box" placeholder="••••" />
          </div>

          <h3 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '12px', color: '#ea580c' }}>Medical Information (Optional)</h3>

          <div className="input-group">
            <label>Blood Type</label>
            <input type="text" className="input-box" placeholder="e.g. O+, A-" />
          </div>

          <div className="input-group">
            <label>Allergies & Conditions</label>
            <input type="text" className="input-box" placeholder="e.g. Asthma, Penicillin" />
          </div>

          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => setScreen('home')}>CREATE ACCOUNT</button>
        </div>
      )}

      {/* SCREEN 4: HOME EMERGENCY DASHBOARD */}
      {screen === 'home' && (
        <div>
          <div className="dark-card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <span style={{ color: '#ea580c', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' }}>OFFLINE MESH NETWORK READY</span>
            <h1 style={{ fontSize: '2.4rem', margin: '10px 0 20px', fontWeight: '800' }}>Are you safe?</h1>
            <button className="btn-sos" onClick={() => setScreen('sos_active')}>
              🚨 SOS — HOLD FOR 3 SECONDS
            </button>
          </div>

          <div className="dashboard-grid">
            <div className="interactive-card" onClick={() => setScreen('disaster_type')}>
              <AlertTriangle color="#ea580c" size={28} />
              <h3 style={{ margin: '12px 0 6px' }}>Report Disaster</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Report fire, flood, earthquake or severe hazards.</p>
            </div>

            <div className="interactive-card" onClick={() => setScreen('victim_condition')}>
              <HeartPulse color="#ea580c" size={28} />
              <h3 style={{ margin: '12px 0 6px' }}>Victim Condition</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Specify injury level to prioritize rescue priority.</p>
            </div>

            <div className="interactive-card" onClick={() => setScreen('map')}>
              <MapPin color="#ea580c" size={28} />
              <h3 style={{ margin: '12px 0 6px' }}>Offline Map</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Locate shelters, hospitals, and police nearby offline.</p>
            </div>

            <div className="interactive-card" onClick={() => setScreen('guides')}>
              <BookOpen color="#ea580c" size={28} />
              <h3 style={{ margin: '12px 0 6px' }}>Emergency Guides</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Step-by-step survival protocols during disasters.</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5: REPORT DISASTER TYPE */}
      {screen === 'disaster_type' && (
        <div className="dark-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>What happened?</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Select the type of emergency incident to alert rescuers nearby.</p>

          <div className="disaster-grid">
            {DISASTERS.map((d) => (
              <div 
                key={d.id} 
                className={`disaster-item ${selectedDisaster === d.id ? 'active' : ''}`}
                onClick={() => setSelectedDisaster(d.id)}
              >
                <d.icon size={28} color={selectedDisaster === d.id ? '#ea580c' : '#9ca3af'} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{d.label}</div>
              </div>
            ))}
          </div>

          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setScreen('victim_condition')}>
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>How serious is your situation?</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '20px' }}>Your condition selection prioritizes rescue routing.</p>

          {[
            { id: 'CRITICAL', label: 'CRITICAL', desc: 'Trapped or severe life-threatening injury', color: '#ef4444' },
            { id: 'URGENT', label: 'URGENT', desc: 'Medical assistance required immediately', color: '#f97316' },
            { id: 'ASSISTANCE', label: 'NEED ASSISTANCE', desc: 'Food, clean water, or emergency shelter', color: '#eab308' },
            { id: 'SAFE', label: 'SAFE', desc: 'No immediate emergency assistance required', color: '#10b981' }
          ].map((c) => (
            <div 
              key={c.id} 
              className={`condition-card ${selectedCondition === c.id ? 'active' : ''}`}
              onClick={() => setSelectedCondition(c.id)}
            >
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: c.color, boxShadow: `0 0 10px ${c.color}` }}></div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{c.label}</strong>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{c.desc}</span>
              </div>
            </div>
          ))}

          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setScreen('sos_active')}>
            Broadcast Emergency Alert
          </button>
        </div>
      )}

      {/* SCREEN 7: ACTIVE MESH SOS TRACKING */}
      {screen === 'sos_active' && (
        <div className="dark-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '6px 16px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '16px' }}>
            🚨 SOS BROADCAST ACTIVE
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Your emergency request has been saved.</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '24px' }}>
            Waiting for a nearby DisasterMesh node to relay payload...
          </p>

          <div style={{ background: '#181a20', padding: '18px', borderRadius: '12px', textAlign: 'left', marginBottom: '20px', display: 'grid', gap: '10px', fontSize: '0.9rem' }}>
            <div><span style={{ color: '#9ca3af' }}>Incident:</span> <strong style={{ color: '#ea580c' }}>{selectedDisaster} ({selectedCondition})</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Location:</span> <strong>Acquired (12.3456° N, 78.9101° E)</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Time:</span> <strong>10:32 AM</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Network:</span> <strong style={{ color: '#ef4444' }}>Offline Mesh Relay Mode</strong></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#181a20', borderRadius: '10px', marginBottom: '24px', fontSize: '0.8rem', color: '#9ca3af' }}>
            <span>Phone → Mesh Node → Gateway → Rescue HQ</span>
            <BatteryCharging size={18} color="#10b981" />
          </div>

          <button className="btn-primary" onClick={() => setScreen('home')}>
            Return to Dashboard
          </button>
        </div>
      )}

      {/* SCREEN 8: OFFLINE MAP & SHELTER NAVIGATOR */}
      {screen === 'map' && (
        <div className="dark-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.6rem' }}>Offline Emergency Map</h2>
            <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px' }}>100% Cached</span>
          </div>

          {/* Interactive Visual Map Representation */}
          <div style={{ width: '100%', height: '260px', background: '#161922', borderRadius: '12px', border: '1px solid #272a34', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ absolute: 'center', color: '#334155', fontWeight: '800', fontSize: '3rem', letterSpacing: '4px' }}>VECTOR MAP</div>
            
            <div style={{ position: 'absolute', top: '25%', left: '30%', display: 'flex', alignItems: 'center', gap: '4px', background: '#0f172a', padding: '4px 8px', borderRadius: '6px', border: '1px solid #3b82f6' }}>
              <HeartPulse size={14} color="#ef4444" />
              <span style={{ fontSize: '0.75rem' }}>Hospital</span>
            </div>

            <div style={{ position: 'absolute', top: '60%', left: '65%', display: 'flex', alignItems: 'center', gap: '4px', background: '#0f172a', padding: '4px 8px', borderRadius: '6px', border: '1px solid #10b981' }}>
              <Shield size={14} color="#10b981" />
              <span style={{ fontSize: '0.75rem' }}>Safe Shelter (1.4 km)</span>
            </div>
          </div>

          <div style={{ background: '#181a20', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '1rem' }}>Nearest Safe Shelter</strong>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Sector 4 Community Center • 1.4 km away</span>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 18px' }}>
              <Navigation size={16} /> Navigate
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 9: EMERGENCY GUIDES */}
      {screen === 'guides' && (
        <div className="dark-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <button style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setScreen('home')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Offline Emergency Guides</h2>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
            {['Earthquake', 'Flood', 'Fire', 'First Aid'].map((g) => (
              <button 
                key={g} 
                style={{ background: activeGuide === g ? '#ea580c' : '#181a20', border: '1px solid #272a34', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => setActiveGuide(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div style={{ background: '#181a20', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ color: '#ea580c', marginBottom: '12px' }}>{activeGuide} Protocol</h3>
            <ul style={{ color: '#d1d5db', paddingLeft: '20px', display: 'grid', gap: '10px', fontSize: '0.9rem' }}>
              <li><strong>Drop, Cover, and Hold On:</strong> Take cover under sturdy furniture immediately.</li>
              <li><strong>Stay Clear of Windows:</strong> Avoid glass, light fixtures, and exterior walls.</li>
              <li><strong>Check Injuries First:</strong> Administer basic first aid before attempting movement.</li>
              <li><strong>Avoid Damaged Structures:</strong> Do not re-enter compromised buildings until cleared.</li>
            </ul>
          </div>
        </div>
      )}

      {/* SCREEN 10: ADMIN COMMAND CENTER DASHBOARD */}
      {screen === 'command_center' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2>DisasterMesh Command Center</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: '#ef4444', background: '#2a1215', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>28 Critical</span>
              <span style={{ color: '#f97316', background: '#2a1a12', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>54 Urgent</span>
              <span style={{ color: '#10b981', background: '#122a1c', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>312 Safe</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { id: '#1023', status: 'CRITICAL', count: '3 victims', dist: '1.2 km', desc: 'Trapped in collapsed structure', color: '#ef4444' },
              { id: '#1024', status: 'CRITICAL', count: '1 victim', dist: '2.1 km', desc: 'Severe medical emergency', color: '#ef4444' },
              { id: '#1025', status: 'URGENT', count: '2 victims', dist: '3.4 km', desc: 'Requires water and evacuation', color: '#f97316' }
            ].map((caseItem) => (
              <div key={caseItem.id} className="dark-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong>Case {caseItem.id}</strong>
                  <span style={{ color: caseItem.color, fontWeight: '700', fontSize: '0.8rem' }}>{caseItem.status}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '12px' }}>{caseItem.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginBottom: '16px' }}>
                  <span>People: {caseItem.count}</span>
                  <span>Distance: {caseItem.dist}</span>
                </div>
                <button className="btn-primary" style={{ padding: '8px', fontSize: '0.85rem' }}>
                  Assign Rescue Team
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation Toolbar (For Mobile Viewport) */}
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