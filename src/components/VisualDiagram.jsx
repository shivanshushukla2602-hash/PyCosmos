import React from 'react';
import { Layers, Network, Cpu, MemoryStick as Memory } from 'lucide-react';

export default function VisualDiagram({ diagramType }) {
  if (diagramType === 'memory-references') {
    return (
      <div className="diagram-card">
        <div className="diagram-header">
          <Memory size={18} />
          <span>Python Memory Reference & Pointer Allocation Diagram</span>
        </div>
        <div className="diagram-svg-wrapper">
          <svg
            viewBox="0 0 640 220"
            preserveAspectRatio="xMidYMid meet"
            className="diagram-svg"
          >
            {/* Variables Stack (Left) */}
            <rect x="25" y="20" width="165" height="180" rx="10" fill="#0b1329" stroke="#334155" strokeWidth="1.5" />
            <text x="107" y="48" fill="#94a3b8" fontSize="12" fontWeight="800" letterSpacing="0.05em" textAnchor="middle">VARIABLE NAMES</text>
            
            <rect x="42" y="65" width="130" height="38" rx="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="107" y="89" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="var(--font-mono, monospace)" textAnchor="middle">a = [10, 20]</text>
            
            <rect x="42" y="122" width="130" height="38" rx="7" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
            <text x="107" y="146" fill="#c084fc" fontSize="13" fontWeight="bold" fontFamily="var(--font-mono, monospace)" textAnchor="middle">b = a (alias)</text>

            {/* Pointer Arrows (Center) */}
            <path d="M 172 84 C 270 84, 290 115, 385 115" fill="none" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow-cyan)" strokeDasharray="5 3" />
            <path d="M 172 141 C 270 141, 290 120, 385 120" fill="none" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#arrow-purple)" strokeDasharray="5 3" />

            {/* Heap Memory Object (Right) */}
            <rect x="390" y="20" width="225" height="180" rx="10" fill="#0b1329" stroke="#334155" strokeWidth="1.5" />
            <text x="502" y="48" fill="#94a3b8" fontSize="12" fontWeight="800" letterSpacing="0.05em" textAnchor="middle">HEAP MEMORY OBJECT</text>

            <rect x="410" y="65" width="185" height="115" rx="8" fill="#172554" stroke="#3b82f6" strokeWidth="2" />
            <text x="502" y="93" fill="#60a5fa" fontSize="12" fontWeight="700" textAnchor="middle">List Object in Heap</text>
            <text x="502" y="125" fill="#f8fafc" fontFamily="var(--font-mono, monospace)" fontSize="16" fontWeight="700" textAnchor="middle">[10, 20]</text>
            <text x="502" y="155" fill="#94a3b8" fontFamily="var(--font-mono, monospace)" fontSize="11" textAnchor="middle">id(): 0x7f9a12c8</text>

            <defs>
              <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  if (diagramType === 'legb-scope') {
    return (
      <div className="diagram-card">
        <div className="diagram-header">
          <Layers size={18} />
          <span>LEGB Scope Resolution Hierarchy Pyramid</span>
        </div>
        <div className="diagram-svg-wrapper">
          <svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid meet" className="diagram-svg">
            {/* Level 1: Local */}
            <polygon points="320,15 200,65 440,65" fill="#0284c7" opacity="0.88" />
            <text x="320" y="48" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1. LOCAL (Inside function)</text>

            {/* Level 2: Enclosing */}
            <polygon points="195,70 135,120 505,120 445,70" fill="#7c3aed" opacity="0.88" />
            <text x="320" y="103" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">2. ENCLOSING (Outer / Nested closures)</text>

            {/* Level 3: Global */}
            <polygon points="130,125 70,175 570,175 510,125" fill="#059669" opacity="0.88" />
            <text x="320" y="158" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">3. GLOBAL (Module-level scope)</text>

            {/* Level 4: Built-in */}
            <polygon points="65,180 15,230 625,230 575,180" fill="#d97706" opacity="0.88" />
            <text x="320" y="213" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">4. BUILT-IN (Python keywords & functions: print, len, range)</text>
          </svg>
        </div>
      </div>
    );
  }

  if (diagramType === 'oop-inheritance') {
    return (
      <div className="diagram-card">
        <div className="diagram-header">
          <Network size={18} />
          <span>OOP Multiple Inheritance & Method Resolution Order (MRO) Tree</span>
        </div>
        <div className="diagram-svg-wrapper">
          <svg viewBox="0 0 640 220" preserveAspectRatio="xMidYMid meet" className="diagram-svg">
            {/* Parent A */}
            <rect x="110" y="25" width="170" height="48" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="195" y="55" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">class ParentA</text>

            {/* Parent B */}
            <rect x="360" y="25" width="170" height="48" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
            <text x="445" y="55" fill="#a855f7" fontSize="13" fontWeight="bold" textAnchor="middle">class ParentB</text>

            {/* Child */}
            <rect x="235" y="135" width="170" height="48" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="320" y="165" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">class Child(ParentA, ParentB)</text>

            {/* Connectors */}
            <line x1="195" y1="73" x2="280" y2="135" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
            <line x1="445" y1="73" x2="360" y2="135" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 3" />

            {/* MRO note */}
            <text x="320" y="206" fill="#94a3b8" fontSize="11" textAnchor="middle">MRO Lookup Order: Child &rarr; ParentA &rarr; ParentB &rarr; object</text>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="diagram-card">
      <div className="diagram-header">
        <Cpu size={18} />
        <span>Execution & Memory Architecture Diagram</span>
      </div>
      <div className="diagram-svg-wrapper">
        <svg viewBox="0 0 640 170" preserveAspectRatio="xMidYMid meet" className="diagram-svg">
          <rect x="25" y="35" width="165" height="95" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="107" y="78" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">Input Stream</text>
          <text x="107" y="102" fill="#94a3b8" fontSize="11" textAnchor="middle">Source Code / User Data</text>

          <line x1="190" y1="82" x2="235" y2="82" stroke="#38bdf8" strokeWidth="2.5" />

          <rect x="235" y="35" width="170" height="95" rx="8" fill="#172554" stroke="#a855f7" strokeWidth="1.5" />
          <text x="320" y="78" fill="#a855f7" fontSize="13" fontWeight="bold" textAnchor="middle">Python Engine</text>
          <text x="320" y="102" fill="#94a3b8" fontSize="11" textAnchor="middle">Bytecode Compiler & PVM</text>

          <line x1="405" y1="82" x2="450" y2="82" stroke="#a855f7" strokeWidth="2.5" />

          <rect x="450" y="35" width="165" height="95" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
          <text x="532" y="78" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">Output Result</text>
          <text x="532" y="102" fill="#94a3b8" fontSize="11" textAnchor="middle">stdout / Return Value</text>
        </svg>
      </div>
    </div>
  );
}
