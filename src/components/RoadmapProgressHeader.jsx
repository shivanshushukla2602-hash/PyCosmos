import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Clock, Map, Sparkles, Trophy, Target } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { AnimatedCounter } from './AnimatedCounter';

export default function RoadmapProgressHeader({ categories, completedMap }) {
  let totalTopics = 0;
  let totalCompleted = 0;

  const levelStats = categories.map((cat, idx) => {
    let catTotal = 0;
    let catDone = 0;
    cat.nodes.forEach(n => {
      n.topicIds.forEach(id => {
        catTotal += 1;
        totalTopics += 1;
        if (completedMap[id]) {
          catDone += 1;
          totalCompleted += 1;
        }
      });
    });
    const percent = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
    return {
      levelNum: idx + 1,
      title: cat.title.replace(/^Level \d+: /, ''),
      color: cat.color,
      total: catTotal,
      done: catDone,
      percent
    };
  });

  const overallPercent = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="roadmap-progress-card"
    >
      <div className="roadmap-progress-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <ProgressRing percentage={overallPercent} size={110} stroke={9} />
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--py-yellow)', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span>PYCOSMOS PREPARATION TRACKER</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0.25rem 0', color: 'var(--text-primary)' }}>
              <AnimatedCounter value={totalCompleted} /> of {totalTopics} Topics Mastered
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {overallPercent === 100
                ? 'Outstanding achievement! You have completed 100% of the entire Python curriculum.'
                : `You have completed ${overallPercent}% of the structured Python developer roadmap. Keep the momentum going!`}
            </p>
          </div>
        </div>

        {/* STACKED LEVEL BREAKDOWN BAR */}
        <div className="stacked-progress-container">
          <div className="stacked-bar-bg" style={{ height: '14px', borderRadius: '9999px' }}>
            {levelStats.map(stat => (
              <motion.div
                key={stat.levelNum}
                className="stacked-bar-segment"
                style={{
                  width: `${totalTopics > 0 ? (stat.done / totalTopics) * 100 : 0}%`,
                  background: stat.color
                }}
                initial={{ width: 0 }}
                animate={{ width: `${totalTopics > 0 ? (stat.done / totalTopics) * 100 : 0}%` }}
                transition={{ duration: 1.2, delay: 0.15 * stat.levelNum, ease: 'easeOut' }}
                title={`Stage ${stat.levelNum}: ${stat.done}/${stat.total} topics done (${stat.percent}%)`}
              />
            ))}
          </div>

          {/* STACKED LEGEND PILLS */}
          <div className="stacked-legend">
            {levelStats.map(stat => (
              <div
                key={stat.levelNum}
                className="legend-item"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <span className="legend-dot" style={{ background: stat.color, boxShadow: `0 0 8px ${stat.color}` }} />
                <span className="legend-text">
                  Stage {stat.levelNum}: <strong>{stat.percent}%</strong> ({stat.done}/{stat.total})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
