import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Shield, Eye, Database } from 'lucide-react';
import Footer from '../components/Footer';

export default function Settings() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Information', icon: User, active: true },
    { id: 'security', label: 'Security & Access', icon: Lock, active: false },
    { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield, active: false },
    { id: 'appearance', label: 'Appearance', icon: Eye, active: false },
    { id: 'billing', label: 'Billing & Plans', icon: Database, active: false },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      padding: '120px 2rem 4rem',
      color: '#000',
      fontFamily: "'Inter', sans-serif",
      position: 'relative'
    }}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} style={{ marginBottom: '1rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #000 0%, rgba(0,0,0,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Account Settings
          </h1>
          <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1.1rem' }}>
            Manage your preferences and platform configurations.
          </p>
        </motion.div>

        {/* Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          gap: '2rem'
        }}>
          {/* Sidebar Menu */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  background: item.active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: item.active ? '#000' : 'rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: item.active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!item.active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!item.active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <item.icon size={18} />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            variants={itemVariants}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(30px) saturate(120%)',
              WebkitBackdropFilter: 'blur(30px) saturate(120%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Profile Information</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  border: '2px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={32} color="rgba(255,255,255,0.8)" />
                </div>
                <button style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#000',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}>Change Avatar</button>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem' }}>First Name</label>
                  <input type="text" defaultValue="Demo" style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.1)',
                    color: '#000', fontSize: '1rem', outline: 'none'
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem' }}>Last Name</label>
                  <input type="text" defaultValue="User" style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.1)',
                    color: '#000', fontSize: '1rem', outline: 'none'
                  }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem' }}>Email Address</label>
                <input type="email" defaultValue="demo@pathora.com" style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.1)',
                  color: '#000', fontSize: '1rem', outline: 'none'
                }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem' }}>Bio</label>
                <textarea rows="4" defaultValue="AI and Software Engineering enthusiast." style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.1)',
                  color: '#000', fontSize: '1rem', outline: 'none', resize: 'none'
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button style={{
                  background: '#2563eb',
                  border: 'none',
                  color: '#fff',
                  padding: '0.75rem 2rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                }}>Save Changes</button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
