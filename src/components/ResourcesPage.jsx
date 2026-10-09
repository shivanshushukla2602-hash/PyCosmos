import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ExternalLink,
  BookOpen,
  Code2,
  Award,
  Terminal,
  Sparkles,
  BookMarked,
  Layers,
  GraduationCap,
  Globe,
  Search,
  CheckCircle2,
  Wrench,
  Video,
  Share2,
  Copy,
  Check,
  Cpu,
  Shield,
  Zap,
  Star,
  X
} from 'lucide-react';
import PyCosmosLogo from './PyCosmosLogo';

// 1. PRACTICE PLATFORMS
const PRACTICE_PLATFORMS = [
  {
    id: 'leetcode',
    name: 'LeetCode Python',
    desc: 'The gold standard for algorithmic coding interview preparation with Python 3.11+ runtime.',
    link: 'https://leetcode.com/problemset/all/?languageTags=python3',
    category: 'Algorithms',
    badge: 'Interview Standard',
    icon: Terminal,
    color: '#fb923c'
  },
  {
    id: 'hackerrank',
    name: 'HackerRank Python Track',
    desc: 'Structured domain challenge tracks ranging from fundamental syntax to regex, closures, and generators.',
    link: 'https://www.hackerrank.com/domains/python',
    category: 'Practice',
    badge: 'Structured Drills',
    icon: Code2,
    color: '#22c55e'
  },
  {
    id: 'exercism',
    name: 'Exercism Python Track',
    desc: 'Free, test-driven Python exercises with personalized mentor feedback and idiomatic code reviews.',
    link: 'https://exercism.org/tracks/python',
    category: 'Mentored',
    badge: 'Community Mentored',
    icon: GraduationCap,
    color: '#38bdf8'
  },
  {
    id: 'codewars',
    name: 'Codewars Python Katas',
    desc: 'Gamified programming katas ranked by difficulty (8 kyu to 1 kyu) to sharpen algorithmic problem solving.',
    link: 'https://www.codewars.com/?language=python',
    category: 'Gamified',
    badge: 'Kata Drills',
    icon: Award,
    color: '#ef4444'
  },
  {
    id: 'docs',
    name: 'Python 3 Official Docs',
    desc: 'The authoritative CPython language specification, PEP standard catalog, and standard library manual.',
    link: 'https://docs.python.org/3/',
    category: 'Documentation',
    badge: 'Official Manual',
    icon: BookOpen,
    color: '#ffd43b'
  },
  {
    id: 'peps',
    name: 'Python Enhancement Proposals (PEPs)',
    desc: 'The official architectural proposals that govern the design, type system, and evolution of Python.',
    link: 'https://peps.python.org/',
    category: 'Standards',
    badge: 'CPython Architecture',
    icon: Layers,
    color: '#f472b6'
  }
];

// 2. MODERN DEVELOPER TOOLING
const MODERN_TOOLS = [
  {
    id: 'uv',
    name: 'uv (by Astral)',
    desc: 'An extremely fast Python package and project manager written in Rust. 10-100x faster than pip.',
    link: 'https://github.com/astral-sh/uv',
    category: 'Package Management',
    badge: 'Blazing Fast Rust',
    icon: Zap,
    color: '#a855f7'
  },
  {
    id: 'ruff',
    name: 'Ruff',
    desc: 'An ultra-fast Python linter and code formatter written in Rust. Replaces Flake8, Black, isort, and Bandit.',
    link: 'https://astral.sh/ruff',
    category: 'Linting & Formatting',
    badge: 'Industry Standard',
    icon: Wrench,
    color: '#fbbf24'
  },
  {
    id: 'pytest',
    name: 'pytest',
    desc: 'The mature, full-featured Python testing framework that makes writing simple and scalable test suites fun.',
    link: 'https://docs.pytest.org/',
    category: 'Testing',
    badge: 'Production QA',
    icon: Shield,
    color: '#38bdf8'
  },
  {
    id: 'mypy',
    name: 'Mypy Type Checker',
    desc: 'Optional static typing for Python. Catches errors before runtime without sacrificing dynamic flexibility.',
    link: 'https://mypy-lang.org/',
    category: 'Static Analysis',
    badge: 'Strict Types',
    icon: Cpu,
    color: '#34d399'
  },
  {
    id: 'poetry',
    name: 'Poetry',
    desc: 'Deterministic dependency management and packaging for Python projects with lockfile integrity.',
    link: 'https://python-poetry.org/',
    category: 'Packaging',
    badge: 'Dependency Lock',
    icon: Layers,
    color: '#06b6d4'
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    desc: 'High-performance, easy to learn, fast to code modern web framework based on standard Python type hints.',
    link: 'https://fastapi.tiangolo.com/',
    category: 'Web Framework',
    badge: 'High Performance',
    icon: Globe,
    color: '#10b981'
  }
];

// 3. RECOMMENDED BOOKS
const RECOMMENDED_BOOKS = [
  {
    id: 'fluent_python',
    title: 'Fluent Python (2nd Edition)',
    author: 'Luciano Ramalho',
    desc: 'The definitive masterwork on writing clear, idiomatic Python using the data model, protocols, generators, and coroutines.',
    tag: 'Advanced / Idiomatic',
    color: '#38bdf8'
  },
  {
    id: 'crash_course',
    title: 'Python Crash Course (3rd Edition)',
    author: 'Eric Matthes',
    desc: 'The premier hands-on, project-based introduction to Python for beginners building practical applications.',
    tag: 'Beginner / Practical',
    color: '#22c55e'
  },
  {
    id: 'effective_python',
    title: 'Effective Python: 90 Specific Ways',
    author: 'Brett Slatkin',
    desc: 'Actionable best practices, common pitfalls, performance tips, and robust concurrency guidance.',
    tag: 'Core Best Practices',
    color: '#ffd43b'
  },
  {
    id: 'architecture_patterns',
    title: 'Architecture Patterns with Python',
    author: 'Harry Percival & Bob Gregory',
    desc: 'Domain-Driven Design (DDD), Unit of Work, Event-Driven Architecture, and Repository patterns in production Python.',
    tag: 'Systems Architecture',
    color: '#c084fc'
  }
];

