import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import BackgroundVideoLayer from "./components/BackgroundVideoLayer.jsx";

import Home from "./Pages/Home.jsx";
import Predict from "./Pages/Predict.jsx";
import Chat from "./Pages/Chat.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import Plans from "./Pages/Plans.jsx";
import Quiz from "./Pages/Quiz.jsx";
import Admin from "./Pages/Admin.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Settings from "./Pages/Settings.jsx";

import { auth } from "./firebase.js";

function App() {

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Router>
      
      {/* Background Video */}
      <BackgroundVideoLayer />

      {/* Navbar */}
      <Navbar handleLogout={handleLogout} />

      {/* Main App */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          background: "transparent",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

    </Router>
  );
}

export default App;