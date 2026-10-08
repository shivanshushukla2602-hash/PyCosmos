import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode,
  Copy,
  Check,
  Sparkles,
  Search,
  Printer,
  ChevronRight,
  Terminal,
  GitBranch,
  Quote,
  Layers,
  Zap,
  Box,
  AlertTriangle,
  Play,
  Download,
  Code2,
  RotateCcw,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import PyCosmosLogo from './PyCosmosLogo';
import PythonPlayground from './PythonPlayground';

const CHEATSHEET_SECTIONS = [
  {
    id: 'sec-1',
    num: 1,
    title: 'Variables & Data Types',
    shortTitle: '1. Variables',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.15)',
    border: 'rgba(56, 189, 248, 0.35)',
    icon: Terminal,
    code: `# Variable assignment & casting
x = 10          # int
y = 3.14        # float
name = "PyCosmos" # str
is_valid = True # bool

# Type casting & inspection
num = int("100")
pi_str = str(3.14)
print(f"Name: {name}, Valid: {is_valid}")
print(f"Types: x={type(x).__name__}, y={type(y).__name__}")`
  },
  {
    id: 'sec-2',
    num: 2,
    title: 'Control Flow & Match-Case',
    shortTitle: '2. Control Flow',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.15)',
    border: 'rgba(192, 132, 252, 0.35)',
    icon: GitBranch,
    code: `# Structural Pattern Matching (Python 3.10+)
def evaluate_http_status(status_code):
    match status_code:
        case 200:
            return "OK: Success"
        case 400 | 404 as err:
            return f"Client Error: {err}"
        case 500:
            return "Server Error"
        case _:
            return "Unknown Status"

for code in [200, 404, 500]:
    print(f"HTTP {code} -> {evaluate_http_status(code)}")`
  },
  {
    id: 'sec-3',
    num: 3,
    title: 'Strings & Slicing',
    shortTitle: '3. Strings',
    color: '#f472b6',
    bg: 'rgba(244, 114, 182, 0.15)',
    border: 'rgba(244, 114, 182, 0.35)',
    icon: Quote,
    code: `s = "Python Programming"

# Slicing syntax: s[start:stop:step]
print("Slice [0:6]:", s[0:6])   # 'Python'
print("Reversed:", s[::-1])      # Reversed string
print("Every 2nd char:", s[::2]) # 'Pto rgamn'

# Modern String methods & formatting
print("Uppercase:", s.upper())
print("Joined:", " -> ".join(["Setup", "Forge", "Mastery"]))
print(f"F-String expression: 2 ** 8 = {2 ** 8}")`
  },
  {
    id: 'sec-4',
    num: 4,
    title: 'Data Structures & Comprehensions',
    shortTitle: '4. Data Structures',
    color: '#2dd4bf',
    bg: 'rgba(45, 212, 191, 0.15)',
    border: 'rgba(45, 212, 191, 0.35)',
    icon: Layers,
    code: `# List, Tuple, Set, Dict
lst = [1, 2, 3, 4]             # Mutable ordered list
tup = (10, 20, 30)             # Immutable tuple
st = {1, 2, 2, 3}              # Unique set -> {1, 2, 3}
dct = {"forge": "python", "id": 42} # Key-value map

# Comprehensions (List & Dict)
evens_squared = [x**2 for x in range(10) if x % 2 == 0]
lookup = {k: len(k) for k in ["python", "forge", "async"]}

print("Evens squared:", evens_squared)
print("String lengths:", lookup)`
  },
  {
    id: 'sec-5',
    num: 5,
    title: 'Functions, Lambdas & Decorators',
    shortTitle: '5. Functions',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.15)',
    border: 'rgba(251, 146, 60, 0.35)',
    icon: Zap,
    code: `# Variadic arguments (*args, **kwargs)
def calculate_metrics(base, *values, **metadata):
    total = base + sum(values)
    return total, metadata

# Simple decorator pattern
def log_execution(func):
    def wrapper(*args, **kwargs):
        print(f"Calling: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_execution
def greet(name: str) -> str:
    return f"Welcome to PyCosmos, {name}!"

res, meta = calculate_metrics(10, 20, 30, tag="v1.0")
print("Metrics result:", res, meta)
print(greet("Developer"))`
  },
  {
    id: 'sec-6',
    num: 6,
    title: 'OOP Classes & Inheritance',
    shortTitle: '6. OOP',
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.15)',
    border: 'rgba(74, 222, 128, 0.35)',
    icon: Box,
    code: `class Serpent:
    species = "Python 3.11" # Class attribute

    def __init__(self, name: str, skill_level: int):
        self.name = name
        self.skill_level = skill_level

    def forge(self):
        return f"{self.name} is forging code at Level {self.skill_level}!"

    @classmethod
    def create_master(cls, name: str):
        return cls(name, 100)

snake = Serpent.create_master("Viper")
print(snake.forge())
print("Species:", Serpent.species)`
  },
  {
    id: 'sec-7',
    num: 7,
    title: 'Exception Handling & File I/O',
    shortTitle: '7. Exceptions & Files',
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.15)',
    border: 'rgba(248, 113, 113, 0.35)',
    icon: AlertTriangle,
    code: `# Robust Exception Handling
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError as err:
        return f"Error: Cannot divide by zero ({err})"
    except TypeError as err:
        return f"Error: Invalid type ({err})"
    finally:
        pass # Always executes for cleanup

print("10 / 2 =", safe_divide(10, 2))
print("10 / 0 =", safe_divide(10, 0))`
  }
];

