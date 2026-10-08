import { motion } from "framer-motion";

export function BadgeUnlock({ icon, label }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 14 }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <motion.div
        animate={{ boxShadow: ["0 0 0px #FFD43B", "0 0 20px #FFD43B", "0 0 0px #FFD43B"] }}
        transition={{ duration: 1.5, repeat: 2 }}
        className="rounded-full p-4 bg-yellow-400/20 flex items-center justify-center"
        style={{
          backgroundColor: "rgba(255, 212, 59, 0.15)",
          borderRadius: "9999px",
          width: "64px",
          height: "64px",
          margin: "0 auto",
        }}
      >
        {icon}
      </motion.div>
      <span className="text-sm font-medium mt-2">{label}</span>
    </motion.div>
  );
}
