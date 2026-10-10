import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Code,
  Code2,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  AlertTriangle,
  Star,
  Check,
  Zap,
  Layers,
  ArrowRight,
  Cpu,
  GitCompare,
  FileCheck,
  GraduationCap,
  ListTodo,
  Terminal,
  Play,
  Globe,
  Copy,
  Clock,
  Circle,
  XCircle,
  Share2,
  Compass,
  FileCode,
  Maximize2
} from 'lucide-react';
import { celebrate } from '../utils/celebrate';
import PythonPlayground from './PythonPlayground';
import VisualDiagram from './VisualDiagram';
import Breadcrumbs from './Breadcrumbs';
import PyCosmosLogo from './PyCosmosLogo';

/**
 * Modern macOS style Code Snippet Studio with Line Numbers & 1-click Copy
 */
function CodeSnippetBlock({ title, code, language = 'python' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code ? code.split('\n') : [];

  return (
    <div className="py-code-studio-frame">
      <div className="py-code-studio-bar">
        <div className="studio-window-controls">
          <span className="dot dot-close" />
          <span className="dot dot-min" />
          <span className="dot dot-max" />
          <span className="studio-filename-tag">{title || 'example.py'}</span>
        </div>

        <div className="studio-bar-actions">
          <span className="studio-lang-badge">{language}</span>
          <button
            type="button"
            onClick={handleCopy}
            className={`py-copy-btn ${copied ? 'copied' : ''}`}
            title="Copy code to clipboard"
          >
            {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="py-code-body-wrapper">
        <div className="py-code-gutter" aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i} className="gutter-line-num">{i + 1}</span>
          ))}
        </div>
        <pre className="py-code-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Parse structured step-by-step execution text into visual interactive pipeline steps
 */
function parseExecutionPipeline(text) {
  if (!text) return { intro: '', steps: [] };
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const introLines = [];
  const steps = [];

  lines.forEach((line) => {
    const match = line.match(/^(\d+)\.\s*([^:]+):\s*(.+)$/);
    if (match) {
      steps.push({
        num: match[1],
        title: match[2].trim(),
        desc: match[3].trim()
      });
    } else {
      const simpleMatch = line.match(/^(\d+)\.\s*(.+)$/);
      if (simpleMatch) {
        steps.push({
          num: simpleMatch[1],
          title: `Stage ${simpleMatch[1]}`,
          desc: simpleMatch[2].trim()
        });
      } else {
        introLines.push(line);
      }
    }
  });

  return {
    intro: introLines.join(' '),
    steps: steps.length > 0 ? steps : null,
    raw: text
  };
}

function getDiagramTypeForTopic(topicId) {
  if (!topicId) return 'cpython-pipeline';
  const id = topicId.toLowerCase();
  if (id.includes('setup') || id.includes('fundament') || id.includes('internals') || id.includes('bytecode') || id.includes('repl')) {
    return 'cpython-pipeline';
  }
  if (id.includes('variable') || id.includes('memory') || id.includes('pointer') || id.includes('number') || id.includes('data-type')) {
    return 'memory-references';
  }
  if (id.includes('scope') || id.includes('function') || id.includes('closure') || id.includes('lambda')) {
    return 'legb-scope';
  }
  if (id.includes('oop') || id.includes('class') || id.includes('inherit') || id.includes('mro') || id.includes('method')) {
    return 'oop-inheritance';
  }
  return 'cpython-pipeline';
}

