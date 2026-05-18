import React from 'react';
import { motion } from 'framer-motion';
import { User, Activity, Target, Zap, Clock, Shield } from 'lucide-react';
import Footer from '../components/Footer';

export default function Dashboard() {
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

  const stats = [
    { label: 'Active Sessions', value: '12', icon: Activity, color: '#3b82f6' },
    { label: 'Career Trajectory', value: '89%', icon: Target, color: '#10b981' },
    { label: 'AI Insights', value: '4 New', icon: Zap, color: '#f59e0b' },
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
            Command Center
          </h1>
          <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1.1rem' }}>
            Real-time analytics and career trajectory insights.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02, translateY: -5 }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(30px) saturate(120%)',
                WebkitBackdropFilter: 'blur(30px) saturate(120%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div>
                <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                  {stat.label}
                </p>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stat.value}</h3>
              </div>
              <div style={{
                background: `rgba(${parseInt(stat.color.slice(1,3), 16)}, ${parseInt(stat.color.slice(3,5), 16)}, ${parseInt(stat.color.slice(5,7), 16)}, 0.1)`,
                padding: '12px',
                borderRadius: '16px',
                color: stat.color
              }}>
                <stat.icon size={24} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          <motion.div
            variants={itemVariants}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(30px) saturate(120%)',
              WebkitBackdropFilter: 'blur(30px) saturate(120%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2.5rem',
              minHeight: '400px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Activity Matrix</h2>
            <div style={{
              flex: 1,
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0,0,0,0.4)'
            }}>
              <p>Predictive Trajectory Visualization Loading...</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(30px) saturate(120%)',
              WebkitBackdropFilter: 'blur(30px) saturate(120%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Recent Logs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { icon: Clock, title: 'Profile Updated', time: '2 mins ago' },
                { icon: Zap, title: 'AI Prediction Run', time: '1 hr ago' },
                { icon: Shield, title: 'Security Check', time: '5 hrs ago' }
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <log.icon size={18} color="rgba(0,0,0,0.8)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 500 }}>{log.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
