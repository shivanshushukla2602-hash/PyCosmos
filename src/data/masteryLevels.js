// 27-Level Python Mastery Tracker Dataset
// Matches the user's Mastery Progression table: Level 1 to 27

export const MASTERY_LEVELS = [
  {
    level: 1,
    area: "Fundamentals",
    topicIds: ["setup-and-fundamentals", "variables-and-memory"],
    description: "Interpreter, Python execution process, REPL, variables, dynamic typing, and memory model.",
    category: "Foundation"
  },
  {
    level: 2,
    area: "Data Types",
    topicIds: ["data-types", "numbers"],
    description: "Built-in fundamental types, numbers, precision, type conversion, and truthy/falsy behavior.",
    category: "Foundation"
  },
  {
    level: 3,
    area: "Operators",
    topicIds: ["operators", "input-and-output", "conditional-statements", "loops"],
    description: "Arithmetic, bitwise, comparison, short-circuit logic, formatting, and loop controls.",
    category: "Foundation"
  },
  {
    level: 4,
    area: "Strings",
    topicIds: ["strings"],
    description: "String slicing, immutability, encoding, string methods, f-strings, and string performance.",
    category: "Core Data Structures"
  },
  {
    level: 5,
    area: "Lists/Tuples/Sets/Dictionaries",
    topicIds: ["lists", "tuples", "sets", "dictionaries"],
    description: "Core collection data structures, hash tables, mutability, methods, and dictionary internals.",
    category: "Core Data Structures"
  },
  {
    level: 6,
    area: "Functions",
    topicIds: ["functions", "functional-programming"],
    description: "First-class functions, *args/**kwargs, scoping LEGB, closures, lambdas, and functional tools.",
    category: "Functions"
  },
  {
    level: 7,
    area: "Comprehensions",
    topicIds: ["comprehensions"],
    description: "List, dict, set, and generator comprehensions, nested comprehensions, and readability.",
    category: "Functions"
  },
  {
    level: 8,
    area: "Iterators/Generators",
    topicIds: ["iterators-and-generators"],
    description: "Iterator protocol, __iter__/__next__, yield, yield from, lazy evaluation, and memory benefits.",
    category: "Functions"
  },
  {
    level: 9,
    area: "Exceptions",
    topicIds: ["exception-handling"],
    description: "Exception hierarchy, try-except-else-finally, custom exceptions, and EAFP vs LBYL.",
    category: "Practical Python"
  },
  {
    level: 10,
    area: "File Handling",
    topicIds: ["file-handling"],
    description: "open(), text/binary modes, buffers, tell/seek, context managers, pathlib, and JSON/CSV handling.",
    category: "Practical Python"
  },
  {
    level: 11,
    area: "Modules/Packages",
    topicIds: ["modules", "packages-and-environments"],
    description: "sys.path, __name__ == '__main__', virtual environments, pip, and pyproject.toml.",
    category: "Practical Python"
  },
  {
    level: 12,
    area: "OOP",
    topicIds: ["object-oriented-programming"],
    description: "Classes, self, dunder methods, inheritance, MRO, polymorphism, encapsulation, and duck typing.",
    category: "OOP"
  },
  {
    level: 13,
    area: "Decorators",
    topicIds: ["advanced-functions-and-decorators"],
    description: "Function/class decorators, decorator arguments, functools.wraps, and lru_cache.",
    category: "OOP"
  },
  {
    level: 14,
    area: "Context Managers",
    topicIds: ["context-managers"],
    description: "Context manager protocol, __enter__/__exit__, contextlib, and @contextmanager.",
    category: "OOP"
  },
  {
    level: 15,
    area: "Python Internals",
    topicIds: ["python-scope-and-namespaces", "python-data-model", "memory-management", "advanced-python-internals"],
    description: "Namespaces, everything is an object, CPython execution, bytecode dis, and garbage collector.",
    category: "Python Internals"
  },
  {
    level: 16,
    area: "Type Hints/Dataclasses",
    topicIds: ["type-hints", "dataclasses"],
    description: "Typing module, generic protocols, modern | union syntax, and frozen dataclasses.",
    category: "Python Internals"
  },
  {
    level: 17,
    area: "Standard Library",
    topicIds: ["important-standard-library"],
    description: "collections, itertools, functools, datetime, math, os, sys, and time standard modules.",
    category: "Standard Library"
  },
  {
    level: 18,
    area: "Regex",
    topicIds: ["regular-expressions"],
    description: "Pattern matching, character classes, greedy vs lazy quantifiers, lookahead, and raw regex.",
    category: "Standard Library"
  },
  {
    level: 19,
    area: "APIs/Databases",
    topicIds: ["json-and-serialization", "database-programming", "networking-and-apis"],
    description: "REST APIs with requests, SQLite3, SQL transactions, JSON parsing, and serialization.",
    category: "Standard Library"
  },
  {
    level: 20,
    area: "Testing/Debugging",
    topicIds: ["testing", "logging-and-debugging"],
    description: "pytest, unittest, fixtures, mocking, logging module levels, and debugging techniques.",
    category: "Professional Python"
  },
  {
    level: 21,
    area: "Concurrency/Async",
    topicIds: ["concurrency", "asynchronous-python"],
    description: "Threads vs processes, GIL, event loop, asyncio, coroutines, and async context managers.",
    category: "Professional Python"
  },
  {
    level: 22,
    area: "Advanced Python",
    topicIds: ["performance-and-optimization", "pythonic-programming", "command-line-python"],
    description: "Profiling with cProfile, timeit, Zen of Python idioms, argparse CLI tools, and optimization.",
    category: "Professional Python"
  },
  {
    level: 23,
    area: "NumPy/Pandas",
    topicIds: ["data-science-with-python"],
    description: "NumPy ndarrays, vectorization, broadcasting, Pandas DataFrames, and visualization.",
    category: "Development"
  },
  {
    level: 24,
    area: "ML Python",
    topicIds: ["machine-learning-with-python", "advanced-ai-ml-python"],
    description: "scikit-learn pipelines, PyTorch/TensorFlow deep learning, LLM APIs, embeddings, and RAG.",
    category: "Development"
  },
  {
    level: 25,
    area: "Web Development",
    topicIds: ["web-development-with-python"],
    description: "FastAPI async endpoints, Flask micro-services, Django architecture, and ORM.",
    category: "Development"
  },
  {
    level: 26,
    area: "Projects",
    topicIds: ["python-project-development", "professional-python-development"],
    description: "End-to-end applications, project structure, virtual environments, Docker, and CI/CD.",
    category: "Projects + Problem Solving"
  },
  {
    level: 27,
    area: "Problem Solving",
    topicIds: ["python-built-in-functions", "confusing-concepts", "problem-solving-with-python"],
    description: "All built-in functions, confusing concepts demystified, DSA patterns, and CP tricks.",
    category: "Projects + Problem Solving"
  }
];

