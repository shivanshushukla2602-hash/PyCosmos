// Pyradox Roadmap Categories & Learning Nodes
// Aligned with the complete 51-topic progression path (Topics 0 to 50)

export const ROADMAP_CATEGORIES = [
  {
    id: "foundation",
    title: "1. Foundation (Topics 0 - 7)",
    description: "Python setup, runtime process, memory references, primitives, operators, and iteration.",
    color: "#38bdf8",
    nodes: [
      {
        id: "node-setup",
        title: "Setup & Execution",
        summary: "CPython virtual machine, bytecode compilation pipeline, and REPL.",
        topicIds: ["setup-and-fundamentals"],
        level: "Beginner",
        estHours: 2,
        requires: []
      },
      {
        id: "node-vars-memory",
        title: "Variables & Memory Model",
        summary: "Object references, dynamic typing, id(), and reference counting.",
        topicIds: ["variables-and-memory"],
        level: "Beginner",
        estHours: 2.5,
        requires: ["node-setup"]
      },
      {
        id: "node-types-numbers",
        title: "Types & Numbers",
        summary: "Built-in scalar types, arbitrary precision ints, floats, and truthiness.",
        topicIds: ["data-types", "numbers"],
        level: "Beginner",
        estHours: 3,
        requires: ["node-vars-memory"]
      },
      {
        id: "node-control-flow",
        title: "Operators, I/O & Loops",
        summary: "Short-circuit logic, f-strings, match/case, and loop-else patterns.",
        topicIds: ["operators", "input-and-output", "conditional-statements", "loops"],
        level: "Beginner",
        estHours: 4,
        requires: ["node-types-numbers"]
      }
    ]
  },
  {
    id: "data-structures",
    title: "2. Core Data Structures (Topics 8 - 12)",
    description: "Strings, lists, tuples, sets, and dictionaries with internal hash table mechanics.",
    color: "#10b981",
    nodes: [
      {
        id: "node-strings",
        title: "Strings & Unicode",
        summary: "Immutability, slicing, string methods, encoding (str vs bytes), and join performance.",
        topicIds: ["strings"],
        level: "Beginner",
        estHours: 3,
        requires: ["node-control-flow"]
      },
      {
        id: "node-lists-tuples",
        title: "Lists & Tuples",
        summary: "Dynamic arrays, over-allocation, shallow vs deep copies, and named tuples.",
        topicIds: ["lists", "tuples"],
        level: "Intermediate",
        estHours: 4,
        requires: ["node-strings"]
      },
      {
        id: "node-sets-dicts",
        title: "Sets & Dictionaries",
        summary: "Hash tables, O(1) lookups, set algebra, and dictionary ordering layout.",
        topicIds: ["sets", "dictionaries"],
        level: "Intermediate",
        estHours: 4.5,
        requires: ["node-lists-tuples"]
      }
    ]
  },
  {
    id: "functions-iteration",
    title: "3. Functions & Iteration (Topics 13 - 16)",
    description: "First-class functions, scoping rules, lambdas, comprehensions, and generators.",
    color: "#a855f7",
    nodes: [
      {
        id: "node-functions",
        title: "Functions & Scope",
        summary: "Positional-only (/), keyword-only (*), LEGB name resolution, and closures.",
        topicIds: ["functions", "functional-programming"],
        level: "Intermediate",
        estHours: 4,
        requires: ["node-sets-dicts"]
      },
      {
        id: "node-iterators-comprehensions",
        title: "Iterators, Generators & Comprehensions",
        summary: "Iterator protocol, yield, yield from, and memory-efficient streaming.",
        topicIds: ["iterators-and-generators", "comprehensions"],
        level: "Intermediate",
        estHours: 3.5,
        requires: ["node-functions"]
      }
    ]
  },
  {
    id: "practical-python",
    title: "4. Practical Python (Topics 17 - 20)",
    description: "Exception hierarchies, file I/O, modules, packages, and virtual environments.",
    color: "#f59e0b",
    nodes: [
      {
        id: "node-exceptions-files",
        title: "Exceptions & File Handling",
        summary: "EAFP vs LBYL, custom exceptions, pathlib.Path, and large file streams.",
        topicIds: ["exception-handling", "file-handling"],
        level: "Intermediate",
        estHours: 3.5,
        requires: ["node-iterators-comprehensions"]
      },
      {
        id: "node-modules-packages",
        title: "Modules, Packages & Envs",
        summary: "sys.path, __name__ == '__main__', virtual environments, and pyproject.toml.",
        topicIds: ["modules", "packages-and-environments"],
        level: "Intermediate",
        estHours: 3,
        requires: ["node-exceptions-files"]
      }
    ]
  },
  {
    id: "oop-protocols",
    title: "5. OOP & Protocols (Topics 21 - 24)",
    description: "Classes, dunder methods, MRO, decorators, context managers, and namespaces.",
    color: "#f43f5e",
    nodes: [
      {
        id: "node-oop-core",
        title: "Object-Oriented Programming",
        summary: "self, dunder methods, C3 linearization MRO, polymorphism, and duck typing.",
        topicIds: ["object-oriented-programming"],
        level: "Advanced",
        estHours: 5,
        requires: ["node-modules-packages"]
      },
      {
        id: "node-decorators-context",
        title: "Decorators & Context Managers",
        summary: "Closures, functools.wraps, lru_cache, and @contextmanager protocol.",
        topicIds: ["advanced-functions-and-decorators", "context-managers", "python-scope-and-namespaces"],
        level: "Advanced",
        estHours: 4.5,
        requires: ["node-oop-core"]
      }
    ]
  },
  {
    id: "internals-types",
    title: "6. Python Internals & Types (Topics 25 - 29)",
    description: "Data model, memory allocator, descriptor protocol, type hints, and dataclasses.",
    color: "#6366f1",
    nodes: [
      {
        id: "node-data-model-memory",
        title: "Data Model & Memory Management",
        summary: "Everything is an object, PyObject headers, __slots__, and generational GC.",
        topicIds: ["python-data-model", "memory-management"],
        level: "Advanced",
        estHours: 4.5,
        requires: ["node-decorators-context"]
      },
      {
        id: "node-types-dataclasses",
        title: "Type Hints, Dataclasses & Regex",
        summary: "mypy static types, frozen dataclasses, and regular expressions.",
        topicIds: ["type-hints", "dataclasses", "regular-expressions"],
        level: "Advanced",
        estHours: 4,
        requires: ["node-data-model-memory"]
      }
    ]
  },
  {
    id: "stdlib-apis",
    title: "7. Standard Library & APIs (Topics 30 - 33)",
    description: "collections, itertools, SQLite database operations, JSON, and REST networking.",
    color: "#06b6d4",
    nodes: [
      {
        id: "node-stdlib-json",
        title: "Standard Library & Serialization",
        summary: "Counter, deque, itertools combinatorics, JSON serialization, and pickle hazards.",
        topicIds: ["important-standard-library", "json-and-serialization"],
        level: "Intermediate",
        estHours: 4,
        requires: ["node-types-dataclasses"]
      },
      {
        id: "node-db-apis",
        title: "Databases & REST APIs",
        summary: "sqlite3 parameterized queries, transactions, and HTTP client integrations.",
        topicIds: ["database-programming", "networking-and-apis"],
        level: "Intermediate",
        estHours: 4,
        requires: ["node-stdlib-json"]
      }
    ]
  },
  {
    id: "professional-python",
    title: "8. Professional Python & Concurrency (Topics 34 - 41)",
    description: "Testing with pytest, logging, threading vs multiprocessing, asyncio, and optimization.",
    color: "#f97316",
    nodes: [
      {
        id: "node-testing-logging",
        title: "Testing, Logging & Debugging",
        summary: "unittest, pytest fixtures, mocks, logging hierarchies, and PDB debugging.",
        topicIds: ["testing", "logging-and-debugging"],
        level: "Advanced",
        estHours: 4,
        requires: ["node-db-apis"]
      },
      {
        id: "node-concurrency-async",
        title: "Concurrency, GIL & Asyncio",
        summary: "ThreadPoolExecutor, ProcessPoolExecutor, GIL mechanics, and async/await event loops.",
        topicIds: ["concurrency", "asynchronous-python"],
        level: "Advanced",
        estHours: 5,
        requires: ["node-testing-logging"]
      },
      {
        id: "node-internals-perf",
        title: "Optimization, Pythonic Code & CLI",
        summary: "cProfile profiling, timeit benchmarking, Zen of Python, and argparse CLIs.",
        topicIds: ["advanced-python-internals", "performance-and-optimization", "pythonic-programming", "command-line-python"],
        level: "Advanced",
        estHours: 4.5,
        requires: ["node-concurrency-async"]
      }
    ]
  },
  {
    id: "development-ai-ml",
    title: "9. Development & AI/ML (Topics 42 - 45)",
    description: "FastAPI web services, NumPy/Pandas data science, ML pipelines, and LLM RAG applications.",
    color: "#d946ef",
    nodes: [
      {
        id: "node-web-data",
        title: "Web APIs & Data Science",
        summary: "FastAPI async endpoints, NumPy SIMD vectorization, and Pandas aggregations.",
        topicIds: ["web-development-with-python", "data-science-with-python"],
        level: "Advanced",
        estHours: 5,
        requires: ["node-internals-perf"]
      },
      {
        id: "node-ml-ai",
        title: "Machine Learning & Advanced AI",
        summary: "scikit-learn pipelines, PyTorch tensors, vector embeddings, and RAG architectures.",
        topicIds: ["machine-learning-with-python", "advanced-ai-ml-python"],
        level: "Advanced",
        estHours: 6,
        requires: ["node-web-data"]
      }
    ]
  },
  {
    id: "projects-dsa",
    title: "10. Projects & Problem Solving (Topics 46 - 50)",
    description: "Full-stack project architectures, professional CI/CD, built-in functions, and DSA patterns.",
    color: "#ffd43b",
    nodes: [
      {
        id: "node-projects-dev",
        title: "Project Architecture & CI/CD",
        summary: "End-to-end applications, Docker containerization, Git workflows, and packaging.",
        topicIds: ["python-project-development", "professional-python-development"],
        level: "Advanced",
        estHours: 6,
        requires: ["node-ml-ai"]
      },
      {
        id: "node-dsa-mastery",
        title: "Built-ins, Gotchas & DSA Solving",
        summary: "All 68 built-in functions, confusing concepts demystified, and LeetCode algorithmic patterns.",
        topicIds: ["python-built-in-functions", "confusing-concepts", "problem-solving-with-python"],
        level: "Advanced",
        estHours: 8,
        requires: ["node-projects-dev"]
      }
    ]
  }
];
