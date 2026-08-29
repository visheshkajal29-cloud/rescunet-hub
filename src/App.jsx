import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, Shield, PhoneCall, HeartHandshake, LayoutDashboard, 
  MapPin, RefreshCw, Radio, Phone, Zap, Trash2, Map as MapIcon,
  Mic, MicOff, Volume2, VolumeX, Download, Languages, UserCheck, Send
} from 'lucide-react';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import jsPDF from 'jspdf';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Internationalization Dictionaries
const TRANSLATIONS = {
  en: {
    title: 'RescuNet Hub',
    online: 'ONLINE SYSTEM',
    offline: 'OFFLINE STORAGE ACTIVE',
    sosCall: 'EMERGENCY DIRECT CALL',
    quickAlert: 'Quick Alert',
    mapRadar: 'Emergency Map',
    logs: 'Logs',
    precautions: 'Visual Precautions',
    helplines: 'Emergency Lines',
    donate: 'Relief Fund',
    responderView: 'Responder Mode',
    sendAlert: '⚡ TRANSMIT INSTANT EMERGENCY ALERT',
    disasterType: 'Disaster Category',
    severity: 'Severity Level',
    location: 'GPS Detected Location',
    details: 'Situation Details (Optional)',
    placeholderDetails: 'Describe trapped individuals, casualties, hazards...',
    voiceNote: 'Emergency Voice Note',
    startRec: 'Record Voice Alert',
    stopRec: 'Stop Recording',
    clearAll: 'Clear All Logs',
    exportCsv: 'Export CSV',
    exportPdf: 'Export PDF Report',
    sirenToggleOn: 'ACTIVATE SIREN & STROBE',
    sirenToggleOff: 'DEACTIVATE SIREN',
    smsFallback: '📱 Send via Emergency SMS'
  },
  hi: {
    title: 'रेस्क्यूनेट हब',
    online: 'ऑनलाइन सिस्टम',
    offline: 'ऑफलाइन स्टोरेज सक्रिय',
    sosCall: 'आपातकालीन कॉल',
    quickAlert: 'त्वरित अलर्ट',
    mapRadar: 'आपातकालीन मानचित्र',
    logs: 'लॉग रिपोर्ट',
    precautions: 'बचाव निर्देश',
    helplines: 'हेल्पलाइन नंबर',
    donate: 'राहत कोष',
    responderView: 'बचावकर्ता मोड',
    sendAlert: '⚡ तुरंत आपातकालीन अलर्ट भेजें',
    disasterType: 'आपदा श्रेणी',
    severity: 'गंभीरता स्तर',
    location: 'जीपीएस स्थान',
    details: 'स्थिति का विवरण (वैकल्पिक)',
    placeholderDetails: 'फंसे हुए लोगों या खतरों का विवरण दें...',
    voiceNote: 'आपातकालीन वॉयस नोट',
    startRec: 'वॉइस रिकॉर्ड शुरू करें',
    stopRec: 'रिकॉर्डिंग रोकें',
    clearAll: 'सभी लॉग हटाएं',
    exportCsv: 'CSV डाउनलोड करें',
    exportPdf: 'PDF रिपोर्ट डाउनलोड करें',
    sirenToggleOn: 'साइरन और स्ट्रोब चालू करें',
    sirenToggleOff: 'साइरन बंद करें',
    smsFallback: '📱 एसएमएस (SMS) द्वारा भेजें'
  }
};

const DISASTER_TYPES = ['Flood', 'Earthquake', 'Cyclone', 'Landslide', 'Wildfire', 'Tsunami'];

const PRECAUTION_DATA = [
  {
    type: 'Flood',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    rules: ['Move to higher ground immediately.', 'Avoid standing water and power lines.', 'Store drinking water in sealed containers.']
  },
  {
    type: 'Earthquake',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    rules: ['Drop, Cover, and Hold on.', 'Stay away from outer walls and glass windows.', 'If outside, clear buildings and overhead wires.']
  },
  {
    type: 'Cyclone',
    image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80',
    rules: ['Secure roof sheets and shut windows.', 'Keep battery radios turned on.', 'Remain indoors until official clearance.']
  },
  {
    type: 'Landslide',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    rules: ['Move out of path of flowing debris.', 'Listen for cracking trees or rolling boulders.', 'Stay alert while navigating hillside roads.']
  },
  {
    type: 'Wildfire',
    image: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=800&q=80',
    rules: ['Evacuate immediately when ordered.', 'Close all doors/windows to prevent drafts.', 'Wear long sleeves and wet face coverings.']
  },
  {
    type: 'Tsunami',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80',
    rules: ['Head inland to high ground instantly upon coastal recession.', 'Avoid coastal shores until official all-clear is issued.']
  }
];

