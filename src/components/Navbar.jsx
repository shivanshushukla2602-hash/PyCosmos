import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import {
  Flame,
  Bookmark,
  Sun,
  Moon,
  Home,
  Map,
  BookOpen,
  ListTodo,
  HelpCircle,
  BarChart3,
  Compass,
  Trophy,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import PyCosmosLogo from './PyCosmosLogo';

export default function Navbar({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  streakCount = 1,
  bookmarkCount = 0,
  onOpenBookmarks,
  theme,
  setTheme,
  currentUser,
  onSignOut
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStreakTooltip, setShowStreakTooltip] = useState(false);
  const { scrollYProgress } = useScroll();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'mastery', label: 'Mastery Tracker', icon: Trophy },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'checklist', label: 'Checklist', icon: ListTodo },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'resources', label: 'Resources', icon: Compass }
  ];

  // 7-day week dots for the dynamic streak popover
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIdx = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar-wrapper no-print">
      {/* 1. TOP SCROLL PROGRESS BAR (PYTHON YELLOW) */}
      <div className="navbar-scroll-progress-track">
        <motion.div
          className="navbar-scroll-progress-bar"
          style={{
            scaleX: scrollYProgress,
            transformOrigin: '0% 50%'
          }}
        />
      </div>

      {/* 2. FLOATING BLURRED GLASS BAR */}
      <div className="navbar-floating-bar">
        {/* BRAND LOGO & TAGLINE */}
        <div
          className="brand"
          onClick={() => handleNavClick('home')}
          title="PyCosmos — A whole universe of Python in one place"
        >
          <PyCosmosLogo size={32} animated={true} />
          <div className="brand-text-block">
            <div className="brand-name">
              <span className="brand-blue">Py</span>
              <span className="brand-yellow brand-shimmer-hover">Cosmos</span>
            </div>
            <span className="brand-tagline">
              Universe of Python
            </span>
          </div>
        </div>

        {/* DESKTOP NAVIGATION TABS WITH ANIMATED SLIDING PILL */}
        <nav className="nav-links desktop-only" aria-label="Main Navigation">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentView === t.id;

            return (
              <button
                key={t.id}
                className={`nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(t.id)}
                type="button"
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="active-pill-bg"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Icon size={15} className="nav-tab-icon" />
                <span className="nav-tab-label">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS: STREAK, BOOKMARKS, THEME TOGGLE, USER PROFILE, MOBILE TOGGLE */}
        <div className="navbar-controls-right">
          {/* Dynamic Interactive Streak Badge (Yellow Flame) */}
          <div
            className="streak-container"
            onMouseEnter={() => setShowStreakTooltip(true)}
            onMouseLeave={() => setShowStreakTooltip(false)}
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="streak-badge"
              onClick={() => handleNavClick('dashboard')}
              title="Click to view learning activity stats"
            >
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  rotate: [-5, 5, -5],
                  filter: [
                    'drop-shadow(0 0 2px #FFD43B)',
                    'drop-shadow(0 0 8px #FFD43B)',
                    'drop-shadow(0 0 2px #FFD43B)'
                  ]
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Flame size={16} fill="var(--py-yellow)" color="var(--py-yellow)" />
              </motion.div>
              <span className="streak-badge-text">
                {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
              </span>
            </motion.div>

            {/* Streak Popover on Hover */}
            <AnimatePresence>
              {showStreakTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="streak-popover"
                >
                  <div className="streak-popover-header">
                    <Flame size={15} fill="var(--py-yellow)" color="var(--py-yellow)" />
                    <span>{streakCount}-Day Practice Streak</span>
                  </div>
                  <p className="streak-popover-desc">
                    Solve a quiz or complete a lesson today to keep your Python streak burning!
                  </p>

                  {/* 7-Day Mini Tracker Dots */}
                  <div className="streak-days-track">
                    {weekDays.map((d, i) => {
                      const isDoneOrToday = i <= todayDayIdx;
                      return (
                        <div key={i} className="streak-day-col">
                          <span className="streak-day-label">{d}</span>
                          <div
                            className={`streak-day-dot ${isDoneOrToday ? 'done' : 'pending'}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bookmarks Drawer Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenBookmarks}
            className="navbar-icon-btn"
            title={`Revision Bookmarks (${bookmarkCount})`}
            type="button"
            aria-label="Bookmarks"
          >
            <Bookmark size={17} />
            {bookmarkCount > 0 && (
              <span className="navbar-badge-counter">{bookmarkCount}</span>
            )}
          </motion.button>

          {/* Theme Toggle (Light / Dark) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="navbar-icon-btn theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            type="button"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex' }}
              >
                {theme === 'dark' ? (
                  <Sun size={17} style={{ color: 'var(--py-yellow)' }} />
                ) : (
                  <Moon size={17} style={{ color: 'var(--py-blue)' }} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* User Profile Pill & Dropdown */}
          {currentUser && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="navbar-user-pill"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div
                  className="navbar-avatar-circle"
                  style={
                    currentUser.isAdmin
                      ? { border: '1.5px solid var(--py-yellow)', background: 'rgba(255, 212, 59, 0.2)' }
                      : {}
                  }
                >
                  {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="navbar-user-meta desktop-only">
                  <span className="navbar-user-name">
                    {currentUser.name.split(' ')[0]}
                    {currentUser.isAdmin && (
                      <ShieldCheck size={12} style={{ color: 'var(--py-yellow)' }} title="Platform Owner & Architect" />
                    )}
                  </span>
                  <span className="navbar-user-role" style={{ color: currentUser.isAdmin ? 'var(--py-yellow)' : 'inherit' }}>
                    {currentUser.isAdmin ? 'Owner / Admin' : currentUser.level || 'Mastery'}
                  </span>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>

              {/* Dropdown User Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="navbar-user-dropdown"
                  >
                    <div className="dropdown-user-header">
                      <div className="dropdown-name">
                        <span>{currentUser.name}</span>
                        {currentUser.isAdmin && (
                          <span className="owner-badge">
                            OWNER
                          </span>
                        )}
                      </div>
                      <div className="dropdown-email">{currentUser.email}</div>
                      <div className="dropdown-role-badge">
                        <ShieldCheck size={12} />
                        <span>{currentUser.role || 'Python Pro'}</span>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleNavClick('mastery');
                      }}
                      className="dropdown-item"
                    >
                      <Trophy size={15} />
                      <span>View 27-Level Tracker</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleNavClick('dashboard');
                      }}
                      className="dropdown-item"
                    >
                      <BarChart3 size={15} />
                      <span>My Learning Analytics</span>
                    </button>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="dropdown-item signout-item"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* MOBILE MENU TOGGLE (COLLAPSIBLE HAMBURGER) */}
          <button
            type="button"
            className="navbar-icon-btn mobile-menu-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 3. MOBILE MENU DROPDOWN PANEL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="navbar-mobile-drawer mobile-only"
          >
            <div className="mobile-drawer-inner">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = currentView === t.id;

                return (
                  <button
                    key={t.id}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(t.id)}
                    type="button"
                  >
                    <Icon size={18} />
                    <span>{t.label}</span>
                    {isActive && <div className="mobile-nav-active-dot" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
