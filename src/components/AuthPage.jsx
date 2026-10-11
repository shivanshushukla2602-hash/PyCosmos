import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  User,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Terminal,
  Copy,
  Check,
  AlertCircle,
  Sun,
  Moon,
  Layers,
  Trophy,
  Sparkles,
  ShieldCheck,
  Cpu,
  Brain,
  Zap,
  Play,
  Compass,
  Code2
} from 'lucide-react';
import PyCosmosLogo from './PyCosmosLogo';
import { celebrate } from '../utils/celebrate';

// Pre-seeded demo accounts for instant evaluation
const DEMO_ACCOUNTS = [
  {
    name: 'Shivanshu Shukla',
    email: 'shivanshushukla1919@gmail.com',
    password: 'shivanshu19',
    role: 'Platform Owner & Lead Architect',
    level: 'Grandmaster (Lvl 27)',
    avatar: 'SS',
    badge: 'Owner / Admin'
  },
  {
    name: 'Alex Rivera',
    email: 'alex@pycosmos.dev',
    password: 'password123',
    role: 'AI/ML Systems Researcher',
    level: 'Intermediate (Lvl 12)',
    avatar: 'AR',
    badge: 'AI/ML Track'
  }
];

// Interactive persona previews for the left showcase terminal
const PERSONA_PREVIEWS = [
  {
    id: 'architect',
    label: 'Lead Architect',
    icon: Cpu,
    filename: 'cpython_internals.py',
    code: `import sys, dis

def optimize_pipeline(bytecode):
    # CPython 3.12 Specialized Adaptive Interpreter
    return dis.dis(bytecode)

print(">>> CPython 3.12 Adaptive Tier: ACTIVE")
print(">>> Architecture: 27 Mastery Levels Cleared")`,
    stat: '51 Modules • CPython 3.12'
  },
  {
    id: 'aiml',
    label: 'AI & Systems',
    icon: Brain,
    filename: 'neural_matrix.py',
    code: `import torch, numpy as np

# Distributed Tensor Parallelism Pipeline
matrix = np.random.randn(512, 512)
print(">>> PyCosmos AI Engine: Online")
print(">>> Micro-benchmarking: 0.12ms inference")`,
    stat: 'Vectorized Tensors • WebAssembly'
  },
  {
    id: 'voyager',
    label: 'Foundation',
    icon: Zap,
    filename: 'first_steps.py',
    code: `class PythonVoyager:
    def __init__(self, name):
        self.name = name
        self.streak = 1

voyager = PythonVoyager("Shivanshu")
print(f">>> Welcome, {voyager.name}! Ready to explore.")`,
    stat: 'Zero to Mastery • Free Forever'
  }
];