const HELPLINES = [
  { title: 'Personal Direct SOS', number: '7082810840' },
  { title: 'National Emergency', number: '112' },
  { title: 'NDRF Disaster Control', number: '011-24363260' },
  { title: 'Fire Services', number: '101' },
  { title: 'Ambulance Services', number: '102' }
];

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function App() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState('report');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [reports, setReports] = useState(() => JSON.parse(localStorage.getItem('rescunet_reports') || '[]'));
  const [responderMode, setResponderMode] = useState(false);
  
  // Audio & Strobe Beacon States
  const [sirenActive, setSirenActive] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // Voice Note Recording States
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Form State
  const [disasterType, setDisasterType] = useState('Flood');
  const [severity, setSeverity] = useState('Critical');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090, address: 'Acquiring GPS...' });
  const [loadingLoc, setLoadingLoc] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    fetchGeoLocation();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Web Audio Synth Siren Effect
  const toggleSiren = () => {
    if (sirenActive) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      setSirenActive(false);
    } else {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);

      // Oscillate pitch continuously
      let flag = false;
      const interval = setInterval(() => {
        if (!oscRef.current) {
          clearInterval(interval);
          return;
        }
        osc.frequency.setValueAtTime(flag ? 440 : 880, ctx.currentTime);
        flag = !flag;
      }, 500);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscRef.current = osc;
      setSirenActive(true);
    }
  };

  // Voice Recorder Controls
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone access denied or unverified.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const fetchGeoLocation = () => {
    if (!navigator.geolocation) {
      setLocation(l => ({ ...l, address: 'Geolocation not supported' }));
      return;
    }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let addr = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
        
        if (navigator.onLine) {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data.display_name) addr = data.display_name;
          } catch (e) {
            console.error('Reverse Geocode error', e);
          }
        }
        setLocation({ lat: latitude, lng: longitude, address: addr });
        setLoadingLoc(false);
      },
      () => {
        setLocation(l => ({ ...l, address: 'Location permission denied' }));
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    let audioUrl = null;
    if (audioBlob) {
      audioUrl = URL.createObjectURL(audioBlob);
    }
    const newReport = {
      id: Date.now(),
      disasterType,
      severity,
      status: 'Pending',
      description: description.trim() || 'Urgent SOS Incident Reported (No details provided)',
      address: location.address,
      lat: location.lat,
      lng: location.lng,
      audioUrl,
      timestamp: new Date().toLocaleString()
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('rescunet_reports', JSON.stringify(updated));
    setDescription('');
    setAudioBlob(null);
    alert('Emergency alert transmitted!');
    setActiveTab('dashboard');
  };

  // Send SOS via SMS
  const sendSmsFallback = () => {
    const text = `EMERGENCY ALERT! Type: ${disasterType}, Severity: ${severity}, Location: ${location.address}, Details: ${description || 'Immediate assistance requested'}`;
    window.open(`sms:7082810840?body=${encodeURIComponent(text)}`);
  };

  // Status Triage Update for Volunteers
  const updateReportStatus = (id, status) => {
    const updated = reports.map(r => r.id === id ? { ...r, status } : r);
    setReports(updated);
    localStorage.setItem('rescunet_reports', JSON.stringify(updated));
  };

  const deleteReport = (id) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('rescunet_reports', JSON.stringify(updated));
  };

  const clearAllReports = () => {
    if (window.confirm('Wipe all saved emergency logs?')) {
      setReports([]);
      localStorage.setItem('rescunet_reports', JSON.stringify([]));
    }
  };

  // Export CSV Data File
  const exportCsv = () => {
    if (reports.length === 0) return alert('No reports to export.');
    let csvContent = "data:text/csv;charset=utf-8,ID,Type,Severity,Status,Timestamp,Address,Description\n";
    reports.forEach(r => {
      csvContent += `"${r.id}","${r.disasterType}","${r.severity}","${r.status}","${r.timestamp}","${r.address.replace(/"/g, '""')}","${r.description.replace(/"/g, '""')}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RescuNet_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF Document
  const exportPdf = () => {
    if (reports.length === 0) return alert('No reports to export.');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('RescuNet Emergency Incident Log', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    let y = 38;
    reports.forEach((r, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.text(`${idx + 1}. [${r.severity}] ${r.disasterType} - Status: ${r.status}`, 14, y);
      doc.setFontSize(9);
      doc.text(`Time: ${r.timestamp} | Location: ${r.address.substring(0, 65)}`, 14, y + 6);
      doc.text(`Details: ${r.description.substring(0, 80)}`, 14, y + 12);
      y += 20;
    });
    doc.save(`RescuNet_Log_${Date.now()}.pdf`);
  };

  return (
    <div className={`app-container ${sirenActive ? 'strobe-alert' : ''}`}>
      {/* Top Navigation Header */}
      <header>
        <div className="brand">
          <Zap size={32} color="#ef4444" /> {t.title}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className="nav-btn" 
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <Languages size={16} /> {lang === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <div className={`online-badge ${!isOnline ? 'offline' : ''}`}>
            <Radio size={14} /> {isOnline ? t.online : t.offline}
          </div>
        </div>
      </header>

      {/* Direct SOS Banner */}
      <div className="panic-banner">
        <div className="panic-info">
          <h2>{t.sosCall}</h2>
          <p>Instant Voice Connection: 7082810840</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={toggleSiren} 
            className="direct-sos-btn"
            style={{ background: sirenActive ? '#f59e0b' : '#3b82f6' }}
          >
            {sirenActive ? <VolumeX size={20} /> : <Volume2 size={20} />}
            {sirenActive ? t.sirenToggleOff : t.sirenToggleOn}
          </button>
          <a href="tel:7082810840" className="direct-sos-btn">
            <Phone size={20} /> CALL NOW
          </a>
        </div>
      </div>

      {/* App Navigation Tabs */}
      <div className="nav-tabs">
        <button className={`nav-btn ${activeTab === 'report' ? 'active' : ''}`} onClick={() => setActiveTab('report')}>
          <AlertTriangle size={18} /> {t.quickAlert}
        </button>
        <button className={`nav-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
          <MapIcon size={18} /> {t.mapRadar}
        </button>
        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <LayoutDashboard size={18} /> {t.logs} ({reports.length})
        </button>
        <button className={`nav-btn ${activeTab === 'precautions' ? 'active' : ''}`} onClick={() => setActiveTab('precautions')}>
          <Shield size={18} /> {t.precautions}
        </button>
        <button className={`nav-btn ${activeTab === 'sos' ? 'active' : ''}`} onClick={() => setActiveTab('sos')}>
          <PhoneCall size={18} /> {t.helplines}
        </button>
        <button className={`nav-btn ${activeTab === 'donate' ? 'active' : ''}`} onClick={() => setActiveTab('donate')}>
          <HeartHandshake size={18} /> {t.donate}
        </button>
      </div>

      {/* TAB 1: QUICK REPORT & EMERGENCY ACTIONS */}
      {activeTab === 'report' && (
        <div className="card">
          <h2 className="card-title"><AlertTriangle color="#ef4444" /> {t.sendAlert}</h2>
          <form onSubmit={handleReportSubmit}>
            <div className="form-group">
              <label>{t.disasterType}</label>
              <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)}>
                {DISASTER_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t.severity}</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="Critical">Critical (Immediate Danger)</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t.location}</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" value={location.address} readOnly />
                <button type="button" className="nav-btn" onClick={fetchGeoLocation} disabled={loadingLoc}>
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>{t.details}</label>
              <textarea 
                rows="3" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder={t.placeholderDetails}
              ></textarea>
            </div>

            {/* Voice Audio Recording Component */}
            <div className="form-group">
              <label>{t.voiceNote}</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {!recording ? (
                  <button type="button" className="nav-btn" onClick={startRecording} style={{ background: '#1e293b' }}>
                    <Mic size={16} color="#ef4444" /> {t.startRec}
                  </button>
                ) : (
                  <button type="button" className="nav-btn" onClick={stopRecording} style={{ background: '#7f1d1d' }}>
                    <MicOff size={16} color="#fff" /> {t.stopRec}
                  </button>
                )}
                {audioBlob && <span style={{ color: '#10b981', fontSize: '0.85rem' }}>✓ Voice Recorded</span>}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ background: '#dc2626', fontSize: '1.1rem', padding: '16px', marginBottom: '10px' }}>
              ⚡ SEND ALERT NOW WITH 1-CLICK
            </button>
            <button type="button" className="btn-primary" onClick={sendSmsFallback} style={{ background: '#334155', fontSize: '0.95rem', padding: '12px' }}>
              {t.smsFallback}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: INTERACTIVE MAP & RADAR */}
      {activeTab === 'map' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="card-title" style={{ margin: 0 }}>
              <MapIcon color="#ef4444" /> {t.mapRadar}
            </h2>
            <button className="nav-btn" onClick={fetchGeoLocation}>
              <RefreshCw size={16} /> Recenter GPS
            </button>
          </div>
          <div style={{ height: '420px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
            <MapContainer 
              center={[location.lat || 28.6139, location.lng || 77.2090]} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapRecenter center={[location.lat || 28.6139, location.lng || 77.2090]} />
              {location.lat && location.lng && (
                <>
                  <Marker position={[location.lat, location.lng]}>
                    <Popup>📍 Your Location<br />{location.address}</Popup>
                  </Marker>
                  <Circle center={[location.lat, location.lng]} radius={3000} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.15 }} />
                </>
              )}
              {reports.map((r) => (
                r.lat && r.lng ? (
                  <Marker key={r.id} position={[r.lat, r.lng]}>
                    <Popup>
                      <strong>{r.disasterType} ({r.severity})</strong><br />
                      Status: <em>{r.status}</em><br />
                      {r.description}<br />
                      <small>{r.timestamp}</small>
                    </Popup>
                  </Marker>
                ) : null
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* TAB 3: INCIDENT LOGS & TRIAGE RESPONDER MODE */}
      {activeTab === 'dashboard' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 className="card-title" style={{ margin: 0 }}><LayoutDashboard /> Incident Logs</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setResponderMode(!responderMode)} 
                style={{ background: responderMode ? '#059669' : '#334155', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
              >
                <UserCheck size={16} /> {t.responderView}
              </button>
              <button onClick={exportCsv} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #0284c7', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={16} /> CSV
              </button>
              <button onClick={exportPdf} style={{ background: '#1e293b', color: '#f472b6', border: '1px solid #db2777', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={16} /> PDF
              </button>
              {reports.length > 0 && (
                <button onClick={clearAllReports} style={{ background: '#7f1d1d', color: '#fca5a5', border: '1px solid #991b1b', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {reports.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No saved emergency reports.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reports.map((r) => (
                <div key={r.id} style={{ background: '#090d16', padding: '16px', borderRadius: '10px', borderLeft: `6px solid ${r.severity === 'Critical' ? '#ef4444' : '#f59e0b'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <strong>
                      {r.disasterType} <span style={{ color: r.severity === 'Critical' ? '#ef4444' : '#f59e0b' }}>({r.severity})</span>
                      <span style={{ marginLeft: '10px', fontSize: '0.8rem', background: r.status === 'Resolved' ? '#065f46' : r.status === 'In Progress' ? '#9a3412' : '#374151', padding: '2px 8px', borderRadius: '12px' }}>
                        {r.status}
                      </span>
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.timestamp}</span>
                      <button 
                        onClick={() => deleteReport(r.id)} 
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.95rem', marginBottom: '10px', color: '#cbd5e1' }}>{r.description}</p>
                  
                  {r.audioUrl && (
                    <div style={{ marginBottom: '10px' }}>
                      <audio controls src={r.audioUrl} style={{ width: '100%', height: '36px' }} />
                    </div>
                  )}

                  <small style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {r.address}
                  </small>

                  {/* Responder Triage Controls */}
                  {responderMode && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #1e293b', display: 'flex', gap: '8px' }}>
                      <button onClick={() => updateReportStatus(r.id, 'In Progress')} style={{ background: '#d97706', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        Mark In Progress
                      </button>
                      <button onClick={() => updateReportStatus(r.id, 'Resolved')} style={{ background: '#059669', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRECAUTIONS */}
      {activeTab === 'precautions' && (
        <div className="grid-layout">
          {PRECAUTION_DATA.map((item) => (
            <div key={item.type} className="precaution-card">
              <img 
                src={item.image} 
                alt={item.type} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="precaution-body">
                <h3>{item.type} Protocol</h3>
                <ul>
                  {item.rules.map((rule, idx) => <li key={idx}>{rule}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: EMERGENCY HELPLINES */}
      {activeTab === 'sos' && (
        <div className="card">
          <h2 className="card-title"><PhoneCall color="#ef4444" /> {t.helplines}</h2>
          <div className="sos-grid" style={{ marginTop: '20px' }}>
            {HELPLINES.map((h, i) => (
              <div key={i} className="sos-card">
                <div>
                  <strong>{h.title}</strong>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>{h.number}</div>
                </div>
                <a href={`tel:${h.number}`} className="sos-call-btn">CALL</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: RELIEF FUND */}
      {activeTab === 'donate' && (
        <div className="donate-box">
          <HeartHandshake size={56} color="#f59e0b" style={{ marginBottom: '16px' }} />
          <h2>Emergency Relief Support</h2>
          <p style={{ color: 'var(--text-muted)', margin: '12px 0' }}>Direct support to disaster relief supplies via UPI.</p>
          <div className="upi-tag">7082810840@mbk</div>
          <br />
          <a href="upi://pay?pa=7082810840@mbk&pn=DisasterRelief&cu=INR" className="btn-primary" style={{ display: 'inline-block', width: 'auto', marginTop: '16px', textDecoration: 'none' }}>
            PAY VIA UPI APP
          </a>
        </div>
      )}
    </div>
  );
}