export default function TopicDetail({
  topic,
  isCompleted,
  onToggleComplete,
  isBookmarked,
  onToggleBookmark,
  onNavigateToQuiz,
  onNavigateToTopic,
  topicsList = [],
  onShowToast,
  subtopicStatusMap = {},
  onToggleSubtopicStatus
}) {
  const [activeSyntaxTab, setActiveSyntaxTab] = useState('syntax'); // 'syntax' | 'basic'
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [activeStepHover, setActiveStepHover] = useState(null);

  if (!topic) {
    return (
      <div className="topic-detail-empty">
        <PyCosmosLogo size={48} animated={true} />
        <h3>Select a Curriculum Topic</h3>
        <p>Choose any of the 51 Python modules from the sidebar to explore in-depth concepts, diagrams, and runnable code.</p>
      </div>
    );
  }

  const currentIndex = topicsList.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? topicsList[currentIndex - 1] : null;
  const nextTopic = currentIndex < topicsList.length - 1 ? topicsList[currentIndex + 1] : null;

  const handleMarkComplete = () => {
    if (!isCompleted) {
      celebrate();
    }
    onToggleComplete(topic.id);
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

  const getSubtopicStatusIcon = (subId) => {
    const s = subtopicStatusMap[subId] || 'not_started';
    if (s === 'completed') return { status: 'completed', label: 'Completed', Icon: CheckCircle2 };
    if (s === 'learning') return { status: 'learning', label: 'Learning', Icon: Clock };
    return { status: 'not_started', label: 'Not started', Icon: Circle };
  };

  const pipelineData = parseExecutionPipeline(topic.stepByStepExecution);
  const diagramType = getDiagramTypeForTopic(topic.id);

  return (
    <motion.div
      key={topic.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="topic-detail-main"
    >
      {/* ── TOP NAVIGATION & BREADCRUMBS BAR ── */}
      <div className="topic-top-navigation">
        <Breadcrumbs
          items={[
            { label: 'Curriculum', onClick: () => {} },
            { label: topic.category, onClick: () => {} },
            { label: topic.title }
          ]}
          onNavigate={() => {}}
        />

        <div className="prev-next-bar">
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.96 }}
            className="nav-arrow-btn"
            disabled={!prevTopic}
            onClick={() => prevTopic && onNavigateToTopic(prevTopic.id)}
            title={prevTopic ? prevTopic.title : 'First topic'}
          >
            <ChevronLeft size={16} />
            <span>Prev: {prevTopic ? prevTopic.title.slice(0, 20) + '...' : 'None'}</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.96 }}
            className="nav-arrow-btn"
            disabled={!nextTopic}
            onClick={() => nextTopic && onNavigateToTopic(nextTopic.id)}
            title={nextTopic ? nextTopic.title : 'Last topic'}
          >
            <span>Next: {nextTopic ? nextTopic.title.slice(0, 20) + '...' : 'None'}</span>
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* ── HERO BANNER: BESPOKE PYTHON BRAND DECK ── */}
      <div className="py-topic-hero-card">
        {/* Top Badges Ribbon */}
        <div className="py-topic-meta-ribbon">
          <span className="py-meta-badge py-category-badge">
            <BookOpen size={13} color="var(--py-blue-light)" />
            <span>{topic.category || 'Foundation'}</span>
          </span>

          <span className="py-meta-badge py-level-badge">
            <Zap size={13} color="var(--py-yellow)" />
            <span>{topic.level || 'Beginner'}</span>
          </span>

          {topic.stars && (
            <span className="py-meta-badge py-core-badge" title="Core Frequently Used Concept">
              <Star size={12} fill="var(--py-yellow)" color="var(--py-yellow)" />
              <span>Core Concept</span>
            </span>
          )}

          <span className="py-meta-badge py-doc-badge">
            <FileCode size={12} />
            <span>{topic.docRefTag || 'Python 3 Docs'}</span>
          </span>
        </div>

        {/* Title & Summary Lead */}
        <div className="py-hero-title-row">
          <div className="py-hero-emblem-box">
            <PyCosmosLogo size={36} animated={true} />
          </div>
          <div>
            <h1 className="py-topic-headline">{topic.title}</h1>
            <p className="py-topic-summary">{topic.summary}</p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="py-hero-actions-bar">
          <div className="actions-left-group">
            <a
              href={topic.docUrl || 'https://docs.python.org/3/'}
              target="_blank"
              rel="noopener noreferrer"
              className="py-btn-secondary doc-link"
            >
              <ExternalLink size={15} />
              <span>Official Python Docs</span>
            </a>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-btn-secondary bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}`}
              onClick={() => onToggleBookmark(topic.id)}
            >
              <Bookmark
                size={15}
                style={{
                  color: isBookmarked ? 'var(--py-yellow)' : undefined,
                  fill: isBookmarked ? 'var(--py-yellow)' : 'none'
                }}
              />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </motion.button>
          </div>

          <div className="actions-right-group">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`py-master-btn ${isCompleted ? 'is-completed' : ''}`}
              onClick={handleMarkComplete}
            >
              <CheckCircle2 size={17} />
              <span>{isCompleted ? 'Topic Mastered ✓' : 'Mark Topic Mastered'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── STICKY SECTION JUMP NAVIGATION BAR ── */}
      <div className="py-section-jump-nav-bar">
        <span className="jump-nav-label">SECTIONS:</span>
        <div className="jump-nav-links">
          <a href="#sec-overview" className="py-jump-pill">1-2. Overview</a>
          <a href="#sec-syntax" className="py-jump-pill">3-4. Syntax & Demo</a>
          <a href="#sec-execution" className="py-jump-pill highlight-pill">5. CPython Pipeline & Diagram</a>
          <a href="#sec-examples" className="py-jump-pill">6. Code Studio</a>
          <a href="#sec-mistakes" className="py-jump-pill">7. Gotchas Lab</a>
          <a href="#sec-differences" className="py-jump-pill">8. Comparisons</a>
          <a href="#sec-realworld" className="py-jump-pill">9. Industry Blueprints</a>
          <a href="#sec-interview" className="py-jump-pill">10. Interview Q&A</a>
          <a href="#sec-subtopics" className="py-jump-pill">Checklist</a>
          <a href="#sec-sandbox" className="py-jump-pill">Sandbox</a>
          <a href="#sec-quiz" className="py-jump-pill">11. Practice Quiz</a>
          <a href="#sec-revision" className="py-jump-pill">12. Revision</a>
        </div>
      </div>

      {/* ── MODULE 1: ARCHITECTURAL OVERVIEW & DESIGN RATIONALE (Sections 1 & 2) ── */}
      <div id="sec-overview" className="py-module-card">
        <div className="py-module-header">
          <div className="py-module-badge-icon">
            <Lightbulb size={18} color="var(--py-yellow)" />
          </div>
          <div>
            <h3 className="py-module-title">1. What is it? & 2. Why does it exist?</h3>
            <span className="py-module-subtitle">Foundational concept, mechanical definition, and engineering rationale</span>
          </div>
        </div>

        <div className="py-overview-dual-grid">
          {/* Card A: What is it? */}
          <div className="py-overview-box def-box">
            <div className="overview-box-header">
              <span className="box-tag blue-tag">CORE DEFINITION</span>
            </div>
            <h4 className="overview-box-title">What is it?</h4>
            <p className="overview-box-text">{topic.whatIsIt}</p>
          </div>

          {/* Card B: Why does it exist? */}
          <div className="py-overview-box rationale-box">
            <div className="overview-box-header">
              <span className="box-tag yellow-tag">ENGINEERING RATIONALE</span>
            </div>
            <h4 className="overview-box-title">Why does it exist?</h4>
            <p className="overview-box-text">{topic.whyDoesItExist}</p>
          </div>
        </div>
      </div>

      {/* ── MODULE 2: SYNTAX SPECIFICATION & BASIC DEMO (Sections 3 & 4) ── */}
      <div id="sec-syntax" className="py-module-card">
        <div className="py-module-header">
          <div className="py-module-badge-icon">
            <Code size={18} color="var(--py-blue-light)" />
          </div>
          <div>
            <h3 className="py-module-title">3. Formal Syntax & 4. Runnable Demonstration</h3>
            <span className="py-module-subtitle">Formal grammar pattern Demarcation & minimal executable example</span>
          </div>
        </div>

        <div className="py-syntax-switcher-bar">
          <button
            type="button"
            className={`py-tab-btn ${activeSyntaxTab === 'syntax' ? 'active' : ''}`}
            onClick={() => setActiveSyntaxTab('syntax')}
          >
            <Code2 size={14} />
            <span>Formal Syntax Specification</span>
          </button>
          <button
            type="button"
            className={`py-tab-btn ${activeSyntaxTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveSyntaxTab('basic')}
          >
            <Play size={14} />
            <span>Runnable Starter Demonstration</span>
          </button>
        </div>

        <div className="py-syntax-content-area">
          {activeSyntaxTab === 'syntax' && topic.syntax && (
            <CodeSnippetBlock title="syntax_specification.py" code={topic.syntax} />
          )}

          {activeSyntaxTab === 'basic' && topic.basicExample && (
            <CodeSnippetBlock title="starter_example.py" code={topic.basicExample} />
          )}
        </div>
      </div>

      {/* ── MODULE 3: UNDER THE HOOD: CPYTHON EXECUTION & VISUAL DIAGRAM (Section 5) ── */}
      <div id="sec-execution" className="py-module-card py-internals-hero-card">
        <div className="py-module-header">
          <div className="py-module-badge-icon">
            <Cpu size={18} color="var(--py-yellow)" />
          </div>
          <div>
            <h3 className="py-module-title">5. Step-by-Step Execution (CPython Internals & Diagram)</h3>
            <span className="py-module-subtitle">Under the hood: tokens, AST parsing, bytecode opcodes, and virtual machine stack</span>
          </div>
        </div>

        {/* INTRO TERMINAL BAR */}
        {pipelineData.intro && (
          <div className="py-pipeline-intro-bar">
            <Terminal size={14} color="var(--py-yellow)" />
            <span className="pipeline-intro-text">{pipelineData.intro}</span>
          </div>
        )}

        {/* INTERACTIVE PIPELINE STEPS CARDS */}
        {pipelineData.steps && pipelineData.steps.length > 0 ? (
          <div className="py-pipeline-steps-grid">
            {pipelineData.steps.map((st, idx) => {
              const isHovered = activeStepHover === idx;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3, scale: 1.01 }}
                  onMouseEnter={() => setActiveStepHover(idx)}
                  onMouseLeave={() => setActiveStepHover(null)}
                  className={`py-pipeline-step-card ${isHovered ? 'hovered' : ''}`}
                >
                  <div className="pipeline-step-top">
                    <span className="pipeline-phase-badge">Phase 0{st.num}</span>
                    <span className="pipeline-dot-indicator" />
                  </div>
                  <h4 className="pipeline-step-title">{st.title}</h4>
                  <p className="pipeline-step-desc">{st.desc}</p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-raw-internals-box">
            <pre>{topic.stepByStepExecution}</pre>
          </div>
        )}

        {/* VISUAL ARCHITECTURAL DIAGRAM INFOGRAPHIC */}
        <div className="py-diagram-embed-section">
          <VisualDiagram diagramType={diagramType} />
        </div>
      </div>

      {/* ── MODULE 4: MULTI-TIER PRACTICAL CODE EXAMPLES (Section 6) ── */}
      {topic.multipleExamples && topic.multipleExamples.length > 0 && (
        <div id="sec-examples" className="py-module-card">
          <div className="py-module-header">
            <div className="py-module-badge-icon">
              <Layers size={18} color="var(--py-blue-light)" />
            </div>
            <div>
              <h3 className="py-module-title">6. Graduated Code Studio (Simple → Intermediate → Tricky)</h3>
              <span className="py-module-subtitle">Progression from beginner execution to real-world production edge cases</span>
            </div>
          </div>

          {/* TIER TABS SWITCHER */}
          <div className="py-example-tier-tabs">
            {topic.multipleExamples.map((ex, idx) => {
              const isSelected = activeExampleIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveExampleIndex(idx)}
                  className={`py-tier-tab-btn ${isSelected ? 'active' : ''}`}
                >
                  <span className="tier-tab-icon">
                    {ex.level === 'Simple' ? '⚡' : ex.level === 'Intermediate' ? '⚙️' : '🔮'}
                  </span>
                  <span className="tier-tab-label">{ex.level}</span>
                  <span className="tier-tab-title">({ex.title.slice(0, 24)}...)</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE EXAMPLE DISPLAY */}
          {(() => {
            const ex = topic.multipleExamples[activeExampleIndex] || topic.multipleExamples[0];
            return (
              <div className="py-active-example-view">
                <div className="active-example-meta">
                  <span className="active-tier-pill">{ex.level} Demonstration</span>
                  <h4 className="active-example-heading">{ex.title}</h4>
                </div>

                <CodeSnippetBlock title={`${ex.level.toLowerCase()}_example.py`} code={ex.code} />

                <div className="py-example-explanation-card">
                  <Lightbulb size={16} color="var(--py-yellow)" />
                  <div>
                    <strong style={{ color: 'var(--py-yellow)' }}>Engineering Explanation: </strong>
                    <span>{ex.explanation}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── MODULE 5: COMMON MISTAKES & GOTCHAS LAB (Section 7) ── */}
      {topic.commonMistakes && topic.commonMistakes.length > 0 && (
        <div id="sec-mistakes" className="py-module-card py-gotchas-card">
          <div className="py-module-header">
            <div className="py-module-badge-icon">
              <AlertTriangle size={18} color="var(--py-yellow)" />
            </div>
            <div>
              <h3 className="py-module-title">7. Common Mistakes & Gotchas (Why it Fails)</h3>
              <span className="py-module-subtitle">Understand the mechanical cause rather than just memorizing rules</span>
            </div>
          </div>

          <div className="py-mistakes-grid">
            {topic.commonMistakes.map((m, i) => (
              <div key={i} className="py-mistake-box">
                <h4 className="py-mistake-title">
                  <AlertTriangle size={15} color="var(--py-yellow)" />
                  <span>{m.title}</span>
                </h4>

                <div className="py-split-code-deck">
                  {/* Problematic */}
                  <div className="py-split-col wrong-col">
                    <div className="split-label-row wrong-label">
                      <XCircle size={13} color="#f43f5e" />
                      <span>Problematic Anti-pattern:</span>
                    </div>
                    <pre className="py-split-pre"><code>{m.wrongCode}</code></pre>
                  </div>

                  {/* Correct */}
                  <div className="py-split-col correct-col">
                    <div className="split-label-row correct-label">
                      <CheckCircle2 size={13} color="#22c55e" />
                      <span>Recommended Idiomatic Fix:</span>
                    </div>
                    <pre className="py-split-pre"><code>{m.correctCode}</code></pre>
                  </div>
                </div>

                {/* Mechanical Root Cause */}
                <div className="py-why-fails-callout">
                  <strong style={{ color: 'var(--py-yellow)' }}>Mechanical Cause: </strong>
                  <span>{m.whyItFails}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODULE 6: HEAD-TO-HEAD COMPARISONS (Section 8) ── */}
      {topic.importantDifferences && topic.importantDifferences.length > 0 && (
        <div id="sec-differences" className="py-module-card">
          <div className="py-module-header">
            <div className="py-module-badge-icon">
              <GitCompare size={18} color="var(--py-blue-light)" />
            </div>
            <div>
              <h3 className="py-module-title">8. Important Differences & Head-to-Head Comparisons</h3>
              <span className="py-module-subtitle">Rigorous contrast cards for frequently confused architectural mechanisms</span>
            </div>
          </div>

          <div className="py-diff-cards-grid">
            {topic.importantDifferences.map((diff, i) => (
              <div key={i} className="py-diff-card">
                <div className="py-diff-items-header">
                  <span className="diff-pill pill-a">{diff.itemA}</span>
                  <span className="diff-versus-text">VS</span>
                  <span className="diff-pill pill-b">{diff.itemB}</span>
                </div>

                <h4 className="py-diff-title">{diff.title}</h4>

                <ul className="py-diff-points">
                  {diff.comparison.map((point, j) => (
                    <li key={j}>
                      <span className="diff-bullet-marker" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODULE 7: REAL-WORLD & INDUSTRY USE (Section 9) ── */}
      {topic.realWorldUse && (
        <div id="sec-realworld" className="py-module-card">
          <div className="py-module-header">
            <div className="py-module-badge-icon">
              <Sparkles size={18} color="var(--py-yellow)" />
            </div>
            <div>
              <h3 className="py-module-title">9. Real-World & Production Industry Application</h3>
              <span className="py-module-subtitle">Where you encounter this in distributed backends, AI pipelines, and tooling</span>
            </div>
          </div>

          <div className="py-industry-blueprint-box">
            <div className="blueprint-tags-row">
              <span className="blueprint-tag">Backend Systems</span>
              <span className="blueprint-tag">AI/ML Workflows</span>
              <span className="blueprint-tag">Distributed Microservices</span>
            </div>
            <p className="blueprint-body-text">{topic.realWorldUse}</p>
          </div>
        </div>
      )}

      {/* ── MODULE 8: SENIOR INTERVIEW PERSPECTIVE & TRAPS (Section 10) ── */}
      {topic.interviewPerspective && topic.interviewPerspective.length > 0 && (
        <div id="sec-interview" className="py-module-card">
          <div className="py-module-header">
            <div className="py-module-badge-icon">
              <GraduationCap size={18} color="var(--py-yellow)" />
            </div>
            <div>
              <h3 className="py-module-title">10. Senior Interview Perspective & Candidate Traps</h3>
              <span className="py-module-subtitle">Top technical screening questions and expected depth of architectural understanding</span>
            </div>
          </div>

          <div className="py-interview-list">
            {topic.interviewPerspective.map((qa, i) => (
              <div key={i} className="py-interview-card">
                <div className="interview-q-header">
                  <span className="interview-q-badge">Question 0{i + 1}</span>
                  <h4 className="interview-q-title">Q: {qa.question}</h4>
                </div>

                {qa.trap && (
                  <div className="interview-trap-box">
                    <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: '#f59e0b' }}>Candidate Trap: </strong>
                      <span>{qa.trap}</span>
                    </div>
                  </div>
                )}

                <div className="interview-ans-box">
                  <strong style={{ color: 'var(--py-blue-light)' }}>Expected Staff-Level Answer: </strong>
                  <p>{qa.expectedAnswer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODULE 9: INTERACTIVE SUBTOPICS CHECKLIST ── */}
      {topic.subtopics && topic.subtopics.length > 0 && (
        <div id="sec-subtopics" className="py-module-card">
          <div className="py-module-header">
            <div className="py-module-badge-icon">
              <ListTodo size={18} color="var(--py-blue-light)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 className="py-module-title">Granular Subtopics Mastery Tracker</h3>
                <span className="py-subtopic-counter">
                  {topic.subtopics.filter((s) => subtopicStatusMap[s.id] === 'completed').length} / {topic.subtopics.length} Mastered
                </span>
              </div>
              <span className="py-module-subtitle">Click any subtopic to cycle: Not Started → Learning → Mastered</span>
            </div>
          </div>

          <div className="py-subtopics-interactive-deck">
            {topic.subtopics.map((sub) => {
              const sObj = getSubtopicStatusIcon(sub.id);
              const IconComponent = sObj.Icon || Circle;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleCycleSubtopic(sub.id)}
                  className={`py-subtopic-chip status-${subtopicStatusMap[sub.id] || 'not_started'}`}
                  title="Click to cycle status"
                >
                  <IconComponent size={14} className="subtopic-icon" />
                  <span className="subtopic-title">{sub.text}</span>
                  {sub.isStarred && <Star size={11} fill="var(--py-yellow)" color="var(--py-yellow)" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODULE 10: INTERACTIVE PYTHON SANDBOX ── */}
      <div id="sec-sandbox" className="py-module-card">
        <div className="py-module-header">
          <div className="py-module-badge-icon">
            <Terminal size={18} color="var(--py-yellow)" />
          </div>
          <div>
            <h3 className="py-module-title">Interactive Python Sandbox</h3>
            <span className="py-module-subtitle">Experiment, modify code, and evaluate outputs directly in your browser</span>
          </div>
        </div>

        <PythonPlayground initialCode={topic.starterCode} onShowToast={onShowToast} />
      </div>

      {/* ── MODULE 11: PRACTICE QUESTIONS & MASTERY ASSESSMENT (Section 11) ── */}
      <div id="sec-quiz" className="py-quiz-assessment-card">
        <div className="quiz-assessment-left">
          <div className="quiz-assessment-badge-icon">
            <HelpCircle size={28} color="var(--py-yellow)" />
          </div>
          <div>
            <h3 className="quiz-assessment-title">11. Practice Questions & Mastery Assessment</h3>
            <p className="quiz-assessment-desc">
              Validate your understanding of {topic.title} with challenge quizzes or pull fresh questions live from free online APIs.
            </p>
          </div>
        </div>

        <div className="quiz-assessment-actions">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="py-btn-yellow-glow"
            onClick={() => onNavigateToQuiz(topic.id, 'topic')}
          >
            <HelpCircle size={16} />
            <span>Curriculum Quiz</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="py-btn-blue-glow"
            onClick={() => onNavigateToQuiz(topic.id, 'live_api')}
          >
            <Globe size={16} />
            <span>Live API Questions</span>
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* ── MODULE 12: HIGH-YIELD REVISION SHEET (Section 12) ── */}
      {topic.revisionSheet && topic.revisionSheet.length > 0 && (
        <div id="sec-revision" className="py-module-card py-revision-card">
          <div className="py-module-header">
            <div className="py-module-badge-icon">
              <FileCheck size={18} color="var(--py-blue-light)" />
            </div>
            <div>
              <h3 className="py-module-title">12. High-Yield 60-Second Revision Sheet</h3>
              <span className="py-module-subtitle">Fast takeaways and essential architectural rules for quick review</span>
            </div>
          </div>

          <div className="py-revision-checklist">
            {topic.revisionSheet.map((item, idx) => (
              <div key={idx} className="py-revision-item">
                <div className="py-revision-bullet">
                  <Check size={13} color="var(--py-yellow)" />
                </div>
                <span className="py-revision-text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOTTOM PREV / NEXT NAVIGATION ── */}
      <div className="py-bottom-nav-bar">
        <motion.button
          type="button"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.96 }}
          className="nav-arrow-btn"
          disabled={!prevTopic}
          onClick={() => prevTopic && onNavigateToTopic(prevTopic.id)}
        >
          <ChevronLeft size={16} />
          <span>Previous: {prevTopic ? prevTopic.title : 'None'}</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.96 }}
          className="nav-arrow-btn"
          disabled={!nextTopic}
          onClick={() => nextTopic && onNavigateToTopic(nextTopic.id)}
        >
          <span>Next: {nextTopic ? nextTopic.title : 'None'}</span>
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
