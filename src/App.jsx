import React, { useState } from 'react';
import { 
  Flame, Radio, Shield, MapPin, AlertTriangle, 
  Activity, ArrowRight, User, Phone, Lock, HeartPulse, CheckCircle2
} from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState('home'); // home, login, signup, disaster_type, victim_condition, sos_active
  const [selectedDisaster, setSelectedDisaster] = useState('Earthquake');
  const [selectedCondition, setSelectedCondition] = useState('CRITICAL');

  const EARTHQUAKE_IMG = "https://images.unsplash.com/photo-1677233860259-ce1a8e0f8498?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const DISASTERS = [
    { id: 'Earthquake', label: 'Earthquake', image: EARTHQUAKE_IMG },
    { id: 'Flood', label: 'Flood', icon: AlertTriangle },
    { id: 'Fire', label: 'Fire', icon: Flame },
    { id: 'Cyclone', label: 'Cyclone', icon: Activity },
    { id: 'Landslide', label: 'Landslide', icon: Shield },
    { id: 'Heatwave', label: 'Heatwave', icon: Flame },
    { id: 'Industrial', label: 'Industrial', icon: Shield },
    { id: 'Other', label: 'Other', icon: AlertTriangle }
  ];

  return (
    <div className="app-container">
      {/* Top Navbar Header */}
      <header className="navbar">
        <div className="brand-logo" onClick={() => setScreen('home')} style={{ cursor: 'pointer' }}>
          <Flame color="#ea580c" size={28} />
          <span>DisasterMesh</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="badge-status"><Radio size={12} /> Offline Mesh Active</div>
          <button 
            style={{ background: '#16181e', border: '1px solid #272a34', color: '#fff', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => setScreen(screen === 'login' ? 'signup' : 'login')}
          >
            {screen === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </header>

      {/* SCREEN 1: Home / Emergency Dashboard */}
      {screen === 'home' && (
        <div>
          <div className="dark-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <span style={{ color: '#ea580c', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '1px' }}>OFFLINE EMERGENCY SYSTEM</span>
            <h1 style={{ fontSize: '2.5rem', margin: '12px 0 24px', fontWeight: '800' }}>Are you safe?</h1>
            <button className="btn-sos" onClick={() => setScreen('sos_active')}>
              🚨 SOS — HOLD FOR 3 SECONDS
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="dark-card" style={{ cursor: 'pointer' }} onClick={() => setScreen('disaster_type')}>
              <AlertTriangle color="#ea580c" size={28} />
              <h3 style={{ margin: '12px 0 6px' }}>Report Disaster</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Report a fire, flood, earthquake or other hazard.</p>
            </div>

            <div className="dark-card" style={{ cursor: 'pointer' }} onClick={() => setScreen('victim_condition')}>
              <HeartPulse color="#ea580c" size={28} />
              <h3 style={{ margin: '12px 0 6px' }}>Victim Condition</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Update your immediate safety and injury status.</p>
            </div>

            <div className="dark-card">
              <MapPin color="#ea580c" size={28} />
              <h3 style={{ margin: '12px 0 6px' }}>Offline Map</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>View emergency map and shelters without internet.</p>
            </div>

            <div className="dark-card">
              <CheckCircle2 color="#10b981" size={28} />
              <h3 style={{ margin: '12px 0 6px' }}>I'm Safe ✓</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Send safe status to contacts via mesh network.</p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: Login */}
      {screen === 'login' && (
        <div className="dark-card" style={{ maxWidth: '450px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '0.9rem' }}>Access your DisasterMesh emergency profile</p>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Mobile Number</label>
            <input type="text" className="input-box" placeholder="Enter mobile number" />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#9ca3af', fontSize: '0.85rem' }}>PIN</label>
            <input type="password" className="input-box" placeholder="••••••••" />
          </div>

          <button className="btn-primary" onClick={() => setScreen('home')}>LOGIN</button>
        </div>
      )}

      {/* SCREEN 3: Emergency Type */}
      {screen === 'disaster_type' && (
        <div className="dark-card">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>What happened?</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Select the type of emergency incident to alert rescuers.</p>

          <div className="disaster-grid">
            {DISASTERS.map((d) => (
              <div 
                key={d.id} 
                className={`disaster-item ${selectedDisaster === d.id ? 'active' : ''}`}
                onClick={() => setSelectedDisaster(d.id)}
              >
                {d.image ? (
                  <img src={d.image} alt={d.label} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px' }} />
                ) : (
                  <d.icon size={28} color={selectedDisaster === d.id ? '#ea580c' : '#9ca3af'} style={{ margin: '0 auto 8px' }} />
                )}
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{d.label}</div>
              </div>
            ))}
          </div>

          <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => setScreen('victim_condition')}>
            Continue →
          </button>
        </div>
      )}

      {/* SCREEN 4: Victim Condition */}
      {screen === 'victim_condition' && (
        <div className="dark-card" style={{ maxWidth: '550px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>How serious is your situation?</h2>
          <p style={{ color: '#9ca3af', marginBottom: '20px' }}>Select your status to prioritize rescue efforts.</p>

          {[
            { id: 'CRITICAL', label: 'CRITICAL', desc: 'Trapped or severe injury', color: '#ef4444' },
            { id: 'URGENT', label: 'URGENT', desc: 'Medical assistance required', color: '#f97316' },
            { id: 'ASSISTANCE', label: 'NEED ASSISTANCE', desc: 'Food, water or shelter required', color: '#eab308' },
            { id: 'SAFE', label: 'SAFE', desc: 'No immediate assistance required', color: '#10b981' }
          ].map((c) => (
            <div 
              key={c.id} 
              className={`condition-card ${selectedCondition === c.id ? 'active' : ''}`}
              onClick={() => setSelectedCondition(c.id)}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.color, boxShadow: `0 0 8px ${c.color}` }}></div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{c.label}</strong>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{c.desc}</span>
              </div>
            </div>
          ))}

          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setScreen('sos_active')}>
            Confirm Selection
          </button>
        </div>
      )}

      {/* SCREEN 5: SOS Active Status */}
      {screen === 'sos_active' && (
        <div className="dark-card" style={{ maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '8px 16px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '16px' }}>
            🚨 SOS ACTIVE
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Your emergency request has been saved.</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '24px' }}>Waiting for a nearby DisasterMesh device...</p>

          <div style={{ background: '#181a20', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px', display: 'grid', gap: '12px' }}>
            <div><span style={{ color: '#9ca3af' }}>Location:</span> <strong>Acquired (12.3456 N, 78.9101 E)</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Time:</span> <strong>10:32 AM</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Network:</span> <strong style={{ color: '#ef4444' }}>Offline Mesh Active</strong></div>
            <div><span style={{ color: '#9ca3af' }}>Status:</span> <strong>Searching for nearby devices</strong></div>
          </div>

          <button className="btn-primary" onClick={() => setScreen('home')}>
            Return to Home Dashboard
          </button>
        </div>
      )}
    </div>
  );
}