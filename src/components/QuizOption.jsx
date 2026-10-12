import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

const shakeVariant = {
  shake: {
    x: [0, -8, 8, -6, 6, 0],
    transition: { duration: 0.4 },
  },
};

const pulseVariant = {
  pulse: {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgba(22,163,74,0.4)",
      "0 0 0 10px rgba(22,163,74,0)",
    ],
    transition: { duration: 0.5 },
  },
};

export function QuizOption({ label, state, onClick, disabled }) {
  // state: "idle" | "correct" | "wrong"
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      variants={state === "wrong" ? shakeVariant : pulseVariant}
      animate={state === "wrong" ? "shake" : state === "correct" ? "pulse" : ""}
      whileHover={!disabled ? { scale: 1.01, borderColor: "var(--py-blue)" } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.95rem 1.25rem",
        borderRadius: "var(--radius-md)",
        border: "1.5px solid",
        borderColor: state === "correct" ? "#16a34a" : state === "wrong" ? "#dc2626" : "var(--border-color)",
        backgroundColor: state === "correct" ? "rgba(22, 163, 74, 0.1)" : state === "wrong" ? "rgba(220, 38, 38, 0.1)" : "#ffffff",
        color: state === "correct" ? "#15803d" : state === "wrong" ? "#b91c1c" : "var(--text-primary)",
        fontSize: "0.98rem",
        fontWeight: "600",
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
        transition: "all 0.2s ease"
      }}
    >
      <span>{label}</span>
      {state === "correct" && <CheckCircle2 size={18} style={{ color: "#16a34a", flexShrink: 0 }} />}
      {state === "wrong" && <XCircle size={18} style={{ color: "#dc2626", flexShrink: 0 }} />}
    </motion.button>
  );
}