export default function AuthPage({ onLogin, theme = 'dark', setTheme }) {
  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [track, setTrack] = useState('full_mastery');
  const [showPassword, setShowPassword] = useState(false);

  // Active showcase persona
  const [activePersona, setActivePersona] = useState(PERSONA_PREVIEWS[0]);

  // OTP State (Used during Registration Verification)
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // UI / Feedback States
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Digit input refs
  const inputRefs = useRef([]);

  // Local theme toggle support
  const handleToggleTheme = () => {
    if (setTheme) {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    } else {
      const isLight = document.body.classList.contains('light-theme');
      if (isLight) {
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
      }
    }
  };

  const isCurrentLight = theme === 'light' || (typeof document !== 'undefined' && document.body.classList.contains('light-theme'));

  // Timer countdown effect for OTP resend
  useEffect(() => {
    let interval = null;
    if (isTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, otpTimer]);

  // Password Strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'rgba(255,255,255,0.1)' };
    if (pass.length < 6) return { score: 25, label: 'Too short', color: '#ef4444' };
    let score = 50;
    if (pass.length >= 8) score += 20;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;
    if (score >= 90) return { score: 100, label: 'Hardened', color: '#22c55e' };
    if (score >= 70) return { score: 75, label: 'Strong', color: 'var(--py-yellow)' };
    return { score: 50, label: 'Moderate', color: '#f59e0b' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Generate 6-digit OTP
  const triggerOtpGeneration = (targetEmail) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsOtpStep(true);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpTimer(60);
    setIsTimerActive(true);
    setErrorMsg('');
    setSuccessMsg(`Verification code dispatched to ${targetEmail}`);
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 200);
  };

  // 1. Existing User Login Handler (Email + Password)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();

      // Check registered accounts in localStorage
      let accounts = [];
      try {
        const stored = localStorage.getItem('pyradox_registered_users');
        accounts = stored ? JSON.parse(stored) : [];
      } catch {
        accounts = [];
      }

      // Check against stored accounts and demo accounts
      const allAccounts = [...accounts, ...DEMO_ACCOUNTS];
      const foundUser = allAccounts.find(
        (acc) => acc.email.toLowerCase() === cleanEmail
      );

      if (!foundUser) {
        setErrorMsg('Account not found with this email. Please switch to Create Account.');
        return;
      }

      if (foundUser.password && foundUser.password !== password) {
        setErrorMsg('Invalid password. Please verify your credentials or select a demo account.');
        return;
      }

      // Successful login
      celebrate();
      const sessionUser = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || 'Python Engineer',
        level: foundUser.level || 'Beginner (Lvl 1)',
        avatar: foundUser.avatar || foundUser.name.slice(0, 2).toUpperCase(),
        token: `pyx_${Date.now()}`
      };

      onLogin(sessionUser);
    }, 450);
  };

  // 2. New User Registration Request (Initiates OTP Verification)
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerOtpGeneration(email.trim());
    }, 400);
  };

  // 3. OTP Digit Change Handler
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // OTP Keydown (Backspace navigation)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // OTP Paste Handler
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // 4. Verify OTP and Enter PyCosmos
  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (enteredOtp !== generatedOtp && enteredOtp !== '123456') {
        setErrorMsg('Invalid code. Please use the simulated code provided below.');
        return;
      }

      const newUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: track === 'ai_ml' ? 'AI/ML Python Specialist' : 'Python Full Stack Pro',
        level: 'Apprentice (Lvl 1)',
        avatar: name.trim().slice(0, 2).toUpperCase() || 'PF',
        createdAt: new Date().toISOString()
      };

      try {
        const stored = localStorage.getItem('pyradox_registered_users');
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((u) => u.email !== newUser.email);
        localStorage.setItem('pyradox_registered_users', JSON.stringify([...filtered, newUser]));
      } catch (err) {
        console.error('Failed to save user', err);
      }

      celebrate();
      onLogin({
        ...newUser,
        token: `pyx_${Date.now()}`
      });
    }, 500);
  };

  // One-click demo sign-in
  const handleQuickDemoLogin = (account) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      celebrate();
      onLogin({
        name: account.name,
        email: account.email,
        role: account.role,
        level: account.level,
        avatar: account.avatar,
        token: `pyx_demo_${Date.now()}`
      });
    }, 300);
  };

  const copySimulatedOtp = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const autoFillOtp = () => {
    if (generatedOtp) {
      setOtpDigits(generatedOtp.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="auth-page-root py-auth-gateway-root">
      {/* Background Ambient Aura */}
      <div className="auth-ambient-glow" />
      <div className="auth-mesh-grid-overlay" />

      <div className="auth-portal-wrapper">
        <div className="auth-portal-grid py-auth-cosmic-grid">
          
          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN: BESPOKE DEVELOPER WORKSPACE & INTERACTIVE SIMULATOR
              ══════════════════════════════════════════════════════════════════ */}
          <motion.div
            className="auth-showcase-panel py-auth-showcase-deck"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div>
              {/* Brand Crest & Title */}
              <div className="auth-showcase-brand py-auth-crest-wrap">
                <div className="py-auth-crest-glow">
                  <PyCosmosLogo size={42} animated={true} />
                </div>
                <div>
                  <div className="auth-showcase-logo-text">
                    <span className="brand-blue">Py</span>
                    <span className="brand-yellow">Cosmos</span>
                  </div>
                  <div className="auth-showcase-tagline">UNIVERSE OF PYTHON • DEVELOPER GATEWAY</div>
                </div>
              </div>

              {/* Main Headline */}
              <div className="auth-showcase-hero">
                <h1 className="auth-showcase-heading py-auth-headline">
                  Master Python with <span className="py-gold-text">Architectural Precision</span>
                </h1>
                <p className="auth-showcase-subheading">
                  From fundamental CPython bytecode execution to asynchronous concurrency and production AI systems. Built specifically for engineers who demand genuine technical depth.
                </p>
              </div>

              {/* Interactive Persona Tabs for Live Terminal Code Preview */}
              <div className="py-persona-switcher-strip">
                <span className="persona-strip-label">PREVIEW TRACK:</span>
                {PERSONA_PREVIEWS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePersona(p)}
                    className={`persona-strip-pill ${activePersona.id === p.id ? 'active' : ''}`}
                  >
                    <p.icon size={12} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {/* macOS Style Interactive Code Studio Preview */}
              <div className="auth-showcase-terminal py-auth-terminal-studio">
                <div className="terminal-header-bar">
                  <div className="terminal-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <div className="terminal-file-badge">
                    <Code2 size={12} color="var(--py-blue-light)" />
                    <span>{activePersona.filename}</span>
                  </div>
                  <span className="terminal-env-badge">CPython 3.12.7 VM</span>
                </div>
                <div className="terminal-body-code">
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {activePersona.code}
                  </pre>
                </div>
                <div className="terminal-footer-meta">
                  <span className="terminal-footer-chip">✓ {activePersona.stat}</span>
                  <span className="terminal-footer-latency">⚡ 0.0ms WebAssembly Sandbox</span>
                </div>
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="auth-showcase-highlights py-auth-highlights-grid">
              <div className="showcase-highlight-item">
                <div className="highlight-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <Layers size={16} />
                </div>
                <div>
                  <div className="highlight-title">51-Topic Structured Curriculum</div>
                  <div className="highlight-desc">Zero guesswork with sequenced milestones from Foundation to AI</div>
                </div>
              </div>

              <div className="showcase-highlight-item">
                <div className="highlight-icon-wrap" style={{ background: 'rgba(255, 212, 59, 0.15)', color: 'var(--py-yellow)' }}>
                  <Cpu size={16} />
                </div>
                <div>
                  <div className="highlight-title">CPython Internals & Bytecode</div>
                  <div className="highlight-desc">Learn how Python compiles source into AST, opcodes, and ceval.c loops</div>
                </div>
              </div>

              <div className="showcase-highlight-item">
                <div className="highlight-icon-wrap" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                  <Trophy size={16} />
                </div>
                <div>
                  <div className="highlight-title">27-Level Mastery Accreditation</div>
                  <div className="highlight-desc">Earn cryptographic milestones and verified developer credentials</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN: ULTRA-PREMIUM AUTHENTICATION TERMINAL
              ══════════════════════════════════════════════════════════════════ */}
          <motion.div
            className="auth-card-modern py-auth-terminal-card"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          >
            {/* Top Bar: Mode Indicator + Theme Toggle */}
            <div className="auth-card-top-row">
              <div className="py-auth-badge-chip">
                <Sparkles size={12} color="var(--py-yellow)" />
                <span>
                  {isOtpStep ? 'Security Keypad' : authMode === 'login' ? 'Authentication Gate' : 'New Developer Registration'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleTheme}
                className="auth-theme-btn"
                title={isCurrentLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {isCurrentLight ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            </div>

            {/* Mode Switcher Tabs (Sign In vs Create Account) */}
            {!isOtpStep && (
              <div className="auth-segmented-tabs py-auth-tab-switch">
                <button
                  type="button"
                  className={`auth-segmented-btn ${authMode === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                >
                  <KeyRound size={14} />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  className={`auth-segmented-btn ${authMode === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                >
                  <User size={14} />
                  <span>Create Account</span>
                </button>
              </div>
            )}

            {/* Inline Error & Success Alerts */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="auth-alert error-alert"
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="auth-alert success-alert"
                >
                  <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── FORM 1: LOGIN ─── */}
            {!isOtpStep && authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Welcome Back, Engineer
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Enter your credentials to resume your personalized Python journey.
                  </p>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Developer Email</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. shivanshushukla1919@gmail.com"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <div className="auth-label-row">
                    <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMsg('');
                      }}
                      className="auth-link-subtle"
                    >
                      Need an account?
                    </button>
                  </div>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your security password"
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-password-toggle"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="auth-submit-btn py-auth-submit-gradient"
                >
                  {isLoading ? (
                    <span>Authenticating Session...</span>
                  ) : (
                    <>
                      <span>Enter PyCosmos Platform</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ─── FORM 2: REGISTER ─── */}
            {!isOtpStep && authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Create Developer Profile
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Initialize your telemetry tracking, sandbox history, and mastery certifications.
                  </p>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Full Name</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shivanshu Shukla"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Developer Email</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. dev@pythonist.com"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <div className="auth-label-row">
                    <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                    {password && (
                      <span className="password-strength-tag" style={{ color: passwordStrength.color, fontSize: '0.72rem', fontWeight: 700 }}>
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-password-toggle"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Dynamic Password Strength Track */}
                  {password && (
                    <div className="password-strength-track">
                      <div
                        className="password-strength-fill"
                        style={{ width: `${passwordStrength.score}%`, background: passwordStrength.color }}
                      />
                    </div>
                  )}
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Curriculum Track Focus</label>
                  <div className="auth-track-selector py-auth-track-grid">
                    <button
                      type="button"
                      className={`track-pill-btn ${track === 'full_mastery' ? 'active' : ''}`}
                      onClick={() => setTrack('full_mastery')}
                    >
                      <Layers size={14} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800 }}>Full 51 Topics</div>
                        <div style={{ fontSize: '0.68rem', opacity: 0.75 }}>Syntax to Production</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`track-pill-btn ${track === 'ai_ml' ? 'active' : ''}`}
                      onClick={() => setTrack('ai_ml')}
                    >
                      <Brain size={14} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 800 }}>AI, ML & Systems</div>
                        <div style={{ fontSize: '0.68rem', opacity: 0.75 }}>PyTorch & Fast APIs</div>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password || !name}
                  className="auth-submit-btn py-auth-submit-gradient"
                >
                  {isLoading ? (
                    <span>Dispatched Security Code...</span>
                  ) : (
                    <>
                      <span>Continue & Verify Identity</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ─── FORM 3: OTP VERIFICATION STEP ─── */}
            {isOtpStep && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="auth-otp-section"
              >
                <div className="otp-icon-ring py-otp-beacon">
                  <KeyRound size={24} style={{ color: 'var(--py-yellow)' }} />
                </div>
                
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Verify Developer Email
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Enter the 6-digit cryptographic verification code sent to <strong style={{ color: 'var(--py-yellow)' }}>{email}</strong>
                </p>

                {/* Simulated Dispatch Card */}
                <div className="otp-simulation-card py-otp-card">
                  <div className="sim-top-row">
                    <span className="sim-badge">
                      <CheckCircle2 size={13} />
                      <span>Security Dispatch Active</span>
                    </span>
                    <div className="sim-actions">
                      <button
                        type="button"
                        onClick={autoFillOtp}
                        className="sim-btn"
                      >
                        ⚡ Auto-Fill
                      </button>
                      <button
                        type="button"
                        onClick={copySimulatedOtp}
                        className="sim-btn"
                      >
                        {copiedOtp ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedOtp ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="sim-code-row">
                    <span className="sim-code-display py-otp-display">{generatedOtp}</span>
                  </div>
                </div>

                {/* 6 Digit Inputs */}
                <div className="otp-inputs-grid py-otp-grid" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`otp-digit-box ${digit ? 'filled' : ''}`}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {/* Resend & Back controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', marginTop: '0.85rem' }}>
                  {isTimerActive ? (
                    <span style={{ color: 'var(--text-muted)' }}>
                      Resend code in <strong style={{ color: 'var(--py-yellow)' }}>{otpTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => triggerOtpGeneration(email)}
                      className="auth-link-subtle"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <RefreshCw size={12} />
                      <span>Resend Security Code</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsOtpStep(false)}
                    className="auth-link-subtle"
                  >
                    Edit Email Address
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  className="auth-submit-btn py-auth-submit-gradient"
                  style={{ marginTop: '1.25rem' }}
                >
                  {isLoading ? (
                    <span>Verifying Cryptographic Code...</span>
                  ) : (
                    <>
                      <span>Complete Registration & Enter</span>
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Instant Demo Access (Elevated Cyber Credentials) */}
            <div className="auth-demo-footer py-auth-demo-deck">
              <div className="demo-footer-title">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} color="var(--py-yellow)" />
                  <span>Verified Developer Passwords</span>
                </span>
                <span className="demo-instant-tag">1-CLICK INSTANT ENTRY</span>
              </div>
              <div className="demo-buttons-grid">
                {DEMO_ACCOUNTS.map((acc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickDemoLogin(acc)}
                    className="demo-card-btn py-demo-card"
                    title={`Instant login as ${acc.name}`}
                  >
                    <div className="demo-avatar-circle py-avatar-glow">{acc.avatar}</div>
                    <div className="demo-card-info">
                      <div className="demo-card-name-row">
                        <span className="demo-card-name">{acc.name}</span>
                        <span className="demo-badge-pill">{acc.badge}</span>
                      </div>
                      <div className="demo-card-role">{acc.role} • {acc.level}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
