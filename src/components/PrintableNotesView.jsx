import React from 'react';
import { Printer, ArrowLeft, CheckSquare, Square } from 'lucide-react';

export default function PrintableNotesView({
  topics,
  completedMap,
  onToggleComplete,
  userNotesMap,
  onBackToApp
}) {
  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="printable-container">
      {/* Printable Control Bar */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="btn btn-secondary" onClick={onBackToApp}>
          <ArrowLeft size={16} />
          <span>Back to App</span>
        </button>

        <button className="btn btn-primary" onClick={handleTriggerPrint}>
          <Printer size={16} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      <div className="print-header">
        <h1 className="print-title">PyCosmos - Python Mastery Study Notes</h1>
        <p className="print-subtitle">PyCosmos: a whole universe of Python in one place • Complete Python Reference & Practice Workbook</p>
      </div>

      {topics.map((topic, index) => {
        const isCompleted = !!completedMap[topic.id];
        const notes = userNotesMap[topic.id] || '';

        return (
          <div key={topic.id} className="print-topic-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2 className="print-topic-title">
                {index + 1}. {topic.title}
              </h2>
              <div
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 'bold' }}
                onClick={() => onToggleComplete(topic.id)}
              >
                {isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                <span>{isCompleted ? 'COMPLETED' : 'PENDING'}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.75rem' }}>
              Category: <strong>{topic.category}</strong> • Video Timestamp: <strong>{topic.timestamp}</strong> ({topic.youtubeLink})
            </div>

            {/* WHY TO USE */}
            <div className="print-section-header">WHY TO USE IT (REASONING):</div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{topic.whyToUse}</p>

            {/* HOW TO USE */}
            <div className="print-section-header" style={{ marginTop: '0.75rem' }}>HOW TO USE IT (SYNTAX & RULES):</div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{topic.howToUse}</p>

            {/* CODE EXAMPLES */}
            <div className="print-section-header" style={{ marginTop: '0.75rem' }}>CODE EXAMPLES:</div>
            {topic.codeExamples?.map((ex, exIdx) => (
              <div key={exIdx} style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>• {ex.title}:</div>
                <div className="print-code-block">{ex.code}</div>
              </div>
            ))}

            {/* USER NOTES IF TYPED */}
            {notes && (
              <div style={{ marginTop: '0.75rem' }}>
                <div className="print-section-header">YOUR TYPED NOTES:</div>
                <div className="print-code-block" style={{ background: '#fff', fontStyle: 'italic' }}>{notes}</div>
              </div>
            )}

            {/* RULED SPACE FOR HANDWRITTEN CODE & EXTRA POINTS */}
            <div className="ruled-writing-box">
              <div className="ruled-label">Space for handwritten code & extra points</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
