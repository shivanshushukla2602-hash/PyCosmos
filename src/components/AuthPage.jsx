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
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Layers,
  Cpu,
  Zap,
  BookOpen
} from 'lucide-react';
import PyCosmosLogo from './PyCosmosLogo';
import HeartLogo from './HeartLogo';
import { celebrate } from '../utils/celebrate';

// Owner Account definition
const OWNER_ACCOUNT = {
  name: 'Shivanshu Shukla',
  email: 'shivanshushukla1919@gmail.com',
  password: 'shivanshu19',
  role: 'Platform Owner & Lead Architect',
  level: 'Grandmaster (Lvl 27)',
  avatar: 'SS',
  badge: 'Owner / Admin',
  isAdmin: true
};

export default function AuthPage({ onLogin, initialMode = 'register', theme, setTheme }) {
  // Mode: 'login' | 'register' (Defaults to 'register' / Signup page)
  const [authMode, setAuthMode] = useState(initialMode);

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

  // Synchronize authMode whenever initialMode is supplied/updated
  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

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
    if (!pass) return { score: 0, label: 'Empty', color: '#e2e8f0' };
    if (pass.length < 6) return { score: 25, label: 'Too short', color: '#ef4444' };
    let score = 50;
    if (pass.length >= 8) score += 20;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;
    if (score >= 90) return { score: 100, label: 'Hardened', color: '#16a34a' };
    if (score >= 70) return { score: 75, label: 'Strong', color: '#e5a800' };
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
    setSuccessMsg(`Verification code sent to ${targetEmail}`);
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

      // Check against stored accounts and owner account
      const allAccounts = [OWNER_ACCOUNT, ...accounts];
      const foundUser = allAccounts.find(
        (acc) => acc.email.toLowerCase() === cleanEmail
      );

      if (!foundUser) {
        setErrorMsg('No account found with this email. Please switch to Create Account.');
        return;
      }

      if (foundUser.password !== password) {
        setErrorMsg('Invalid password. Please check your credentials and retry.');
        return;
      }

      // Successful login
      celebrate();
      onLogin(foundUser);
    }, 450);
  };

  // 2. New User Registration Request
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full developer name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid developer email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    // Check if account already exists
    let existing = [];
    try {
      const stored = localStorage.getItem('pyradox_registered_users');
      existing = stored ? JSON.parse(stored) : [];
    } catch {
      existing = [];
    }

    if (existing.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg('An account with this email already exists. Please sign in instead.');
      return;
    }

    // Transition to OTP verification step
    triggerOtpGeneration(email.trim());
  };

  // 3. Handle Digit input for OTP
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal.slice(-1);
    setOtpDigits(newDigits);

    if (cleanVal && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    const focusTarget = Math.min(pasted.length, 5);
    if (inputRefs.current[focusTarget]) {
      inputRefs.current[focusTarget].focus();
    }
  };

  // 4. Verify OTP and finalize account creation
  const handleVerifyOtp = () => {
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    if (entered !== generatedOtp && entered !== '123456') {
      setErrorMsg('Verification code mismatch. Please check the simulated OTP code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      const newUser = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: track === 'ai_systems' ? 'AI Systems Specialist' : 'Full-Stack Python Engineer',
        level: 'Novice Voyager (Lvl 01)',
        avatar: name.trim().slice(0, 2).toUpperCase() || 'PY',
        track: track,
        registeredAt: new Date().toISOString()
      };

      try {
        const stored = localStorage.getItem('pyradox_registered_users');
        const list = stored ? JSON.parse(stored) : [];
        list.push(newUser);
        localStorage.setItem('pyradox_registered_users', JSON.stringify(list));
      } catch (err) {
        console.error(err);
      }

      celebrate();
      onLogin(newUser);
    }, 450);
  };

  // Copy simulated OTP helper
  const handleCopySimulatedOtp = () => {
    if (!generatedOtp) return;
    navigator.clipboard.writeText(generatedOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  return (
    <div
      className="auth-light-page-wrapper"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 50%, #F1F5F9 100%)',
        padding: '2.5rem 1.25rem',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Subtle Python brand ambient background blooms */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '15%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(48, 105, 152, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 212, 59, 0.16) 0%, transparent 70%)',
          filter: 'blur(75px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 2 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
            <PyCosmosLogo size={56} />
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: '#0A1018',
              letterSpacing: '-0.025em',
              margin: '0 0 0.35rem 0'
            }}
          >
            Py<span style={{ color: '#306998' }}>Cosmos</span>
          </h1>
          <p
            style={{
              fontSize: '0.92rem',
              color: '#475569',
              margin: '0 0 0.85rem 0',
              fontWeight: 500
            }}
          >
            Universe of Python • Architectural Learning Gateway
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(48, 105, 152, 0.08)',
              border: '1px solid rgba(48, 105, 152, 0.2)',
              color: '#205075',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.76rem',
              fontWeight: 700
            }}
          >
            <Sparkles size={12} color="#e5a800" />
            <span>Python 3.12 Engine • Zero Setup WASM</span>
          </div>
        </div>

        {/* Clean Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '24px',
            boxShadow: '0 12px 36px -8px rgba(48, 105, 152, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
            padding: '2.25rem 2.25rem',
            boxSizing: 'border-box'
          }}
        >
          {/* Segmented Switcher (Sign In vs Create Account) */}
          {!isOtpStep && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.35rem',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '0.35rem',
                marginBottom: '1.75rem'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: authMode === 'register' ? '#FFFFFF' : 'transparent',
                  color: authMode === 'register' ? '#0A1018' : '#64748B',
                  boxShadow: authMode === 'register' ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <User size={15} color={authMode === 'register' ? '#e5a800' : '#64748B'} />
                <span>Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  background: authMode === 'login' ? '#FFFFFF' : 'transparent',
                  color: authMode === 'login' ? '#0A1018' : '#64748B',
                  boxShadow: authMode === 'login' ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <KeyRound size={15} color={authMode === 'login' ? '#306998' : '#64748B'} />
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Error & Success Alerts */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#b91c1c',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem'
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  background: 'rgba(22, 163, 74, 0.08)',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  color: '#15803d',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem'
                }}
              >
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form 1: Sign In */}
          {!isOtpStep && authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Developer Email
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <Mail size={16} color="#64748B" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@pythonist.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#0A1018',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#334155',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.78rem',
                      color: '#306998',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Need an account?
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <Lock size={16} color="#64748B" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#0A1018',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #306998 0%, #205075 100%)',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: isLoading ? 'default' : 'pointer',
                  boxShadow: '0 4px 16px rgba(48, 105, 152, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter PyCosmos Platform</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
              <div style={{ textAlign: 'center', marginTop: '0.4rem', fontSize: '0.84rem', color: '#64748B' }}>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#306998',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {/* Form 2: Create Account */}
          {!isOtpStep && authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Full Name
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem'
                  }}
                >
                  <User size={16} color="#64748B" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shivanshu Shukla"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#0A1018',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Developer Email
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem'
                  }}
                >
                  <Mail size={16} color="#64748B" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. dev@pythonist.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#0A1018',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#334155',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    Password
                  </label>
                  {password && (
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem'
                  }}
                >
                  <Lock size={16} color="#64748B" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password (6+ chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#0A1018',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength Meter Bar */}
                {password && (
                  <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '9999px', marginTop: '0.4rem', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${passwordStrength.score}%`,
                        background: passwordStrength.color,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Track Selector */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: '0.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Curriculum Track Focus
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setTrack('full_mastery')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '12px',
                      border: track === 'full_mastery' ? '1.5px solid #306998' : '1.5px solid #E2E8F0',
                      background: track === 'full_mastery' ? 'rgba(48, 105, 152, 0.06)' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0A1018', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Layers size={14} color="#306998" /> 51 Topics Track
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.2rem' }}>
                      Syntax to Architecture
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTrack('ai_systems')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0.75rem 0.85rem',
                      borderRadius: '12px',
                      border: track === 'ai_systems' ? '1.5px solid #e5a800' : '1.5px solid #E2E8F0',
                      background: track === 'ai_systems' ? 'rgba(255, 212, 59, 0.08)' : '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0A1018', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Cpu size={14} color="#e5a800" /> AI & Systems Track
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.2rem' }}>
                      PyTorch & Fast APIs
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #306998 0%, #205075 100%)',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: isLoading ? 'default' : 'pointer',
                  boxShadow: '0 4px 16px rgba(48, 105, 152, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Continue & Verify Identity</span>
                <ArrowRight size={17} />
              </button>
              <div style={{ textAlign: 'center', marginTop: '0.4rem', fontSize: '0.84rem', color: '#64748B' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#306998',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* Form 3: OTP Verification Keypad */}
          {isOtpStep && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0A1018', margin: '0 0 0.35rem 0' }}>
                  Verify Developer Identity
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                  Enter the 6-digit cryptographic code sent to <strong style={{ color: '#0A1018' }}>{email}</strong>
                </p>
              </div>

              {/* Simulated Code Pill with Copy Helper */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '0.65rem 1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="#306998" />
                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Simulated OTP:</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#306998', letterSpacing: '0.1em' }}>
                    {generatedOtp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySimulatedOtp}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  {copiedOtp ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  <span>{copiedOtp ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* 6 Digit Inputs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '0.5rem'
                }}
                onPaste={handleOtpPaste}
              >
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
                    style={{
                      width: '100%',
                      height: '52px',
                      textAlign: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      background: digit ? 'rgba(48, 105, 152, 0.05)' : '#F8FAFC',
                      border: digit ? '2px solid #306998' : '1.5px solid #CBD5E1',
                      borderRadius: '12px',
                      color: '#0A1018',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Controls: Resend & Edit Email */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                {isTimerActive ? (
                  <span style={{ color: '#64748B' }}>
                    Resend code in <strong style={{ color: '#e5a800' }}>{otpTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerOtpGeneration(email)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#306998',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: 0
                    }}
                  >
                    <RefreshCw size={13} />
                    <span>Resend Code</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Edit Email
                </button>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading || otpDigits.join('').length !== 6}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #306998 0%, #205075 100%)',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: isLoading || otpDigits.join('').length !== 6 ? 'default' : 'pointer',
                  opacity: otpDigits.join('').length === 6 ? 1 : 0.65,
                  boxShadow: '0 4px 16px rgba(48, 105, 152, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <span>Complete Registration & Enter</span>
                    <CheckCircle2 size={17} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* 1-Click Fast Pass for Platform Owner Only (Shivanshu Shukla) */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              celebrate();
              onLogin(OWNER_ACCOUNT);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#FFFFFF',
              border: '1.5px dashed rgba(48, 105, 152, 0.35)',
              color: '#205075',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease'
            }}
            title="Platform Owner 1-Click Instant Access"
          >
            <ShieldCheck size={14} color="#e5a800" />
            <span>Owner 1-Click Access (Shivanshu Shukla)</span>
          </button>
        </div>

        {/* Consistent PyCosmos Footer Attribution on Auth Page */}
        <div className="footer-bottom-centered" style={{ marginTop: '2.5rem' }}>
          <div className="footer-attribution">
            <span className="footer-built-blue">Built with</span>
            <HeartLogo size={26} />
            <span className="footer-built-blue">by</span>
            <strong className="footer-author-yellow">Shivanshu Shukla</strong>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} PyCosmos. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
