import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Code,
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
  XCircle
} from 'lucide-react';
import { celebrate } from '../utils/celebrate';
import PythonPlayground from './PythonPlayground';
import VisualDiagram from './VisualDiagram';
import Breadcrumbs from './Breadcrumbs';

/**
 * Reusable Code Snippet Block with macOS traffic dots and 1-click Copy feedback
 */
function CodeSnippetBlock({ title, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-example-block" style={{ marginTop: '0.85rem' }}>
      <div className="example-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <div className="traffic-dot" style={{ background: '#ff5f56', width: '9px', height: '9px' }} />
            <div className="traffic-dot" style={{ background: '#ffbd2e', width: '9px', height: '9px' }} />
            <div className="traffic-dot" style={{ background: '#27c93f', width: '9px', height: '9px' }} />
          </div>
          <span className="example-title" style={{ marginLeft: '0.35rem' }}>{title}</span>
        </div>

        <button
          onClick={handleCopy}
          className="code-copy-btn"
          title="Copy code to clipboard"
          style={{
            background: 'transparent',
            border: 'none',
            color: copied ? '#22c55e' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            transition: 'color 0.2s ease'
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre style={{ margin: 0 }}><code>{code}</code></pre>
    </div>
  );
}

export default function TopicDetail({
  topic,
  isCompleted,
  onToggleComplete,
  isBookmarked,
  onToggleBookmark,
  onNavigateToQuiz,
  onNavigateToTopic,
  topicsList,
  onShowToast,
  subtopicStatusMap = {},
  onToggleSubtopicStatus
}) {
  if (!topic) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Select a topic to start learning!</div>;
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

  // Subtopic status cycle: 'not_started' -> 'learning' -> 'completed' -> 'not_started'
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

  return (
    <motion.div
      key={topic.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="topic-detail-main"
    >
      {/* TOP NAVIGATION & BREADCRUMBS */}
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
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.96 }}
            className="nav-arrow-btn"
            disabled={!prevTopic}
            onClick={() => prevTopic && onNavigateToTopic(prevTopic.id)}
          >
            <ChevronLeft size={16} />
            <span>Prev: {prevTopic ? prevTopic.title.slice(0, 22) + '...' : 'None'}</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.96 }}
            className="nav-arrow-btn"
            disabled={!nextTopic}
            onClick={() => nextTopic && onNavigateToTopic(nextTopic.id)}
          >
            <span>Next: {nextTopic ? nextTopic.title.slice(0, 22) + '...' : 'None'}</span>
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* TOPIC BANNER CARD */}
      <div className="topic-banner-card">
        <div className="topic-meta-chips">
          <span className="meta-chip category-chip">
            <BookOpen size={13} />
            <span>{topic.category || 'Foundation'}</span>
          </span>

          <span className="meta-chip level-chip">
            <Zap size={13} />
            <span>{topic.level || 'Beginner'}</span>
          </span>

          {topic.stars && (
            <span className="meta-chip stars-chip" title="Core Frequently Used Concept">
              <Star size={13} style={{ fill: 'var(--py-yellow)', color: 'var(--py-yellow)' }} />
              <span>Core Concept</span>
            </span>
          )}

          <span className="meta-chip timestamp-chip">
            <BookOpen size={13} />
            <span>{topic.docRefTag || 'Python 3 Docs'}</span>
          </span>
        </div>

        <h1 className="topic-main-headline">{topic.title}</h1>
        <p className="topic-summary-lead">{topic.summary}</p>

        {/* Action Buttons */}
        <div className="topic-actions-row">
          <div className="actions-left-group">
            <a
              href={topic.docUrl || 'https://docs.python.org/3/'}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-action-btn"
            >
              <ExternalLink size={16} />
              <span>Official Python Docs</span>
            </a>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`action-btn-secondary ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => onToggleBookmark(topic.id)}
            >
              <Bookmark
                size={16}
                style={{
                  color: isBookmarked ? 'var(--py-yellow)' : undefined,
                  fill: isBookmarked ? 'var(--py-yellow)' : 'none'
                }}
              />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className={`mark-complete-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleMarkComplete}
          >
            <CheckCircle2 size={18} />
            <span>{isCompleted ? 'Mastered' : 'Mark Topic Mastered'}</span>
          </motion.button>
        </div>
      </div>

      {/* QUICK JUMP NAVIGATION BAR FOR ALL 12 SECTIONS */}
      <div className="section-jump-nav-bar">
        <span className="jump-nav-label">Curriculum Sections:</span>
        <div className="jump-nav-links">
          <a href="#sec-overview" className="jump-pill">1-2. Overview & Purpose</a>
          <a href="#sec-syntax" className="jump-pill">3-4. Syntax & Basic Example</a>
          <a href="#sec-execution" className="jump-pill">5. CPython Internals</a>
          <a href="#sec-examples" className="jump-pill">6. Deep Dive Examples</a>
          <a href="#sec-mistakes" className="jump-pill">7. Common Mistakes</a>
          <a href="#sec-differences" className="jump-pill">8. Key Differences</a>
          <a href="#sec-realworld" className="jump-pill">9. Real-World Use</a>
          <a href="#sec-interview" className="jump-pill">10. Interview Q&A</a>
          <a href="#sec-subtopics" className="jump-pill">Subtopic Checklist</a>
          <a href="#sec-sandbox" className="jump-pill">Sandbox Playground</a>
          <a href="#sec-quiz" className="jump-pill">11. Practice Quizzes</a>
          <a href="#sec-revision" className="jump-pill">12. Revision Sheet</a>
        </div>
      </div>

      {/* ─── SECTION 1 & 2: WHAT IS IT & WHY DOES IT EXIST ─────────────────── */}
      <div id="sec-overview" className="topic-instruction-card">
        <div className="instruction-header">
          <div className="badge-icon-circle blue-icon">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3>1. What is it? & 2. Why does it exist?</h3>
            <span className="header-subtitle">Definition, historical rationale, and core problem solved</span>
          </div>
        </div>

        <div className="instruction-body">
          <div className="definition-box">
            <h4>What is it?</h4>
            <p>{topic.whatIsIt}</p>
          </div>

          <div className="rationale-box">
            <h4>Why does it exist?</h4>
            <p>{topic.whyDoesItExist}</p>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3 & 4: SYNTAX & BASIC EXAMPLE ──────────────────────────── */}
      <div id="sec-syntax" className="topic-instruction-card">
        <div className="instruction-header">
          <div className="badge-icon-circle purple-icon">
            <Code size={20} />
          </div>
          <div>
            <h3>3. Syntax & 4. Basic Example</h3>
            <span className="header-subtitle">Formal syntax pattern & minimal runnable demonstration</span>
          </div>
        </div>

        <div className="instruction-body">
          {topic.syntax && (
            <CodeSnippetBlock title="Formal Syntax Specification" code={topic.syntax} />
          )}

          {topic.basicExample && (
            <CodeSnippetBlock title="Basic Runnable Example" code={topic.basicExample} />
          )}
        </div>
      </div>

      {/* ─── SECTION 5: STEP-BY-STEP EXECUTION & CPYTHON INTERNALS ─────────── */}
      {topic.stepByStepExecution && (
        <div id="sec-execution" className="topic-instruction-card">
          <div className="instruction-header">
            <div className="badge-icon-circle emerald-icon">
              <Cpu size={20} />
            </div>
            <div>
              <h3>5. Step-by-Step Execution (CPython Internals)</h3>
              <span className="header-subtitle">Under the hood: bytecode, memory allocation, pointers, and stack frames</span>
            </div>
          </div>

          <div className="instruction-body">
            <div className="internals-explanation-box">
              <pre className="internals-pre">{topic.stepByStepExecution}</pre>
            </div>

            {/* Visual memory/scope diagram if applicable */}
            {(topic.id.includes('variable') || topic.id.includes('list') || topic.id.includes('scope') || topic.id.includes('oops') || topic.id.includes('memory') || topic.id.includes('dictionary')) && (
              <VisualDiagram
                diagramType={
                  topic.id.includes('variable') || topic.id.includes('memory') ? 'memory-references' :
                  topic.id.includes('scope') ? 'legb-scope' :
                  topic.id.includes('dictionary') ? 'hash-table' :
                  'oop-inheritance'
                }
              />
            )}
          </div>
        </div>
      )}

      {/* ─── SECTION 6: MULTIPLE EXAMPLES (SIMPLE -> INTERMEDIATE -> TRICKY) ── */}
      {topic.multipleExamples && topic.multipleExamples.length > 0 && (
        <div id="sec-examples" className="topic-instruction-card">
          <div className="instruction-header">
            <div className="badge-icon-circle blue-icon">
              <Layers size={20} />
            </div>
            <div>
              <h3>6. Multiple Examples (Simple → Intermediate → Tricky)</h3>
              <span className="header-subtitle">Graduated progression of practical code examples</span>
            </div>
          </div>

          <div className="instruction-body">
            <div className="examples-stacked-list">
              {topic.multipleExamples.map((ex, i) => (
                <div key={i} className="example-card-item">
                  <div className="example-card-header">
                    <span className={`difficulty-badge badge-${ex.level.toLowerCase()}`}>
                      {ex.level === 'Simple' ? 'Simple' : ex.level === 'Intermediate' ? 'Intermediate' : 'Tricky / Edge Case'}
                    </span>
                    <h4>{ex.title}</h4>
                  </div>
                  <CodeSnippetBlock title={`${ex.level} Snippet`} code={ex.code} />
                  <p className="example-explanation-text" style={{ marginTop: '0.65rem' }}>{ex.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 7: COMMON MISTAKES & EXPLANATIONS OF "WHY" ─────────────── */}
      {topic.commonMistakes && topic.commonMistakes.length > 0 && (
        <div id="sec-mistakes" className="topic-instruction-card mistakes-theme">
          <div className="instruction-header">
            <div className="badge-icon-circle amber-icon">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3>7. Common Mistakes & Gotchas (Why it Fails)</h3>
              <span className="header-subtitle">Understand the mechanical cause rather than just memorizing rules</span>
            </div>
          </div>

          <div className="instruction-body">
            <div className="mistakes-grid">
              {topic.commonMistakes.map((m, i) => (
                <div key={i} className="mistake-comparison-box">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={15} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                    <span>{m.title}</span>
                  </h4>
                  <div className="code-split-row">
                    <div className="split-col wrong-col">
                      <span className="split-label wrong-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <XCircle size={13} />
                        <span>Problematic Pattern:</span>
                      </span>
                      <pre><code>{m.wrongCode}</code></pre>
                    </div>
                    <div className="split-col correct-col">
                      <span className="split-label correct-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckCircle2 size={13} />
                        <span>Correct Idiom:</span>
                      </span>
                      <pre><code>{m.correctCode}</code></pre>
                    </div>
                  </div>
                  <div className="why-it-fails-box">
                    <strong>Why it fails: </strong>
                    <span>{m.whyItFails}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 8: IMPORTANT DIFFERENCES & COMPARISONS ─────────────────── */}
      {topic.importantDifferences && topic.importantDifferences.length > 0 && (
        <div id="sec-differences" className="topic-instruction-card">
          <div className="instruction-header">
            <div className="badge-icon-circle purple-icon">
              <GitCompare size={20} />
            </div>
            <div>
              <h3>8. Important Differences & Comparisons</h3>
              <span className="header-subtitle">Head-to-head contrast cards (e.g. is vs ==, list vs tuple)</span>
            </div>
          </div>

          <div className="instruction-body">
            <div className="differences-cards-list">
              {topic.importantDifferences.map((diff, i) => (
                <div key={i} className="diff-card">
                  <h4>{diff.title}</h4>
                  <div className="diff-items-header">
                    <span className="diff-tag-a">{diff.itemA}</span>
                    <span className="diff-vs">VS</span>
                    <span className="diff-tag-b">{diff.itemB}</span>
                  </div>
                  <ul className="diff-points-list">
                    {diff.comparison.map((point, j) => (
                      <li key={j}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 9: REAL-WORLD & INDUSTRY USE ───────────────────────────── */}
      {topic.realWorldUse && (
        <div id="sec-realworld" className="topic-instruction-card">
          <div className="instruction-header">
            <div className="badge-icon-circle emerald-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h3>9. Real-World & Industry Application</h3>
              <span className="header-subtitle">Where you encounter this in production systems & AI pipelines</span>
            </div>
          </div>

          <div className="instruction-body">
            <div className="real-world-box">
              <p>{topic.realWorldUse}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 10: INTERVIEW PERSPECTIVE ──────────────────────────────── */}
      {topic.interviewPerspective && topic.interviewPerspective.length > 0 && (
        <div id="sec-interview" className="topic-instruction-card">
          <div className="instruction-header">
            <div className="badge-icon-circle amber-icon">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3>10. Senior Interview Perspective & Traps</h3>
              <span className="header-subtitle">Top technical screening questions and expected depth of understanding</span>
            </div>
          </div>

          <div className="instruction-body">
            <div className="interview-qa-list">
              {topic.interviewPerspective.map((qa, i) => (
                <div key={i} className="interview-qa-card">
                  <h4 className="interview-q">Q: {qa.question}</h4>
                  {qa.trap && (
                    <div className="interview-trap-alert">
                      <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <AlertTriangle size={13} style={{ color: 'var(--accent-amber)' }} />
                        Candidate Trap:
                      </strong>
                      <span>{qa.trap}</span>
                    </div>
                  )}
                  <div className="interview-expected-ans">
                    <strong>Expected Answer: </strong>
                    <p>{qa.expectedAnswer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SUBTOPICS INTERACTIVE CHECKLIST ─────────────────────────────── */}
      {topic.subtopics && topic.subtopics.length > 0 && (
        <div id="sec-subtopics" className="topic-instruction-card checklist-theme">
          <div className="instruction-header">
            <div className="badge-icon-circle emerald-icon">
              <ListTodo size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3>Topic Checklist & Subtopics Tracker</h3>
                <span className="subtopic-counter-badge">
                  {topic.subtopics.filter((s) => subtopicStatusMap[s.id] === 'completed').length} / {topic.subtopics.length} Mastered
                </span>
              </div>
              <span className="header-subtitle">
                Click any item to cycle status: Not Started → In Progress → Completed
              </span>
            </div>
          </div>

          <div className="instruction-body">
            <div className="subtopics-interactive-grid">
              {topic.subtopics.map((sub) => {
                const sObj = getSubtopicStatusIcon(sub.id);
                const IconComponent = sObj.Icon || Circle;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleCycleSubtopic(sub.id)}
                    className={`subtopic-toggle-item status-${subtopicStatusMap[sub.id] || 'not_started'}`}
                    title="Click to cycle status: Not Started -> In Progress -> Completed"
                  >
                    <IconComponent size={13} className="subtopic-status-icon" style={{ flexShrink: 0 }} />
                    <span className="subtopic-text">{sub.text}</span>
                    {sub.isStarred && <Star size={11} fill="var(--py-yellow)" style={{ color: 'var(--py-yellow)', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── INTERACTIVE CODE SANDBOX ───────────────────────────────────────── */}
      <div id="sec-sandbox" className="topic-instruction-card">
        <div className="instruction-header">
          <div className="badge-icon-circle blue-icon">
            <Terminal size={20} />
          </div>
          <div>
            <h3>Interactive Python Sandbox</h3>
            <span className="header-subtitle">Experiment, modify code, and run in the browser</span>
          </div>
        </div>

        <div className="instruction-body">
          <PythonPlayground initialCode={topic.starterCode} onShowToast={onShowToast} />
        </div>
      </div>

      {/* ─── SECTION 11: PRACTICE QUESTIONS & QUIZZES ────────────────────────── */}
      <div id="sec-quiz" className="quiz-cta-gradient-card">
        <div className="quiz-cta-content">
          <div className="quiz-cta-icon-box">
            <HelpCircle size={32} />
          </div>
          <div>
            <h3 className="quiz-cta-headline">11. Practice Questions & Mastery Assessment</h3>
            <p className="quiz-cta-subtext">
              Test your understanding of {topic.title} with interactive challenge questions or query live free internet APIs for fresh topic-wise questions.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-yellow quiz-cta-button"
            onClick={() => onNavigateToQuiz(topic.id, 'topic')}
          >
            <HelpCircle size={18} />
            <span>Curriculum Quiz</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-primary quiz-cta-button"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', borderColor: 'rgba(99, 102, 241, 0.4)' }}
            onClick={() => onNavigateToQuiz(topic.id, 'live_api')}
          >
            <Globe size={18} />
            <span>Fetch Live API Questions</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* ─── SECTION 12: REVISION SHEET (60-SECOND REVISION) ────────────────── */}
      {topic.revisionSheet && topic.revisionSheet.length > 0 && (
        <div id="sec-revision" className="topic-instruction-card revision-theme">
          <div className="instruction-header">
            <div className="badge-icon-circle blue-icon">
              <FileCheck size={20} />
            </div>
            <div>
              <h3>12. High-Yield Revision Sheet</h3>
              <span className="header-subtitle">Compact takeaways to review the entire topic in 60 seconds</span>
            </div>
          </div>

          <div className="instruction-body">
            <div className="revision-bullet-list">
              {topic.revisionSheet.map((item, idx) => (
                <div key={idx} className="revision-bullet-item">
                  <div className="revision-bullet-dot">
                    <Check size={14} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM PREV / NEXT NAVIGATION */}
      <div className="bottom-nav-bar">
        <motion.button
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
