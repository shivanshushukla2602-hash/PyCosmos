import React from 'react';
import {
  Heart,
  Map,
  BookOpen,
  CheckSquare,
  HelpCircle,
  BarChart3,
  FileCode,
  Compass,
  Trophy,
  ArrowRight
} from 'lucide-react';
import PyCosmosLogo from './PyCosmosLogo';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (viewId) => {
    if (onNavigate) {
      onNavigate(viewId);
    }
    scrollToTop();
  };

  return (
    <footer className="pycosmos-global-footer pyforge-global-footer no-print">
      <div className="footer-container">
        {/* Top Multi-Column Content Grid */}
        <div className="footer-grid">
          
          {/* Column 1: Brand & Purpose */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-header" onClick={() => handleNav('home')}>
              <PyCosmosLogo size={34} animated={false} />
              <div className="footer-brand-title">
                <span className="brand-blue">Py</span>
                <span className="brand-yellow">Cosmos</span>
              </div>
            </div>
            
            <p className="footer-brand-desc">
              PyCosmos: a whole universe of Python in one place. A comprehensive platform designed to take you from core programming fundamentals to production-ready systems and applied AI. Practice through structured progression, hands-on lessons, and milestone verification.
            </p>

            <div className="footer-brand-badge">
              <span className="footer-badge-dot" />
              <span>Interactive Python Learning & Practice Platform</span>
            </div>
          </div>

          {/* Column 2: What's in the Website (Curriculum & Study) */}
          <div className="footer-col">
            <h4 className="footer-col-title">What PyCosmos Offers</h4>
            <ul className="footer-features-list">
              <li>
                <button type="button" onClick={() => handleNav('roadmap')} className="footer-feature-item">
                  <Map size={15} className="footer-icon-accent" />
                  <div>
                    <strong>Visual 10-Stage Roadmap</strong>
                    <span>Step-by-step path from basics to advanced engineering</span>
                  </div>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('learn')} className="footer-feature-item">
                  <BookOpen size={15} className="footer-icon-accent" />
                  <div>
                    <strong>Interactive Lessons</strong>
                    <span>Deep-dive topics with code examples and explanations</span>
                  </div>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('resources')} className="footer-feature-item">
                  <Compass size={15} className="footer-icon-accent" />
                  <div>
                    <strong>Curated Resources</strong>
                    <span>Essential guides, official docs, and reference libraries</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: What It Will Do (Practice & Mastery) */}
          <div className="footer-col">
            <h4 className="footer-col-title">How It Builds Your Skills</h4>
            <ul className="footer-features-list">
              <li>
                <button type="button" onClick={() => handleNav('quizzes')} className="footer-feature-item">
                  <HelpCircle size={15} className="footer-icon-accent" />
                  <div>
                    <strong>Targeted Quizzes</strong>
                    <span>Test understanding with instant evaluation and feedback</span>
                  </div>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('mastery')} className="footer-feature-item">
                  <Trophy size={15} className="footer-icon-accent" />
                  <div>
                    <strong>Skill Mastery Tracking</strong>
                    <span>Monitor completion stages and measure skill growth</span>
                  </div>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('checklist')} className="footer-feature-item">
                  <CheckSquare size={15} className="footer-icon-accent" />
                  <div>
                    <strong>Interactive Checklist</strong>
                    <span>Track progress topic-by-topic with saved state</span>
                  </div>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('learn')} className="footer-feature-item">
                  <BookOpen size={15} className="footer-icon-accent" />
                  <div>
                    <strong>Interactive Sandbox</strong>
                    <span>Test and execute Python code directly in browser</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Navigation</h4>
            <div className="footer-quick-links">
              <button type="button" onClick={() => handleNav('home')} className="footer-link-btn">Home</button>
              <button type="button" onClick={() => handleNav('roadmap')} className="footer-link-btn">Roadmap</button>
              <button type="button" onClick={() => handleNav('learn')} className="footer-link-btn">Learn</button>
              <button type="button" onClick={() => handleNav('mastery')} className="footer-link-btn">Mastery Tracker</button>
              <button type="button" onClick={() => handleNav('checklist')} className="footer-link-btn">Checklist</button>
              <button type="button" onClick={() => handleNav('quizzes')} className="footer-link-btn">Quizzes</button>
              <button type="button" onClick={() => handleNav('dashboard')} className="footer-link-btn">Dashboard</button>
              <button type="button" onClick={() => handleNav('resources')} className="footer-link-btn">Resources</button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Bar: Centered Built with Love by Shivanshu Shukla */}
        <div className="footer-bottom-centered">
          <div className="footer-attribution">
            <span className="footer-built-blue">Built with</span>
            <Heart
              size={16}
              className="footer-heart-icon"
              fill="#ef4444"
              color="#ef4444"
            />
            <span className="footer-built-blue">by</span>
            <strong className="footer-author-yellow">Shivanshu Shukla</strong>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} PyCosmos. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
