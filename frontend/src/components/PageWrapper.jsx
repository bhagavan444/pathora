import React from "react";
import { motion } from "framer-motion";

// Subtle, Vercel-inspired fade and scale transition
// Optimized for 144Hz with hardware acceleration
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.99,
    y: 4,
    filter: "blur(4px)",
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier smooth ease-out
    },
  },
  out: {
    opacity: 0,
    scale: 0.99,
    y: -4,
    filter: "blur(4px)",
    transition: {
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

const PageWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className={className}
      style={{
        width: "100%",
        minHeight: "100vh",
        willChange: "transform, opacity, filter",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden"
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
