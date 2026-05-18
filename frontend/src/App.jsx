import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CinematicBackground from "./components/CinematicBackground";

// Pages
import Home from "./pages/Home";
import Predict from "./pages/Predict";
import Chat from "./pages/Chat";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Plans from "./pages/Plans";
import Quiz from "./pages/Quiz";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

import { auth } from "./firebase"; // Import Firebase auth for logout

function App() {
  const handleLogout = () => {
    if (!auth) {
      console.warn("[App] Firebase auth is undefined. Cannot sign out.");
      return;
    }
    auth.signOut()
      .then(() => {
        localStorage.removeItem("user");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", backgroundColor: "transparent" }}>
      <CinematicBackground />
      <div style={{ position: "relative", zIndex: 10 }}>
        <Router>
          <Navbar handleLogout={handleLogout} /> {/* Pass handleLogout to Navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login handleLogin={() => { }} />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;