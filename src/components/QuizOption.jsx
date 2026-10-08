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
      "0 0 0 0 rgba(34,197,94,0.5)",
      "0 0 0 10px rgba(34,197,94,0)",
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
      whileHover={!disabled ? { scale: 1.01, borderColor: "var(--py-blue-light)" } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.9rem 1.25rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid",
        borderColor: state === "correct" ? "#22c55e" : state === "wrong" ? "#da3633" : "var(--border-color)",
        backgroundColor: state === "correct" ? "rgba(34, 197, 94, 0.2)" : state === "wrong" ? "rgba(218, 54, 51, 0.2)" : "var(--bg-card)",
        color: state === "correct" ? "#4ade80" : state === "wrong" ? "#f87171" : "var(--text-primary)",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justify: "space-between",
        transition: "all 0.2s ease"
      }}
    >
      <span>{label}</span>
      {state === "correct" && <CheckCircle2 size={18} style={{ color: "#4ade80", flexShrink: 0 }} />}
      {state === "wrong" && <XCircle size={18} style={{ color: "#f87171", flexShrink: 0 }} />}
    </motion.button>
  );
}