export default function CheatSheetPage({ onShowToast }) {
  const [copiedSection, setCopiedSection] = useState(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sandboxCode, setSandboxCode] = useState(CHEATSHEET_SECTIONS[0].code);

  const playgroundRef = useRef(null);

  // Scroll Spy & Progress Tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100)));
      }

      const sectionElements = CHEATSHEET_SECTIONS.map((s) => document.getElementById(s.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionIndex(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = (title, code) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(title);
    if (onShowToast) onShowToast(`Copied ${title} to clipboard.`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleRunInSandbox = (code, title) => {
    setSandboxCode(code);
    if (onShowToast) onShowToast(`Loaded ${title} into Python Sandbox.`);
    if (playgroundRef.current) {
      playgroundRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportFullMarkdown = (downloadFile = false) => {
    let md = `# PyCosmos — Python 3.11 Quick Reference Cheat Sheet\n\n`;
    md += `*Generated: ${new Date().toLocaleDateString()} | PyCosmos Learning Environment*\n\n`;
    md += `---\n\n`;

    CHEATSHEET_SECTIONS.forEach((sec) => {
      md += `## ${sec.num}. ${sec.title}\n\n`;
      md += "```python\n" + sec.code + "\n```\n\n";
    });

    if (downloadFile) {
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PyCosmos_Python_Cheatsheet.md');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onShowToast) onShowToast("Downloaded PyCosmos_Python_Cheatsheet.md");
    } else {
      navigator.clipboard.writeText(md).then(() => {
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 2500);
        if (onShowToast) onShowToast("Full Cheat Sheet copied to clipboard as Markdown.");
      });
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -130;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Syntax Highlighting Tokenizer helper
  const renderHighlightedLine = (line) => {
    if (line.trim().startsWith('#')) {
      return <span style={{ color: '#8b949e', fontStyle: 'italic' }}>{line}</span>;
    }

    const tokenRegex =
      /(".*?"|'.*?'|#.*$|@[a-zA-Z0-9_]+|\b(?:def|class|try|except|finally|if|elif|else|match|case|with|as|for|in|is|return|lambda|import|from|True|False|None)\b|\b(?:print|int|float|str|bool|sum|range|len|open|type|super|enumerate|zip|map|filter)\b|\b\d+(?:\.\d+)?\b)/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith('#')) {
        parts.push(
          <span key={match.index} style={{ color: '#8b949e', fontStyle: 'italic' }}>
            {token}
          </span>
        );
      } else if (token.startsWith('@')) {
        parts.push(
          <span key={match.index} style={{ color: '#d2a8ff', fontWeight: 600 }}>
            {token}
          </span>
        );
      } else if (token.startsWith('"') || token.startsWith("'")) {
        parts.push(
          <span key={match.index} style={{ color: '#a5d6ff' }}>
            {token}
          </span>
        );
      } else if (
        /^(def|class|try|except|finally|if|elif|else|match|case|with|as|for|in|is|return|lambda|import|from|True|False|None)$/.test(
          token
        )
      ) {
        parts.push(
          <span key={match.index} style={{ color: '#ff7b72', fontWeight: 600 }}>
            {token}
          </span>
        );
      } else if (
        /^(print|int|float|str|bool|sum|range|len|open|type|super|enumerate|zip|map|filter)$/.test(
          token
        )
      ) {
        parts.push(
          <span key={match.index} style={{ color: '#79c0ff' }}>
            {token}
          </span>
        );
      } else if (/^\d+(?:\.\d+)?$/.test(token)) {
        parts.push(
          <span key={match.index} style={{ color: '#79c0ff' }}>
            {token}
          </span>
        );
      } else {
        parts.push(token);
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts;
  };

  const filteredSections = CHEATSHEET_SECTIONS.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return sec.title.toLowerCase().includes(q) || sec.code.toLowerCase().includes(q);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      style={{ paddingBottom: '5rem' }}
    >
      {/* 1. STICKY SECTION NAVIGATION BAR WITH SCROLL-SPY */}
      <div className="sticky-cheatsheet-nav">
        <div className="cheatsheet-nav-inner">
          {CHEATSHEET_SECTIONS.map((sec, idx) => {
            const isActive = activeSectionIndex === idx;

            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`cheatsheet-nav-tab ${isActive ? 'active' : ''}`}
                style={{
                  borderColor: isActive ? sec.color : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: isActive ? sec.color : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#0d1117' : sec.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 800
                  }}
                >
                  {sec.num}
                </div>
                <span>{sec.shortTitle}</span>
              </button>
            );
          })}

          {/* Quick jump to WASM Playground */}
          <button
            onClick={() => {
              if (playgroundRef.current) {
                playgroundRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="cheatsheet-nav-tab"
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8'
            }}
          >
            <Play size={12} fill="#38bdf8" />
            <span>WASM Sandbox</span>
          </button>
        </div>

        {/* Scroll Progress Bar at top of nav */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'transparent' }}>
          <div
            style={{
              height: '100%',
              width: `${scrollProgress}%`,
              background: 'linear-gradient(90deg, #38bdf8, var(--py-yellow))',
              transition: 'width 0.1s ease-out'
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* HEADER SECTION WITH PYCOSMOS BRANDING */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
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
                PYTHON 3.11 REFERENCE & WASM RUNTIME
              </span>
            </motion.div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
              Python Quick Reference & <span className="forge-gradient-text">Live Sandbox</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', margin: 0, maxWidth: '650px' }}>
              Condensed patterns for Python 3.11 syntax, data structures, OOP, and exceptions. Click <strong>"Run in Sandbox"</strong> on any snippet to execute live in-browser.
            </p>
          </div>

          {/* Action buttons: Search, Export MD, Print */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords..."
                style={{
                  width: '100%',
                  padding: '0.45rem 0.85rem 0.45rem 2.2rem',
                  borderRadius: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              onClick={() => handleExportFullMarkdown(false)}
              className="checklist-export-btn"
              title="Copy entire cheat sheet as Markdown"
            >
              {copiedFull ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
              <span>{copiedFull ? 'Copied MD!' : 'Export MD'}</span>
            </button>

            <button
              onClick={() => handleExportFullMarkdown(true)}
              className="cat-batch-btn"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
              title="Download cheat sheet as .md file"
            >
              <Download size={13} />
              <span>.md</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => window.print()}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              title="Print or Save PDF"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* 2. SECTIONS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
          {filteredSections.map((sec, idx) => {
            const IconComp = sec.icon;
            const isCopied = copiedSection === sec.title;
            const lines = sec.code.split('\n');

            return (
              <motion.div
                id={sec.id}
                key={sec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="section-card"
                style={{
                  borderLeft: `4px solid ${sec.color}`,
                  borderColor: sec.border,
                  borderRadius: '18px',
                  padding: '1.6rem 1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                }}
              >
                {/* Section Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Number Badge */}
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: sec.color,
                        color: '#0d1117',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {sec.num}
                    </div>

                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: sec.bg,
                        color: sec.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconComp size={19} />
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {sec.title}
                    </h3>
                  </div>

                  {/* Actions: Run in Sandbox & Copy Code */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleRunInSandbox(sec.code, sec.title)}
                      className="cat-batch-btn"
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        borderColor: 'rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.78rem'
                      }}
                      title="Load and execute this snippet in the WASM playground"
                    >
                      <Play size={12} fill="#38bdf8" />
                      <span>Run in Sandbox</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCopy(sec.title, sec.code)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: `1px solid ${isCopied ? '#39d353' : 'var(--border-color)'}`,
                        background: isCopied ? '#238636' : 'rgba(255, 255, 255, 0.04)',
                        color: isCopied ? '#ffffff' : 'var(--text-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {isCopied ? (
                          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Check size={13} />
                          </motion.span>
                        ) : (
                          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Copy size={13} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </motion.button>
                  </div>
                </div>

                {/* SYNTAX HIGHLIGHTED CODE PANEL WITH LINE NUMBERS & TERMINAL DOTS */}
                <div className="code-panel" style={{ borderTop: `2px solid ${sec.color}` }}>
                  <div className="code-panel-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="terminal-dot red" />
                      <span className="terminal-dot yellow" />
                      <span className="terminal-dot green" />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginLeft: '0.4rem', color: 'var(--text-muted)' }}>
                        snippet_{sec.num}.py
                      </span>
                    </div>
                    <span style={{ color: sec.color, fontWeight: 700, fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      {lines.length} lines
                    </span>
                  </div>

                  <div style={{ padding: '0.75rem 0' }}>
                    {lines.map((line, lIdx) => (
                      <div key={lIdx} className="code-line">
                        <span className="line-num">{lIdx + 1}</span>
                        <span className="line-content">{renderHighlightedLine(line)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            3. INTERACTIVE IN-BROWSER WASM PYTHON PLAYGROUND
            ═════════════════════════════════════════════════════════════════════ */}
        <div ref={playgroundRef} id="playground-section" style={{ paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Code2 size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                  Interactive Python WASM Sandbox
                </h2>
                <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 800, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  Pyodide 0.25
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0 }}>
                Write and execute Python 3.11 code directly in your browser. Standard library and output redirection enabled.
              </p>
            </div>
          </div>

          <PythonPlayground initialCode={sandboxCode} onShowToast={onShowToast} />
        </div>
      </div>
    </motion.div>
  );
}
