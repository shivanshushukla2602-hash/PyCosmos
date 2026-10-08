import React from 'react';
import { motion } from 'framer-motion';
import { Check, Compass, Sparkles } from 'lucide-react';

export default function RoadmapStepper({ categories, completedMap }) {
  const scrollToLevel = (levelId) => {
    const el = document.getElementById(`level-section-${levelId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="roadmap-stepper-card"
    >
      <div className="roadmap-stepper-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Compass size={16} color="var(--py-blue-light)" />
          <span className="stepper-title">Curriculum Stages Stepper</span>
        </div>
        <span className="stepper-subtitle">Click any stage to smoothly jump to its nodes</span>
      </div>

      <div className="roadmap-stepper-grid">
        {categories.map((cat, idx) => {
          let totalCount = 0;
          let doneCount = 0;
          cat.nodes.forEach(n => {
            n.topicIds.forEach(id => {
              totalCount += 1;
              if (completedMap[id]) doneCount += 1;
            });
          });
          const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
          const isCompleted = percent === 100;
          const isInProgress = percent > 0 && percent < 100;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`stepper-node ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : ''}`}
              onClick={() => scrollToLevel(cat.id)}
              style={{
                '--node-color': cat.color,
                boxShadow: isCompleted ? `0 0 15px ${cat.color}20` : 'none'
              }}
            >
              <div className="stepper-node-top">
                <div
                  className="stepper-badge"
                  style={{
                    background: `${cat.color}25`,
                    color: cat.color,
                    border: `1px solid ${cat.color}60`
                  }}
                >
                  Stage {idx + 1}
                </div>
                <div
                  className="stepper-percent"
                  style={{
                    color: isCompleted ? '#22c55e' : isInProgress ? '#ffd43b' : 'var(--text-muted)'
                  }}
                >
                  {isCompleted ? <Check size={14} /> : `${percent}%`}
                </div>
              </div>

              <div className="stepper-node-title" title={cat.title}>
                {cat.title.replace(/^Level \d+: /, '')}
              </div>

              <div className="stepper-progress-bar-bg">
                <motion.div
                  className="stepper-progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ background: cat.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