export const PROGRESSION_TRACKS = [
  {
    name: "Foundation",
    levels: "1 → 2 → 3",
    description: "Python setup, execution process, memory model, types, numbers, operators, and loops.",
    range: [0, 7]
  },
  {
    name: "Core Data Structures",
    levels: "4 → 5",
    description: "Strings, lists, tuples, sets, dictionaries, and dictionary hash tables under the hood.",
    range: [8, 12]
  },
  {
    name: "Functions & Iteration",
    levels: "6 → 7 → 8",
    description: "First-class functions, closures, decorators, comprehensions, iterators, and generators.",
    range: [13, 16]
  },
  {
    name: "Practical Python",
    levels: "9 → 10 → 11",
    description: "Exception hierarchy, file handling, modules, packages, and virtual environments.",
    range: [17, 20]
  },
  {
    name: "OOP & Protocols",
    levels: "12 → 13 → 14",
    description: "Object-oriented programming, MRO, dunder methods, decorators, and context managers.",
    range: [21, 24]
  },
  {
    name: "Python Internals",
    levels: "15 → 16",
    description: "CPython execution, bytecode, descriptor protocol, memory management, and type hints.",
    range: [25, 29]
  },
  {
    name: "Standard Library & APIs",
    levels: "17 → 18 → 19",
    description: "itertools, collections, regex, SQLite, and networking REST APIs.",
    range: [30, 33]
  },
  {
    name: "Professional Python",
    levels: "20 → 21 → 22",
    description: "Testing (pytest), logging, threading/multiprocessing, asyncio, and optimization.",
    range: [34, 41]
  },
  {
    name: "Development & AI/ML",
    levels: "23 → 24 → 25",
    description: "NumPy/Pandas data science, ML/Deep Learning/LLMs, and FastAPI/Flask web apps.",
    range: [42, 45]
  },
  {
    name: "Projects & DSA",
    levels: "26 → 27",
    description: "Production projects, built-in functions mastery, tricky concepts, and DSA algorithms.",
    range: [46, 50]
  }
];
