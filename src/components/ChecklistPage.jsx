import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  GitBranch,
  Code2,
  Layers,
  Rocket,
  Cpu,
  Check,
  ChevronDown,
  RotateCcw,
  ListTodo,
  AlertTriangle,
  ArrowRight,
  Search,
  Grid,
  Clock,
  Trophy,
  Filter,
  Sparkles,
  HelpCircle,
  BookOpen,
  Star,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  CheckCheck,
  CheckCircle2,
  Flame,
  FileCode2,
  Circle,
  X,
  Calendar,
  Sliders,
  Target,
  Activity
} from 'lucide-react';
import { CATEGORIES } from '../data/topicsData';
import { celebrate } from '../utils/celebrate';
import { AnimatedCounter } from './AnimatedCounter';
import PyCosmosLogo from './PyCosmosLogo';

const CATEGORY_META = {
  'Foundation': {
    color: '#306998',
    bg: 'rgba(48, 105, 152, 0.15)',
    border: 'rgba(75, 139, 190, 0.35)',
    icon: Terminal
  },
  'Core Data Structures': {
    color: '#ffd43b',
    bg: 'rgba(255, 212, 59, 0.15)',
    border: 'rgba(255, 212, 59, 0.35)',
    icon: Layers
  },
  'Functions': {
    color: '#2dd4bf',
    bg: 'rgba(45, 212, 191, 0.15)',
    border: 'rgba(45, 212, 191, 0.35)',
    icon: Code2
  },
  'Practical Python': {
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
    icon: GitBranch
  },
  'OOP & Protocols': {
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.35)',
    icon: Rocket
  },
  'Python Internals': {
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.35)',
    icon: Cpu
  },
  'Standard Library': {
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.35)',
    icon: BookOpen
  },
  'Professional Python': {
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.15)',
    border: 'rgba(234, 179, 8, 0.35)',
    icon: Trophy
  },
  'Development & AI/ML': {
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.15)',
    border: 'rgba(99, 102, 241, 0.35)',
    icon: Sparkles
  },
  'Projects & Problem Solving': {
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.15)',
    border: 'rgba(20, 184, 166, 0.35)',
    icon: HelpCircle
  }
};

