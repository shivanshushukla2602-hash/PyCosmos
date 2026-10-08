import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items, onNavigate }) {
  return (
    <nav className="breadcrumbs-bar no-print">
      <span className="breadcrumb-link" onClick={() => onNavigate('home')}>
        <Home size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
        Home
      </span>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          {item.onClick ? (
            <span className="breadcrumb-link" onClick={item.onClick}>
              {item.label}
            </span>
          ) : (
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
