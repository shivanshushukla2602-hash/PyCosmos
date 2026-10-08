import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Flame,
  CheckCircle2,
  BookMarked,
  Printer,
  Sparkles,
  ArrowRight,
  BarChart2,
  Trophy,
  Star,
  Check,
  Zap,
  Target,
  Clock,
  BookOpen,
  Code2,
  Share2,
  Download,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  Layers,
  Cpu,
  Rocket,
  X,
  Copy,
  Calendar
} from 'lucide-react';
import { CATEGORIES } from '../data/topicsData';
import AnalyticsCharts from './AnalyticsCharts';
import { AnimatedCounter } from './AnimatedCounter';
import { ProgressRing } from './ProgressRing';
import GitHubHeatmap from './GitHubHeatmap';
import PyCosmosLogo from './PyCosmosLogo';

export default function DashboardPage({
  topics = [],
  completedMap = {},
  quizScoresMap = {},
  streakCount = 0,
  bookmarkedIds = [],
  onNavigateToTopic,
  currentUser = null,
  subtopicStatusMap = {}
}) {
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const totalTopics = topics.length;
  const percentCompleted = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const quizScores = Object.values(quizScoresMap);
  const quizAvg = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

  // Subtopics stats
  const { totalSubtopics, completedSubtopics } = useMemo(() => {
    let tot = 0;
    let done = 0;
    topics.forEach((t) => {
      if (t.subtopics) {
        tot += t.subtopics.length;
        t.subtopics.forEach((s) => {
          if (subtopicStatusMap[s.id] === 'completed') done++;
        });
      }
    });
    return { totalSubtopics: tot, completedSubtopics: done };
  }, [topics, subtopicStatusMap]);

  // Next recommended topic (first uncompleted topic in the sequence)
  const nextRecommendedTopic = topics.find((t) => !completedMap[t.id]) || topics[0];

  // Bookmarked topics list
  const bookmarkedTopics = useMemo(() => {
    return topics.filter((t) => bookmarkedIds.includes(t.id));
  }, [topics, bookmarkedIds]);

  // Developer Achievements / Badges
  const badges = useMemo(() => [
    {
      id: 'first_step',
      name: 'First Spark',
      desc: 'Complete your 1st Python topic',
      Icon: Rocket,
      color: '#38bdf8',
      unlocked: completedCount >= 1,
      progress: Math.min(100, (completedCount / 1) * 100)
    },
    {
      id: 'basics_master',
      name: 'Foundation Master',
      desc: 'Complete all 8 Foundation topics',
      Icon: Zap,
      color: '#ffd43b',
      unlocked: topics.filter((t) => t.category === 'Foundation').length > 0 && topics.filter((t) => t.category === 'Foundation').every((t) => completedMap[t.id]),
      progress: Math.round((topics.filter((t) => t.category === 'Foundation' && completedMap[t.id]).length / Math.max(1, topics.filter((t) => t.category === 'Foundation').length)) * 100)
    },
    {
      id: 'data_architect',
      name: 'Data Architect',
      desc: 'Master Core Data Structures',
      Icon: Layers,
      color: '#a855f7',
      unlocked: topics.filter((t) => t.category === 'Core Data Structures').length > 0 && topics.filter((t) => t.category === 'Core Data Structures').every((t) => completedMap[t.id]),
      progress: Math.round((topics.filter((t) => t.category === 'Core Data Structures' && completedMap[t.id]).length / Math.max(1, topics.filter((t) => t.category === 'Core Data Structures').length)) * 100)
    },
    {
      id: 'quiz_master',
      name: 'Quiz Champion',
      desc: 'Achieve 80%+ quiz accuracy across ≥ 3 quizzes',
      Icon: Target,
      color: '#22c55e',
      unlocked: quizAvg >= 80 && quizScores.length >= 3,
      progress: Math.min(100, Math.round((quizScores.length / 3) * 100))
    },
    {
      id: 'streak_7',
      name: 'Consistency Flame',
      desc: 'Maintain an active 7-day study streak',
      Icon: Flame,
      color: '#fb923c',
      unlocked: streakCount >= 7,
      progress: Math.min(100, Math.round((streakCount / 7) * 100))
    },
    {
      id: 'oop_craftsman',
      name: 'OOP Craftsman',
      desc: 'Master Classes, Protocols & Dunder methods',
      Icon: ShieldCheck,
      color: '#ec4899',
      unlocked: topics.filter((t) => t.category === 'OOP & Protocols').length > 0 && topics.filter((t) => t.category === 'OOP & Protocols').every((t) => completedMap[t.id]),
      progress: Math.round((topics.filter((t) => t.category === 'OOP & Protocols' && completedMap[t.id]).length / Math.max(1, topics.filter((t) => t.category === 'OOP & Protocols').length)) * 100)
    },
    {
      id: 'cpython_hacker',
      name: 'CPython Hacker',
      desc: 'Understand the GIL, bytecode & memory models',
      Icon: Cpu,
      color: '#f97316',
      unlocked: topics.filter((t) => t.category === 'Python Internals').length > 0 && topics.filter((t) => t.category === 'Python Internals').every((t) => completedMap[t.id]),
      progress: Math.round((topics.filter((t) => t.category === 'Python Internals' && completedMap[t.id]).length / Math.max(1, topics.filter((t) => t.category === 'Python Internals').length)) * 100)
    },
    {
      id: 'python_pro',
      name: 'PyCosmos Grandmaster',
      desc: '100% completion of the full 51-topic curriculum',
      Icon: Trophy,
      color: '#eab308',
      unlocked: percentCompleted === 100,
      progress: percentCompleted
    }
  ], [topics, completedMap, completedCount, quizAvg, quizScores.length, streakCount, percentCompleted]);

  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText('PYC-8491-SHA256-VERIFIED');
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const userName = (currentUser?.name && currentUser.name !== 'Shivansh Shukla') ? currentUser.name : 'Shivanshu Shukla';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ maxWidth: '1120px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}
    >
      {/* ═════════════════════════════════════════════════════════════════════
          1. HERO HEADER WITH PYCOSMOS BRANDING & LEVEL RING
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.25rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}
          >
            <div style={{ position: 'relative' }}>
              <div className="hero-snake-bloom" style={{ width: '65px', height: '65px' }} />
              <PyCosmosLogo size={40} animated={true} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--py-yellow)', textTransform: 'uppercase' }}>
              COMMAND CENTER & ANALYTICS
            </span>
          </motion.div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
            Welcome back, <span className="forge-gradient-text">{userName}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
            "Beautiful is better than ugly. Explicit is better than implicit. Simple is better than complex." — <em>The Zen of Python (PEP 20)</em>
          </p>
        </div>

        {/* Global Progress Ring & Level Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--bg-card)', padding: '0.85rem 1.35rem', borderRadius: '18px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)' }}>
          <ProgressRing percentage={percentCompleted} size={78} stroke={7} />
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              Mastery Tier
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--py-yellow)' }}>
              {percentCompleted >= 80
                ? 'Level 5 • Grandmaster'
                : percentCompleted >= 60
                ? 'Level 4 • Specialist'
                : percentCompleted >= 35
                ? 'Level 3 • Craftsman'
                : percentCompleted >= 10
                ? 'Level 2 • Apprentice'
                : 'Level 1 • Explorer'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {completedCount} of {totalTopics} topics mastered
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          2. TOP SUMMARY METRICS DECK
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.25rem' }}>
        <motion.div whileHover={{ y: -3 }} className="tracker-stat-box" style={{ borderLeft: '4px solid var(--py-yellow)' }}>
          <span className="stat-label">Course Completed</span>
          <span className="stat-val highlight">
            <AnimatedCounter value={percentCompleted} />%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {completedCount} / {totalTopics} Core Topics
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="tracker-stat-box" style={{ borderLeft: '4px solid #22c55e' }}>
          <span className="stat-label">Subtopic Checkpoints</span>
          <span className="stat-val">
            <AnimatedCounter value={completedSubtopics} /> / {totalSubtopics}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Granular Python Milestones
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="tracker-stat-box" style={{ borderLeft: '4px solid #38bdf8' }}>
          <span className="stat-label">Quiz Accuracy Avg</span>
          <span className="stat-val">
            <AnimatedCounter value={quizAvg} />%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {quizScores.length} Quizzes Logged
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="tracker-stat-box" style={{ borderLeft: '4px solid #fb923c' }}>
          <span className="stat-label">Daily Flame Streak</span>
          <span className="stat-val" style={{ color: '#fb923c' }}>
            <AnimatedCounter value={streakCount} /> Days
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Continuous Learning Flow
          </span>
        </motion.div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          3. RECOMMENDED NEXT TOPIC & CERTIFICATE ACCESS
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {/* RECOMMENDED NEXT TOPIC */}
        <div
          className="section-card"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(59, 130, 246, 0.08))',
            borderColor: 'rgba(6, 182, 212, 0.35)',
            borderRadius: '18px',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              <Sparkles size={15} />
              <span>Recommended Next Mission</span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              {nextRecommendedTopic ? nextRecommendedTopic.title : 'All Topics Mastered'}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
              {nextRecommendedTopic
                ? nextRecommendedTopic.summary
                : 'Outstanding achievement! You have completed every instructional module across all 10 Python curriculum pillars.'}
            </p>
          </div>

          <div>
            {nextRecommendedTopic && (
              <button
                type="button"
                className="btn btn-yellow"
                onClick={() => onNavigateToTopic(nextRecommendedTopic.id)}
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <span>Continue Lesson & Code</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* CERTIFICATE ACCESS */}
        <div
          className="section-card"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.12))',
            borderColor: 'rgba(16, 185, 129, 0.35)',
            borderRadius: '18px',
            padding: '1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              <Award size={15} />
              <span>PyCosmos Official Certification</span>
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Python Systems Mastery Award
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
              {percentCompleted === 100
                ? 'Your verified certificate is ready! View, export, or print your official document.'
                : `Complete all ${totalTopics} curriculum topics to unlock your verified credential (${completedCount}/${totalTopics} completed).`}
            </p>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCertModal(true)}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#10b981', borderColor: '#059669' }}
            >
              <Printer size={15} />
              <span>{percentCompleted === 100 ? 'View Verified Certificate' : 'Preview Certificate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          4. GITHUB STYLE CONTRIBUTION HEATMAP
          ═════════════════════════════════════════════════════════════════════ */}
      <GitHubHeatmap completedMap={completedMap} />

      {/* ═════════════════════════════════════════════════════════════════════
          5. ANALYTICS RADAR & PERFORMANCE CHARTS
          ═════════════════════════════════════════════════════════════════════ */}
      <AnalyticsCharts topics={topics} completedMap={completedMap} quizScoresMap={quizScoresMap} />

      {/* ═════════════════════════════════════════════════════════════════════
          6. BOOKMARKED TOPICS QUICK-ACCESS (IF ANY)
          ═════════════════════════════════════════════ */}
      {bookmarkedTopics.length > 0 && (
        <div
          className="section-card"
          style={{
            marginBottom: '2.5rem',
            background: 'var(--bg-card)',
            borderRadius: '18px',
            border: '1px solid var(--border-color)',
            padding: '1.5rem 1.75rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 212, 59, 0.15)', border: '1px solid rgba(255, 212, 59, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--py-yellow)' }}>
              <Star size={18} fill="var(--py-yellow)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Saved for Revision ({bookmarkedTopics.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Quick jump to your bookmarked topics
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {bookmarkedTopics.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -2 }}
                onClick={() => onNavigateToTopic(t.id)}
                style={{
                  padding: '0.95rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--py-blue-light)' }}>
                    {t.category}
                  </span>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: '0.15rem 0 0', color: 'var(--text-primary)' }}>
                    {t.title}
                  </h4>
                </div>
                <ArrowRight size={15} color="var(--text-muted)" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          7. COLLECTIBLE ACHIEVEMENTS & BADGES MATRIX
          ═════════════════════════════════════════════════════════════════════ */}
      <div
        className="section-card"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '18px',
          border: '1px solid var(--border-color)',
          padding: '1.75rem 2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308' }}>
              <Trophy size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Achievements & Developer Badges
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {badges.map((b) => (
            <motion.div
              key={b.id}
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => setSelectedBadge(b)}
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: b.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.3)',
                border: b.unlocked ? `1.5px solid ${b.color}55` : '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: b.unlocked ? `0 0 18px ${b.color}22` : 'none',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {b.unlocked && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', borderRadius: '9999px', padding: '0.1rem 0.4rem', fontSize: '0.65rem', fontWeight: 800 }}>
                  UNLOCKED
                </div>
              )}

              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  margin: '0.35rem auto 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: b.unlocked ? `${b.color}22` : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${b.unlocked ? `${b.color}44` : 'rgba(255, 255, 255, 0.1)'}`,
                  color: b.unlocked ? b.color : 'var(--text-muted)',
                  filter: b.unlocked ? 'none' : 'grayscale(1) opacity(0.5)'
                }}
              >
                {b.Icon && <b.Icon size={22} />}
              </div>

              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: b.unlocked ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: '0.25rem' }}>
                {b.name}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                {b.desc}
              </div>

              {/* Progress sliver */}
              <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${b.progress}%`,
                    height: '100%',
                    background: b.unlocked ? b.color : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px'
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          8. OFFICIAL PYCOSMOS CERTIFICATE MODAL
          ═════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showCertModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={() => setShowCertModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="cert-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar (Outside Certificate Paper) */}
              <div className="cert-modal-header no-print">
                <div className="cert-header-left">
                  <span className="cert-official-chip">
                    <ShieldCheck size={15} />
                    <span>Official PyCosmos Accreditation</span>
                  </span>
                  <span className="cert-header-meta">Registry ID: PYC-2026-8491</span>
                </div>
                <button
                  type="button"
                  className="cert-close-btn"
                  onClick={() => setShowCertModal(false)}
                  title="Close Certificate Preview"
                >
                  <X size={18} />
                </button>
              </div>

              {/* The Certificate Paper */}
              <div className="cert-paper" id="printable-certificate">
                {/* Guilloché Geometric Border */}
                <div className="cert-outer-frame">
                  <div className="cert-inner-frame">
                    
                    {/* Corner Ornaments */}
                    <div className="cert-corner corner-tl">
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <path d="M 0 0 L 36 0 L 36 5 L 5 5 L 5 36 L 0 36 Z" fill="#d97706" />
                        <circle cx="11" cy="11" r="3" fill="#306998" />
                      </svg>
                    </div>
                    <div className="cert-corner corner-tr">
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <path d="M 36 0 L 0 0 L 0 5 L 31 5 L 31 36 L 36 36 Z" fill="#d97706" />
                        <circle cx="25" cy="11" r="3" fill="#306998" />
                      </svg>
                    </div>
                    <div className="cert-corner corner-bl">
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <path d="M 0 36 L 36 36 L 36 31 L 5 31 L 5 0 L 0 0 Z" fill="#d97706" />
                        <circle cx="11" cy="25" r="3" fill="#306998" />
                      </svg>
                    </div>
                    <div className="cert-corner corner-br">
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <path d="M 36 36 L 0 36 L 0 31 L 31 31 L 31 0 L 36 0 Z" fill="#d97706" />
                        <circle cx="25" cy="25" r="3" fill="#306998" />
                      </svg>
                    </div>

                    {/* Certificate Content Header */}
                    <div className="cert-content-header">
                      <div className="cert-header-side">
                        <span className="cert-org-tag">ORGANIZATION ACCREDITATION</span>
                        <span className="cert-org-meta">ISO/PEP-8 COMPLIANT</span>
                      </div>

                      <div className="cert-emblem-wrap">
                        <div className="cert-logo-glow" />
                        <PyCosmosLogo size={44} animated={false} />
                      </div>

                      <div className="cert-header-side cert-side-right">
                        <span className="cert-org-tag">REGISTRY STATUS</span>
                        <span className="cert-org-meta verified-green">VERIFIED ON-CHAIN</span>
                      </div>
                    </div>

                    {/* Pre-title & Headline */}
                    <div className="cert-titles-wrap">
                      <div className="cert-registry-pretitle">
                        PYCOSMOS SYSTEMS ACADEMY &amp; VERIFICATION REGISTRY
                      </div>
                      <h1 className="cert-main-title">
                        Certificate of Advanced Systems Mastery
                      </h1>
                      <div className="cert-conferred-upon">
                        THIS CREDENTIAL IS PROUDLY CONFERRED UPON
                      </div>
                    </div>

                    {/* Recipient Name with Luxury Underline Flourish */}
                    <div className="cert-recipient-wrap">
                      <div className="cert-recipient-name">
                        {userName}
                      </div>
                      <div className="cert-name-flourish">
                        <span className="flourish-line" />
                        <span className="flourish-diamond">◆</span>
                        <span className="flourish-line" />
                      </div>
                    </div>

                    {/* Commendation Citation */}
                    <p className="cert-citation-body">
                      For successfully demonstrating comprehensive mastery across the <strong>51 core CPython runtime, memory architecture, object-oriented, concurrent, and systems engineering</strong> domains of the Python programming language with verified technical competence.
                    </p>

                    {/* Metadata 3-Column Grid */}
                    <div className="cert-metadata-grid">
                      <div className="cert-meta-card">
                        <span className="cert-meta-label">Conferral Date</span>
                        <span className="cert-meta-value">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="cert-meta-sub">Official Issue Date</span>
                      </div>

                      <div className="cert-meta-card">
                        <span className="cert-meta-label">Credential Hash</span>
                        <span className="cert-meta-value cert-hash-text">
                          PYC-8491-SHA256
                        </span>
                        <span className="cert-meta-sub">Cryptographic Stamp</span>
                      </div>

                      <div className="cert-meta-card">
                        <span className="cert-meta-label">Curriculum Standing</span>
                        <span className="cert-meta-value cert-status-green">
                          {percentCompleted === 100 ? '100% Mastered (51/51)' : `${percentCompleted}% Complete (${completedCount}/51)`}
                        </span>
                        <span className="cert-meta-sub">Track Verification</span>
                      </div>
                    </div>

                    {/* Signatures & Gold Embossed Official Seal */}
                    <div className="cert-bottom-signatures">
                      {/* Left Signature */}
                      <div className="cert-sig-block">
                        <div className="cert-signature-art">
                          <svg width="140" height="30" viewBox="0 0 150 38">
                            <path d="M 10 28 C 30 10, 45 36, 60 16 C 75 -2, 85 30, 105 18 C 120 8, 135 22, 145 12" fill="none" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="cert-sig-line" />
                        <div className="cert-signer-name">Shivanshu Shukla</div>
                        <div className="cert-signer-title">Founder &amp; Lead System Architect</div>
                      </div>

                      {/* Center Official Seal */}
                      <div className="cert-seal-badge">
                        <div className="seal-outer-circle">
                          <div className="seal-inner-circle">
                            <div className="seal-star">★</div>
                            <div className="seal-text-top">PYCOSMOS</div>
                            <div className="seal-text-bottom">VERIFIED</div>
                            <div className="seal-year">2026</div>
                          </div>
                        </div>
                        <div className="seal-ribbon-tails">
                          <div className="ribbon-tail tail-left" />
                          <div className="ribbon-tail tail-right" />
                        </div>
                      </div>

                      {/* Right Signature / Registry Stamp */}
                      <div className="cert-sig-block">
                        <div className="cert-signature-art">
                          <svg width="140" height="30" viewBox="0 0 150 38">
                            <path d="M 15 22 C 35 26, 40 6, 65 18 C 85 32, 100 10, 125 15 C 135 18, 140 8, 145 24" fill="none" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="cert-sig-line" />
                        <div className="cert-signer-name">Python Academic Board</div>
                        <div className="cert-signer-title">Global Credential Standards</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Modal Bottom Actions Bar (Outside the printable paper) */}
              <div className="cert-modal-actions-bar no-print">
                <button
                  type="button"
                  className="cert-btn-ghost"
                  onClick={() => setShowCertModal(false)}
                >
                  Close Preview
                </button>

                <div className="cert-actions-right">
                  <button
                    type="button"
                    className="cert-btn-copy"
                    onClick={handleCopyHash}
                  >
                    {copiedHash ? <Check size={15} style={{ color: '#22c55e' }} /> : <Copy size={15} />}
                    <span>{copiedHash ? 'Hash Copied!' : 'Copy Hash'}</span>
                  </button>

                  <button
                    type="button"
                    className="cert-btn-print"
                    onClick={() => window.print()}
                  >
                    <Printer size={16} />
                    <span>Print Certificate / PDF</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
