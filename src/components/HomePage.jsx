import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Play,
  CheckCircle2,
  HelpCircle,
  Map,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Code,
  BookOpen,
  Clock,
  Terminal,
  Zap,
  Check,
  ChevronDown,
  RotateCcw,
  GitBranch,
  Layers,
  Compass,
  CheckSquare,
  FileText,
  RefreshCw,
  Copy,
  CheckCheck,
  Brain
} from 'lucide-react';
import PyCosmosLogo from './PyCosmosLogo';
import { AnimatedCounter } from './AnimatedCounter';
import { RevealGroup, RevealItem } from './RevealGroup';
import { TopicCard } from './TopicCard';
import { QuizOption } from './QuizOption';
import { TOPICS } from '../data/topicsData';
import { HOVER_LIFT_VARIANT, BUTTON_HOVER_VARIANT } from '../utils/motionVariants';
import { runPythonCode } from '../services/pythonCompiler';
import { fetchProblemOfTheDay } from '../services/questionApiService';
import { celebrate } from '../utils/celebrate';



const PLAYGROUND_SNIPPETS = [
  {
    id: 'fibonacci',
    filename: 'fibonacci.py',
    title: 'Fibonacci Sequence',
    initialCode: `# Generate Fibonacci sequence up to N terms
def generate_fibonacci(n: int):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

print("Fibonacci:", generate_fibonacci(10))`,
    defaultOutput: 'Fibonacci: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]'
  },
  {
    id: 'list_comp',
    filename: 'list_comprehension.py',
    title: 'List Comprehension',
    initialCode: `# Filter and square even numbers
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squared_evens = [x**2 for x in numbers if x % 2 == 0]

print("Squared Evens:", squared_evens)`,
    defaultOutput: 'Squared Evens: [4, 16, 36, 64, 100]'
  },
  {
    id: 'dataclass',
    filename: 'class_example.py',
    title: 'Class & Dataclass',
    initialCode: `# Python 3.11 Dataclass Structure
from dataclasses import dataclass

@dataclass
class Developer:
    name: str
    skill: str = "Python"

dev = Developer("Alex")
print(f"Developer: {dev.name} ({dev.skill})")`,
    defaultOutput: 'Developer: Alex (Python)'
  }
];

const JOURNEY_LEVELS = [
  { level: 1, name: 'Basics', color: '#4b8bbe', bg: 'rgba(75, 139, 190, 0.15)', topics: 10 },
  { level: 2, name: 'Control Flow', color: '#c084fc', bg: 'rgba(168, 85, 247, 0.15)', topics: 5 },
  { level: 3, name: 'Functions', color: '#2dd4bf', bg: 'rgba(20, 184, 166, 0.15)', topics: 4 },
  { level: 4, name: 'Data Structures', color: '#f472b6', bg: 'rgba(236, 72, 153, 0.15)', topics: 5 },
  { level: 5, name: 'Advanced System', color: '#fb923c', bg: 'rgba(249, 115, 22, 0.15)', topics: 3 }
];

