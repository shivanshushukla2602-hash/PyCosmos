import { motion } from "framer-motion";

const pathVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
};

const nodeVariant = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.15, type: "spring", stiffness: 260, damping: 18 },
  }),
};

export function RoadmapConnector({ d }) {
  return (
    <motion.path
      d={d}
      stroke="#306998"
      strokeWidth={3}
      fill="none"
      variants={pathVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    />
  );
}

export function RoadmapNode({ index, status, children, onClick, className = "" }) {
  const statusColor =
    status === "completed" ? "#22C55E" : status === "in-progress" ? "#FFD43B" : "#4B5563";

  return (
    <motion.div
      custom={index}
      variants={nodeVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.08 }}
      onClick={onClick}
      style={{ borderColor: statusColor }}
      className={`rounded-full border-2 p-4 bg-surface cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}
