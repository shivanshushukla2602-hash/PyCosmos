// Shared Framer Motion Physics & Variant Primitives for Pyradox

export const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 300,
  damping: 20
};

export const HOVER_LIFT_VARIANT = {
  initial: { y: 0, scale: 1 },
  whileHover: {
    y: -6,
    scale: 1.015,
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
    transition: SPRING_TRANSITION
  },
  whileTap: { scale: 0.97 }
};

export const BUTTON_HOVER_VARIANT = {
  whileHover: { scale: 1.04, transition: SPRING_TRANSITION },
  whileTap: { scale: 0.95 }
};

export const STAGGER_CONTAINER_VARIANT = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const FADE_UP_ITEM_VARIANT = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }
  }
};
