export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] rounded-md ${className}`}
      style={{
        animation: "shimmer 1.5s infinite linear",
        backgroundColor: "var(--bg-card-hover)",
        borderRadius: "var(--radius-sm)",
      }}
    />
  );
}