// 4. CHANNELS & MEDIA
const COMMUNITY_CHANNELS = [
  {
    id: 'pycon',
    name: 'PyCon & PSF Talks',
    desc: 'Keynotes, technical deep-dives, and core developer panels from global Python conferences.',
    link: 'https://www.youtube.com/@PyConUS',
    category: 'Conferences',
    badge: 'Official PSF',
    icon: Video,
    color: '#ef4444'
  },
  {
    id: 'arjancodes',
    name: 'ArjanCodes',
    desc: 'Clean code architecture, OOP design patterns, refactoring, and software craftsmanship in Python.',
    link: 'https://www.youtube.com/@ArjanCodes',
    category: 'Architecture',
    badge: 'Design Patterns',
    icon: Code2,
    color: '#38bdf8'
  },
  {
    id: 'mcoding',
    name: 'mCoding (by James Murphy)',
    desc: 'Bite-sized, expert-level explorations of Python quirks, CPython internals, typing, and performance tricks.',
    link: 'https://www.youtube.com/@mCoding',
    category: 'Internals',
    badge: 'CPython Deep Dive',
    icon: Cpu,
    color: '#fbbf24'
  },
  {
    id: 'realpython',
    name: 'Real Python Tutorials',
    desc: 'High-quality, step-by-step written articles and video courses covering every aspect of the Python ecosystem.',
    link: 'https://realpython.com/',
    category: 'Tutorials',
    badge: 'Curated Guides',
    icon: Globe,
    color: '#34d399'
  }
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('platforms'); // 'platforms' | 'tools' | 'books' | 'channels'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = (item) => {
    const link = item.link || `https://www.google.com/search?q=${encodeURIComponent(item.title || item.name)}`;
    navigator.clipboard.writeText(link);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter items based on current active tab and search query
  const filteredItems = useMemo(() => {
    let source = PRACTICE_PLATFORMS;
    if (activeTab === 'tools') source = MODERN_TOOLS;
    else if (activeTab === 'books') source = RECOMMENDED_BOOKS;
    else if (activeTab === 'channels') source = COMMUNITY_CHANNELS;

    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();

    return source.filter((item) => {
      const title = (item.name || item.title || '').toLowerCase();
      const desc = (item.desc || '').toLowerCase();
      const cat = (item.category || item.tag || '').toLowerCase();
      return title.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [activeTab, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="resources-page-container"
    >
      {/* 1. HERO HEADER WITH PYCOSMOS BRANDING */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}
        >
          <div style={{ position: 'relative' }}>
            <div className="hero-snake-bloom" style={{ width: '65px', height: '65px' }} />
            <PyCosmosLogo size={42} animated={true} />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--py-yellow)', textTransform: 'uppercase' }}>
            51-TOPIC PYTHON ECOSYSTEM
          </span>
        </motion.div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
          Curated Python <span className="forge-gradient-text">Resources & Tooling</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', maxWidth: '640px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
          Hand-picked platforms, modern Rust-powered developer tools, authoritative specifications, and literature for professional Python engineers.
        </p>

        {/* Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, platforms, or books..."
              style={{
                width: '100%',
                padding: '0.55rem 1rem 0.55rem 2.3rem',
                borderRadius: '10px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 4 Primary Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { id: 'platforms', label: 'Coding Platforms', icon: Terminal, count: PRACTICE_PLATFORMS.length },
            { id: 'tools', label: 'Modern Tooling', icon: Wrench, count: MODERN_TOOLS.length },
            { id: 'books', label: 'Recommended Books', icon: BookOpen, count: RECOMMENDED_BOOKS.length },
            { id: 'channels', label: 'Media & Channels', icon: Video, count: COMMUNITY_CHANNELS.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pill-btn ${isActive ? 'active' : ''}`}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT GRID */}
      <div>
        {filteredItems.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px dashed var(--border-color)'
            }}
          >
            <Compass size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No resources match "{searchQuery}"
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 auto 1.25rem' }}>
              Try clearing your search query or selecting a different category tab.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}
          >
            {filteredItems.map((item, idx) => {
              const Icon = item.icon || BookOpen;
              const isCopied = copiedId === item.id;
              const hasExternalLink = Boolean(item.link);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderLeft: `4px solid ${item.color || '#38bdf8'}`,
                    borderRadius: '16px',
                    padding: '1.4rem 1.6rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div>
                    {/* Top Row: Category Pill & Link Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: `${item.color || '#38bdf8'}22`,
                            border: `1px solid ${item.color || '#38bdf8'}44`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: item.color || '#38bdf8'
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: item.color || 'var(--py-blue-light)',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {item.badge || item.tag || item.category}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item)}
                          className="cat-batch-btn"
                          style={{ padding: '0.25rem 0.5rem' }}
                          title="Copy Link"
                        >
                          {isCopied ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
                        </button>

                        {hasExternalLink && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cat-batch-btn"
                            style={{
                              padding: '0.25rem 0.55rem',
                              color: 'var(--py-yellow)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Visit Resource"
                          >
                            <span>Visit</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.35rem' }}>
                      {item.name || item.title}
                    </h3>

                    {item.author && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        by {item.author}
                      </div>
                    )}

                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