export default function HomePage({
  completedCount = 0,
  completedMap = {},
  totalTopics = 51,
  quizScoresMap = {},
  recentlyViewedIds = [],
  onNavigate,
  onSelectTopic,
  streakCount = 1
}) {
  const percentCompleted = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Calculate Average Quiz Score
  const quizScores = Object.values(quizScoresMap);
  const quizAvgScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

  // Find Next Best Action Topic for "Today's Focus" Smart Card
  const nextTopic = TOPICS.find(t => !completedMap[t.id]) || TOPICS[0];

  // Live Interactive Playground State
  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0);
  const [editableCode, setEditableCode] = useState(PLAYGROUND_SNIPPETS[0].initialCode);
  const [playgroundOutput, setPlaygroundOutput] = useState(PLAYGROUND_SNIPPETS[0].defaultOutput);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isOutputError, setIsOutputError] = useState(false);
  const [compilerStatus, setCompilerStatus] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Typewriter Loop in Hero State
  const [heroTypewriterIdx, setHeroTypewriterIdx] = useState(0);
  const [heroTypedChars, setHeroTypedChars] = useState(0);
  const [heroTypingDone, setHeroTypingDone] = useState(false);

  const heroSnippet = PLAYGROUND_SNIPPETS[heroTypewriterIdx];
  const heroFullText = heroSnippet.initialCode;

  // Hero Typewriter Effect Timer
  useEffect(() => {
    setHeroTypedChars(0);
    setHeroTypingDone(false);

    const timer = setInterval(() => {
      setHeroTypedChars(prev => {
        if (prev + 1 >= heroFullText.length) {
          clearInterval(timer);
          setHeroTypingDone(true);
          return heroFullText.length;
        }
        return prev + 1;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [heroTypewriterIdx, heroFullText]);

  // Hero Snippet Cycler (10s)
  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setHeroTypewriterIdx(prev => (prev + 1) % PLAYGROUND_SNIPPETS.length);
    }, 10000);

    return () => clearInterval(cycleTimer);
  }, []);

  // Hero Snippet manual switch
  const handleSelectHeroSnippet = (idx) => {
    setHeroTypewriterIdx(idx);
    setHeroTypedChars(0);
    setHeroTypingDone(false);
  };

  // Update playground editable code when tab changes
  const handleSnippetTabChange = (idx) => {
    setActiveSnippetIdx(idx);
    setEditableCode(PLAYGROUND_SNIPPETS[idx].initialCode);
    setPlaygroundOutput('Click "Run Code" to execute with CPython WebAssembly.');
    setIsOutputError(false);
    setCompilerStatus('Ready');
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(editableCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetCode = () => {
    setEditableCode(PLAYGROUND_SNIPPETS[activeSnippetIdx].initialCode);
    setPlaygroundOutput(PLAYGROUND_SNIPPETS[activeSnippetIdx].defaultOutput);
    setIsOutputError(false);
    setCompilerStatus('Reset to template');
  };

  // Run Real Python Code via Pyodide WebAssembly
  const handleRunPlaygroundCode = async () => {
    setIsExecuting(true);
    setIsOutputError(false);
    setCompilerStatus('Compiling & Executing Python 3.12 (WASM)...');
    setPlaygroundOutput('Compiling & running in CPython WebAssembly VM...');

    try {
      const res = await runPythonCode(editableCode, (status) => {
        setCompilerStatus(status);
      });

      setPlaygroundOutput(res.output);
      setIsOutputError(res.isError);
      setCompilerStatus(res.isError ? 'Execution Error' : 'CPython 3.12 • Exit 0');
    } catch (err) {
      setPlaygroundOutput(`Runtime Error: ${err.message || String(err)}`);
      setIsOutputError(true);
      setCompilerStatus('Execution Failed');
    } finally {
      setIsExecuting(false);
    }
  };

  // Dynamic Problem of the Day State (loaded from API and changes dynamically)
  const [qotd, setQotd] = useState({
    question: "Loading dynamic Problem of the Day from API...",
    options: ["Loading...", "Loading...", "Loading...", "Loading..."],
    correct: 0,
    explanation: "",
    topicCategory: "Python Core",
    difficulty: "INTERMEDIATE",
    isLiveApi: false
  });
  const [qotdLoading, setQotdLoading] = useState(true);
  const [qotdSelected, setQotdSelected] = useState(null);
  const [qotdShowAnswer, setQotdShowAnswer] = useState(false);
  const [qotdCountdown, setQotdCountdown] = useState('14h 23m');

  // Load Problem of the Day on Mount and update live countdown
  useEffect(() => {
    let isMounted = true;
    const loadQotd = async () => {
      setQotdLoading(true);
      try {
        const problem = await fetchProblemOfTheDay({ forceNew: false });
        if (isMounted && problem) {
          setQotd(problem);
          if (problem.dateKey) {
            const savedAnswer = localStorage.getItem(`pycosmos_qotd_answered_${problem.dateKey}`) || localStorage.getItem(`pyforge_qotd_answered_${problem.dateKey}`);
            if (savedAnswer !== null) {
              setQotdSelected(Number(savedAnswer));
              setQotdShowAnswer(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic QOTD:', err);
      } finally {
        if (isMounted) setQotdLoading(false);
      }
    };

    loadQotd();

    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setQotdCountdown(`${hours}h ${mins}m`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Fetch New Dynamic Problem from API on Demand
  const handleRefreshQotd = async () => {
    setQotdLoading(true);
    setQotdSelected(null);
    setQotdShowAnswer(false);
    try {
      const freshProblem = await fetchProblemOfTheDay({ forceNew: true, source: 'api' });
      if (freshProblem) {
        setQotd(freshProblem);
      }
    } catch (err) {
      console.error('Failed to refresh QOTD from API:', err);
    } finally {
      setQotdLoading(false);
    }
  };

  const handleSelectQotdOption = (idx) => {
    if (qotdShowAnswer) return;
    setQotdSelected(idx);
    setQotdShowAnswer(true);

    if (idx === qotd.correct) {
      celebrate();
    }

    try {
      if (qotd.dateKey) {
        localStorage.setItem(`pycosmos_qotd_answered_${qotd.dateKey}`, String(idx));
      }
    } catch {}
  };

  // Recently Viewed Topics Array
  const recentTopicsList = recentlyViewedIds
    .map(id => TOPICS.find(t => t.id === id))
    .filter(Boolean);

  return (
    <div style={{ paddingBottom: '5rem', position: 'relative' }}>
      {/* 1. FULL-VIEWPORT HERO SECTION WITH KINETIC ANIMATIONS */}
      <section
        style={{
          minHeight: '86vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 1.5rem 2.5rem',
          position: 'relative'
        }}
      >


        {/* Hero Content Center */}
        <div style={{ maxWidth: '940px', zIndex: 3 }}>
          {/* Unmistakable PyCosmos Python Snake Emblem & Bloom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hero-snake-container"
          >
            <div className="hero-snake-bloom" />
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <PyCosmosLogo size={84} animated={true} />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-title"
          >
            Master Python Programming <br />
            <span className="forge-gradient-text">A Whole Universe of Python</span> in One Place
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hero-subtitle"
          >
            <strong>PyCosmos: a whole universe of Python in one place.</strong> From absolute fundamentals to production-ready Python mastery. Follow our interactive visual roadmap, solve topic-wise quizzes, run live WebAssembly code, and explore the complete Python ecosystem.
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="hero-actions"
          >
            <motion.button
              {...BUTTON_HOVER_VARIANT}
              className="btn btn-yellow btn-shimmer-wrap"
              onClick={() => onNavigate('roadmap')}
              style={{ padding: '0.9rem 2.1rem', fontSize: '1.02rem', borderRadius: '14px' }}
            >
              <Map size={20} />
              <span>Explore Skill Roadmap</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ display: 'inline-flex' }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.button>

            <motion.button
              {...BUTTON_HOVER_VARIANT}
              className="btn btn-secondary btn-secondary-glow"
              onClick={() => onNavigate('learn')}
              style={{ padding: '0.9rem 2.1rem', fontSize: '1.02rem', borderRadius: '14px' }}
            >
              <Code size={20} />
              <span>{completedCount > 0 ? 'Continue Learning' : 'Start Basics'}</span>
            </motion.button>
          </motion.div>

          {/* Integrated macOS Code Window inside Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="hero-code-terminal-card"
          >
            {/* macOS Titlebar & Tabs */}
            <div className="terminal-titlebar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <div className="traffic-dot" style={{ background: '#ff5f56' }} />
                  <div className="traffic-dot" style={{ background: '#ffbd2e' }} />
                  <div className="traffic-dot" style={{ background: '#27c93f' }} />
                </div>

                {/* Snippet Switcher Tabs */}
                <div style={{ display: 'flex', gap: '0.35rem', marginLeft: '0.5rem' }}>
                  {PLAYGROUND_SNIPPETS.map((snip, idx) => (
                    <button
                      key={snip.id}
                      onClick={() => handleSelectHeroSnippet(idx)}
                      className={`terminal-tab-pill ${heroTypewriterIdx === idx ? 'active' : ''}`}
                    >
                      {snip.filename}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.75rem',
                  color: '#39d353',
                  background: 'rgba(35, 134, 54, 0.15)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontWeight: 700
                }}>
                  <span className="live-pulse-dot" />
                  <Terminal size={12} />
                  <span>Python 3.11 WASM</span>
                </div>
              </div>
            </div>

            {/* Code Body with Line Numbers & Output */}
            <div className="terminal-editor-body">
              {/* Line Numbers Gutter */}
              <div className="line-numbers-gutter">
                {heroFullText.split('\n').map((_, idx) => (
                  <div key={idx} style={{ height: '1.65rem' }}>{idx + 1}</div>
                ))}
              </div>

              {/* Code Content */}
              <div style={{ flex: 1, overflowX: 'auto' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
                  {heroFullText.slice(0, heroTypedChars)}
                  {!heroTypingDone && <span className="blinking-cursor">|</span>}
                </pre>

                {/* Animated Output Drawer */}
                {heroTypingDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      marginTop: '1.25rem',
                      padding: '0.75rem 1rem',
                      background: 'rgba(13, 17, 23, 0.9)',
                      borderRadius: '10px',
                      borderLeft: '4px solid #38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.86rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div>
                      <span style={{ color: '#8b949e', marginRight: '0.5rem' }}>Output &gt;&gt;</span>
                      <span style={{ color: '#fde047', fontWeight: 700 }}>{heroSnippet.defaultOutput}</span>
                    </div>

                    <button
                      onClick={() => handleSelectHeroSnippet(heroTypewriterIdx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}
                      title="Replay animation"
                    >
                      <RotateCcw size={12} />
                      <span>Replay</span>
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Scroll-down indicator */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '1.25rem'
            }}
            onClick={() => window.scrollTo({ top: 620, behavior: 'smooth' })}
          >
            <span>Scroll to explore roadmap</span>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </section>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* 2. "YOUR JOURNEY SO FAR" SERPENTINE ROADMAP SECTION */}
        <section style={{ marginBottom: '4.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--py-blue-light)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.06em', marginBottom: '0.45rem', background: 'rgba(48, 105, 152, 0.15)', padding: '0.3rem 0.85rem', borderRadius: '9999px', border: '1px solid rgba(48, 105, 152, 0.3)' }}>
              <Compass size={16} />
              <span>YOUR LEARNING JOURNEY</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              Curriculum Roadmap Overview
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', maxWidth: '580px', margin: '0.3rem auto 0' }}>
              Follow the guided serpentine pathway from fundamentals to advanced system architecture.
            </p>
          </div>

          {/* Serpentine Pathway Container */}
          <div className="serpentine-pathway-container">
            {/* Sinuous SVG Connecting Track */}
            <svg
              viewBox="0 0 1000 24"
              preserveAspectRatio="none"
              className="serpentine-track-svg"
            >
              <defs>
                <linearGradient id="serpentineNeonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="25%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#2dd4bf" />
                  <stop offset="75%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              {/* Base Track */}
              <path
                d="M 10 12 C 250 4, 350 20, 500 12 C 650 4, 750 20, 990 12"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {/* Active Pulsing Energy Track */}
              <motion.path
                d="M 10 12 C 250 4, 350 20, 500 12 C 650 4, 750 20, 990 12"
                stroke="url(#serpentineNeonGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.max(0.1, percentCompleted / 100) }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
              />
            </svg>

            {/* 5 Milestone Node Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', position: 'relative', zIndex: 2 }}>
              {JOURNEY_LEVELS.map((lvl) => {
                const isCurrent = (percentCompleted < 20 && lvl.level === 1) ||
                  (percentCompleted >= 20 && percentCompleted < 40 && lvl.level === 2) ||
                  (percentCompleted >= 40 && percentCompleted < 60 && lvl.level === 3) ||
                  (percentCompleted >= 60 && percentCompleted < 80 && lvl.level === 4) ||
                  (percentCompleted >= 80 && lvl.level === 5);

                return (
                  <motion.div
                    key={lvl.level}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => onNavigate('roadmap')}
                    className="milestone-node-card"
                    style={{
                      background: isCurrent ? lvl.bg : 'rgba(13, 17, 23, 0.7)',
                      border: `1.5px solid ${isCurrent ? lvl.color : 'rgba(255, 255, 255, 0.1)'}`,
                      boxShadow: isCurrent ? `0 0 25px ${lvl.bg}, 0 8px 20px rgba(0, 0, 0, 0.4)` : 'none'
                    }}
                  >
                    <div
                      className="milestone-node-badge"
                      style={{
                        background: isCurrent ? lvl.color : 'var(--bg-sidebar)',
                        color: isCurrent ? '#0d1117' : lvl.color,
                        boxShadow: isCurrent ? `0 0 15px ${lvl.color}` : 'none'
                      }}
                    >
                      {isCurrent && <div className="milestone-active-pulse" />}
                      L{lvl.level}
                    </div>

                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {lvl.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {lvl.topics} Topics
                    </div>

                    {isCurrent && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '10px',
                          background: '#39d353',
                          color: '#0d1117',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          boxShadow: '0 2px 10px rgba(57, 211, 83, 0.4)'
                        }}
                      >
                        ACTIVE
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 4 Stat Cards */}
          <RevealGroup className="stats-row">
            <RevealItem>
              <motion.div {...HOVER_LIFT_VARIANT} className="stat-card">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(48, 105, 152, 0.2)', color: 'var(--py-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <BookOpen size={24} />
                </div>
                <div className="stat-number"><AnimatedCounter value={50} />+</div>
                <div className="stat-label">Structured Topics</div>
              </motion.div>
            </RevealItem>

            <RevealItem>
              <motion.div {...HOVER_LIFT_VARIANT} className="stat-card">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 212, 59, 0.2)', color: 'var(--py-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <HelpCircle size={24} />
                </div>
                <div className="stat-number"><AnimatedCounter value={20} />+</div>
                <div className="stat-label">Topic Quizzes</div>
              </motion.div>
            </RevealItem>

            <RevealItem>
              <motion.div {...HOVER_LIFT_VARIANT} className="stat-card">
                <div style={{ position: 'relative', width: '52px', height: '52px', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="52" height="52" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                    <circle cx="26" cy="26" r="21" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="21"
                      stroke="#39d353"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={132}
                      initial={{ strokeDashoffset: 132 }}
                      whileInView={{ strokeDashoffset: 132 - (132 * percentCompleted) / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(35, 134, 54, 0.2)', color: '#39d353', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <div className="stat-number"><AnimatedCounter value={percentCompleted} />%</div>
                <div className="stat-label">Completed So Far</div>
              </motion.div>
            </RevealItem>

            <RevealItem>
              <motion.div {...HOVER_LIFT_VARIANT} className="stat-card">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <Clock size={24} />
                </div>
                <div className="stat-number"><AnimatedCounter value={40} /> hrs</div>
                <div className="stat-label">Est. Learning Time</div>
              </motion.div>
            </RevealItem>
          </RevealGroup>
        </section>

        {/* 3. LIVE INTERACTIVE CODE PLAYGROUND */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#39d353', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em', marginBottom: '0.4rem', background: 'rgba(35, 134, 54, 0.15)', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(35, 134, 54, 0.3)' }}>
              <Zap size={16} />
              <span>INTERACTIVE CODE PLAYGROUND</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              Try Python Live Right Here
            </h2>
          </div>

          <div
            className="section-card"
            style={{
              background: '#161b22',
              border: '1.5px solid var(--border-color)',
              borderRadius: '20px',
              padding: 0,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Header Tabs & Run Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0.75rem 1.25rem',
              background: '#0d1117',
              borderBottom: '1px solid #30363d',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <div className="traffic-dot" style={{ background: '#ff5f56' }} />
                  <div className="traffic-dot" style={{ background: '#ffbd2e' }} />
                  <div className="traffic-dot" style={{ background: '#27c93f' }} />
                </div>

                <div style={{ display: 'flex', gap: '0.3rem', marginLeft: '0.75rem' }}>
                  {PLAYGROUND_SNIPPETS.map((snip, idx) => (
                    <button
                      key={snip.id}
                      onClick={() => handleSnippetTabChange(idx)}
                      style={{
                        padding: '0.3rem 0.7rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                        border: 'none',
                        cursor: 'pointer',
                        background: activeSnippetIdx === idx ? '#21262d' : 'transparent',
                        color: activeSnippetIdx === idx ? 'var(--py-yellow)' : '#8b949e',
                        fontWeight: activeSnippetIdx === idx ? 700 : 500
                      }}
                    >
                      {snip.title}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={handleCopyCode}
                  title="Copy code to clipboard"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: copiedCode ? '#39d353' : '#8b949e',
                    padding: '0.4rem 0.65rem',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {copiedCode ? <CheckCheck size={13} /> : <Copy size={13} />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleResetCode}
                  title="Reset code to original snippet"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    color: '#8b949e',
                    padding: '0.4rem 0.65rem',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>

                <motion.button
                  {...BUTTON_HOVER_VARIANT}
                  onClick={handleRunPlaygroundCode}
                  disabled={isExecuting}
                  className="btn btn-yellow"
                  style={{
                    padding: '0.45rem 1.2rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 0 15px rgba(255, 212, 59, 0.35)'
                  }}
                >
                  {isExecuting ? (
                    <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )}
                  <span>{isExecuting ? 'Compiling...' : 'Run Code'}</span>
                </motion.button>
              </div>
            </div>

            {/* Editable Textarea Code Input */}
            <div style={{ padding: '1.25rem', background: '#090d16' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const start = e.target.selectionStart;
                      const end = e.target.selectionEnd;
                      const val = editableCode;
                      setEditableCode(val.substring(0, start) + '    ' + val.substring(end));
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 4;
                      }, 0);
                    }
                  }}
                  rows={8}
                  spellCheck="false"
                  autoCapitalize="off"
                  autoComplete="off"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f0f6fc',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.92rem',
                    lineHeight: '1.65',
                    resize: 'vertical',
                    tabSize: 4
                  }}
                  placeholder="Write any Python code here and click Run Code..."
                />
              </div>

              {/* Output Panel with Real Console Diagnostics */}
              <div style={{
                marginTop: '1.25rem',
                background: '#0a0e17',
                borderRadius: '12px',
                border: isOutputError ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(57, 211, 83, 0.3)',
                borderLeft: isOutputError ? '4px solid #ef4444' : '4px solid #39d353',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 1rem',
                  background: 'rgba(0,0,0,0.3)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b949e', fontSize: '0.78rem' }}>
                    <Terminal size={13} color={isOutputError ? '#ef4444' : '#39d353'} />
                    <span>Console Output &gt;&gt;</span>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '9999px',
                      background: isOutputError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(57, 211, 83, 0.15)',
                      color: isOutputError ? '#f87171' : '#4ade80',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOutputError ? '#ef4444' : '#22c55e' }} />
                      {compilerStatus || (isOutputError ? 'Error' : 'CPython 3.12 (WASM)')}
                    </span>
                  </div>

                  <button
                    onClick={() => setPlaygroundOutput('')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#8b949e',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      padding: '0.2rem 0.5rem'
                    }}
                  >
                    Clear
                  </button>
                </div>

                <div style={{
                  padding: '0.9rem 1.15rem',
                  color: isOutputError ? '#fca5a5' : '#4ade80',
                  fontWeight: '500',
                  whiteSpace: 'pre-wrap',
                  minHeight: '44px',
                  lineHeight: '1.6'
                }}>
                  {playgroundOutput || <span style={{ color: '#6e7681', fontStyle: 'italic' }}>Output is empty. Click "Run Code" above.</span>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. "TODAY'S FOCUS" SMART CARD */}
        <section style={{ marginBottom: '4rem' }}>
          <div
            className="section-card"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 212, 59, 0.15) 0%, rgba(48, 105, 152, 0.2) 100%)',
              border: '1.5px solid rgba(255, 212, 59, 0.35)',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--py-yellow)', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.05em', marginBottom: '0.5rem', background: 'rgba(255, 212, 59, 0.12)', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(255, 212, 59, 0.3)' }}>
                <Brain size={16} />
                <span>TODAY'S RECOMMENDED FOCUS</span>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {completedCount > 0 ? `Continue: ${nextTopic.title}` : `Start Your Journey: ${nextTopic.title}`}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
                Category: <strong style={{ color: 'var(--py-blue-light)' }}>{nextTopic.category}</strong> • Reference: {nextTopic.docRefTag || 'Python Docs'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <motion.button
                {...BUTTON_HOVER_VARIANT}
                className="btn btn-yellow"
                onClick={() => onSelectTopic(nextTopic.id)}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
              >
                <Code size={18} />
                <span>Open Lesson</span>
                <ArrowRight size={16} />
              </motion.button>

              <motion.button
                {...BUTTON_HOVER_VARIANT}
                className="btn btn-secondary"
                onClick={() => onNavigate('quizzes')}
                style={{ padding: '0.75rem 1.3rem', fontSize: '0.95rem' }}
              >
                <HelpCircle size={18} />
                <span>Take Quick Quiz</span>
              </motion.button>
            </div>
          </div>
        </section>

        {/* 5. ELEVATED QUESTION OF THE DAY */}
        <section style={{ marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="qotd-animated-border"
          >
            <div className="qotd-inner-content">
              <div className="qotd-header-badges" style={{ flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div className="qotd-header" style={{ margin: 0 }}>
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                      style={{ display: 'inline-flex' }}
                    >
                      <Sparkles size={18} color="var(--py-yellow)" />
                    </motion.div>
                    <span style={{ fontWeight: 800, letterSpacing: '0.05em' }}>QUESTION OF THE DAY</span>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    background: qotd.isLiveApi ? 'rgba(57, 211, 83, 0.15)' : 'rgba(48, 105, 152, 0.2)',
                    color: qotd.isLiveApi ? '#39d353' : 'var(--py-blue-light)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontWeight: 700
                  }}>
                    {qotd.isLiveApi ? '🌐 Live API' : '⚡ Daily Python Challenge'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div className="qotd-streak-badge">
                    <Flame size={14} />
                    <span>{streakCount || 1}-Day Streak</span>
                  </div>
                  <div className="qotd-timer-badge">
                    <Clock size={12} />
                    <span>New in: {qotdCountdown}</span>
                  </div>

                  <motion.button
                    {...BUTTON_HOVER_VARIANT}
                    onClick={handleRefreshQotd}
                    disabled={qotdLoading}
                    className="btn btn-secondary"
                    title="Fetch a new dynamic challenge from the API"
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={13} style={{ animation: qotdLoading ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{qotdLoading ? 'Loading API...' : 'New Challenge'}</span>
                  </motion.button>
                </div>
              </div>

              {qotdLoading ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ display: 'inline-block', marginBottom: '0.75rem' }}
                  >
                    <RefreshCw size={24} color="var(--py-yellow)" />
                  </motion.div>
                  <p style={{ fontSize: '0.95rem' }}>Fetching dynamic challenge from Computer Science API...</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0' }}>
                    <span className="badge badge-basics" style={{ fontSize: '0.75rem' }}>{qotd.topicCategory || 'PYTHON CORE'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Difficulty: {qotd.difficulty || 'MEDIUM'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {qotd.question}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    {qotd.options.map((opt, idx) => {
                      let optionState = "idle";
                      if (qotdShowAnswer) {
                        if (idx === qotd.correct) optionState = "correct";
                        else if (idx === qotdSelected) optionState = "wrong";
                      }

                      return (
                        <QuizOption
                          key={idx}
                          label={opt}
                          state={optionState}
                          disabled={qotdShowAnswer}
                          onClick={() => handleSelectQotdOption(idx)}
                        />
                      );
                    })}
                  </div>

                  {qotdShowAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        background: 'rgba(35, 134, 54, 0.15)',
                        borderLeft: '4px solid #39d353',
                        padding: '1.1rem 1.35rem',
                        borderRadius: '10px',
                        fontSize: '0.92rem',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <strong style={{ color: '#39d353' }}>Explanation:</strong> {qotd.explanation}
                      </div>

                      <button
                        onClick={handleRefreshQotd}
                        className="btn btn-yellow"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <RefreshCw size={13} />
                        <span>Try Next Challenge →</span>
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* 6. RECENT ACTIVITY / CONTINUE WHERE YOU LEFT OFF */}
        {recentTopicsList.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Recently Viewed Lessons
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Quickly jump back into the topics you last studied.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {recentTopicsList.map((topic) => (
                <motion.div
                  key={topic.id}
                  {...HOVER_LIFT_VARIANT}
                  onClick={() => onSelectTopic(topic.id)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-basics">{topic.category}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{topic.docRefTag || 'Docs'}</span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      {topic.title}
                    </h4>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--py-blue-light)', fontWeight: 700 }}>
                    <span>Resume Lesson</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 7. REBUILT FEATURE CARDS SHOWCASE (2x2 GRID) */}
        <section style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--py-yellow)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em', marginBottom: '0.5rem', background: 'rgba(232, 185, 35, 0.12)', padding: '0.3rem 0.85rem', borderRadius: '9999px', border: '1px solid rgba(232, 185, 35, 0.3)' }}>
              <Sparkles size={16} color="var(--py-yellow)" />
              <span>PLATFORM CORE FEATURES</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Everything You Need to Master Python
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '620px', margin: '0 auto' }}>
              A complete ecosystem designed for visual learning, hands-on WASM execution, and structured preparation.
            </p>
          </div>

          <RevealGroup className="feature-showcase-grid">
            {/* Card 1: Skill-Tree Roadmap */}
            <RevealItem>
              <motion.div
                onClick={() => onNavigate('roadmap')}
                className="feature-glass-card feature-card-glow-blue"
                style={{ cursor: 'pointer' }}
              >
                {/* Abstract Line Art SVG Background */}
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 100 100"
                  style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.08, pointerEvents: 'none' }}
                >
                  <path d="M 10 20 Q 30 80 80 90" stroke="var(--py-blue-light)" strokeWidth="3" fill="none" strokeDasharray="4 4" />
                  <circle cx="10" cy="20" r="5" fill="var(--py-blue-light)" />
                  <circle cx="45" cy="53" r="5" fill="var(--py-blue-light)" />
                  <circle cx="80" cy="90" r="6" fill="var(--py-blue-light)" />
                </svg>

                <div>
                  <div className="feature-icon-glass-circle" style={{ background: 'rgba(75, 139, 190, 0.2)', border: '1px solid rgba(75, 139, 190, 0.35)', color: 'var(--py-blue-light)' }}>
                    <Map size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                    Skill-Tree Roadmap
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Visual step-by-step learning path across 5 level categories from Basics to Advanced System Engineering.
                  </p>
                </div>

                {/* Circular Metric Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--py-blue-light)' }}>
                    Roadmap Progress
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{percentCompleted}%</span>
                    <svg width="28" height="28" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="14" cy="14" r="10" stroke="rgba(75, 139, 190, 0.2)" strokeWidth="3" fill="transparent" />
                      <circle
                        cx="14"
                        cy="14"
                        r="10"
                        stroke="var(--py-blue-light)"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={62.8}
                        strokeDashoffset={62.8 - (62.8 * percentCompleted) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </RevealItem>

            {/* Card 2: Topic Quizzes */}
            <RevealItem>
              <motion.div
                onClick={() => onNavigate('quizzes')}
                className="feature-glass-card feature-card-glow-amber"
                style={{ cursor: 'pointer' }}
              >
                {/* Abstract Question Line Art SVG */}
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 100 100"
                  style={{ position: 'absolute', right: '-15px', top: '-15px', opacity: 0.08, pointerEvents: 'none' }}
                >
                  <text x="30" y="70" fontSize="70" fontWeight="900" fill="var(--py-yellow)" fontFamily="sans-serif">?</text>
                  <circle cx="75" cy="30" r="12" stroke="var(--py-yellow)" strokeWidth="2" fill="none" />
                </svg>

                <div>
                  <div className="feature-icon-glass-circle" style={{ background: 'rgba(232, 185, 35, 0.2)', border: '1px solid rgba(232, 185, 35, 0.35)', color: 'var(--py-yellow)' }}>
                    <HelpCircle size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                    Topic Quizzes
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Test your understanding with topic-wise multiple choice questions and 10-question full practice assessments.
                  </p>
                </div>

                {/* Circular Metric Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--py-yellow)' }}>
                    Quiz Avg Score
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{quizAvgScore}%</span>
                    <svg width="28" height="28" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="14" cy="14" r="10" stroke="rgba(232, 185, 35, 0.2)" strokeWidth="3" fill="transparent" />
                      <circle
                        cx="14"
                        cy="14"
                        r="10"
                        stroke="var(--py-yellow)"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={62.8}
                        strokeDashoffset={62.8 - (62.8 * quizAvgScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </RevealItem>

            {/* Card 3: Personal Dashboard */}
            <RevealItem>
              <motion.div
                onClick={() => onNavigate('dashboard')}
                className="feature-glass-card feature-card-glow-green"
                style={{ cursor: 'pointer' }}
              >
                {/* Abstract Bar Chart SVG */}
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 100 100"
                  style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.08, pointerEvents: 'none' }}
                >
                  <rect x="20" y="50" width="14" height="40" rx="3" fill="#39d353" />
                  <rect x="42" y="35" width="14" height="55" rx="3" fill="#39d353" />
                  <rect x="64" y="20" width="14" height="70" rx="3" fill="#39d353" />
                </svg>

                <div>
                  <div className="feature-icon-glass-circle" style={{ background: 'rgba(35, 134, 54, 0.2)', border: '1px solid rgba(35, 134, 54, 0.35)', color: '#39d353' }}>
                    <Award size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                    Personal Dashboard
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Track completion %, 52-week activity heatmap, skill radar chart, and generate official certificate.
                  </p>
                </div>

                {/* Circular Metric Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#39d353' }}>
                    Analytics & Heatmap
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Active</span>
                    <svg width="28" height="28" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="14" cy="14" r="10" stroke="rgba(35, 134, 54, 0.2)" strokeWidth="3" fill="transparent" />
                      <circle
                        cx="14"
                        cy="14"
                        r="10"
                        stroke="#39d353"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={62.8}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </RevealItem>

            {/* Card 4: Curated Resources & Ecosystem */}
            <RevealItem>
              <motion.div
                onClick={() => onNavigate('resources')}
                className="feature-glass-card feature-card-glow-purple"
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <div className="feature-icon-glass-circle" style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.35)', color: '#c084fc' }}>
                    <Compass size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                    Curated Resources & Ecosystem
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Authoritative documentation, developer tooling, practice platforms, and books for professional Python developers.
                  </p>
                </div>

                {/* Metric Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c084fc' }}>
                    Essential Tooling
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>Explore</span>
                    <ArrowRight size={15} style={{ color: '#c084fc' }} />
                  </div>
                </div>
              </motion.div>
            </RevealItem>
          </RevealGroup>
        </section>

        {/* 8. FOOTER CTA BAND */}
        <section>
          <div
            className="section-card"
            style={{
              background: 'linear-gradient(135deg, rgba(48, 105, 152, 0.3) 0%, rgba(255, 212, 59, 0.2) 100%)',
              border: '1.5px solid var(--py-blue-light)',
              borderRadius: '24px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Ready to level up your Python skills?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.75rem' }}>
              Join thousands of developers mastering Python with visual roadmaps, interactive WASM sandboxes, and daily preparation tracking.
            </p>

            <motion.button
              {...BUTTON_HOVER_VARIANT}
              className="btn btn-yellow btn-shimmer-wrap"
              onClick={() => onNavigate('learn')}
              style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              <Rocket size={20} />
              <span>Start Free Learning Now</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
}
