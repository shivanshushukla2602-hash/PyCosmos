import React from 'react';
import { motion } from 'framer-motion';
import {
  Landmark,
  Sparkles,
  Calendar,
  User,
  Quote,
  Terminal,
  Cpu,
  Globe,
  ExternalLink,
  BookOpen,
  Award,
  Layers,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Tv
} from 'lucide-react';

const ZEN_OF_PYTHON = [
  "Beautiful is better than ugly.",
  "Explicit is better than implicit.",
  "Simple is better than complex.",
  "Complex is better than complicated.",
  "Flat is better than nested.",
  "Sparse is better than dense.",
  "Readability counts.",
  "Special cases aren't special enough to break the rules.",
  "Although practicality beats purity.",
  "Errors should never pass silently.",
  "Unless explicitly silenced.",
  "In the face of ambiguity, refuse the temptation to guess.",
  "There should be one-- and preferably only one --obvious way to do it.",
  "Although that way may not be obvious at first unless you're Dutch.",
  "Now is better than never.",
  "Although never is often better than *right* now.",
  "If the implementation is hard to explain, it's a bad idea.",
  "If the implementation is easy to explain, it may be a good idea.",
  "Namespaces are one honking great idea -- let's do more of those!"
];

const TIMELINE_MILESTONES = [
  {
    year: '1989',
    tag: 'Origin',
    title: 'Christmas Project at CWI',
    desc: 'Guido van Rossum began writing Python as a holiday hobby project at Centrum Wiskunde & Informatica (CWI) in the Netherlands, seeking an interpreter for the ABC language.',
    color: '#306998'
  },
  {
    year: '1991',
    tag: 'v0.9.0',
    title: 'First Alt.Sources Public Release',
    desc: 'Python 0.9.0 posted to alt.sources. Features included classes with inheritance, exception handling, functions, and core data types (str, list, dict).',
    color: '#4b8bbe'
  },
  {
    year: '1994',
    tag: 'v1.0',
    title: 'Python 1.0 & Functional Primitives',
    desc: 'Included functional programming tools lambda, map, filter, and reduce. Formed the foundation for early scientific scripting.',
    color: '#2dd4bf'
  },
  {
    year: '2000',
    tag: 'v2.0',
    title: 'Python 2.0 & Cycle-Detecting GC',
    desc: 'Introduced list comprehensions, garbage collection capable of detecting reference cycles, and full Unicode string integration.',
    color: '#ffd43b'
  },
  {
    year: '2008',
    tag: 'v3.0',
    title: 'Python 3.0 "Py3K" Major Overhaul',
    desc: 'Cleaned up language flaws: mandatory print() function, strict text (str) vs binary (bytes) separation, integer division returning floats.',
    color: '#e8b923'
  },
  {
    year: '2020',
    tag: 'EOL',
    title: 'Python 2.7 End-Of-Life (EOL)',
    desc: 'Official deprecation of Python 2 after two decades, solidifying Python 3 as the universal standard for development.',
    color: '#f87171'
  },
  {
    year: '2022–Present',
    tag: 'Modern',
    title: 'Faster CPython & No-GIL (PEP 703)',
    desc: 'Python 3.11+ delivers 10–60% speedups via specialized bytecode, structural pattern matching (match-case), and experimental free-threaded CPython.',
    color: '#39d353'
  }
];

