import { motion } from "framer-motion";

export function TopicCard({ topic, onClick, children, className = "" }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6, boxShadow: "0 12px 24px rgba(48,105,152,0.25)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-xl p-5 bg-surface border border-white/5 cursor-pointer ${className}`}
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {children || (
        <div>
          <h4 className="font-bold text-lg mb-1">{topic?.title}</h4>
          <p className="text-sm opacity-70">{topic?.category}</p>
        </div>
      )}
    </motion.div>
  );
}
