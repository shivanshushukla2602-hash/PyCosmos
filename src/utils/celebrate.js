import confetti from "canvas-confetti";

export function celebrate() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#FFD43B", "#306998", "#22C55E"],
  });
}
