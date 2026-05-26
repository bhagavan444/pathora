import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Database, Shield, Settings2, Code, 
  Terminal, Activity, Zap, CheckCircle2, Copy 
} from 'lucide-react';
import Footer from '../components/Footer';
import { auth } from '../firebase';
import './Settings.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('identity');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  // Data states
  const [profile, setProfile] = useState({ engineering_role: '', career_target: '', primary_stack: '' });
  const [preferences, setPreferences] = useState({ recruiter_strictness: 'moderate', ats_analysis_mode: 'standard', profile_visibility: false });
  const [tokens, setTokens] = useState([]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const menuItems = [
    { id: 'identity', label: 'Engineering Identity', icon: User },
    { id: 'preferences', label: 'Intelligence Preferences', icon: Settings2 },
    { id: 'infrastructure', label: 'Infrastructure Access', icon: Database },
    { id: 'api_tokens', label: 'API & Tokens', icon: Code },
    { id: 'security', label: 'Security Operations', icon: Shield },
  ];

  const getToken = async () => {
    if (auth?.currentUser) {
      // For development, if Firebase isn't returning a valid token, we send UID
      return auth.currentUser.uid;
    }
    return "test_uid"; // Fallback for local testing if not logged in
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const headers = { 'Authorization': `Bearer ${token}` };
      
      if (activeTab === 'identity') {
        const res = await fetch('/api/settings/profile', { headers });
        if (res.ok) setProfile(await res.json());
      } else if (activeTab === 'preferences') {
        const res = await fetch('/api/settings/preferences', { headers });
        if (res.ok) setPreferences(await res.json());
      } else if (activeTab === 'api_tokens') {
        const res = await fetch('/api/settings/tokens', { headers });
        if (res.ok) {
          const data = await res.json();
          setTokens(data.tokens || []);
        }
      }
    } catch (e) {
      console.error("Failed to fetch settings", e);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus(`[POSTGRESQL] Persisting ${activeTab} state...`);
    
    try {
      const token = await getToken();
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      let endpoint = '';
      let payload = {};
      
      if (activeTab === 'identity') {
        endpoint = '/api/settings/profile';
        payload = profile;
      } else if (activeTab === 'preferences') {
        endpoint = '/api/settings/preferences';
        payload = preferences;
      }
      
      if (endpoint) {
        await fetch(endpoint, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
      }
      
      setTimeout(() => {
        setSaveStatus('[SYNC] Infrastructure state committed.');
        setTimeout(() => setSaveStatus(''), 2000);
        setLoading(false);
      }, 800);
      
    } catch (e) {
      console.error(e);
      setSaveStatus('[ERROR] Telemetry sync failed.');
      setLoading(false);
    }
  };

  const createToken = async () => {
    setSaveStatus('[SYSTEM] Generating infrastructure token...');
    try {
      const token = await getToken();
      const res = await fetch('/api/settings/tokens/create', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Production Pipeline Key' })
      });
      if (res.ok) {
        const newToken = await res.json();
        setTokens(prev => [...prev, newToken]);
        setSaveStatus('[SYNC] Token materialized.');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const revokeToken = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/settings/tokens/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTokens(prev => prev.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'identity':
        return (
          <>
            <div className="settings-form-group">
              <label className="settings-label">Engineering Role</label>
              <input 
                type="text" 
                className="settings-input" 
                value={profile.engineering_role}
                onChange={e => setProfile({...profile, engineering_role: e.target.value})}
                placeholder="e.g. Frontend Systems Engineer"
              />
            </div>
            <div className="settings-form-group">
              <label className="settings-label">Career Target</label>
              <input 
                type="text" 
                className="settings-input" 
                value={profile.career_target}
                onChange={e => setProfile({...profile, career_target: e.target.value})}
                placeholder="e.g. Backend Infrastructure"
              />
            </div>
            <div className="settings-form-group">
              <label className="settings-label">Primary Stack Vector</label>
              <input 
                type="text" 
                className="settings-input" 
                value={profile.primary_stack}
                onChange={e => setProfile({...profile, primary_stack: e.target.value})}
                placeholder="e.g. React, Node.js, PostgreSQL"
              />
            </div>
          </>
        );
      case 'preferences':
        return (
          <>
            <div className="settings-form-group">
              <label className="settings-label">Recruiter Strictness</label>
              <select 
                className="settings-select"
                value={preferences.recruiter_strictness}
                onChange={e => setPreferences({...preferences, recruiter_strictness: e.target.value})}
              >
                <option value="lenient">Lenient (High False Positives)</option>
                <option value="moderate">Moderate (Standard)</option>
                <option value="strict">Strict (Enterprise Grade)</option>
              </select>
            </div>
            <div className="settings-form-group">
              <label className="settings-label">ATS Analysis Mode</label>
              <select 
                className="settings-select"
                value={preferences.ats_analysis_mode}
                onChange={e => setPreferences({...preferences, ats_analysis_mode: e.target.value})}
              >
                <option value="startup">Startup Ecosystem</option>
                <option value="standard">Standard Industry</option>
                <option value="enterprise">FAANG/Enterprise</option>
              </select>
            </div>
            <div className="settings-form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
              <input 
                type="checkbox" 
                id="visibility"
                checked={preferences.profile_visibility}
                onChange={e => setPreferences({...preferences, profile_visibility: e.target.checked})}
                style={{ width: '16px', height: '16px', accentColor: '#8b5cf6' }}
              />
              <label htmlFor="visibility" className="settings-label" style={{ marginBottom: 0 }}>
                Enable Public Intelligence Profile
              </label>
            </div>
          </>
        );
      case 'api_tokens':
        return (
          <>
            <p style={{ color: 'rgba(0,0,0,0.6)', marginBottom: '24px', fontSize: '14px' }}>
              Generate API tokens for programmatic access to the evaluation pipeline and recruiter engines.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <button className="btn-save" onClick={createToken}>
                <Zap size={16} /> Generate Token
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {tokens.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(0,0,0,0.4)', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
                  NO ACTIVE TOKENS PROVISIONED
                </div>
              ) : (
                tokens.map(t => (
                  <div key={t.id} className="token-card">
                    <div>
                      <div className="token-name">{t.name}</div>
                      <div className="token-value">{t.token}</div>
                    </div>
                    <button className="btn-revoke" onClick={() => revokeToken(t.id)}>Revoke</button>
                  </div>
                ))
              )}
            </div>
          </>
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(0,0,0,0.4)', fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
            [SYSTEM] MODULE OFFLINE OR UNDER CONSTRUCTION
          </div>
        );
    }
  };

  return (
    <div className="settings-wrap">
      <div className="grid-bg"></div>
      
      <motion.div 
        className="settings-inner"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="settings-header">
          <h1 className="settings-title">Control Center</h1>
          <p className="settings-subtitle">Engineering identity & infrastructure configuration</p>
        </motion.div>

        <motion.div variants={itemVariants} className="settings-layout">
          
          {/* Left Sidebar */}
          <div className="settings-sidebar">
            {menuItems.map(item => (
              <div 
                key={item.id}
                className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={16} color={activeTab === item.id ? "#8b5cf6" : "currentColor"} />
                {item.label}
              </div>
            ))}
          </div>

          {/* Center Main Panel */}
          <div className="settings-panel">
            <div className="panel-title">
              {(() => {
                const ActiveIcon = menuItems.find(i => i.id === activeTab)?.icon;
                return ActiveIcon ? <ActiveIcon className="panel-title-icon" size={20} /> : null;
              })()}
              {menuItems.find(i => i.id === activeTab)?.label}
            </div>
            
            <div style={{ minHeight: '300px' }}>
              {renderContent()}
            </div>

            {/* Save Actions (Only for form tabs) */}
            {['identity', 'preferences'].includes(activeTab) && (
              <div className="settings-actions">
                <AnimatePresence>
                  {saveStatus && (
                    <motion.div 
                      className="telemetry-toast"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Terminal size={14} /> {saveStatus}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button 
                  className="btn-save" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? <Activity size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Commit State
                </button>
              </div>
            )}
          </div>

          {/* Right Telemetry Panel */}
          <div className="settings-telemetry">
            <div className="telemetry-card">
              <div className="telemetry-header">
                <Activity size={12} color="#10b981" />
                Infrastructure Health
              </div>
              <div className="telemetry-value">
                99.99<span className="telemetry-unit">%</span>
              </div>
            </div>
            <div className="telemetry-card">
              <div className="telemetry-header">
                <Database size={12} color="#8b5cf6" />
                State Persistence
              </div>
              <div className="telemetry-value">
                PostgreSQL<span className="telemetry-unit">/v14</span>
              </div>
            </div>
            <div className="telemetry-card">
              <div className="telemetry-header">
                <Shield size={12} color="#f59e0b" />
                Security Ops
              </div>
              <div className="telemetry-value" style={{ fontSize: '18px' }}>
                Secure
              </div>
            </div>
          </div>
          
        </motion.div>
      </motion.div>
      
      <div style={{ marginTop: '60px' }}>
        <Footer />
      </div>
    </div>
  );
}
