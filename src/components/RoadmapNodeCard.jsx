import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  GitBranch,
  Code,
  Type,
  List,
  Sparkles,
  Calculator,
  Wand2,
  Lock,
  RefreshCw,
  Box,
  Share2,
  Shapes,
  AlertTriangle,
  FileCode,
  FolderTree,
  Cpu,
  Wrench,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
  BookOpen
} from 'lucide-react';
import { TOPICS_BY_ID } from '../data/topicsData';

const ICON_MAP = {
  'node-setup': Terminal,
  'node-vars-memory': GitBranch,
  'node-types-numbers': Calculator,
  'node-control-flow': Code,
  'node-strings': Type,
  'node-lists-tuples': List,
  'node-sets-dicts': Sparkles,
  'node-functions': Wand2,
  'node-comprehensions': Sparkles,
  'node-classes': Box,
  'node-oop-advanced': Share2,
  'node-exceptions': AlertTriangle,
  'node-file-io': FileCode,
  'node-modules-packages': FolderTree,
  'node-async-concurrency': Cpu,
  'node-testing-pep8': Wrench
};

export function RoadmapNodeCard({
  node,
  index,
  categoryColor,
  completedMap,
  onNavigateToTopic,
  isRightSide = false
}) {
  const IconComponent = ICON_MAP[node.id] || Code;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const completedCount = node.topicIds.filter(id => completedMap[id]).length;
  const totalCount = node.topicIds.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  let status = 'not-started';
  if (completedCount === totalCount && totalCount > 0) {
    status = 'completed';
  } else if (completedCount > 0) {
    status = 'in-progress';
  }

  const statusColor = status === 'completed' ? '#22c55e' : status === 'in-progress' ? '#ffd43b' : '#6e7681';

  return (
    <motion.div
      initial={{ opacity: 0, x: isRightSide ? 40 : -40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`roadmap-node-card-modern status-${status}`}
      style={{
        '--accent-color': categoryColor,
        '--status-color': statusColor
      }}
    >
      {/* CARD TOP ROW */}
      <div className="node-card-top-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="node-icon-badge" style={{ background: `${categoryColor}20`, color: categoryColor, border: `1.5px solid ${categoryColor}40` }}>
            <IconComponent size={22} />
          </div>
          <div>
            <div className="node-level-tag">{node.level} • ~{node.estHours} hrs</div>
            <h3 className="node-card-title">{node.title}</h3>
          </div>
        </div>

        {/* STATUS CHIP */}
        <div className={`node-status-chip ${status}`}>
          {status === 'completed' && (
            <>
              <CheckCircle2 size={13} style={{ color: '#22c55e' }} />
              <span>Completed</span>
            </>
          )}
          {status === 'in-progress' && (
            <>
              <Clock size={13} style={{ color: '#ffd43b' }} />
              <span>In Progress ({percent}%)</span>
            </>
          )}
          {status === 'not-started' && (
            <>
              <Circle size={13} style={{ color: '#8b949e' }} />
              <span>Not Started</span>
            </>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      <p className="node-card-summary">{node.summary}</p>

      {/* PREREQUISITES PILL IF AVAILABLE */}
      {node.requires && node.requires.length > 0 && (
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="roadmap-prereq-badge">
            <Lock size={11} />
            <span>Prerequisite: {node.requires.join(', ')}</span>
          </span>
        </div>
      )}

      {/* TOPICS DRAWER ACCORDION TOGGLE */}
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDrawerOpen(!isDrawerOpen);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--py-blue-light)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: 0
          }}
        >
          <BookOpen size={14} />
          <span>{isDrawerOpen ? 'Hide Sub-topics' : `View ${totalCount} Sub-topics`}</span>
          {isDrawerOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {completedCount} / {totalCount} Done
        </span>
      </div>

      {/* SUB-TOPICS DRAWER WITH ANIMATE PRESENCE */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="roadmap-topics-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {node.topicIds.map((topicId) => {
              const topic = TOPICS_BY_ID[topicId];
              const isTopicDone = Boolean(completedMap[topicId]);
              const titleText = topic ? topic.title : topicId.replace(/-/g, ' ');

              return (
                <button
                  key={topicId}
                  onClick={() => onNavigateToTopic(topicId)}
                  className={`roadmap-topic-row-btn ${isTopicDone ? 'done' : ''}`}
                  title={`Open "${titleText}" in Learn view`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isTopicDone ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: isTopicDone ? '#22c55e' : 'var(--text-muted)',
                        flexShrink: 0
                      }}
                    >
                      {isTopicDone ? <Check size={11} /> : <Circle size={10} />}
                    </div>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: isTopicDone ? 600 : 500 }}>
                      {titleText}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: isTopicDone ? '#22c55e' : 'var(--py-blue-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                    <span>Study</span>
                    <ArrowRight size={11} />
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER MINI PROGRESS INDICATOR & LAUNCH ACTION */}
      <div className="node-card-footer" style={{ marginTop: '1rem' }}>
        <div className="node-progress-info">
          <div className="node-mini-bar-bg">
            <motion.div
              className="node-mini-bar-fill"
              initial={{ width: 0 }}
              whileInView={{ width: `${percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ background: statusColor }}
            />
          </div>
        </div>

        <button
          onClick={() => onNavigateToTopic(node.topicIds[0])}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <div className="node-action-arrow">
            <span>{status === 'completed' ? 'Review' : status === 'in-progress' ? 'Continue' : 'Start'}</span>
            <ArrowRight size={15} />
          </div>
        </button>
      </div>
    </motion.div>
  );
}
