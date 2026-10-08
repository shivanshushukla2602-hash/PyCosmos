import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Trash2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function BookmarksDrawer({
  isOpen,
  onClose,
  bookmarkedIds = [],
  topics = [],
  onSelectTopic,
  onRemoveBookmark
}) {
  const bookmarkedTopics = topics.filter((t) => bookmarkedIds.includes(t.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="drawer-backdrop"
            onClick={onClose}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(255, 212, 59, 0.15)',
                    border: '1px solid rgba(255, 212, 59, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--py-yellow)'
                  }}
                >
                  <Bookmark size={18} fill="var(--py-yellow)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Saved Bookmarks
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {bookmarkedTopics.length} topic{bookmarkedTopics.length !== 1 ? 's' : ''} saved for quick review
                  </span>
                </div>
              </div>

              <button
                className="btn-icon"
                onClick={onClose}
                style={{ borderRadius: '8px', padding: '0.4rem' }}
                title="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content List */}
            {bookmarkedTopics.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-secondary)' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px dashed var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <Bookmark size={24} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  No Saved Bookmarks Yet
                </h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.5, maxWidth: '280px', margin: '0 auto' }}>
                  Click the bookmark ribbon icon on any Python topic card to pin it here for quick interview revision.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
                {bookmarkedTopics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ x: 2 }}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1rem 1.15rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onClick={() => {
                      onSelectTopic(topic.id);
                      onClose();
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: 'var(--py-blue-light)',
                          letterSpacing: '0.04em',
                          display: 'inline-block',
                          marginBottom: '0.2rem'
                        }}
                      >
                        {topic.category}
                      </span>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.94rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {topic.title}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ padding: '0.35rem', color: '#ef4444' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBookmark(topic.id);
                        }}
                        title="Remove bookmark"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
