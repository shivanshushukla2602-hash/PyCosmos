import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import RoadmapPage from './components/RoadmapPage';
import TopicDetail from './components/TopicDetail';
import ChecklistPage from './components/ChecklistPage';
import QuizPage from './components/QuizPage';
import DashboardPage from './components/DashboardPage';
import ResourcesPage from './components/ResourcesPage';
import HistoryPage from './components/HistoryPage';
import BookmarksDrawer from './components/BookmarksDrawer';
import AmbientBackground from './components/AmbientBackground';
import AuthPage from './components/AuthPage';
import MasteryTrackerPage from './components/MasteryTrackerPage';
import { TOPICS } from './data/topicsData';
import { Check } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import Footer from './components/Footer';

// Platform Owner & Admin Profile
const OWNER_ADMIN_USER = {
  name: 'Shivanshu Shukla',
  email: 'shivanshushukla1919@gmail.com',
  role: 'Platform Owner & Lead Architect',
  level: 'Grandmaster (Lvl 27)',
  avatar: 'SS',
  isAdmin: true,
  token: 'pyx_owner_permanent_session'
};

export default function App() {
  // Authentication State: Auto-authenticated as Platform Owner by default
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('pyradox_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // If an account is already logged in, preserve it, or upgrade if it's the owner's email
        if (parsed.email === 'shivanshushukla1919@gmail.com' || parsed.name === 'Shivansh Shukla') {
          const updated = { ...OWNER_ADMIN_USER, ...parsed, name: 'Shivanshu Shukla' };
          localStorage.setItem('pyradox_current_user', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      }
      // Auto-authenticate website owner by default so they never have to create account or log in
      localStorage.setItem('pyradox_current_user', JSON.stringify(OWNER_ADMIN_USER));
      return OWNER_ADMIN_USER;
    } catch {
      return OWNER_ADMIN_USER;
    }
  });

  const [currentView, setCurrentView] = useState('home'); // 'home'|'roadmap'|'mastery'|'learn'|'checklist'|'quizzes'|'dashboard'|'cheatsheet'|'resources'

  const [selectedTopicId, setSelectedTopicId] = useState(() => {
    return TOPICS[0]?.id || 'setup-and-fundamentals';
  });

  const [quizMode, setQuizMode] = useState('topic'); // 'topic' | 'live_api' | 'full'

  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('pyradox_theme') || 'dark');
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Granular Subtopics Status Map ('not_started' | 'learning' | 'completed')
  const [subtopicStatusMap, setSubtopicStatusMap] = useState(() => {
    try {
      const saved = localStorage.getItem('pyradox_subtopics_status');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleSubtopicStatus = (subId, newStatus) => {
    setSubtopicStatusMap((prev) => {
      const next = { ...prev, [subId]: newStatus };
      localStorage.setItem('pyradox_subtopics_status', JSON.stringify(next));
      return next;
    });
  };

  // Recently viewed topics history state
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pyradox_recent_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSelectTopicAndNavigate = (tId) => {
    setSelectedTopicId(tId);
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== tId);
      const next = [tId, ...filtered].slice(0, 5);
      localStorage.setItem('pyradox_recent_topics', JSON.stringify(next));
      return next;
    });
    setCurrentView('learn');
  };

  // Completed topics map
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('pyradox_completed');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Quiz scores map
  const [quizScoresMap, setQuizScoresMap] = useState(() => {
    try {
      const saved = localStorage.getItem('pyradox_quiz_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Bookmarked topic IDs
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pyradox_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Streak Tracker logic
  const [streakCount, setStreakCount] = useState(() => {
    try {
      const lastActive = localStorage.getItem('pyradox_last_active');
      const savedStreak = parseInt(localStorage.getItem('pyradox_streak') || '1', 10);
      const today = new Date().toDateString();

      if (lastActive) {
        const lastDate = new Date(lastActive);
        const diffDays = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          localStorage.setItem('pyradox_last_active', today);
          const newStreak = savedStreak + 1;
          localStorage.setItem('pyradox_streak', newStreak.toString());
          return newStreak;
        } else if (diffDays > 1) {
          localStorage.setItem('pyradox_last_active', today);
          localStorage.setItem('pyradox_streak', '1');
          return 1;
        }
      } else {
        localStorage.setItem('pyradox_last_active', today);
        localStorage.setItem('pyradox_streak', '1');
      }
      return savedStreak;
    } catch {
      return 1;
    }
  });

  // Theme effect
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('pyradox_theme', theme);
  }, [theme]);

  // Handle Mark Complete toggle
  const handleToggleComplete = (topicId) => {
    setCompletedMap((prev) => {
      const next = { ...prev, [topicId]: !prev[topicId] };
      localStorage.setItem('pyradox_completed', JSON.stringify(next));

      const topicObj = TOPICS.find((t) => t.id === topicId);
      const title = topicObj ? topicObj.title : 'Topic';
      showToast(!prev[topicId] ? `Marked "${title}" as mastered.` : `Marked "${title}" as pending.`);
      return next;
    });
  };

  // Handle Reset Progress
  const handleResetProgress = () => {
    setCompletedMap({});
    setQuizScoresMap({});
    setSubtopicStatusMap({});
    localStorage.removeItem('pyradox_completed');
    localStorage.removeItem('pyradox_quiz_scores');
    localStorage.removeItem('pyradox_subtopics_status');
    showToast("Progress reset successfully.");
  };

  // Handle Bookmark toggle
  const handleToggleBookmark = (topicId) => {
    setBookmarkedIds((prev) => {
      const isExist = prev.includes(topicId);
      const next = isExist ? prev.filter((id) => id !== topicId) : [...prev, topicId];
      localStorage.setItem('pyradox_bookmarks', JSON.stringify(next));

      const topicObj = TOPICS.find((t) => t.id === topicId);
      showToast(!isExist ? `Bookmarked "${topicObj?.title || 'Topic'}".` : `Removed bookmark.`);
      return next;
    });
  };

  // Save Quiz score
  const handleSaveQuizScore = (topicId, scorePercent) => {
    setQuizScoresMap((prev) => {
      const next = { ...prev, [topicId]: Math.max(prev[topicId] || 0, scorePercent) };
      localStorage.setItem('pyradox_quiz_scores', JSON.stringify(next));
      return next;
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User Login Handler (called after valid email+pass or successful OTP verify)
  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('pyradox_current_user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }
    showToast(`Welcome to PyCosmos, ${user.name.split(' ')[0]}.`);
  };

  // User Sign Out Handler
  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('pyradox_current_user');
    } catch (err) {
      console.error(err);
    }
    showToast("Signed out successfully. See you soon!");
  };

  // If not logged in, render AuthPage as the FIRST PAGE!
  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} theme={theme} setTheme={setTheme} />;
  }

  const currentTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];
  const completedCount = Object.values(completedMap).filter(Boolean).length;

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* Ambient Background scoped to Home Page */}
      {currentView === 'home' && <AmbientBackground />}

      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        streakCount={streakCount}
        bookmarkCount={bookmarkedIds.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        theme={theme}
        setTheme={setTheme}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* RENDER VIEW ACCORDING TO NAVIGATION */}
      <AnimatePresence mode="wait">
        <PageTransition key={currentView}>
          {currentView === 'home' && (
            <HomePage
              completedCount={completedCount}
              completedMap={completedMap}
              totalTopics={TOPICS.length}
              quizScoresMap={quizScoresMap}
              recentlyViewedIds={recentlyViewedIds}
              onNavigate={setCurrentView}
              onSelectTopic={handleSelectTopicAndNavigate}
              streakCount={streakCount}
            />
          )}

          {currentView === 'roadmap' && (
            <RoadmapPage
              completedMap={completedMap}
              onSelectNode={(nodeId) => {}}
              onNavigateToTopic={handleSelectTopicAndNavigate}
            />
          )}

          {currentView === 'mastery' && (
            <MasteryTrackerPage
              completedMap={completedMap}
              onNavigateToTopic={handleSelectTopicAndNavigate}
              subtopicStatusMap={subtopicStatusMap}
              onToggleSubtopicStatus={handleToggleSubtopicStatus}
            />
          )}

          {currentView === 'learn' && (
            <div className="layout-body">
              <Sidebar
                topics={TOPICS}
                selectedTopicId={selectedTopicId}
                onSelectTopic={setSelectedTopicId}
                completedMap={completedMap}
                onToggleComplete={handleToggleComplete}
                searchQuery={searchQuery}
              />

              <TopicDetail
                topic={currentTopic}
                isCompleted={!!completedMap[currentTopic.id]}
                onToggleComplete={handleToggleComplete}
                isBookmarked={bookmarkedIds.includes(currentTopic.id)}
                onToggleBookmark={handleToggleBookmark}
                onNavigateToQuiz={(tId, mode = 'topic') => {
                  setSelectedTopicId(tId);
                  setQuizMode(mode);
                  setCurrentView('quizzes');
                }}
                onNavigateToTopic={setSelectedTopicId}
                topicsList={TOPICS}
                onShowToast={showToast}
                subtopicStatusMap={subtopicStatusMap}
                onToggleSubtopicStatus={handleToggleSubtopicStatus}
              />
            </div>
          )}

          {currentView === 'checklist' && (
            <ChecklistPage
              topics={TOPICS}
              completedMap={completedMap}
              onToggleComplete={handleToggleComplete}
              onResetProgress={handleResetProgress}
              onNavigateToTopic={handleSelectTopicAndNavigate}
              subtopicStatusMap={subtopicStatusMap}
              onToggleSubtopicStatus={handleToggleSubtopicStatus}
              onShowToast={showToast}
            />
          )}

          {currentView === 'quizzes' && (
            <QuizPage
              topics={TOPICS}
              selectedTopicId={selectedTopicId}
              initialQuizMode={quizMode}
              onSaveQuizScore={handleSaveQuizScore}
              onNavigateToTopic={handleSelectTopicAndNavigate}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardPage
              topics={TOPICS}
              completedMap={completedMap}
              quizScoresMap={quizScoresMap}
              streakCount={streakCount}
              bookmarkedIds={bookmarkedIds}
              onNavigateToTopic={handleSelectTopicAndNavigate}
              currentUser={currentUser}
              subtopicStatusMap={subtopicStatusMap}
            />
          )}

          {currentView === 'history' && (
            <HistoryPage />
          )}

          {currentView === 'resources' && (
            <ResourcesPage />
          )}
        </PageTransition>
      </AnimatePresence>

      {/* GLOBAL FOOTER (CONSISTENT ACROSS ALL VIEWS) */}
      <Footer onNavigate={setCurrentView} />

      {/* BOOKMARKS DRAWER */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedIds={bookmarkedIds}
        topics={TOPICS}
        onSelectTopic={(tId) => {
          setSelectedTopicId(tId);
          setCurrentView('learn');
        }}
        onRemoveBookmark={handleToggleBookmark}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="toast">
          <Check size={18} style={{ color: 'var(--accent-emerald)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
