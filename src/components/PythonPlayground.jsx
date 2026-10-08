import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Copy,
  Check,
  RotateCcw,
  Terminal,
  Loader2,
  Code2,
  Sparkles
} from 'lucide-react';

export default function PythonPlayground({ initialCode, onShowToast }) {
  const [code, setCode] = useState(initialCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pyodideInstance, setPyodideInstance] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  useEffect(() => {
    setCode(initialCode || '');
    setOutput('');
  }, [initialCode]);

  // Load Pyodide WASM Engine lazily
  const loadPyodideEngine = async () => {
    if (window.pyodide || pyodideInstance) return window.pyodide || pyodideInstance;

    setPyodideLoading(true);
    try {
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      const py = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
      });
      setPyodideInstance(py);
      window.pyodide = py;
      setPyodideLoading(false);
      return py;
    } catch (err) {
      console.warn("Pyodide load error, using fallback executor", err);
      setPyodideLoading(false);
      return null;
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running Python code in Pyodide WASM sandbox...');

    try {
      const py = await loadPyodideEngine();
      if (py) {
        py.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = sys.stdout
        `);

        try {
          py.runPython(code);
          const stdout = py.runPython("sys.stdout.getvalue()");
          setOutput(stdout || 'Process completed with no output.');
        } catch (err) {
          setOutput(`Python Execution Error:\n${err.message}`);
        }
      } else {
        simulatePythonFallback(code);
      }
    } catch (e) {
      setOutput(`Execution error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const simulatePythonFallback = (pyCode) => {
    let logs = [];
    const lines = pyCode.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('print(') && line.endsWith(')')) {
        let inside = line.slice(6, -1);
        try {
          const evaluateExpr = new Function(`"use strict"; return (${inside.replace(/#/g, '//')})`);
          logs.push(String(evaluateExpr()));
        } catch {
          logs.push(inside.replace(/^["']|["']$/g, ''));
        }
      }
    });
    setOutput(logs.join('\n') || "Simulated Execution Complete.");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onShowToast) onShowToast("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode || '');
    setOutput('');
  };

  const lineCount = Math.max(8, code.split('\n').length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="code-sandbox-panel">
      {/* EDITOR TOP TOOLBAR */}
      <div className="sandbox-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
          </div>
          <span className="editor-lang-badge">
            <Code2 size={13} />
            <span>Python 3.11</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="sandbox-btn secondary"
            onClick={handleCopyCode}
          >
            {copied ? <Check size={14} style={{ color: '#22c55e' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="sandbox-btn secondary"
            onClick={handleReset}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="sandbox-btn run-btn"
            onClick={handleRunCode}
            disabled={isRunning || pyodideLoading}
          >
            {isRunning || pyodideLoading ? (
              <Loader2 size={14} className="spin-icon" />
            ) : (
              <Play size={14} />
            )}
            <span>{pyodideLoading ? 'Loading Pyodide...' : isRunning ? 'Running...' : 'Run Code'}</span>
          </motion.button>
        </div>
      </div>

      {/* CODE EDITOR WORKSPACE WITH LINE NUMBERS */}
      <div className="editor-workspace">
        <div className="line-numbers-col">
          {lineNumbers.map(n => (
            <span key={n}>{n}</span>
          ))}
        </div>

        <textarea
          className="editor-textarea-modern"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="# Write Python code here..."
          spellCheck="false"
          rows={Math.max(10, lineCount)}
        />
      </div>

      {/* OUTPUT TERMINAL PANEL */}
      <div className="terminal-output-container">
        <div className="terminal-header">
          <Terminal size={14} style={{ color: 'var(--py-blue-light)' }} />
          <span>Output Terminal</span>
        </div>

        <AnimatePresence mode="wait">
          {output ? (
            <motion.pre
              key="output-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`terminal-text ${output.includes('Error') ? 'error' : ''}`}
            >
              {output}
            </motion.pre>
          ) : (
            <motion.div
              key="idle-cursor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="terminal-idle-text"
            >
              <span>Click 'Run Code' to execute Python script...</span>
              <span className="blinking-cursor">_</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
