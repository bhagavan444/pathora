// Terms.jsx – Premium terms of service page
import React from "react";
import { motion } from "framer-motion";

const pageFade = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Terms() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageFade}
      style={{
        minHeight: "100vh",
        padding: "80px 24px",
        background: "var(--bg)",
        color: "var(--tp)",
        fontFamily: "var(--sans)",
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 400, fontFamily: "var(--display)", marginBottom: 24 }}>
        Terms of Service
      </h1>
      <section style={{ maxWidth: 800, lineHeight: 1.6 }}>
        <p>
          By accessing or using the Pathora platform, you agree to be bound by these Terms of Service ("Terms"). These Terms govern your access to the deterministic engineering intelligence ecosystem, including all services, APIs, and documentation provided by Pathora.
        </p>
        <h2 style={{ fontSize: 24, marginTop: 32, marginBottom: 12 }}>
          1. Usage Rights
        </h2>
        <p>
          Pathora grants you a non‑exclusive, revocable, worldwide license to use the platform for evaluating technical profiles, accessing infrastructure‑grade telemetry, and integrating with the evaluation APIs. All usage must be consistent with the deterministic evaluation methodology and must not be used for deceptive or malicious purposes.
        </p>
        <h2 style={{ fontSize: 24, marginTop: 32, marginBottom: 12 }}>
          2. Data Governance & Privacy
        </h2>
        <p>
          Pathora processes uploaded resumes and profile data in an encrypted pipeline. Data is retained only for the duration necessary to provide evaluation results and is never shared with third‑party advertisers. See the <a href="/privacy" style={{ color: "#818cf8" }}>Privacy Policy</a> for detailed handling.
        </p>
        <h2 style={{ fontSize: 24, marginTop: 32, marginBottom: 12 }}>
          3. Intellectual Property
        </h2>
        <p>
          All proprietary algorithms, deterministic scoring engines, and telemetry visualizations remain the exclusive property of Pathora. You may not reproduce, reverse‑engineer, or distribute any component of the platform without explicit permission.
        </p>
        <h2 style={{ fontSize: 24, marginTop: 32, marginBottom: 12 }}>
          4. Limitation of Liability
        </h2>
        <p>
          Pathora provides evaluation results "as‑is" and disclaims all warranties, express or implied. In no event shall Pathora be liable for indirect, incidental, special, or consequential damages arising from the use of the platform.
        </p>
        <h2 style={{ fontSize: 24, marginTop: 32, marginBottom: 12 }}>
          5. Termination
        </h2>
        <p>
          We reserve the right to suspend or terminate access to the platform at our discretion, particularly for violations of deterministic evaluation integrity or malicious activity.
        </p>
        <p style={{ marginTop: 24, fontSize: 14, color: "var(--tm)" }}>
          Last updated: May 2026
        </p>
      </section>
    </motion.div>
  );
}