export default function HistoryPage() {
  return (
    <div className="history-page-container">
      {/* HERO HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--py-yellow)',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            marginBottom: '0.6rem',
            background: 'rgba(232, 185, 35, 0.12)',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            border: '1px solid rgba(232, 185, 35, 0.3)'
          }}
        >
          <Landmark size={16} />
          <span>OFFICIAL PYTHON HISTORY & EVOLUTION</span>
        </motion.div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
          The Origin Story of Python
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
          From a December 1989 holiday project in Amsterdam to the foundational language powering modern web applications, artificial intelligence, and scientific research.
        </p>
      </div>

      {/* SECTION 1: WHY PYTHON WAS CREATED */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', color: 'var(--py-blue-light)' }}>
            <Sparkles size={22} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              1. Why Python Was Created
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            In the late 1980s, computer scientist <strong style={{ color: 'var(--text-primary)' }}>Guido van Rossum</strong> was working at CWI on the Amoeba distributed operating system. The existing shell scripting languages were inadequate for complex system administration tasks, while system programming languages like C required tedious manual memory management and excessive boilerplate.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7 }}>
            Guido set out to build an extensible scripting language that bridged the gap between C and shell scripts: an interpreted language with syntax so clear and readable that code could be understood as easily as plain English, while providing high-level data types and built-in object orientation.
          </p>
        </div>
      </section>

      {/* SECTION 2: THE LANDSCAPE BEFORE PYTHON */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            2. The Programming Landscape Before Python
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            How pre-existing languages influenced Python's syntax and philosophical goals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.1rem', marginBottom: '0.5rem' }}>ABC Language</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Created at CWI. Inspires Python's indentation-based scoping, readable syntax, and high-level tuple/list data types. However, ABC lacked extensibility and standard file I/O.
            </p>
          </div>

          <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 800, color: '#f97316', fontSize: '1.1rem', marginBottom: '0.5rem' }}>C Language</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Fast and powerful, but manual memory management (pointers, malloc/free) made small scripts slow to write. Python was built in C to allow easy C-extension module integration.
            </p>
          </div>

          <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 800, color: '#a855f7', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Perl</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Popular for text processing, but featured dense, cryptic sigils (`$`, `@`, `%`) and multiple ways to do things. Python prioritized "one obvious way to do it."
            </p>
          </div>

          <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ fontWeight: 800, color: '#22c55e', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Modula-3</div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Provided Python's module system syntax, exception handling model, and keyword parameter conventions.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE CREATOR - GUIDO VAN ROSSUM */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="section-card" style={{ background: 'linear-gradient(135deg, rgba(48, 105, 152, 0.25) 0%, rgba(22, 27, 34, 0.95) 100%)', border: '1.5px solid var(--py-blue-light)', borderRadius: '24px', padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 240px) 1fr', gap: '2rem', alignItems: 'center' }}>
            {/* GUIDO PHOTO */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '2px solid var(--py-blue-light)', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', background: '#161b22', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Guido-van-rossum-2014.jpg/440px-Guido-van-rossum-2014.jpg"
                  alt="Guido van Rossum"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', color: 'var(--py-yellow)' }}>
                  <User size={48} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>Guido van Rossum</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Python Creator & BDFL</div>
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Guido van Rossum at PyCon 2014 <br />
                <span style={{ fontSize: '0.68rem' }}>(Photo: Wikimedia Commons / CC BY-SA 4.0)</span>
              </div>
            </div>

            {/* BIO DETAILS */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--py-yellow)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                <User size={14} />
                <span>CREATOR & BDFL</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Guido van Rossum
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                Dutch programmer born in 1956. Received a Master's degree in Mathematics and Computer Science from the University of Amsterdam in 1982. He led Python's development for nearly three decades as its <strong style={{ color: 'var(--py-yellow)' }}>Benevolent Dictator For Life (BDFL)</strong> until stepping down from governance in July 2018.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Landmark size={14} style={{ color: 'var(--py-blue-light)' }} />
                  <span><strong>CWI & CNRI:</strong> 1989–2003</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Globe size={14} style={{ color: 'var(--accent-emerald)' }} />
                  <span><strong>Google & Dropbox:</strong> 2005–2019</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Terminal size={14} style={{ color: 'var(--py-yellow)' }} />
                  <span><strong>Microsoft:</strong> 2020–Present</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TIMELINE OF PYTHON'S EVOLUTION */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            4. Timeline of Python's Evolution
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Major release milestones from Python 0.9.0 to Python 3.13.
          </p>
        </div>

        {/* TIMELINE VERTICAL PATH */}
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Vertical Connecting Line */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '9px', width: '3px', background: 'linear-gradient(180deg, var(--py-blue), var(--py-yellow), #39d353)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {TIMELINE_MILESTONES.map((m, idx) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                style={{ position: 'relative' }}
              >
                {/* Node Bullet */}
                <div style={{ position: 'absolute', left: '-2.4rem', top: '0.35rem', width: '20px', height: '20px', borderRadius: '50%', background: m.color, border: '3px solid #0d1117', boxShadow: `0 0 10px ${m.color}` }} />

                <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: m.color }}>{m.year}</span>
                    <span className="badge" style={{ background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40`, fontSize: '0.75rem', padding: '0.15rem 0.55rem' }}>
                      {m.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY THE NAME "PYTHON" */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="section-card" style={{ background: 'linear-gradient(135deg, rgba(232, 185, 35, 0.12) 0%, rgba(22, 27, 34, 0.95) 100%)', border: '1.5px solid rgba(232, 185, 35, 0.35)', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(232, 185, 35, 0.2)', color: 'var(--py-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Tv size={32} />
          </div>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              5. Why the Name "Python"? (Fun Fact)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              Contrary to popular belief, Python is <strong style={{ color: 'var(--py-yellow)' }}>not named after the snake</strong>! During the 1980s, Guido van Rossum was reading published scripts of the famous 1970s BBC comedy series <strong style={{ color: 'var(--text-primary)' }}>"Monty Python's Flying Circus."</strong> Wanting a name that was short, unique, and slightly irreverent, he chose "Python."
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: THE ZEN OF PYTHON (PEP 20) */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Quote size={24} style={{ color: '#39d353' }} />
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  6. The Zen of Python (PEP 20)
                </h2>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>By Tim Peters • Official Python Enhancement Proposal 20</div>
              </div>
            </div>

            <a
              href="https://peps.python.org/pep-0020/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem', gap: '0.4rem' }}
            >
              <span>PEP 20 Specification</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {ZEN_OF_PYTHON.map((aphorism, idx) => (
              <div
                key={idx}
                style={{
                  background: '#0d1117',
                  borderLeft: '3px solid var(--py-blue-light)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  color: 'var(--text-primary)'
                }}
              >
                <span style={{ color: '#8b949e', marginRight: '0.4rem' }}>#{idx + 1}</span>
                {aphorism}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: WHY PYTHON TODAY */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            7. Why Python Dominates Today
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Official statistics from TIOBE & IEEE Spectrum rank Python as the #1 language globally.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(75, 139, 190, 0.2)', color: 'var(--py-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Globe size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Web Development</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Production-grade frameworks like Django, FastAPI, and Flask power high-scale backends and microservices worldwide.
            </p>
          </div>

          <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(232, 185, 35, 0.2)', color: 'var(--py-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>AI & Data Science</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Dominant ecosystem for PyTorch, TensorFlow, NumPy, and Pandas — the universal lingua franca of machine learning research.
            </p>
          </div>

          <div className="section-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(35, 134, 54, 0.2)', color: '#39d353', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Terminal size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Automation & DevOps</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Standard tool for cloud infrastructure automation, Ansible playbooks, WebAssembly execution, and system administration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
