import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, Network, MemoryStick as Memory, Workflow, Zap, Code2, ArrowRight } from 'lucide-react';

export default function VisualDiagram({ diagramType = 'cpython-pipeline' }) {
  const [activeStage, setActiveStage] = useState(null);

  // 1. CPYTHON EXECUTION & COMPILATION PIPELINE DIAGRAM
  if (diagramType === 'cpython-pipeline' || diagramType === 'setup-and-fundamentals' || diagramType === 'internals') {
    return (
      <div className="py-diagram-container">
        <div className="py-diagram-header">
          <div className="py-diagram-title-group">
            <Cpu size={18} className="py-blue-icon" />
            <span className="py-diagram-title">CPython Compilation & VM Evaluation Pipeline Architecture</span>
          </div>
          <span className="py-diagram-tag">Interactive Architectural Flow</span>
        </div>

        <div className="py-diagram-svg-wrapper">
          <svg viewBox="0 0 760 210" preserveAspectRatio="xMidYMid meet" className="py-diagram-svg">
            <defs>
              <linearGradient id="pyBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#306998" />
                <stop offset="100%" stopColor="#1e3a5f" />
              </linearGradient>
              <linearGradient id="pyYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd43b" />
                <stop offset="100%" stopColor="#d4a318" />
              </linearGradient>
              <linearGradient id="pyMixedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#306998" />
                <stop offset="100%" stopColor="#ffd43b" />
              </linearGradient>
              <filter id="diagramGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stage 1: Source File */}
            <g
              className="diagram-stage-node"
              onMouseEnter={() => setActiveStage('source')}
              onMouseLeave={() => setActiveStage(null)}
              cursor="pointer"
            >
              <rect x="20" y="35" width="125" height="135" rx="12" fill="#0d1527" stroke={activeStage === 'source' ? '#ffd43b' : '#306998'} strokeWidth="2" />
              <rect x="28" y="43" width="109" height="24" rx="6" fill="#162544" />
              <text x="82" y="59" fill="#ffd43b" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="monospace">script.py</text>
              <text x="82" y="90" fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor="middle">Source Code</text>
              <text x="82" y="110" fill="#94a3b8" fontSize="10" textAnchor="middle">Human readable</text>
              <text x="82" y="126" fill="#94a3b8" fontSize="10" textAnchor="middle">Unicode text</text>
              <rect x="42" y="142" width="81" height="18" rx="4" fill="#306998" fillOpacity="0.3" />
              <text x="82" y="155" fill="#38bdf8" fontSize="9" fontWeight="700" textAnchor="middle">INPUT</text>
            </g>

            {/* Conduit 1 */}
            <path d="M 145 102 L 180 102" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" />
            <polygon points="182,102 174,98 174,106" fill="#38bdf8" />

            {/* Stage 2: Lexer & AST Parser */}
            <g
              className="diagram-stage-node"
              onMouseEnter={() => setActiveStage('ast')}
              onMouseLeave={() => setActiveStage(null)}
              cursor="pointer"
            >
              <rect x="185" y="35" width="130" height="135" rx="12" fill="#0d1527" stroke={activeStage === 'ast' ? '#ffd43b' : '#306998'} strokeWidth="2" />
              <rect x="193" y="43" width="114" height="24" rx="6" fill="#162544" />
              <text x="250" y="59" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle">Tokenizer & AST</text>
              <text x="250" y="90" fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor="middle">Lexer & Parser</text>
              <text x="250" y="110" fill="#94a3b8" fontSize="10" textAnchor="middle">Tokens parsed to</text>
              <text x="250" y="126" fill="#94a3b8" fontSize="10" textAnchor="middle">Abstract Syntax Tree</text>
              <rect x="205" y="142" width="90" height="18" rx="4" fill="#306998" fillOpacity="0.3" />
              <text x="250" y="155" fill="#ffd43b" fontSize="9" fontWeight="700" textAnchor="middle">SYNTAX TREE</text>
            </g>

            {/* Conduit 2 */}
            <path d="M 315 102 L 350 102" stroke="#ffd43b" strokeWidth="2.5" strokeDasharray="4 3" />
            <polygon points="352,102 344,98 344,106" fill="#ffd43b" />

            {/* Stage 3: Bytecode Compiler */}
            <g
              className="diagram-stage-node"
              onMouseEnter={() => setActiveStage('bytecode')}
              onMouseLeave={() => setActiveStage(null)}
              cursor="pointer"
            >
              <rect x="355" y="35" width="135" height="135" rx="12" fill="#0d1527" stroke={activeStage === 'bytecode' ? '#38bdf8' : '#ffd43b'} strokeWidth="2" />
              <rect x="363" y="43" width="119" height="24" rx="6" fill="rgba(255, 212, 59, 0.15)" />
              <text x="422" y="59" fill="#ffd43b" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="monospace">.pyc Bytecode</text>
              <text x="422" y="90" fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor="middle">PyCodeObject</text>
              <text x="422" y="110" fill="#94a3b8" fontSize="10" textAnchor="middle">Compiled opcodes</text>
              <text x="422" y="126" fill="#94a3b8" fontSize="10" textAnchor="middle">Cached in __pycache__</text>
              <rect x="375" y="142" width="95" height="18" rx="4" fill="rgba(255, 212, 59, 0.2)" />
              <text x="422" y="155" fill="#ffd43b" fontSize="9" fontWeight="700" textAnchor="middle">BYTECODE</text>
            </g>

            {/* Conduit 3 */}
            <path d="M 490 102 L 525 102" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" />
            <polygon points="527,102 519,98 519,106" fill="#38bdf8" />

            {/* Stage 4: CPython VM (ceval.c) & CPU */}
            <g
              className="diagram-stage-node"
              onMouseEnter={() => setActiveStage('vm')}
              onMouseLeave={() => setActiveStage(null)}
              cursor="pointer"
            >
              <rect x="530" y="25" width="210" height="155" rx="14" fill="#0a1220" stroke="#306998" strokeWidth="2.5" />
              <rect x="540" y="35" width="190" height="26" rx="6" fill="#1b2a47" />
              <text x="635" y="52" fill="#ffd43b" fontSize="11" fontWeight="800" textAnchor="middle">CPython VM (ceval.c)</text>
              
              <rect x="545" y="70" width="180" height="42" rx="6" fill="#111d33" stroke="#38bdf8" strokeWidth="1" />
              <text x="635" y="87" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle">Evaluation Loop</text>
              <text x="635" y="103" fill="#94a3b8" fontSize="9.5" textAnchor="middle">Operand Stack • Heap PyObjects</text>

              <rect x="545" y="120" width="180" height="46" rx="6" fill="#162544" stroke="#ffd43b" strokeWidth="1" />
              <text x="635" y="138" fill="#ffd43b" fontSize="11" fontWeight="800" textAnchor="middle">Hardware CPU Execution</text>
              <text x="635" y="154" fill="#38bdf8" fontSize="9.5" textAnchor="middle">Native OS Syscalls & Memory</text>
            </g>
          </svg>
        </div>

        {/* Dynamic Interactive Callout */}
        <div className="py-diagram-footer">
          <div className="py-diagram-pill-flow">
            <span className="diagram-step-pill">1. Source Text</span>
            <ArrowRight size={12} color="#306998" />
            <span className="diagram-step-pill">2. Tokens & AST</span>
            <ArrowRight size={12} color="#ffd43b" />
            <span className="diagram-step-pill">3. PyCodeObject</span>
            <ArrowRight size={12} color="#306998" />
            <span className="diagram-step-pill active-pill">4. CPython VM Evaluation</span>
          </div>
          <span className="py-diagram-note">
            CPython is an interpreted bytecode VM: it compiles source to bytecode (.pyc) before executing via C loops.
          </span>
        </div>
      </div>
    );
  }

  // 2. PYTHON MEMORY REFERENCE & PYOBJECT ALLOCATION DIAGRAM
  if (diagramType === 'memory-references') {
    return (
      <div className="py-diagram-container">
        <div className="py-diagram-header">
          <div className="py-diagram-title-group">
            <Memory size={18} className="py-yellow-icon" />
            <span className="py-diagram-title">Python Memory Architecture: Stack Names & Heap PyObject Model</span>
          </div>
          <span className="py-diagram-tag">Pointer & Reference Model</span>
        </div>

        <div className="py-diagram-svg-wrapper">
          <svg viewBox="0 0 740 220" preserveAspectRatio="xMidYMid meet" className="py-diagram-svg">
            <defs>
              <marker id="arrow-gold" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffd43b" />
              </marker>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* STACK: Variable Identifiers */}
            <rect x="25" y="20" width="190" height="180" rx="12" fill="#0d1527" stroke="#306998" strokeWidth="2" />
            <rect x="35" y="30" width="170" height="26" rx="6" fill="#162544" />
            <text x="120" y="47" fill="#ffd43b" fontSize="11" fontWeight="800" textAnchor="middle">STACK (NAMES)</text>
            
            <rect x="40" y="70" width="160" height="42" rx="8" fill="#111d33" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="120" y="96" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">a = [10, 20]</text>

            <rect x="40" y="130" width="160" height="42" rx="8" fill="#111d33" stroke="#ffd43b" strokeWidth="1.5" />
            <text x="120" y="156" fill="#ffd43b" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">b = a (alias)</text>

            {/* POINTER ARROWS */}
            <path d="M 200 91 C 320 91, 340 105, 410 105" fill="none" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow-blue)" strokeDasharray="5 3" />
            <path d="M 200 151 C 320 151, 340 115, 410 115" fill="none" stroke="#ffd43b" strokeWidth="3" markerEnd="url(#arrow-gold)" strokeDasharray="5 3" />

            {/* HEAP: PyObject Structure */}
            <rect x="415" y="15" width="300" height="190" rx="14" fill="#0a1220" stroke="#ffd43b" strokeWidth="2" />
            <rect x="425" y="25" width="280" height="26" rx="6" fill="rgba(255, 212, 59, 0.15)" />
            <text x="565" y="42" fill="#ffd43b" fontSize="11" fontWeight="800" textAnchor="middle">HEAP MEMORY: PyListObject (0x7f9a12c8)</text>

            {/* PyObject Header */}
            <rect x="435" y="62" width="260" height="32" rx="6" fill="#162544" stroke="#306998" strokeWidth="1" />
            <text x="565" y="82" fill="#38bdf8" fontSize="10.5" fontWeight="700" textAnchor="middle">ob_refcnt = 2 (Referenced by 'a' and 'b')</text>

            <rect x="435" y="100" width="260" height="32" rx="6" fill="#162544" stroke="#306998" strokeWidth="1" />
            <text x="565" y="120" fill="#94a3b8" fontSize="10.5" textAnchor="middle">ob_type = &amp;PyList_Type (Dynamic Type)</text>

            {/* Payload Value */}
            <rect x="435" y="138" width="260" height="52" rx="6" fill="#111d33" stroke="#ffd43b" strokeWidth="1.5" />
            <text x="565" y="162" fill="#f8fafc" fontSize="15" fontWeight="800" fontFamily="monospace" textAnchor="middle">[ 10, 20 ]</text>
            <text x="565" y="180" fill="#ffd43b" fontSize="10" textAnchor="middle">ob_item: array of pointers to PyLongObject</text>
          </svg>
        </div>

        <div className="py-diagram-footer">
          <div className="py-diagram-pill-flow">
            <span className="diagram-step-pill">Variables are Names</span>
            <ArrowRight size={12} color="#306998" />
            <span className="diagram-step-pill">Names hold Pointers</span>
            <ArrowRight size={12} color="#ffd43b" />
            <span className="diagram-step-pill active-pill">Values live in Heap PyObjects</span>
          </div>
          <span className="py-diagram-note">
            Variables in Python do not hold raw data; they hold memory pointers to heap-allocated PyObject structs.
          </span>
        </div>
      </div>
    );
  }

  // 3. LEGB SCOPE RESOLUTION PYRAMID
  if (diagramType === 'legb-scope' || diagramType === 'functions' || diagramType === 'scope') {
    return (
      <div className="py-diagram-container">
        <div className="py-diagram-header">
          <div className="py-diagram-title-group">
            <Layers size={18} className="py-blue-icon" />
            <span className="py-diagram-title">LEGB Scope Resolution Hierarchy: Inside-Out Namespace Lookup</span>
          </div>
          <span className="py-diagram-tag">Scope Priority Hierarchy</span>
        </div>

        <div className="py-diagram-svg-wrapper">
          <svg viewBox="0 0 740 230" preserveAspectRatio="xMidYMid meet" className="py-diagram-svg">
            {/* 1. Local Scope */}
            <polygon points="370,15 220,65 520,65" fill="#306998" stroke="#38bdf8" strokeWidth="2" />
            <text x="370" y="47" fill="#f8fafc" fontSize="12.5" fontWeight="900" textAnchor="middle">1. LOCAL (Inside function body: def foo(): x = 1)</text>

            {/* 2. Enclosing Scope */}
            <polygon points="215,70 145,120 595,120 525,70" fill="#1e3a5f" stroke="#306998" strokeWidth="1.5" />
            <text x="370" y="102" fill="#ffd43b" fontSize="12" fontWeight="800" textAnchor="middle">2. ENCLOSING (Outer enclosing closures: nonlocal)</text>

            {/* 3. Global Scope */}
            <polygon points="140,125 75,175 665,175 600,125" fill="#0f1f38" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="370" y="157" fill="#f8fafc" fontSize="12" fontWeight="800" textAnchor="middle">3. GLOBAL (Module-level namespace: global)</text>

            {/* 4. Built-in Scope */}
            <polygon points="70,180 15,225 725,225 670,180" fill="#091322" stroke="#ffd43b" strokeWidth="2" />
            <text x="370" y="210" fill="#ffd43b" fontSize="12" fontWeight="800" textAnchor="middle">4. BUILT-IN (Python built-ins: print, len, range, Exception)</text>
          </svg>
        </div>

        <div className="py-diagram-footer">
          <div className="py-diagram-pill-flow">
            <span className="diagram-step-pill">Local (Fastest)</span>
            <ArrowRight size={12} color="#306998" />
            <span className="diagram-step-pill">Enclosing</span>
            <ArrowRight size={12} color="#ffd43b" />
            <span className="diagram-step-pill">Global</span>
            <ArrowRight size={12} color="#306998" />
            <span className="diagram-step-pill active-pill">Built-in (Fallback)</span>
          </div>
          <span className="py-diagram-note">
            Python searches identifiers from innermost (Local) outwards. If not found in Built-in, NameError is raised.
          </span>
        </div>
      </div>
    );
  }

  // 4. OOP MULTIPLE INHERITANCE & MRO TREE
  if (diagramType === 'oop-inheritance' || diagramType === 'classes' || diagramType === 'oops') {
    return (
      <div className="py-diagram-container">
        <div className="py-diagram-header">
          <div className="py-diagram-title-group">
            <Network size={18} className="py-blue-icon" />
            <span className="py-diagram-title">OOP Multiple Inheritance & C3 Linearization (MRO) Architecture</span>
          </div>
          <span className="py-diagram-tag">MRO Hierarchy</span>
        </div>

        <div className="py-diagram-svg-wrapper">
          <svg viewBox="0 0 740 220" preserveAspectRatio="xMidYMid meet" className="py-diagram-svg">
            {/* Object Root */}
            <rect x="290" y="15" width="160" height="38" rx="8" fill="#162544" stroke="#ffd43b" strokeWidth="2" />
            <text x="370" y="39" fill="#ffd43b" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="monospace">class object</text>

            {/* Base A */}
            <rect x="130" y="80" width="180" height="44" rx="8" fill="#0d1527" stroke="#306998" strokeWidth="2" />
            <text x="220" y="107" fill="#38bdf8" fontSize="12.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">class BaseA(object)</text>

            {/* Base B */}
            <rect x="430" y="80" width="180" height="44" rx="8" fill="#0d1527" stroke="#306998" strokeWidth="2" />
            <text x="520" y="107" fill="#38bdf8" fontSize="12.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">class BaseB(object)</text>

            {/* Derived Child */}
            <rect x="260" y="150" width="220" height="48" rx="10" fill="#1b2a47" stroke="#ffd43b" strokeWidth="2.5" />
            <text x="370" y="179" fill="#ffd43b" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">class Child(BaseA, BaseB)</text>

            {/* Connectors */}
            <line x1="220" y1="80" x2="330" y2="53" stroke="#306998" strokeWidth="2" strokeDasharray="4 3" />
            <line x1="520" y1="80" x2="410" y2="53" stroke="#306998" strokeWidth="2" strokeDasharray="4 3" />
            <line x1="320" y1="150" x2="250" y2="124" stroke="#ffd43b" strokeWidth="2" />
            <line x1="420" y1="150" x2="490" y2="124" stroke="#ffd43b" strokeWidth="2" />
          </svg>
        </div>

        <div className="py-diagram-footer">
          <div className="py-diagram-pill-flow">
            <span className="diagram-step-pill">Child</span>
            <ArrowRight size={12} color="#ffd43b" />
            <span className="diagram-step-pill">BaseA</span>
            <ArrowRight size={12} color="#306998" />
            <span className="diagram-step-pill">BaseB</span>
            <ArrowRight size={12} color="#ffd43b" />
            <span className="diagram-step-pill active-pill">object</span>
          </div>
          <span className="py-diagram-note">
            Method Resolution Order (MRO) executes depth-first left-to-right using the C3 linearization algorithm.
          </span>
        </div>
      </div>
    );
  }

  // 5. DEFAULT TAILORED ARCHITECTURAL PIPELINE
  return (
    <div className="py-diagram-container">
      <div className="py-diagram-header">
        <div className="py-diagram-title-group">
          <Workflow size={18} className="py-blue-icon" />
          <span className="py-diagram-title">Python Runtime Execution & Data Transformation Pipeline</span>
        </div>
        <span className="py-diagram-tag">CPython Pipeline</span>
      </div>

      <div className="py-diagram-svg-wrapper">
        <svg viewBox="0 0 740 160" preserveAspectRatio="xMidYMid meet" className="py-diagram-svg">
          {/* Box 1: Input */}
          <rect x="25" y="30" width="180" height="95" rx="10" fill="#0d1527" stroke="#306998" strokeWidth="2" />
          <rect x="35" y="38" width="160" height="22" rx="5" fill="#162544" />
          <text x="115" y="53" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle">1. INPUT / STATEMENT</text>
          <text x="115" y="82" fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor="middle">Python Expressions</text>
          <text x="115" y="103" fill="#94a3b8" fontSize="10" textAnchor="middle">Identifiers & Literals</text>

          <line x1="205" y1="77" x2="255" y2="77" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" />
          <polygon points="257,77 249,73 249,81" fill="#38bdf8" />

          {/* Box 2: Python Engine */}
          <rect x="260" y="25" width="220" height="105" rx="12" fill="#0a1220" stroke="#ffd43b" strokeWidth="2.5" />
          <rect x="270" y="35" width="200" height="24" rx="6" fill="rgba(255, 212, 59, 0.15)" />
          <text x="370" y="51" fill="#ffd43b" fontSize="11" fontWeight="800" textAnchor="middle">2. CPYTHON ENGINE</text>
          <text x="370" y="82" fill="#f8fafc" fontSize="13" fontWeight="800" textAnchor="middle">Virtual Machine (PVM)</text>
          <text x="370" y="104" fill="#94a3b8" fontSize="10" textAnchor="middle">Type checking • Memory Allocation</text>

          <line x1="480" y1="77" x2="530" y2="77" stroke="#ffd43b" strokeWidth="2.5" strokeDasharray="4 3" />
          <polygon points="532,77 524,73 524,81" fill="#ffd43b" />

          {/* Box 3: Output */}
          <rect x="535" y="30" width="180" height="95" rx="10" fill="#0d1527" stroke="#306998" strokeWidth="2" />
          <rect x="545" y="38" width="160" height="22" rx="5" fill="#162544" />
          <text x="625" y="53" fill="#ffd43b" fontSize="11" fontWeight="800" textAnchor="middle">3. OUTPUT RESULT</text>
          <text x="625" y="82" fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor="middle">Evaluated PyObject</text>
          <text x="625" y="103" fill="#94a3b8" fontSize="10" textAnchor="middle">stdout / Return Value</text>
        </svg>
      </div>

      <div className="py-diagram-footer">
        <div className="py-diagram-pill-flow">
          <span className="diagram-step-pill">High-Level Syntax</span>
          <ArrowRight size={12} color="#306998" />
          <span className="diagram-step-pill">CPython Virtual Machine</span>
          <ArrowRight size={12} color="#ffd43b" />
          <span className="diagram-step-pill active-pill">Evaluated Result</span>
        </div>
        <span className="py-diagram-note">
          Standard CPython execution lifecycle adhering to dynamic typing, reference counting, and bytecode compilation.
        </span>
      </div>
    </div>
  );
}
