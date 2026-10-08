import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Circle,
  Search,
  X,
  BookOpen,
  SlidersHorizontal,
  Star,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/topicsData';
import PyCosmosLogo from './PyCosmosLogo';

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
      init[cat] = idx <= 1; // default expand first two milestone categories
    });
    return init;
  });

  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleSearchChange = (val) => {
    setLocalSearch(val);
    if (setSearchQuery) setSearchQuery(val);
  };

  // Filter topics
  const query = localSearch.trim().toLowerCase();
  const filteredTopics = query
    ? topics.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      )
    : topics;

  const totalCompleted = Object.values(completedMap).filter(Boolean).length;
  const totalTopicsCount = topics.length;

  return (
    <aside className="sidebar-redesigned no-print">
      {/* SIDEBAR HEADER & SEARCH */}
      <div className="sidebar-top-box">
        <div className="sidebar-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PyCosmosLogo size={22} animated={false} />
            <span className="sidebar-title" style={{ fontWeight: 800 }}>Curriculum</span>
          </div>
          <span className="lessons-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ color: '#22c55e', fontWeight: 800 }}>{totalCompleted}</span>
            <span>/</span>
            <span>{totalTopicsCount}</span>
          </span>
        </div>

        {/* SEARCH INPUT */}
        <div className="sidebar-search-box">
          <Search size={15} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search topic or concept..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {localSearch && (
            <button className="search-clear-btn" onClick={() => handleSearchChange('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORIES & TOPICS TREE */}
      <div className="sidebar-tree-container">
        {CATEGORIES.map(category => {
          const categoryTopics = filteredTopics.filter(t => t.category === category);
          if (categoryTopics.length === 0 && query) return null;

          const categoryCompleted = categoryTopics.filter(t => completedMap[t.id]).length;
          const totalCount = categoryTopics.length;
          const percent = totalCount > 0 ? Math.round((categoryCompleted / totalCount) * 100) : 0;
          const isExpanded = query ? true : !!expandedCategories[category];

          return (
            <div key={category} className="sidebar-category-group">
              <div
                className="sidebar-category-header"
                onClick={() => toggleCategory(category)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    <ChevronDown size={15} />
                  </motion.div>
                  <span className="category-title">{category}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="category-count">
                    {categoryCompleted}/{totalCount}
                  </span>
                  {/* MINI SLIVER PROGRESS BAR */}
                  <div className="category-sliver-bg">
                    <div
                      className="category-sliver-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* SMOOTH ANIMATED COLLAPSIBLE LIST */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="sidebar-topic-list"
                  >
                    <div className="tree-connecting-line" />

                    {categoryTopics.map(topic => {
                      const isCompleted = !!completedMap[topic.id];
                      const isActive = topic.id === selectedTopicId;

                      return (
                        <motion.li
                          key={topic.id}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.15 }}
                          className={`sidebar-topic-row ${isActive ? 'active' : ''}`}
                          onClick={() => onSelectTopic(topic.id)}
                        >
                          {/* STATUS ICON */}
                          <div
                            className="topic-status-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(topic.id);
                            }}
                            title={isCompleted ? "Mark pending" : "Mark completed"}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={15} style={{ color: '#22c55e' }} />
                            ) : (
                              <Circle size={15} style={{ color: '#6e7681' }} />
                            )}
                          </div>

                          {/* TOPIC TITLE */}
                          <span className="sidebar-topic-name">
                            {topic.title}
                          </span>

                          {/* DOC REF BADGE */}
                          <span className="sidebar-topic-timestamp">
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
