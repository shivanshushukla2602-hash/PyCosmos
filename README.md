# 🌌 PyCosmos

> **PyCosmos: a whole universe of Python in one place.**

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.12%20WASM-3776AB?logo=python&logoColor=white)](https://pyodide.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An ultra-modern, interactive web platform engineered to guide developers from absolute Python fundamentals to production-ready system architecture and applied AI. Featuring an in-browser WebAssembly Python compiler, a 10-stage visual roadmap, 51 deep-dive topics, real-time quizzes, and cryptographic achievement certificates.

---

## ✨ Features

- **🗺️ 10-Stage Visual Learning Roadmap**: Structured, interactive roadmap nodes spanning Foundations, Data Structures, OOP, Advanced Python, Concurrency, Systems & APIs, Database Engines, Web Frameworks, Testing & DevOps, and AI / Machine Learning.
- **⚡ In-Browser Python 3.12 WebAssembly Compiler**: Full CPython runtime powered by Pyodide WASM. Run genuine Python code, inspect stdout/stderr, capture traceback exceptions, and benchmark execution directly in your browser.
- **📚 51 Deep-Dive Conceptual Topics**: Interactive lessons with runnable code snippets, mental models, key takeaways, and bookmarking.
- **🧠 Dynamic Problem of the Day & Live Quizzes**: Practice topic-specific questions with immediate evaluation, detailed explanations, and streak tracking.
- **📊 Mastery Matrix & Analytics**: 27-level progression matrix, interactive GitHub-style activity heatmaps, category completion rings, and performance breakdowns.
- **✅ Comprehensive Preparation Checklist**: Interactive milestone checklist with subtopic checkpoints, state persistence, and Markdown export.
- **📜 Cryptographic Certificate of Systems Mastery**: Unlock a verified, printable/exportable certificate with on-chain verification hash upon mastering the curriculum.
- **🎨 Glassmorphic Python Identity UI**: High-contrast, WCAG AA compliant theme built on authentic Python Blue (`#3776AB`) & Yellow (`#FFD43B`), complete with smooth dark/light mode transitions and framer-motion micro-interactions.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Animations & Physics**: [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Python Runtime**: [Pyodide CPython 3.12 WebAssembly](https://pyodide.org/)
- **Styling**: Vanilla CSS Design System with curated design tokens

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm or pnpm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shivanshushukla2602-hash/PyCosmos.git
   cd PyCosmos
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```
PyCosmos/
├── index.html                  # HTML entry with Pyodide runtime script
├── package.json                # Project dependencies and build scripts
├── vite.config.js              # Vite configuration
├── public/                     # Static assets and favicons
└── src/
    ├── main.jsx                # Application root entry
    ├── App.jsx                 # App controller & top-level routing
    ├── theme.css               # Centralized brand theme & token system
    ├── index.css               # Global responsive styling & design tokens
    ├── components/
    │   ├── Navbar.jsx          # Glassmorphic top navigation bar
    │   ├── Footer.jsx          # Multi-column footer & copyright
    │   ├── Sidebar.jsx         # Curriculum quick drawer navigation
    │   ├── HomePage.jsx        # Landing hero, sandbox & problem of the day
    │   ├── RoadmapPage.jsx     # Visual 10-stage interactive roadmap
    │   ├── MasteryTrackerPage.jsx # 27-level mastery matrix
    │   ├── ChecklistPage.jsx   # Complete 51-topic preparation checklist
    │   ├── QuizPage.jsx        # Interactive quiz engine & scoring
    │   ├── DashboardPage.jsx   # Analytics, badges, and verified certificate
    │   ├── ResourcesPage.jsx   # Handpicked tools, specs, and documentation
    │   ├── CheatSheetPage.jsx  # Interactive Python 3 quick-reference sandbox
    │   ├── AuthPage.jsx        # Authentication & profile management
    │   └── PyCosmosLogo.jsx    # Authentic brand mark emblem
    ├── data/
    │   ├── topicsData.js       # Complete 51-topic curriculum metadata
    │   ├── roadmapData.js      # 10-stage learning nodes and milestones
    │   └── topics/             # Deep-dive topic content files
    ├── services/
    │   ├── pythonCompiler.js   # Pyodide WebAssembly runner & output capturer
    │   └── questionApiService.js # Dynamic quiz & problem API service
    └── utils/
        ├── celebrate.js        # Confetti celebration animations
        └── motionVariants.js   # Framer motion transition presets
```

---

## 👤 Author

**Shivanshu Shukla**
- GitHub: [@shivanshushukla2602-hash](https://github.com/shivanshushukla2602-hash)

---

## 📄 License

This project is open-source and licensed under the MIT License.
