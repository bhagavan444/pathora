import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx"; // assuming Footer component exists

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <section style={{
        minHeight: "calc(100vh - 120px)",
        padding: "80px 20px",
        background: "var(--bg)",
        color: "var(--tp)",
        fontFamily: "var(--sans)"
      }}>
        <div style={{
          maxWidth: "960px",
          margin: "0 auto",
          lineHeight: 1.6,
          fontSize: 14
        }}>
          <h1 style={{ fontSize: 28, marginBottom: 24, fontWeight: 400, fontFamily: "var(--display)" }}>
            Privacy Policy
          </h1>
          <p>
            Pathora processes resumes and engineering profiles using deterministic evaluation engines. All data is encrypted in‑flight and at rest. We retain only the minimal signals required for infrastructure‑grade analysis and compliance with GDPR/CCPA.
          </p>
          <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, fontWeight: 400 }}>
            Data Governance
          </h2>
          <ul>
            <li>Encrypted storage (AES‑256) with rotating keys.</li>
            <li>Access limited to authorized evaluation services.</li>
            <li>Retention period: 90 days for raw resumes, 1 year for aggregated metrics.</li>
            <li>Full deletion request via the "Contact" portal.</li>
          </ul>
          <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12, fontWeight: 400 }}>
            Telemetry & Security
          </h2>
          <p>
            All pipeline stages emit signed telemetry logs that are stored in an immutable audit trail. No third‑party analytics are injected.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Privacy;
