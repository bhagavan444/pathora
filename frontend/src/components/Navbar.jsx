import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      console.warn("[Navbar] Firebase auth is undefined. Skipping onAuthStateChanged listener.");
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handlePredictClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginPopup(true);
      setTimeout(() => setShowLoginPopup(false), 3000);
    }
  };

  const executeLogout = () => {
    if (handleLogout) handleLogout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const NAV_ITEMS = [
    { label: "Home", to: "/" },
    { label: "Predict", to: "/predict", isPredict: true },
    { label: "AI BOT", to: "/chat" },
    { label: "Quiz", to: "/quiz" },
    { label: "Plans", to: "/plans" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  if (!user) {
    NAV_ITEMS.push({ label: "Login", to: "/login" });
  }

  return (
    <>
      <style>{`
        .nav-container {
          position: fixed;
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 4rem);
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
        }

        .nav-pill {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(30px) saturate(120%);
          -webkit-backdrop-filter: blur(30px) saturate(120%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 100px;
          height: 40px;
          display: flex;
          align-items: center;
          padding: 0 0.3rem;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .logo-pill {
          padding: 0 1.25rem 0 0.5rem;
          gap: 12px;
          text-decoration: none;
        }

        .logo-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .logo-dot {
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.8);
        }

        .brand-text {
          font-size: 0.8rem;
          font-weight: 500;
          color: #000000;
          letter-spacing: 0.02em;
        }

        .nav-center-pill {
          padding: 0 1rem;
          gap: 4px;
        }
        
        @media (max-width: 900px) {
          .nav-center-pill { display: none; }
        }

        .nav-item {
          padding: 0.35rem 0.9rem;
          color: rgba(0,0,0,0.6);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 100px;
          transition: all 0.4s ease;
          position: relative;
        }

        .nav-item:hover {
          color: #000000;
          text-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .nav-item.active {
          color: #000000;
          background: rgba(0, 0, 0, 0.04);
          box-shadow: none;
        }

        .right-pill {
          background: transparent;
          backdrop-filter: none;
          border: none;
          box-shadow: none;
          padding: 0;
          gap: 12px;
        }

        .mobile-btn {
          display: none;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(30px) saturate(120%);
          -webkit-backdrop-filter: blur(30px) saturate(120%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #000000;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 900px) {
          .mobile-btn { display: flex; }
        }

        /* Avatar styles */
        .avatar-container {
          position: relative;
          display: flex;
          align-items: center;
          height: 40px;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          cursor: pointer;
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .avatar-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent, rgba(0,0,0,0.1), transparent);
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .profile-dropdown {
          position: absolute;
          top: 120%;
          right: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 0.5rem;
          min-width: 180px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .dropdown-item {
          padding: 10px 16px;
          color: #000;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .dropdown-item:hover {
          background: rgba(0,0,0,0.04);
        }

        .dropdown-item.logout {
          color: #ef4444;
        }

        .dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Popup styles */
        .login-popup {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.95);
          color: white;
          padding: 12px 24px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 500;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          z-index: 10000;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          pointer-events: none;
        }
      `}</style>

      <div className="nav-container">
        {/* Left Logo Pill */}
        <Link to="/" className="nav-pill logo-pill">
          <div className="logo-circle">
            <div className="logo-dot" />
          </div>
          {location.pathname !== "/chat" && <span className="brand-text">Pathora</span>}
        </Link>

        {/* Center Nav Pill */}
        <nav className="nav-pill nav-center-pill">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={item.isPredict ? handlePredictClick : undefined}
              className={`nav-item ${location.pathname === item.to ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Nav / Mobile Menu */}
        <div className="nav-pill right-pill">
          {user && (
            <div className="avatar-container">
              <motion.div 
                className="profile-avatar"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="avatar-glow" />
                <User size={18} style={{ zIndex: 2 }} />
              </motion.div>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="dropdown-item">
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                      Realtime Active
                    </div>
                    <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>Dashboard</div>
                    <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}>Settings</div>
                    <div className="dropdown-item logout" onClick={executeLogout}>Logout</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            className="mobile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Login Popup */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            className="login-popup"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            Please login to access Predict features
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed', top: '5.5rem', left: '1rem', right: '1rem',
              background: 'rgba(15,15,20,0.8)', backdropFilter: 'blur(30px)',
              borderRadius: '24px', padding: '1.5rem', zIndex: 9998,
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={(e) => {
                    if (item.isPredict && !user) {
                      e.preventDefault();
                      setMenuOpen(false);
                      setShowLoginPopup(true);
                      setTimeout(() => setShowLoginPopup(false), 3000);
                      return;
                    }
                    setMenuOpen(false);
                  }}
                  style={{
                    padding: '12px 16px', color: '#ffffff', textDecoration: 'none',
                    fontSize: '0.9rem', borderRadius: '12px',
                    background: location.pathname === item.to ? 'rgba(255,255,255,0.1)' : 'transparent'
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}