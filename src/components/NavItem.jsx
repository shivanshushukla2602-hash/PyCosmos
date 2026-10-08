import { motion } from "framer-motion";

export function NavItem({ active, label, icon, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-3 px-4 py-2 border-0 bg-transparent text-left cursor-pointer transition-colors"
      style={{
        borderRadius: "var(--radius-md)",
        padding: "0.5rem 1rem",
        position: "relative",
      }}
    >
      {active && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-primary/20 rounded-lg"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, var(--py-blue), var(--py-blue-light))",
            borderRadius: "var(--radius-md)",
            zIndex: 0,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span
        className="relative z-10 flex items-center gap-2.5 font-semibold text-sm"
        style={{
          position: "relative",
          zIndex: 10,
          color: active ? "#ffffff" : "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
        <span>{label}</span>
        {count !== undefined && (
          <span
            style={{
              fontSize: "0.7rem",
              padding: "0.15rem 0.4rem",
              borderRadius: "9999px",
              background: active ? "rgba(255, 255, 255, 0.2)" : "var(--border-color)",
              color: "#ffffff",
              marginLeft: "auto",
            }}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );
}
