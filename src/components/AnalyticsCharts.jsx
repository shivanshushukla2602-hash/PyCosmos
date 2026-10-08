import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/topicsData';

const CATEGORY_COLORS = {
  'Foundation': '#38bdf8',
  'Core Data Structures': '#ffd43b',
  'Functions': '#2dd4bf',
  'Practical Python': '#10b981',
  'OOP & Protocols': '#ec4899',
  'Python Internals': '#f97316',
  'Standard Library': '#06b6d4',
  'Professional Python': '#eab308',
  'Development & AI/ML': '#818cf8',
  'Projects & Problem Solving': '#14b8a6'
};

export default function AnalyticsCharts({ topics = [], completedMap = {}, quizScoresMap = {} }) {
  // Calculate completion percentage for each category
  const categoryStats = CATEGORIES.map((cat) => {
    const catTopics = topics.filter((t) => t.category === cat);
    const completed = catTopics.filter((t) => completedMap[t.id]).length;
    const percent = catTopics.length > 0 ? Math.round((completed / catTopics.length) * 100) : 0;
    const color = CATEGORY_COLORS[cat] || '#38bdf8';
    return { name: cat, percent, total: catTopics.length, completed, color };
  });

  // Calculate Radar Geometry (Decagon for 10 categories)
  const size = 360;
  const center = size / 2;
  const radius = 110;
  const totalPoints = categoryStats.length;

  const getCoordinates = (index, valuePercent) => {
    const angle = ((Math.PI * 2) / totalPoints) * index - Math.PI / 2;
    const r = (radius * valuePercent) / 100;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const radarPoints = categoryStats
    .map((stat, i) => {
      const { x, y } = getCoordinates(i, Math.max(stat.percent, 12)); // Minimum 12% for visibility
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const fullGridPoints = (val) =>
    categoryStats
      .map((_, i) => {
        const { x, y } = getCoordinates(i, val);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
      {/* 1. RADAR CHART CARD */}
      <div
        className="section-card"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <PieChart size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Category Skill Balance Radar
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Multi-domain proficiency across all 10 areas
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0.5rem 0' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
            <defs>
              <radialGradient id="radarFillGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#ffd43b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
              </radialGradient>
            </defs>

            {/* Concentric Decagon Grid Rings */}
            <polygon points={fullGridPoints(25)} fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" strokeDasharray="3 3" />
            <polygon points={fullGridPoints(50)} fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
            <polygon points={fullGridPoints(75)} fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
            <polygon points={fullGridPoints(100)} fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />

            {/* Axis Spokes from Center to Outer Vertex */}
            {categoryStats.map((_, i) => {
              const { x, y } = getCoordinates(i, 100);
              return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />;
            })}

            {/* Filled Skill Polygon */}
            <polygon points={radarPoints} fill="url(#radarFillGradient)" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Corner Node Dots */}
            {categoryStats.map((stat, i) => {
              const { x, y } = getCoordinates(i, Math.max(stat.percent, 12));
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="5"
                  fill={stat.color}
                  stroke="#0d1117"
                  strokeWidth="2"
                />
              );
            })}

            {/* Outer Category Labels */}
            {categoryStats.map((stat, i) => {
              const { x, y } = getCoordinates(i, 124);
              const shortName = stat.name.split(' ')[0];
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  fill={stat.percent > 0 ? '#f1f5f9' : '#64748b'}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="var(--font-sans)"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {shortName} {stat.percent}%
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. PERFORMANCE BAR GRAPH CARD */}
      <div
        className="section-card"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 212, 59, 0.15)', border: '1px solid rgba(255, 212, 59, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--py-yellow)' }}>
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Category Completion Progress
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Detailed breakdown per curriculum pillar
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {categoryStats.map((stat) => (
            <div key={stat.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color }} />
                  {stat.name}
                </span>
                <span style={{ color: stat.color, fontFamily: 'var(--font-mono)' }}>
                  {stat.completed}/{stat.total} ({stat.percent}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percent}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    height: '100%',
                    background: stat.color,
                    borderRadius: '9999px'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