export default function ChecklistPage({
  topics,
  completedMap = {},
  onToggleComplete,
  onResetProgress,
  onNavigateToTopic,
  subtopicStatusMap = {},
  onToggleSubtopicStatus,
  onShowToast
}) {
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const totalTopics = topics.length;
  const percentCompleted = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  // Filters & View States
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'pending' | 'starred'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'subtopics'
  const [studyPace, setStudyPace] = useState(2); // topics per day

  const toggleCategoryCollapse = (cat) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleExpandAll = () => {
    setCollapsedCategories({});
  };

  const handleCollapseAll = () => {
    const allCollapsed = {};
    CATEGORIES.forEach((cat) => {
      allCollapsed[cat] = true;
    });
    setCollapsedCategories(allCollapsed);
  };

  const handleTopicCheck = (topic) => {
    const isCurrentlyDone = !!completedMap[topic.id];
    onToggleComplete(topic.id);
    if (!isCurrentlyDone) {
      celebrate();
    }
  };

  const handleCycleSubtopic = (subId) => {
    if (!onToggleSubtopicStatus) return;
    const current = subtopicStatusMap[subId] || 'not_started';
    let next = 'learning';
    if (current === 'learning') next = 'completed';
    else if (current === 'completed') next = 'not_started';

    if (next === 'completed') {
      celebrate();
    }
    onToggleSubtopicStatus(subId, next);
  };

  // Batch toggle all topics in a category
  const handleToggleCategoryAll = (catTopics, shouldCompleteAll) => {
    catTopics.forEach((t) => {
      const isDone = !!completedMap[t.id];
      if (shouldCompleteAll && !isDone) {
        onToggleComplete(t.id);
      } else if (!shouldCompleteAll && isDone) {
        onToggleComplete(t.id);
      }
    });

    if (shouldCompleteAll) {
      celebrate();
      if (onShowToast) onShowToast(`Marked ${catTopics.length} topics complete.`);
    } else {
      if (onShowToast) onShowToast(`Reset category topics.`);
    }
  };

  // Export checklist as clean Markdown for GitHub / Notion / Study log
  const handleExportMarkdown = (downloadFile = false) => {
    let md = `# PyCosmos — Python Preparation Checklist\n\n`;
    md += `*Generated: ${new Date().toLocaleDateString()} | Progress: ${completedCount}/${totalTopics} topics (${percentCompleted}%)*\n\n`;
    md += `---\n\n`;

    CATEGORIES.forEach((cat) => {
      const catTopics = topics.filter((t) => t.category === cat);
      if (catTopics.length === 0) return;
      const catDone = catTopics.filter((t) => !!completedMap[t.id]).length;
      md += `### ${cat} (${catDone}/${catTopics.length})\n\n`;

      catTopics.forEach((t) => {
        const isDone = !!completedMap[t.id];
        const star = t.stars ? ' [Core]' : '';
        md += `- [${isDone ? 'x' : ' '}] **${t.title}** \`[${t.level || 'Core'}]\`${star}\n`;
        if (t.subtopics && t.subtopics.length > 0) {
          t.subtopics.forEach((s) => {
            const st = subtopicStatusMap[s.id];
            const check = st === 'completed' ? 'x' : ' ';
            md += `    - [${check}] ${s.text}\n`;
          });
        }
      });
      md += `\n`;
    });

    if (downloadFile) {
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PyCosmos_Python_Checklist.md');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onShowToast) onShowToast("Downloaded PyCosmos_Python_Checklist.md");
    } else {
      navigator.clipboard.writeText(md).then(() => {
        setCopiedExport(true);
        setTimeout(() => setCopiedExport(false), 2500);
        if (onShowToast) onShowToast("Checklist copied to clipboard as Markdown.");
      });
    }
  };

  // Filter topics
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      // Search
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.summary && t.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.subtopics && t.subtopics.some((s) => s.text.toLowerCase().includes(searchQuery.toLowerCase())));

      // Status
      const isDone = !!completedMap[t.id];
      let matchesStatus = true;
      if (statusFilter === 'completed') matchesStatus = isDone;
      else if (statusFilter === 'pending') matchesStatus = !isDone;
      else if (statusFilter === 'starred') matchesStatus = Boolean(t.stars);

      // Category
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;

      // Difficulty
      const matchesDifficulty = difficultyFilter === 'all' || t.level === difficultyFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesDifficulty;
    });
  }, [topics, searchQuery, statusFilter, selectedCategory, difficultyFilter, completedMap]);

  // Calculate total subtopics stats
  const { totalSubtopicsCount, completedSubtopicsCount, learningSubtopicsCount } = useMemo(() => {
    let total = 0;
    let completed = 0;
    let learning = 0;

    topics.forEach((t) => {
      if (t.subtopics) {
        t.subtopics.forEach((s) => {
          total++;
          const st = subtopicStatusMap[s.id];
          if (st === 'completed') completed++;
          else if (st === 'learning') learning++;
        });
      }
    });

    return {
      totalSubtopicsCount: total,
      completedSubtopicsCount: completed,
      learningSubtopicsCount: learning
    };
  }, [topics, subtopicStatusMap]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 1. STICKY TOP PROGRESS BAR WITH GLASSMORPHISM */}
      <div className="sticky-top-progress" style={{ backdropFilter: 'blur(14px)', background: 'rgba(13, 17, 23, 0.92)' }}>
        <div className="sticky-top-progress-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', fontWeight: 700, flexWrap: 'wrap' }}>
            <ListTodo size={18} color="var(--py-yellow)" />
            <span style={{ color: 'var(--text-primary)' }}>Topic Mastery:</span>
            <span style={{ color: 'var(--py-yellow)', fontFamily: 'var(--font-mono)' }}>
              <AnimatedCounter value={completedCount} />/{totalTopics} ({percentCompleted}%)
            </span>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.35rem', fontSize: '0.8rem' }}>
              • Subtopics: {completedSubtopicsCount}/{totalSubtopicsCount}
            </span>
          </div>

          <div style={{ flex: 1, maxWidth: '280px', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: 'linear-gradient(90deg, #38bdf8, #fbbf24, #f59e0b)', borderRadius: '9999px' }}
              initial={{ width: 0 }}
              animate={{ width: `${percentCompleted}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setShowResetModal(true)}
              style={{
                background: 'rgba(218, 54, 51, 0.12)',
                border: '1px solid rgba(218, 54, 51, 0.3)',
                color: '#f87171',
                borderRadius: '6px',
                padding: '0.3rem 0.7rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'background 0.2s ease'
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      <div className="checklist-content-container">
        {/* 2. HEADER SECTION WITH PYCOSMOS BRANDING */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.25rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}
            >
              <div style={{ position: 'relative' }}>
                <div className="hero-snake-bloom" style={{ width: '70px', height: '70px' }} />
                <PyCosmosLogo size={42} animated={true} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--py-yellow)', textTransform: 'uppercase' }}>
                51-TOPIC PREPARATION CHECKLIST
              </span>
            </motion.div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Complete Python <span className="forge-gradient-text">Preparation Checklist</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '0.4rem' }}>
              <span style={{ fontWeight: 600 }}>States:</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Circle size={10} style={{ color: 'var(--text-muted)' }} /> Not Started
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <Clock size={10} /> Learning
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <CheckCircle2 size={10} /> Completed
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255, 212, 59, 0.1)', color: 'var(--py-yellow)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(255, 212, 59, 0.25)' }}>
                <Star size={10} fill="currentColor" /> Core Concept
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* View Mode Switcher */}
            <div className="mastery-view-switcher">
              <button
                className={`mastery-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="View full topic cards"
              >
                <Grid size={14} />
                <span>Topics View</span>
              </button>
              <button
                className={`mastery-view-btn ${viewMode === 'subtopics' ? 'active' : ''}`}
                onClick={() => setViewMode('subtopics')}
                title="Reveal all granular subtopics"
              >
                <ListTodo size={14} />
                <span>Subtopics ({totalSubtopicsCount})</span>
              </button>
            </div>

            {/* Expand / Collapse All Toggle */}
            <button
              onClick={Object.keys(collapsedCategories).length > 0 ? handleExpandAll : handleCollapseAll}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {Object.keys(collapsedCategories).length > 0 ? (
                <>
                  <Maximize2 size={13} />
                  <span>Expand All</span>
                </>
              ) : (
                <>
                  <Minimize2 size={13} />
                  <span>Collapse All</span>
                </>
              )}
            </button>

            {/* Markdown Export Button */}
            <button
              onClick={() => handleExportMarkdown(false)}
              className="checklist-export-btn"
              title="Copy checklist as Markdown for GitHub / Notion"
            >
              {copiedExport ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              <span>{copiedExport ? 'Copied MD!' : 'Export MD'}</span>
            </button>

            {/* Download File Button */}
            <button
              onClick={() => handleExportMarkdown(true)}
              className="cat-batch-btn"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
              title="Download checklist as .md file"
            >
              <Download size={13} />
              <span>.md</span>
            </button>
          </div>
        </div>

        {/* 3. BESPOKE DIAGNOSTIC HEALTH STATION & VELOCITY PACE SIMULATOR */}
        {(() => {
          const remainingTopics = Math.max(0, totalTopics - completedCount);
          const projectedDays = Math.ceil(remainingTopics / (studyPace || 1));
          const targetDateObj = new Date();
          targetDateObj.setDate(targetDateObj.getDate() + projectedDays);
          const projectedDateStr = targetDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

          const healthGrade =
            percentCompleted >= 90 ? 'A+' :
            percentCompleted >= 75 ? 'A' :
            percentCompleted >= 50 ? 'B' :
            percentCompleted >= 25 ? 'C' : 'Initiate';

          const donutR = 54;
          const donutCirc = 2 * Math.PI * donutR;
          const doneRatio = totalSubtopicsCount > 0 ? completedSubtopicsCount / totalSubtopicsCount : 0;
          const learningRatio = totalSubtopicsCount > 0 ? learningSubtopicsCount / totalSubtopicsCount : 0;

          return (
            <div className="checklist-health-station-card">
              <div className="health-station-grid">
                {/* LEFT POD: MULTI-SEGMENT DONUT HEALTH GAUGE */}
                <div className="health-donut-pod">
                  <div className="donut-pod-header">
                    <Activity size={15} color="#38bdf8" />
                    <span className="donut-pod-title">Curriculum Health Diagnostic</span>
                  </div>

                  <div className="donut-chart-flex">
                    <div className="donut-svg-wrapper">
                      <svg width="138" height="138" viewBox="0 0 138 138" className="health-donut-svg">
                        <defs>
                          <linearGradient id="donutDoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                        </defs>

                        {/* Background track */}
                        <circle cx="69" cy="69" r={donutR} fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="11" />

                        {/* Mastered Segment (Green/Cyan) */}
                        <motion.circle
                          cx="69"
                          cy="69"
                          r={donutR}
                          fill="none"
                          stroke="url(#donutDoneGrad)"
                          strokeWidth="11"
                          strokeLinecap="round"
                          strokeDasharray={`${doneRatio * donutCirc} ${donutCirc}`}
                          initial={{ strokeDasharray: `0 ${donutCirc}` }}
                          animate={{ strokeDasharray: `${doneRatio * donutCirc} ${donutCirc}` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          transform="rotate(-90 69 69)"
                        />

                        {/* Learning Segment (Amber) */}
                        {learningSubtopicsCount > 0 && (
                          <motion.circle
                            cx="69"
                            cy="69"
                            r={donutR}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="11"
                            strokeLinecap="round"
                            strokeDasharray={`${learningRatio * donutCirc} ${donutCirc}`}
                            strokeDashoffset={-doneRatio * donutCirc}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            transform="rotate(-90 69 69)"
                          />
                        )}
                      </svg>

                      {/* Donut Center Display */}
                      <div className="donut-center-content">
                        <span className="donut-grade-badge">{healthGrade}</span>
                        <span className="donut-percent-num">
                          <AnimatedCounter value={percentCompleted} />%
                        </span>
                        <span className="donut-sub-label">HEALTH</span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="donut-segment-legend">
                      <div className="segment-legend-row">
                        <span className="segment-dot-indicator" style={{ background: '#22c55e' }} />
                        <div className="segment-legend-text">
                          <span className="segment-name">Mastered</span>
                          <strong className="segment-num">{completedSubtopicsCount} subtopics</strong>
                        </div>
                      </div>
                      <div className="segment-legend-row">
                        <span className="segment-dot-indicator" style={{ background: '#f59e0b' }} />
                        <div className="segment-legend-text">
                          <span className="segment-name">In-Flight Learning</span>
                          <strong className="segment-num">{learningSubtopicsCount} subtopics</strong>
                        </div>
                      </div>
                      <div className="segment-legend-row">
                        <span className="segment-dot-indicator" style={{ background: 'rgba(255, 255, 255, 0.25)' }} />
                        <div className="segment-legend-text">
                          <span className="segment-name">Unstarted</span>
                          <strong className="segment-num">{totalSubtopicsCount - completedSubtopicsCount - learningSubtopicsCount} subtopics</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT POD: SPRINT VELOCITY PACE SLIDER & FORECAST */}
                <div className="sprint-pace-pod">
                  <div className="sprint-pod-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Sliders size={15} color="var(--py-yellow)" />
                      <span className="sprint-pod-title">Sprint Velocity Pace Simulator</span>
                    </div>
                    <span className="sprint-time-tag">~{studyPace * 30} mins / day</span>
                  </div>

                  <div className="pace-slider-box">
                    <div className="pace-label-line">
                      <span className="pace-question-text">Target Study Pace:</span>
                      <span className="pace-active-display">
                        <strong>{studyPace}</strong> {studyPace === 1 ? 'topic' : 'topics'} / day
                      </span>
                    </div>

                    <div className="pace-range-wrapper">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={studyPace}
                        onChange={(e) => setStudyPace(parseInt(e.target.value, 10))}
                        className="horizon-range-slider pace-slider-input"
                        aria-label="Set study pace in topics per day"
                      />
                      <div className="pace-ticks-row">
                        {[1, 2, 3, 4, 5].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setStudyPace(p)}
                            className={`pace-tick-chip ${studyPace === p ? 'active' : ''}`}
                          >
                            {p} {p === 1 ? 'topic' : 'topics'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Projection Forecast Banner */}
                  <div className="pace-projection-banner">
                    <div className="projection-col">
                      <span className="projection-label">Topics Remaining</span>
                      <span className="projection-val highlight">{remainingTopics} topics</span>
                    </div>
                    <div className="projection-divider" />
                    <div className="projection-col">
                      <span className="projection-label">Projected Days</span>
                      <span className="projection-val">
                        {remainingTopics === 0 ? '0 days' : `~${projectedDays} days`}
                      </span>
                    </div>
                    <div className="projection-divider" />
                    <div className="projection-col">
                      <span className="projection-label">Target Completion</span>
                      <span className="projection-val target-date">
                        {remainingTopics === 0 ? 'Achieved! 🏆' : projectedDateStr}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TRIO OF BESPOKE STATUS TELEMETRY PODS */}
              <div className="checklist-trio-pods">
                <div className="trio-pod-item gold-pod">
                  <div className="trio-pod-icon">
                    <Star size={16} fill="#ffd43b" color="#ffd43b" />
                  </div>
                  <div className="trio-pod-content">
                    <span className="trio-pod-label">TOPICS CONQUERED</span>
                    <span className="trio-pod-val">
                      <AnimatedCounter value={completedCount} /> <small>/ {totalTopics}</small>
                    </span>
                  </div>
                </div>

                <div className="trio-pod-item emerald-pod">
                  <div className="trio-pod-icon">
                    <CheckCircle2 size={16} color="#22c55e" />
                  </div>
                  <div className="trio-pod-content">
                    <span className="trio-pod-label">SUBTOPICS MASTERED</span>
                    <span className="trio-pod-val">
                      <AnimatedCounter value={completedSubtopicsCount} /> <small>/ {totalSubtopicsCount}</small>
                    </span>
                  </div>
                </div>

                <div className="trio-pod-item amber-pod">
                  <div className="trio-pod-icon">
                    <Flame size={16} color="#f59e0b" />
                  </div>
                  <div className="trio-pod-content">
                    <span className="trio-pod-label">IN-FLIGHT ACTIVE</span>
                    <span className="trio-pod-val">
                      <AnimatedCounter value={learningSubtopicsCount} /> <small>topics</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 4. FILTER CONTROLLER BAR */}
        <div className="tracker-filter-bar" style={{ marginBottom: '1.25rem' }}>
          <div className="filter-search-box">
            <Search size={16} color="var(--py-blue-light)" />
            <input
              type="text"
              placeholder="Search topic or granular subtopic (e.g. decorators, asyncio, GIL, generators)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="filter-categories-pills">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'pending', label: 'Pending Only' },
              { id: 'completed', label: 'Completed' },
              { id: 'starred', label: 'Core Priority' }
            ].map((f) => (
              <button
                key={f.id}
                className={`pill-btn ${statusFilter === f.id ? 'active' : ''}`}
                onClick={() => setStatusFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Chips: Category & Difficulty */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
          {/* Difficulty selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Level:
            </span>
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficultyFilter(lvl)}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: difficultyFilter === lvl ? '1px solid var(--py-blue)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: difficultyFilter === lvl ? 'rgba(75, 139, 190, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: difficultyFilter === lvl ? 'var(--py-blue-light)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {lvl === 'all' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>

          {/* Category Filter dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All 10 Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. EMPTY SEARCH STATE */}
        {filteredTopics.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px dashed var(--border-color)',
              marginBottom: '2rem'
            }}
          >
            <div style={{ width: '60px', height: '60px', margin: '0 auto 1.25rem', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={28} color="var(--text-muted)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No checklist topics found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              No topics matched your search query "{searchQuery}" and current filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSelectedCategory('all');
                setDifficultyFilter('all');
              }}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
            >
              Reset All Filters
            </button>
          </motion.div>
        )}

        {/* 6. TOPICS ACCORDION GROUPS */}
        {CATEGORIES.map((cat) => {
          const catTopics = filteredTopics.filter((t) => t.category === cat);
          if (catTopics.length === 0) return null;

          const meta = CATEGORY_META[cat] || {
            color: '#4b8bbe',
            bg: 'rgba(75, 139, 190, 0.15)',
            border: 'rgba(75, 139, 190, 0.35)',
            icon: Terminal
          };
          const Icon = meta.icon;
          const isCollapsed = !!collapsedCategories[cat];
          const catCompleted = catTopics.filter((t) => !!completedMap[t.id]).length;
          const catPercent = Math.round((catCompleted / catTopics.length) * 100);
          const isCategoryAllDone = catCompleted === catTopics.length;

          return (
            <motion.div
              key={cat}
              layout
              style={{
                marginBottom: '1.75rem',
                background: 'var(--bg-card)',
                borderRadius: '18px',
                border: `1.5px solid ${meta.border}`,
                overflow: 'hidden',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.28)'
              }}
            >
              {/* Category Header */}
              <div
                style={{
                  padding: '1.25rem 1.75rem',
                  background: meta.bg,
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
                  <div
                    onClick={() => toggleCategoryCollapse(cat)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', flex: 1, minWidth: '220px' }}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: meta.border, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                          {cat}
                        </h3>
                        {isCategoryAllDone && (
                          <span style={{ fontSize: '0.72rem', background: 'rgba(34, 197, 94, 0.18)', color: '#4ade80', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 700, border: '1px solid rgba(34, 197, 94, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle2 size={11} /> 100% Mastered
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {catTopics.length} topic{catTopics.length !== 1 ? 's' : ''} ({catCompleted}/{catTopics.length} completed)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Category Batch Action Button */}
                    <button
                      type="button"
                      className="cat-batch-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCategoryAll(catTopics, !isCategoryAllDone);
                      }}
                      title={isCategoryAllDone ? "Reset this category" : "Mark all topics in this category complete"}
                    >
                      {isCategoryAllDone ? (
                        <>
                          <RotateCcw size={11} />
                          <span>Reset Cat</span>
                        </>
                      ) : (
                        <>
                          <CheckCheck size={12} color="#34d399" />
                          <span>Complete All</span>
                        </>
                      )}
                    </button>

                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: meta.color, fontFamily: 'var(--font-mono)' }}>
                      {catPercent}%
                    </span>

                    <motion.div
                      animate={{ rotate: isCollapsed ? -90 : 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => toggleCategoryCollapse(cat)}
                      style={{ cursor: 'pointer', display: 'flex', padding: '0.2rem' }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </div>

                {/* Category Progress Track Bar */}
                <div className="category-progress-track">
                  <div
                    className="category-progress-fill"
                    style={{
                      width: `${catPercent}%`,
                      background: catPercent === 100 ? '#22c55e' : `linear-gradient(90deg, ${meta.color}, var(--py-yellow))`
                    }}
                  />
                </div>
              </div>

              {/* Topics List Body */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ padding: '0.85rem 1.5rem 1.5rem' }}
                  >
                    {catTopics.map((topic) => {
                      const isDone = !!completedMap[topic.id];

                      // Subtopic counts for this topic
                      const subs = topic.subtopics || [];
                      const doneSubs = subs.filter((s) => subtopicStatusMap[s.id] === 'completed').length;

                      // Level styling
                      const levelClass =
                        topic.level === 'Beginner'
                          ? 'badge-difficulty-beginner'
                          : topic.level === 'Advanced'
                          ? 'badge-difficulty-advanced'
                          : 'badge-difficulty-intermediate';

                      return (
                        <motion.div
                          key={topic.id}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            padding: '1.15rem 1.35rem',
                            margin: '0.75rem 0',
                            borderRadius: '14px',
                            background: isDone ? 'rgba(34, 197, 94, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                            border: isDone ? '1px solid rgba(34, 197, 94, 0.45)' : '1px solid var(--border-color)',
                            boxShadow: isDone ? '0 0 18px rgba(34, 197, 94, 0.08)' : 'none',
                            transition: 'border-color 0.2s ease, background 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
                              {/* Checkbox */}
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleTopicCheck(topic)}
                                style={{
                                  marginTop: '2px',
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '8px',
                                  border: isDone ? 'none' : '2px solid var(--border-color)',
                                  background: isDone ? '#22c55e' : 'transparent',
                                  color: '#0d1117',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  flexShrink: 0,
                                  boxShadow: isDone ? '0 0 12px rgba(34, 197, 94, 0.5)' : 'none',
                                  transition: 'all 0.2s ease'
                                }}
                                title={isDone ? "Mark as pending" : "Mark as master complete"}
                              >
                                {isDone ? <Check size={18} strokeWidth={3} /> : null}
                              </motion.button>

                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                                  {/* Topic Number */}
                                  <span className="topic-badge-num">
                                    #{typeof topic.topicNum === 'number' ? String(topic.topicNum).padStart(2, '0') : topic.id}
                                  </span>

                                  {/* Title */}
                                  <span
                                    onClick={() => onNavigateToTopic(topic.id)}
                                    style={{
                                      fontSize: '1.02rem',
                                      fontWeight: 800,
                                      color: isDone ? '#4ade80' : 'var(--text-primary)',
                                      cursor: 'pointer',
                                      textDecoration: isDone ? 'line-through' : 'none'
                                    }}
                                  >
                                    {topic.title}
                                  </span>

                                  {/* Difficulty Badge */}
                                  {topic.level && (
                                    <span className={`badge-difficulty ${levelClass}`}>
                                      {topic.level}
                                    </span>
                                  )}

                                  {/* Core Star */}
                                  {topic.stars && (
                                    <span style={{ color: 'var(--py-yellow)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(255, 212, 59, 0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(255, 212, 59, 0.25)' }}>
                                      <Star size={11} fill="var(--py-yellow)" />
                                      <span>Core</span>
                                    </span>
                                  )}

                                  {/* Subtopics progress pill if available */}
                                  {subs.length > 0 && (
                                    <span className="subtopic-progress-pill">
                                      {doneSubs}/{subs.length} subtopics
                                    </span>
                                  )}
                                </div>

                                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', lineHeight: 1.5 }}>
                                  {topic.summary}
                                </p>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <button
                                type="button"
                                onClick={() => onNavigateToTopic(topic.id)}
                                className="study-level-btn"
                                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                              >
                                <span>Learn & Code</span>
                                <ArrowRight size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Granular Subtopics (Rendered if in subtopics view mode) */}
                          {viewMode === 'subtopics' && subs.length > 0 && (
                            <div style={{ marginTop: '0.95rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                                  Subtopic Checkpoints ({subs.length}):
                                </span>
                                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                                  Click to cycle: Pending → In Progress → Completed
                                </span>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.45rem' }}>
                                {subs.map((sub) => {
                                  const st = subtopicStatusMap[sub.id] || 'not_started';
                                  const StatusIcon = st === 'completed' ? CheckCircle2 : st === 'learning' ? Clock : Circle;

                                  return (
                                    <motion.button
                                      key={sub.id}
                                      type="button"
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleCycleSubtopic(sub.id)}
                                      className={`subtopic-toggle-item status-${st}`}
                                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.65rem' }}
                                    >
                                      <StatusIcon size={13} style={{ flexShrink: 0 }} />
                                      <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {sub.text}
                                      </span>
                                      {sub.isStarred && <Star size={11} fill="var(--py-yellow)" style={{ color: 'var(--py-yellow)', flexShrink: 0 }} />}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* RESET CONFIRMATION MODAL */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={() => setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171', marginBottom: '1rem' }}>
                <AlertTriangle size={26} />
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Reset All Preparation Progress?</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: 1.6 }}>
                This will clear all your checked topics, subtopic checkpoints, and mastery stats across PyCosmos. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setShowResetModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onResetProgress();
                    setShowResetModal(false);
                  }}
                >
                  Yes, Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
