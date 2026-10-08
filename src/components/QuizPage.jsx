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
  Zap
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
          2. BEGINNER-FRIENDLY 3-STEP SETUP PANEL
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="quiz-setup-banner" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
            Configure Practice Session:
          </span>

          <button
            type="button"
            onClick={handleRefreshSameSettings}
            disabled={isLoading}
            className="btn-refresh-questions"
            title="Fetch a fresh new set of questions with current settings"
          >
            <RefreshCw size={13} className={isLoading ? 'spin-icon' : ''} />
            <span>{isLoading ? 'Fetching...' : 'New Questions'}</span>
          </button>
        </div>

        {/* CONTROLS GRID */}
        <div className="setup-controls-grid">
          {/* STEP 1: TOPIC SELECTION */}
          <div className="quiz-step-card">
            <div className="quiz-step-header">
              <span className="quiz-step-badge">01</span>
              <label className="setup-item-label" style={{ margin: 0 }}>
                <BookOpen size={14} color="var(--py-blue-light)" />
                <span>Topic / Subject</span>
              </label>
            </div>

            {/* Quick Domain Filter Chips */}
            <div className="quiz-category-chips">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`quiz-quick-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                All Domains
              </button>
              {CATEGORIES.slice(0, 6).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`quiz-quick-chip ${selectedCategory === c ? 'active' : ''}`}
                >
                  {c.split(' ')[0]}
                </button>
              ))}
            </div>

            <select
              value={activeTopicId}
              onChange={(e) => setActiveTopicId(e.target.value)}
              className="setup-dropdown"
              style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)' }}
            >
              <option value="all">All 51 Topics (Comprehensive Mixed Practice)</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 2: DIFFICULTY */}
          <div className="quiz-step-card">
            <div className="quiz-step-header">
              <span className="quiz-step-badge">02</span>
              <label className="setup-item-label" style={{ margin: 0 }}>
                <Target size={14} color="var(--accent-emerald)" />
                <span>Difficulty Level</span>
              </label>
            </div>

            <div className="pill-selector" style={{ background: 'rgba(0, 0, 0, 0.25)' }}>
              {[
                { id: 'all', label: 'Mixed' },
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Medium' },
                { id: 'hard', label: 'Hard' }
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`pill-option ${difficulty === diff.id ? 'active' : ''}`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {difficulty === 'easy'
                ? 'Beginner friendly syntax & basic usage'
                : difficulty === 'medium'
                ? 'Standard logic, idioms & data flow'
                : difficulty === 'hard'
                ? 'CPython internals, async & decorators'
                : 'Adaptive blend across all skill levels'}
            </span>
          </div>

          {/* STEP 3: QUESTION COUNT */}
          <div className="quiz-step-card">
            <div className="quiz-step-header">
              <span className="quiz-step-badge">03</span>
              <label className="setup-item-label" style={{ margin: 0 }}>
                <Layers size={14} color="var(--py-yellow)" />
                <span>Session Length</span>
              </label>
            </div>

            <div className="pill-selector" style={{ background: 'rgba(0, 0, 0, 0.25)' }}>
              {[
                { count: 3, label: '3 Qs', tag: '~2m' },
                { count: 5, label: '5 Qs', tag: '~5m' },
                { count: 10, label: '10 Qs', tag: '~10m' }
              ].map((cnt) => (
                <button
                  key={cnt.count}
                  type="button"
                  onClick={() => setQuestionCount(cnt.count)}
                  className={`pill-option ${questionCount === cnt.count ? 'active' : ''}`}
                  title={`${cnt.count} questions (${cnt.tag})`}
                >
                  {cnt.label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {questionCount === 3 ? 'Quick 2-minute targeted drill' : questionCount === 5 ? 'Standard 5-minute practice session' : 'Comprehensive 10-question deep dive'}
            </span>
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
