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
  Trophy
} from 'lucide-react';
import PyCosmosLogo from './PyCosmosLogo';
import { celebrate } from '../utils/celebrate';

// Pre-seeded demo accounts for instant evaluation
const DEMO_ACCOUNTS = [
  {
    name: 'Shivanshu Shukla',
    email: 'shivanshushukla1919@gmail.com',
    password: 'shivanshu19',
    role: 'Lead Architect',
    level: 'Master (Lvl 27)',
    avatar: 'SS'
  },
  {
    name: 'Alex Rivera',
    email: 'alex@pycosmos.dev',
    password: 'password123',
    role: 'AI/ML Track Student',
    level: 'Intermediate (Lvl 12)',
    avatar: 'AR'
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
    }, 500);
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
    }, 450);
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
    }, 600);
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
    }, 350);
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
    <div className="auth-page-root">
      {/* Ambient Python Logo Glow */}
      <div className="auth-ambient-glow" />

      <div className="auth-portal-wrapper">
        <div className="auth-portal-grid">
          
          {/* ══════════ LEFT COLUMN: PROFESSIONAL DEVELOPER SHOWCASE ══════════ */}
          <motion.div
            className="auth-showcase-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div>
              {/* Brand Header */}
              <div className="auth-showcase-brand">
                <PyCosmosLogo size={38} animated={true} />
                <div>
                  <div className="auth-showcase-logo-text">
                    <span className="brand-blue">Py</span>
                    <span className="brand-yellow">Cosmos</span>
                  </div>
                  <div className="auth-showcase-tagline">A whole universe of Python in one place</div>
                </div>
              </div>

              {/* Main Headline */}
              <div className="auth-showcase-hero">
                <h1 className="auth-showcase-heading">
                  Master Python with <span className="forge-gradient-text">Structured Precision</span>
                </h1>
                <p className="auth-showcase-subheading">
                  From foundational syntax to high-throughput system architecture.
                  Follow a structured curriculum designed for engineers who want genuine depth.
                </p>
              </div>

              {/* Clean Python Terminal Session Widget */}
              <div className="auth-showcase-terminal">
                <div className="terminal-header-bar">
                  <div className="terminal-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <span className="terminal-title">workspace_session.py</span>
                  <span className="terminal-env-badge">Python 3.12</span>
                </div>
                <div className="terminal-body-code">
                  <div><span className="code-kw">from</span> pycosmos <span className="code-kw">import</span> Curriculum, Workspace</div>
                  <div style={{ height: '0.4rem' }} />
                  <div><span className="code-comment"># Connect to personalized developer roadmap</span></div>
                  <div>workspace = Workspace.connect()</div>
                  <div>curriculum = Curriculum.load(track=<span className="code-str">"core_production"</span>)</div>
                  <div style={{ height: '0.4rem' }} />
                  <div><span className="code-output">&gt;&gt;&gt; Ready: 10 structured progression stages</span></div>
                  <div><span className="code-output">&gt;&gt;&gt; In-browser execution initialized</span></div>
                </div>
              </div>
            </div>

            {/* Focused Key Benefits (No tech stack bragging or how the website was built) */}
            <div className="auth-showcase-highlights">
              <div className="showcase-highlight-item">
                <div className="highlight-icon-wrap">
                  <Layers size={15} />
                </div>
                <div>
                  <div className="highlight-title">Sequential Stage-by-Stage Progression</div>
                  <div className="highlight-desc">Clear milestones with zero guesswork on what to study next</div>
                </div>
              </div>

              <div className="showcase-highlight-item">
                <div className="highlight-icon-wrap">
                  <Terminal size={15} />
                </div>
                <div>
                  <div className="highlight-title">Live In-Browser Code Execution</div>
                  <div className="highlight-desc">Practice syntax and test algorithms right in your browser session</div>
                </div>
              </div>

              <div className="showcase-highlight-item">
                <div className="highlight-icon-wrap">
                  <Trophy size={15} />
                </div>
                <div>
                  <div className="highlight-title">Evaluated Topic Quizzes</div>
                  <div className="highlight-desc">Test your understanding with targeted questions and immediate feedback</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ══════════ RIGHT COLUMN: AUTHENTICATION FORM CARD ══════════ */}
          <motion.div
            className="auth-card-modern"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          >
            {/* Top Bar: Mode Indicator + Theme Toggle */}
            <div className="auth-card-top-row">
              <span className="auth-mode-indicator">
                {isOtpStep ? 'Security Verification' : authMode === 'login' ? 'Account Sign In' : 'Account Registration'}
              </span>

              <button
                type="button"
                onClick={handleToggleTheme}
                className="auth-theme-btn"
                title={isCurrentLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {isCurrentLight ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            </div>

            {/* Mode Switcher Tabs (Hidden during OTP step) */}
            {!isOtpStep && (
              <div className="auth-segmented-tabs">
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
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Welcome back
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Enter your email and password to resume your Python roadmap.
                  </p>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Email Address</label>
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
                      placeholder="Enter your password"
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
                  className="auth-submit-btn"
                >
                  {isLoading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In to PyCosmos</span>
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
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Create your account
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Start tracking your progress and solve interactive Python exercises.
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
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. dev@domain.com"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Password</label>
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
                </div>

                <div className="auth-field-group">
                  <label className="auth-label">Primary Learning Focus</label>
                  <div className="auth-track-selector">
                    <button
                      type="button"
                      className={`track-pill-btn ${track === 'full_mastery' ? 'active' : ''}`}
                      onClick={() => setTrack('full_mastery')}
                    >
                      <Layers size={14} />
                      <span>Full Curriculum</span>
                    </button>
                    <button
                      type="button"
                      className={`track-pill-btn ${track === 'ai_ml' ? 'active' : ''}`}
                      onClick={() => setTrack('ai_ml')}
                    >
                      <Terminal size={14} />
                      <span>AI & Systems</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !password || !name}
                  className="auth-submit-btn"
                >
                  {isLoading ? (
                    <span>Sending Code...</span>
                  ) : (
                    <>
                      <span>Continue & Verify</span>
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
                <div className="otp-icon-ring">
                  <KeyRound size={22} style={{ color: 'var(--py-yellow)' }} />
                </div>
                
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Verify your email
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Enter the 6-digit verification code sent to <strong style={{ color: 'var(--py-yellow)' }}>{email}</strong>
                </p>

                {/* Simulated Dispatch Card */}
                <div className="otp-simulation-card">
                  <div className="sim-top-row">
                    <span className="sim-badge">
                      <CheckCircle2 size={13} />
                      <span>Verification Code</span>
                    </span>
                    <div className="sim-actions">
                      <button
                        type="button"
                        onClick={autoFillOtp}
                        className="sim-btn"
                      >
                        Auto-Fill
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
                    <span className="sim-code-display">{generatedOtp}</span>
                  </div>
                </div>

                {/* 6 Digit Inputs */}
                <div className="otp-inputs-grid" onPaste={handleOtpPaste}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', marginTop: '0.75rem' }}>
                  {isTimerActive ? (
                    <span style={{ color: 'var(--text-muted)' }}>
                      Resend code in <strong style={{ color: 'var(--text-primary)' }}>{otpTimer}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => triggerOtpGeneration(email)}
                      className="auth-link-subtle"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <RefreshCw size={12} />
                      <span>Resend Code</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsOtpStep(false)}
                    className="auth-link-subtle"
                  >
                    Change Email
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  className="auth-submit-btn"
                  style={{ marginTop: '1.25rem' }}
                >
                  {isLoading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Quick Demo Access (Clean & Professional) */}
            <div className="auth-demo-footer">
              <div className="demo-footer-title">
                <span>Developer Demo Access</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Instant Entry</span>
              </div>
              <div className="demo-buttons-grid">
                {DEMO_ACCOUNTS.map((acc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickDemoLogin(acc)}
                    className="demo-card-btn"
                    title={`Click to log in as ${acc.name}`}
                  >
                    <div className="demo-avatar-circle">{acc.avatar}</div>
                    <div className="demo-card-info">
                      <div className="demo-card-name">{acc.name}</div>
                      <div className="demo-card-role">{acc.role}</div>
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
