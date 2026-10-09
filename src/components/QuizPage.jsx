import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Layers,
  Lightbulb,
  Check,
  ChevronRight,
  Smile,
  RefreshCw,
  Flame,
  Shuffle,
  Trophy,
  ExternalLink,
  Code2,
  Zap,
  Sliders,
  Clock,
  ChevronLeft,
  Shield
} from 'lucide-react';
import { CATEGORIES } from '../data/topicsData';
import { celebrate } from '../utils/celebrate';
import { AnimatedCounter } from './AnimatedCounter';
import PyCosmosLogo from './PyCosmosLogo';
import { fetchLiveQuestions, decodeHtmlEntities } from '../services/questionApiService';

export default function QuizPage({
  topics = [],
  selectedTopicId,
  initialQuizMode = 'topic',
  onSaveQuizScore,
  onNavigateToTopic
}) {
  // 1. Setup Controls: Category Filter, Topic, Difficulty, and Number of Questions
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTopicId, setActiveTopicId] = useState(selectedTopicId || 'all');
  const [difficulty, setDifficulty] = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
  const [questionCount, setQuestionCount] = useState(5); // 3 | 5 | 10

  // 2. Quiz Runtime State
  const [questionsList, setQuestionsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshSeed, setRefreshSeed] = useState(0);

  // Active Topic helper
  const activeTopic = topics.find((t) => t.id === activeTopicId) || null;

  // Filter topics for the topic selector dropdown based on selected category
  const availableTopics = useMemo(() => {
    if (selectedCategory === 'all') return topics;
    return topics.filter((t) => t.category === selectedCategory);
  }, [topics, selectedCategory]);

  // Sync activeTopicId if selectedTopicId prop changes externally
  useEffect(() => {
    if (selectedTopicId && selectedTopicId !== activeTopicId) {
      setActiveTopicId(selectedTopicId);
    }
  }, [selectedTopicId]);

  // ─────────────────────────────────────────────────────────────────────────
  // AUTOMATIC API FETCHING: Whenever topic, difficulty, count, or seed changes
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    const autoFetchQuestions = async () => {
      setIsLoading(true);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setShowHint(false);

      try {
        const fetched = await fetchLiveQuestions({
          topicId: activeTopicId === 'all' ? null : activeTopicId,
          topicTitle: activeTopic?.title || 'Python Basics',
          difficulty: difficulty,
          count: questionCount
        });

        if (!isCancelled) {
          if (fetched && fetched.length > 0) {
            setQuestionsList(fetched);
          } else {
            // Fallback to active topic questions or first topic
            setQuestionsList(activeTopic?.questions || topics[0]?.questions || []);
          }
        }
      } catch (err) {
        console.warn('API error during automatic fetch:', err);
        if (!isCancelled) {
          setQuestionsList(activeTopic?.questions || topics[0]?.questions || []);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    autoFetchQuestions();

    return () => {
      isCancelled = true;
    };
  }, [activeTopicId, difficulty, questionCount, refreshSeed]);

  // Handle Option Selection
  const handleSelectOption = (qId, optionIdx) => {
    if (selectedAnswers[qId] !== undefined) return;

    const currentQ = questionsList[currentIndex];
    const isCorrect = optionIdx === currentQ.correctIndex;

    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  // Submit and Calculate Score
  const handleFinishQuiz = () => {
    let calcScore = 0;
    questionsList.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        calcScore += 1;
      }
    });

    setScore(calcScore);
    setIsSubmitted(true);

    const percent = questionsList.length > 0 ? Math.round((calcScore / questionsList.length) * 100) : 0;
    if (percent >= 70) {
      celebrate();
    }

    if (activeTopicId !== 'all' && onSaveQuizScore) {
      onSaveQuizScore(activeTopicId, percent);
    }
  };

  // Quick Randomize / Surprise Quiz
  const handleSurpriseQuiz = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    if (randomTopic) {
      setActiveTopicId(randomTopic.id);
    } else {
      setActiveTopicId('all');
    }
    const diffs = ['all', 'easy', 'medium', 'hard'];
    setDifficulty(diffs[Math.floor(Math.random() * diffs.length)]);
    setRefreshSeed((prev) => prev + 1);
  };

  // Trigger Fresh Set with same settings
  const handleRefreshSameSettings = () => {
    setRefreshSeed((prev) => prev + 1);
  };

  const currentQ = questionsList[currentIndex];
  const currentOptions = currentQ ? (currentQ.options || currentQ.choices || []) : [];
  const progressPercent = questionsList.length > 0 ? Math.round(((currentIndex + 1) / questionsList.length) * 100) : 0;
  const isAnswered = currentQ && selectedAnswers[currentQ.id] !== undefined;

  // Determine Performance Tier
  const scorePercent = questionsList.length > 0 ? Math.round((score / questionsList.length) * 100) : 0;
  const performanceBadge =
    scorePercent === 100
      ? { title: 'Python Grandmaster', Icon: Trophy, color: '#ffd43b', desc: 'Flawless execution! You demonstrated comprehensive mastery across all tested concepts.' }
      : scorePercent >= 80
      ? { title: 'Code Craftsman', Icon: Zap, color: '#4ade80', desc: 'Outstanding knowledge! You demonstrated high proficiency.' }
      : scorePercent >= 60
      ? { title: 'Promising Apprentice', Icon: Sparkles, color: '#38bdf8', desc: 'Solid foundation. Review the detailed explanations below to patch any subtle edge cases.' }
      : { title: 'Novice Explorer', Icon: Lightbulb, color: '#f59e0b', desc: 'Every mistake is a stepping stone. Review the concepts below to solidify your understanding.' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="quiz-page-container"
    >
      {/* ═════════════════════════════════════════════════════════════════════
          1. HERO HEADER WITH PYCOSMOS SNAKE BRANDING
          ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
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
              INTERACTIVE PYTHON COSMOS PRACTICE
            </span>
          </motion.div>

          <h1 style={{ fontSize: '2.3rem', fontWeight: 900, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
            Python Interactive <span className="forge-gradient-text">Practice & Quizzes</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0 }}>
            Real-time evaluation. Choose your topic, difficulty, and question count — questions load automatically via API.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div className="quiz-live-badge">
            <span className="quiz-live-dot" />
            <span>API Auto-Sync Ready</span>
          </div>

          <button
            type="button"
            onClick={handleSurpriseQuiz}
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Randomize settings for a surprise challenge"
          >
            <Shuffle size={13} />
            <span>Surprise Quiz</span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          2. BESPOKE MISSION STUDIO CONSOLE (RANGE SLIDER, 3D DIALS, CAROUSEL)
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="quiz-studio-console-banner">
        {/* STUDIO HEADER */}
        <div className="studio-console-header">
          <div className="studio-header-title-group">
            <div className="studio-console-badge">
              <Sliders size={16} color="var(--py-yellow)" />
            </div>
            <div>
              <h3 className="studio-console-title">Mission Practice Studio</h3>
              <p className="studio-console-sub">Configure real-time Python drills • Fluid length slider, holographic difficulty dials, and domain filters</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshSameSettings}
            disabled={isLoading}
            className="btn-refresh-questions-studio"
            title="Fetch a fresh new set of questions with current settings"
          >
            <RefreshCw size={13} className={isLoading ? 'spin-icon' : ''} />
            <span>{isLoading ? 'Generating Questions...' : 'Regenerate Questions'}</span>
          </button>
        </div>

        {/* ── STEP 1: VISUAL TOPIC DOMAIN CAROUSEL & SELECTOR ── */}
        <div className="studio-block topic-domain-block">
          <div className="studio-block-header">
            <div className="studio-step-num">01</div>
            <div className="studio-block-title-row">
              <BookOpen size={14} color="#38bdf8" />
              <span>Target Topic & Domain Carousel</span>
            </div>
            <span className="studio-block-count">{availableTopics.length} topics available</span>
          </div>

          {/* HORIZONTAL DOMAIN CAROUSEL */}
          <div className="domain-carousel-track">
            {[
              { id: 'all', label: 'All Domains', icon: '🪐' },
              { id: 'Foundation', label: 'Syntax & Primitives', icon: '⚡' },
              { id: 'Data Structures', label: 'Data Structures', icon: '📦' },
              { id: 'Functions & Modules', label: 'Functions & OOP', icon: '🏛️' },
              { id: 'Concurrency & Async', label: 'Async & Concurrency', icon: '🔀' },
              { id: 'Internals & Performance', label: 'CPython Internals', icon: '⚙️' },
              { id: 'Advanced Python', label: 'Metaprogramming', icon: '🔮' }
            ].map((domain) => {
              const isSelected = selectedCategory === domain.id;
              return (
                <motion.button
                  key={domain.id}
                  type="button"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(domain.id)}
                  className={`domain-carousel-card ${isSelected ? 'active' : ''}`}
                >
                  <span className="domain-card-icon">{domain.icon}</span>
                  <span className="domain-card-label">{domain.label}</span>
                  {isSelected && <span className="domain-active-glow" />}
                </motion.button>
              );
            })}
          </div>

          {/* TOPIC DROPDOWN SELECTOR */}
          <div className="topic-dropdown-bar">
            <select
              value={activeTopicId}
              onChange={(e) => setActiveTopicId(e.target.value)}
              className="studio-dropdown-input"
            >
              <option value="all">🪐 All 51 Curriculum Topics (Comprehensive Mixed Drill)</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category || 'Python'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── STEP 2 & 3 DUAL GRID: 3D DIFFICULTY DIALS + FLUID LENGTH SLIDER ── */}
        <div className="studio-dual-controls-grid">
          {/* STEP 2: 3D HOLOGRAPHIC DIFFICULTY DIALS */}
          <div className="studio-block difficulty-block">
            <div className="studio-block-header">
              <div className="studio-step-num">02</div>
              <div className="studio-block-title-row">
                <Target size={14} color="#34d399" />
                <span>Difficulty Spectrum Dial</span>
              </div>
            </div>

            <div className="difficulty-dials-grid">
              {[
                {
                  id: 'all',
                  label: 'Adaptive Mixed',
                  glow: '#ffd43b',
                  badge: 'Balanced',
                  desc: 'Dynamic blend across all difficulty tiers'
                },
                {
                  id: 'easy',
                  label: 'Explorer',
                  glow: '#22c55e',
                  badge: 'Beginner',
                  desc: 'Core syntax, built-ins & basic data structures'
                },
                {
                  id: 'medium',
                  label: 'Engineer',
                  glow: '#38bdf8',
                  badge: 'Intermediate',
                  desc: 'Decorators, generators, idioms & data flow'
                },
                {
                  id: 'hard',
                  label: 'Grandmaster',
                  glow: '#f43f5e',
                  badge: 'Advanced',
                  desc: 'CPython bytecode, GIL, memory & async loops'
                }
              ].map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <motion.div
                    key={diff.id}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDifficulty(diff.id)}
                    className={`difficulty-dial-card ${isSelected ? 'selected' : ''}`}
                    style={{ '--dial-glow': diff.glow }}
                  >
                    <div className="dial-card-top">
                      <span className="dial-beacon-dot" />
                      <span className="dial-badge-pill" style={{ color: diff.glow }}>{diff.badge}</span>
                    </div>
                    <div className="dial-card-title">{diff.label}</div>
                    <div className="dial-card-desc">{diff.desc}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: FLUID QUESTION COUNT RANGE SLIDER */}
          <div className="studio-block slider-block">
            <div className="studio-block-header">
              <div className="studio-step-num">03</div>
              <div className="studio-block-title-row">
                <Layers size={14} color="#ffd43b" />
                <span>Drill Length Fluid Slider</span>
              </div>
              <span className="studio-xp-badge">+{questionCount * 25} XP</span>
            </div>

            {/* BIG READOUT WITH TELEMETRY */}
            <div className="slider-telemetry-readout">
              <div className="slider-count-number">
                <span className="count-big">{questionCount}</span>
                <span className="count-unit">Questions</span>
              </div>

              <div className="slider-time-meta">
                <div className="meta-item">
                  <Clock size={12} color="var(--text-muted)" />
                  <span>Est. ~{Math.max(2, Math.round(questionCount * 1.2))} mins</span>
                </div>
                <div className="meta-item">
                  <Zap size={12} color="var(--py-yellow)" />
                  <span>Reward: {questionCount * 25} XP</span>
                </div>
              </div>
            </div>

            {/* FLUID INTERACTIVE RANGE SLIDER TRACK */}
            <div className="fluid-range-slider-container">
              <input
                type="range"
                min="3"
                max="20"
                step="1"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                className="horizon-range-slider studio-fluid-slider"
                aria-label="Set question count from 3 to 20"
              />
            </div>

            {/* QUICK PRESET CHIPS */}
            <div className="slider-preset-chips">
              {[
                { count: 3, label: '3 Qs (Quick Drill)' },
                { count: 5, label: '5 Qs (Standard)' },
                { count: 10, label: '10 Qs (Deep Dive)' },
                { count: 15, label: '15 Qs (Marathon)' },
                { count: 20, label: '20 Qs (Boss Mode)' }
              ].map((p) => (
                <button
                  key={p.count}
                  type="button"
                  onClick={() => setQuestionCount(p.count)}
                  className={`preset-chip-btn ${questionCount === p.count ? 'active' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          3. QUIZ CONTENT / LOADING STATE / SCORECARD / ACTIVE QUESTION
          ═════════════════════════════════════════════════════════════════════ */}
      {isLoading ? (
        <div className="quiz-loading-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div className="loading-spinner-ring" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '1.25rem', color: 'var(--text-primary)' }}>
            Generating Questions via API...
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '420px', margin: '0.35rem auto 0' }}>
            Preparing tailored practice questions for {activeTopic ? activeTopic.title : 'Python Practice'}.
          </p>
        </div>
      ) : isSubmitted ? (
        /* ══════════ SCORECARD / RESULTS VIEW ══════════ */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="quiz-results-card"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px' }}
        >
          {/* CELEBRATION BADGE */}
          <div className="results-celebration-bubble" style={{ background: `linear-gradient(135deg, ${performanceBadge.color}, #3b82f6)` }}>
            <Award size={48} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 800, color: performanceBadge.color, marginBottom: '0.75rem' }}>
            {performanceBadge.Icon && <performanceBadge.Icon size={14} />}
            <span>{performanceBadge.title}</span>
          </div>

          <h2 className="results-headline">
            {scorePercent >= 70 ? 'Assessment Complete: Outstanding Performance' : 'Assessment Complete: Review & Practice'}
          </h2>

          <div className="results-score-display">
            <span className="score-big" style={{ color: performanceBadge.color }}>
              <AnimatedCounter value={score} />
            </span>
            <span className="score-divider">/</span>
            <span className="score-total">{questionsList.length}</span>
            <span className="score-pill" style={{ background: `${performanceBadge.color}22`, color: performanceBadge.color }}>
              {scorePercent}% Accuracy
            </span>
          </div>

          {maxStreak > 1 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#fb923c', fontSize: '0.88rem', fontWeight: 700, marginBottom: '1rem' }}>
              <Flame size={16} />
              <span>Highest Streak: {maxStreak} consecutive correct answers!</span>
            </div>
          )}

          <p className="results-subtext">
            {performanceBadge.desc}
          </p>

          <div className="results-action-buttons">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleRefreshSameSettings}
            >
              <RotateCcw size={18} />
              <span>Try Another Set (Auto-Generated)</span>
            </button>

            {activeTopic && (
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigateToTopic && onNavigateToTopic(activeTopic.id)}
              >
                <BookOpen size={18} />
                <span>Study {activeTopic.title} Lesson</span>
              </button>
            )}
          </div>

          {/* QUESTION BY QUESTION DETAILED BREAKDOWN */}
          <div className="results-review-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 className="review-title" style={{ margin: 0 }}>
                Detailed Question Review ({questionsList.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {score} correct, {questionsList.length - score} need review
              </span>
            </div>

            <div className="review-list">
              {questionsList.map((q, qIdx) => {
                const userChoiceIdx = selectedAnswers[q.id];
                const isCorrect = userChoiceIdx === q.correctIndex;
                const opts = q.options || q.choices || [];

                return (
                  <div key={q.id || qIdx} className={`review-card ${isCorrect ? 'correct' : 'wrong'}`}>
                    <div className="review-card-header">
                      {isCorrect ? (
                        <CheckCircle2 size={20} className="icon-correct" />
                      ) : (
                        <XCircle size={20} className="icon-wrong" />
                      )}
                      <div>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                          Question {qIdx + 1} • {q.difficulty ? q.difficulty.toUpperCase() : 'MEDIUM'}
                        </span>
                        <h4 className="review-question-text">
                          {decodeHtmlEntities(q.question)}
                        </h4>
                      </div>
                    </div>

                    <div className="review-answers-box">
                      <div className="review-ans-row">
                        <span className="ans-label">Your Answer:</span>
                        <strong className={isCorrect ? 'text-correct' : 'text-wrong'}>
                          {decodeHtmlEntities(opts[userChoiceIdx] || 'No answer selected')}
                        </strong>
                      </div>

                      {!isCorrect && (
                        <div className="review-ans-row">
                          <span className="ans-label">Correct Answer:</span>
                          <strong className="text-correct">
                            {decodeHtmlEntities(opts[q.correctIndex])}
                          </strong>
                        </div>
                      )}

                      {q.explanation && (
                        <div className="review-explanation">
                          <Lightbulb size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1, color: 'var(--py-yellow)' }} />
                          <strong>Explanation:</strong> {decodeHtmlEntities(q.explanation)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      ) : (
        /* ══════════ ACTIVE QUESTION CARD ══════════ */
        currentQ && (
          <motion.div
            key={currentQ.id || currentIndex}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="quiz-card-main"
          >
            {/* CARD TOP INFO BAR */}
            <div className="card-top-bar">
              <div className="top-meta-tags">
                <span className="tag-question-counter">
                  Question {currentIndex + 1} of {questionsList.length}
                </span>

                <span className="tag-topic-badge">
                  {currentQ.topicTitle || (activeTopic ? activeTopic.title : 'Python')}
                </span>

                <span className={`tag-difficulty diff-${(currentQ.difficulty || 'medium').toLowerCase()}`}>
                  {(currentQ.difficulty || 'medium').toUpperCase()}
                </span>

                {streak > 1 && (
                  <span className="quiz-streak-pill">
                    <Flame size={13} />
                    <span>{streak} in a row!</span>
                  </span>
                )}
              </div>

              {/* PROGRESS BAR */}
              <div className="quiz-progress-track">
                <div
                  className="quiz-progress-bar"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* QUESTION HEADING */}
            <h3 className="card-question-text">
              {decodeHtmlEntities(currentQ.question)}
            </h3>

            {/* CODE SNIPPET (IF ANY) */}
            {currentQ.solutionCode && (
              <div className="quiz-terminal-snippet">
                <div className="quiz-terminal-header">
                  <span className="terminal-dot red" />
                  <span className="terminal-dot yellow" />
                  <span className="terminal-dot green" />
                  <span className="terminal-title">python_snippet.py</span>
                </div>
                <pre style={{ margin: 0, padding: '1rem 1.25rem', color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', overflowX: 'auto' }}>
                  <code>{currentQ.solutionCode}</code>
                </pre>
              </div>
            )}

            {/* OPTIONS (A, B, C, D) */}
            <div className="options-stack">
              {currentOptions.map((optText, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                const isRight = optIdx === currentQ.correctIndex;
                const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                let optionClass = 'option-btn';
                if (isAnswered) {
                  if (isRight) {
                    optionClass += ' is-correct';
                  } else if (isSelected) {
                    optionClass += ' is-wrong';
                  } else {
                    optionClass += ' is-muted';
                  }
                }

                return (
                  <motion.button
                    key={optIdx}
                    type="button"
                    whileHover={!isAnswered ? { x: 4, scale: 1.005 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    disabled={isAnswered}
                    className={optionClass}
                  >
                    <span className="option-letter">{optionLetter}</span>
                    <span className="option-text">{decodeHtmlEntities(optText)}</span>
                    {isAnswered && isRight && <Check size={18} className="option-icon-correct" />}
                    {isAnswered && isSelected && !isRight && <XCircle size={18} className="option-icon-wrong" />}
                  </motion.button>
                );
              })}
            </div>

            {/* EXPLANATION & HINT ROW */}
            <div className="card-feedback-section">
              {isAnswered && currentQ.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`answer-feedback-banner ${selectedAnswers[currentQ.id] === currentQ.correctIndex ? 'success' : 'alert'}`}
                >
                  <div className="feedback-heading">
                    {selectedAnswers[currentQ.id] === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Correct! Well done.</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} />
                        <span>Not quite right.</span>
                      </>
                    )}
                  </div>
                  <p className="feedback-body">{decodeHtmlEntities(currentQ.explanation)}</p>
                </motion.div>
              )}

              {/* HINT TOGGLE */}
              {(currentQ.hint || (currentQ.hints && currentQ.hints[0])) && !isAnswered && (
                <div className="hint-container">
                  {!showHint ? (
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="btn-show-hint"
                    >
                      <Lightbulb size={15} />
                      <span>Need a hint?</span>
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="hint-box"
                    >
                      <Lightbulb size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1, color: 'var(--py-yellow)' }} />
                      <strong>Hint:</strong> {decodeHtmlEntities(currentQ.hint || currentQ.hints[0])}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* CARD BOTTOM NAVIGATION */}
            <div className="card-footer-nav">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  setShowHint(false);
                }}
              >
                Previous
              </button>

              {currentIndex < questionsList.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setCurrentIndex((prev) => prev + 1);
                    setShowHint(false);
                  }}
                  disabled={!isAnswered}
                >
                  <span>Next Question</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-yellow"
                  onClick={handleFinishQuiz}
                  disabled={!isAnswered}
                >
                  <Check size={16} />
                  <span>View Assessment Summary</span>
                </button>
              )}
            </div>
          </motion.div>
        )
      )}
    </motion.div>
  );
}
