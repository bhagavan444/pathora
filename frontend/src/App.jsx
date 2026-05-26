import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Core components - keep eager loaded for instant FCP (First Contentful Paint)
import Navbar from "./components/Navbar.jsx";
import BackgroundVideoLayer from "./components/BackgroundVideoLayer.jsx";
import Home from "./Pages/Home.jsx";

// Performance tools
import PageWrapper from "./components/PageWrapper.jsx";
import InfrastructureLoader from "./components/InfrastructureLoader.jsx";
import { auth } from "./firebase.js";

// ==============================================================
// LAZY LOADED ROUTES
// Drastically reduces initial JS payload parsing for 144Hz FCP
// ==============================================================
const Predict = lazy(() => import("./Pages/Predict.jsx"));
const Chat = lazy(() => import("./Pages/Chat.jsx"));
const About = lazy(() => import("./Pages/About.jsx"));
const Contact = lazy(() => import("./Pages/Contact.jsx"));
const Login = lazy(() => import("./Pages/Login.jsx"));
const Plans = lazy(() => import("./Pages/Plans.jsx"));
const Quiz = lazy(() => import("./Pages/Quiz.jsx"));
const Admin = lazy(() => import("./Pages/Admin.jsx"));
const Dashboard = lazy(() => import("./Pages/Dashboard.jsx"));
const Settings = lazy(() => import("./Pages/Settings.jsx"));
const Checkout = lazy(() => import("./Pages/Checkout.jsx"));
const Subscription = lazy(() => import("./Pages/Subscription.jsx"));
const Billing = lazy(() => import("./Pages/Billing.jsx"));
const Console = lazy(() => import("./Pages/Console.jsx"));

// Footer Routes
const Assessments = lazy(() => import("./Pages/Assessments.jsx"));
const Assistant = lazy(() => import("./Pages/Assistant.jsx"));
const Resources = lazy(() => import("./Pages/Resources.jsx"));
const Docs = lazy(() => import("./Pages/Docs.jsx"));
const Research = lazy(() => import("./Pages/Research.jsx"));
const Platform = lazy(() => import("./Pages/Platform.jsx"));
const Careers = lazy(() => import("./Pages/Careers.jsx"));
const Privacy = lazy(() => import("./Pages/Privacy.jsx"));
const Terms = lazy(() => import("./Pages/Terms.jsx"));

// Higher Order Component to wrap lazy routes cleanly
const LazyRoute = ({ Component }) => (
  <Suspense fallback={<InfrastructureLoader />}>
    <PageWrapper>
      <Component />
    </PageWrapper>
  </Suspense>
);

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Eagerly loaded home page */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        
        {/* Lazy loaded core features */}
        <Route path="/predict" element={<LazyRoute Component={Predict} />} />
        <Route path="/chat" element={<LazyRoute Component={Chat} />} />
        <Route path="/about" element={<LazyRoute Component={About} />} />
        <Route path="/contact" element={<LazyRoute Component={Contact} />} />
        <Route path="/login" element={<LazyRoute Component={Login} />} />
        <Route path="/plans" element={<LazyRoute Component={Plans} />} />
        <Route path="/quiz" element={<LazyRoute Component={Quiz} />} />
        <Route path="/admin" element={<LazyRoute Component={Admin} />} />
        <Route path="/dashboard" element={<LazyRoute Component={Dashboard} />} />
        <Route path="/settings" element={<LazyRoute Component={Settings} />} />
        
        {/* Infrastructure SaaS Routes */}
        <Route path="/checkout" element={<LazyRoute Component={Checkout} />} />
        <Route path="/subscription" element={<LazyRoute Component={Subscription} />} />
        <Route path="/billing" element={<LazyRoute Component={Billing} />} />
        <Route path="/console" element={<LazyRoute Component={Console} />} />
        
        {/* Footer Routes */}
        <Route path="/assessments" element={<LazyRoute Component={Assessments} />} />
        <Route path="/assistant" element={<LazyRoute Component={Assistant} />} />
        <Route path="/resources" element={<LazyRoute Component={Resources} />} />
        <Route path="/docs" element={<LazyRoute Component={Docs} />} />
        <Route path="/research" element={<LazyRoute Component={Research} />} />
        <Route path="/platform" element={<LazyRoute Component={Platform} />} />
        <Route path="/careers" element={<LazyRoute Component={Careers} />} />
        <Route path="/privacy" element={<LazyRoute Component={Privacy} />} />
        <Route path="/terms" element={<LazyRoute Component={Terms} />} />
      </Routes>
    </AnimatePresence>
  );
}

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
      <BackgroundVideoLayer />
      <Navbar handleLogout={handleLogout} />
      
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          background: "transparent",
        }}
      >
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;