import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  Search,
  X,
  BookOpen,
  Sparkles,
  Terminal,
  Layers,
  Cpu,
  Shield,
  Workflow,
  Award
} from 'lucide-react';
import { CATEGORIES } from '../data/topicsData';
import PyCosmosLogo from './PyCosmosLogo';

const CATEGORY_ICONS = {
  "Foundation": Terminal,
  "Core Data Structures": Layers,
  "Functions": Workflow,
  "Practical Python": BookOpen,
  "OOP & Protocols": Cpu,
  "Python Internals": Shield,
  "Standard Library": BookOpen,
  "Professional Python": Award,
  "Development & AI/ML": Sparkles,
  "Projects & Problem Solving": Award
};

export default function Sidebar({
  topics,
  selectedTopicId,
  onSelectTopic,
  completedMap,
  onToggleComplete,
  searchQuery,
  setSearchQuery
}) {
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const init = {};
    CATEGORIES.forEach((cat, idx) => {
      init[cat] = idx <= 1; // default expand first two categories
    });
    return init;
  });

  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleSearchChange = (val) => {
    setLocalSearch(val);
    if (setSearchQuery) setSearchQuery(val);
  };

  // Filter topics
  const query = localSearch.trim().toLowerCase();
  const filteredTopics = query
    ? topics.filter((t) =>
        t.title.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      )
    : topics;

  const totalCompleted = Object.values(completedMap).filter(Boolean).length;
  const totalTopicsCount = topics.length;
  const overallPercent = totalTopicsCount > 0 ? Math.round((totalCompleted / totalTopicsCount) * 100) : 0;

  return (
    <aside className="py-sidebar-container no-print">
      {/* ── TOP HEADER & PROGRESS ── */}
      <div className="py-sidebar-top-deck">
        <div className="py-sidebar-brand-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <PyCosmosLogo size={24} animated={false} />
            <div>
              <span className="py-sidebar-title">Python Curriculum</span>
              <span className="py-sidebar-tagline">51 In-Depth Modules</span>
            </div>
          </div>
          <span className="py-sidebar-counter-chip">
            <strong>{totalCompleted}</strong> / {totalTopicsCount}
          </span>
        </div>

        {/* Global Mini Progress Bar */}
        <div className="py-sidebar-global-track">
          <div
            className="py-sidebar-global-fill"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        {/* Search Input Box */}
        <div className="py-sidebar-search-box">
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            className="py-sidebar-search-input"
            placeholder="Search topic or concept..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {localSearch && (
            <button
              type="button"
              className="py-sidebar-clear-btn"
              onClick={() => handleSearchChange('')}
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── CATEGORIES & TOPICS ACCORDION ── */}
      <div className="py-sidebar-tree-body">
        {CATEGORIES.map((category) => {
          const categoryTopics = filteredTopics.filter((t) => t.category === category);
          if (categoryTopics.length === 0 && query) return null;

          const categoryCompleted = categoryTopics.filter((t) => completedMap[t.id]).length;
          const totalCount = categoryTopics.length;
          const percent = totalCount > 0 ? Math.round((categoryCompleted / totalCount) * 100) : 0;
          const isExpanded = query ? true : !!expandedCategories[category];
          const CategoryIcon = CATEGORY_ICONS[category] || BookOpen;

          return (
            <div key={category} className="py-sidebar-category-group">
              <button
                type="button"
                className="py-sidebar-category-header"
                onClick={() => toggleCategory(category)}
              >
                <div className="cat-header-left">
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'flex' }}
                  >
                    <ChevronDown size={14} color="var(--text-muted)" />
                  </motion.div>
                  <CategoryIcon size={14} color="var(--py-blue-light)" />
                  <span className="py-cat-title">{category}</span>
                </div>

                <div className="cat-header-right">
                  <span className="py-cat-count">
                    {categoryCompleted}/{totalCount}
                  </span>
                  <div className="py-cat-mini-bar">
                    <div
                      className="py-cat-mini-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* TOPIC LIST */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="py-sidebar-topic-list"
                  >
                    {categoryTopics.map((topic) => {
                      const isDone = !!completedMap[topic.id];
                      const isActive = topic.id === selectedTopicId;

                      return (
                        <motion.li
                          key={topic.id}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.12 }}
                          className={`py-sidebar-topic-item ${isActive ? 'is-active' : ''}`}
                          onClick={() => onSelectTopic(topic.id)}
                        >
                          {/* Completion Toggle Dot */}
                          <div
                            className="py-topic-status-check"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(topic.id);
                            }}
                            title={isDone ? 'Mark as incomplete' : 'Mark as mastered'}
                          >
                            {isDone ? (
                              <CheckCircle2 size={14} color="#22c55e" />
                            ) : (
                              <Circle size={14} color="rgba(255, 255, 255, 0.25)" />
                            )}
                          </div>

                          {/* Topic Name */}
                          <span className="py-topic-title-label">
                            {topic.title}
                          </span>

                          {/* Ref Tag */}
                          <span className="py-topic-ref-tag">
                            {topic.docRefTag || `§${topic.topicNum}`}
                          </span>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
