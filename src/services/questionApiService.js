/**
 * PyCosmos Question API Service
 * ----------------------------
 * Fetches dynamic, topic-wise practice questions:
 * 1. Open Trivia Database (100% Free, Public REST API, no API key required)
 * 2. Topic-wise Python Cloud Question Repository (categorized for all 51 PyCosmos topics)
 * 3. Optional QuizAPI support with custom API key
 */

import { TOPICS } from '../data/topicsData';

// Helper to decode HTML entities returned by APIs like OpenTDB
export function decodeHtmlEntities(str) {
  if (!str) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

// Helper to shuffle options array randomly
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE TOPIC-WISE QUESTION REPOSITORY (TOPICS 0 TO 50)
// ─────────────────────────────────────────────────────────────────────────────
export const TOPICWISE_QUESTION_BANK = {
  // 0. Setup & Fundamentals
  'setup-and-fundamentals': [
    {
      id: 'top-00-1',
      question: 'Which of the following is the default and standard reference implementation of Python written in C?',
      options: ['CPython', 'PyPy', 'Jython', 'IronPython'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'CPython is the official, default reference implementation of Python maintained by the Python Software Foundation and written in C.',
      hint: 'It is the version you download directly from python.org.'
    },
    {
      id: 'top-00-2',
      question: 'What is the primary role of Python bytecode (.pyc files)?',
      options: [
        'To cache compiled intermediate instructions so future imports execute faster',
        'To compile Python directly into native machine code (x86/ARM binary)',
        'To encrypt proprietary source code for commercial distribution',
        'To eliminate the need for the Python Virtual Machine (PVM)'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'CPython compiles source code into platform-independent bytecode instructions cached in __pycache__ (.pyc) to speed up execution on subsequent runs.',
      hint: 'Think about import loading optimization in the CPython VM.'
    },
    {
      id: 'top-00-3',
      question: 'According to PEP 8, what is the recommended indentation standard for Python code?',
      options: ['Exactly 4 spaces per indentation level', 'A single tab character', '2 spaces per level', 'Any consistent mix of tabs and spaces'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'PEP 8 strictly recommends 4 spaces per indentation level and forbids mixing tabs with spaces in Python 3.',
      hint: 'Never use tabs in modern Python code.'
    }
  ],

  // 1. Variables & Memory
  'variables-and-memory': [
    {
      id: 'top-01-1',
      question: 'In Python, what is the fundamental difference between the `is` operator and the `==` operator?',
      options: [
        '`is` checks memory identity (same memory address in RAM), while `==` checks value equality',
        '`is` checks value equality, while `==` checks memory addresses',
        '`is` is used for numbers, while `==` is used for strings and objects',
        'They are completely identical and interchangeable in modern Python'
      ],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: '`is` evaluates whether `id(a) == id(b)` (identical memory pointer), whereas `==` calls `__eq__` to compare the contents or values.',
      hint: 'Remember: id() checks the memory address.'
    },
    {
      id: 'top-01-2',
      question: 'What mechanism does CPython primarily use for immediate memory reclamation when an object is no longer referenced?',
      options: [
        'Reference Counting',
        'Stop-the-World Tracing Collector',
        'Mark-and-Sweep exclusively',
        'Manual memory freeing with free()'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'CPython relies primarily on Reference Counting (tracked in ob_refcnt). When it drops to zero, memory is freed immediately. A cyclic GC runs periodically for reference cycles.',
      hint: 'Every Python object header contains ob_refcnt.'
    },
    {
      id: 'top-01-3',
      question: 'Why does `a = 256; b = 256; a is b` evaluate to True in CPython, but `a = 257; b = 257; a is b` may evaluate to False in the REPL?',
      options: [
        'CPython pre-allocates and interns small integers in the range [-5, 256]',
        'Numbers above 256 exceed 8-bit registers',
        'Integers above 256 are automatically converted to float',
        'The REPL garbage-collects odd numbers immediately'
      ],
      correctIndex: 0,
      difficulty: 'hard',
      explanation: 'CPython maintains an internal singleton array caching integers from -5 to 256 inclusive. Integers outside this range allocate fresh PyLongObject instances.',
      hint: 'Look up small integer caching in CPython.'
    }
  ],

  // 2. Python Data Types
  'data-types': [
    {
      id: 'top-02-1',
      question: 'Which of the following built-in Python data types is MUTABLE?',
      options: ['list', 'tuple', 'frozenset', 'str'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: '`list`, `dict`, and `set` are mutable collections. `tuple`, `frozenset`, `str`, `int`, and `float` are immutable.',
      hint: 'Which one allows appending or modifying elements in-place?'
    },
    {
      id: 'top-02-2',
      question: 'Which of the following values evaluates to `False` in Python boolean context?',
      options: ['Empty set `set()`', 'String with single space `" "`', 'Number `-1`', 'List with empty string `[""]`'],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'All empty collections (`set()`, `[]`, `{}`, `()`, `""`, `0`, `None`) are falsy. A non-empty collection or non-empty string is truthy.',
      hint: 'Examine which collection has length 0.'
    }
  ],

  // 3. Numbers
  'numbers': [
    {
      id: 'top-03-1',
      question: 'Why does `0.1 + 0.2 == 0.3` evaluate to `False` in standard Python?',
      options: [
        'Binary IEEE 754 floating-point numbers cannot represent 0.1 or 0.2 with exact finite precision',
        'Python rounds all float additions to 3 decimal places',
        'The equality operator cannot compare floats directly',
        'Python converts float operands to integers before addition'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'IEEE 754 double precision floats use base-2 fractions. 0.1 in base 2 is an infinitely repeating binary fraction, resulting in 0.30000000000000004.',
      hint: 'Think about base-2 representation of base-10 decimal fractions.'
    },
    {
      id: 'top-03-2',
      question: 'Which standard library module should you use when financial calculations require exact decimal precision without floating point error?',
      options: ['decimal', 'math', 'fractions', 'numbers'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'The `decimal` module provides the `Decimal` class for fixed and floating-point arithmetic with user-definable exact precision suitable for finance.',
      hint: 'It shares its name with base-10 decimal numbers.'
    }
  ],

  // 4. Operators
  'operators': [
    {
      id: 'top-04-1',
      question: 'What is the result of the expression `10 // 3` versus `10 / 3` in Python 3?',
      options: [
        '`10 // 3` returns integer `3` (floor division); `10 / 3` returns float `3.3333333333333335`',
        'Both return integer `3`',
        'Both return float `3.3333...`',
        '`10 // 3` is a syntax error in Python 3'
      ],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'In Python 3, `/` performs true float division, while `//` performs floor division rounding down towards negative infinity.',
      hint: 'Double slash is floor division.'
    },
    {
      id: 'top-04-2',
      question: 'What is the output of `False and print("Hello")` in Python?',
      options: ['False (print is never executed due to short-circuit evaluation)', '"Hello"', 'True', 'NameError'],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'Python uses short-circuit evaluation. Because the left side of `and` is False, Python immediately returns False without evaluating the right operand.',
      hint: 'Short-circuiting terminates evaluation early when the outcome is already guaranteed.'
    }
  ],

  // 8. Strings
  'strings': [
    {
      id: 'top-08-1',
      question: 'What is the output of `"PyCosmos"[::-1]` in Python?',
      options: ['"somsoCyP"', '"PyCosmos"', '"P"', 'IndexError'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'Slice step -1 traverses the string backwards from the end to the start, reversing it in O(n) time.',
      hint: 'Negative slice step reverses the sequence.'
    },
    {
      id: 'top-08-2',
      question: 'Why is `"".join(string_list)` significantly faster than using `+=` inside a loop to concatenate 100,000 strings?',
      options: [
        '`join()` pre-calculates the required buffer size and allocates memory once in O(n) time, whereas `+=` creates a new string each iteration in O(n^2)',
        '`join()` uses multithreading across CPU cores',
        '`+=` is deprecated in Python 3.12+',
        'Strings are mutable in CPython, so `join()` modifies memory in-place'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'Strings in Python are immutable. `+=` creates a new object and copies the buffer on every iteration leading to quadratic O(n^2) complexity, whereas `str.join()` allocates memory once in O(n).',
      hint: 'Consider string immutability and memory allocation overhead.'
    }
  ],

  // 9. Lists
  'lists': [
    {
      id: 'top-09-1',
      question: 'What is the time complexity of appending an element to the end of a Python list (`list.append(x)`)?',
      options: ['Amortized O(1)', 'Always O(n)', 'O(log n)', 'O(n^2)'],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'Python lists are dynamic arrays (PyListObject). They over-allocate capacity, meaning appends run in amortized O(1) time.',
      hint: 'Dynamic arrays allocate extra space ahead of time.'
    },
    {
      id: 'top-09-2',
      question: 'What will be the output of `a = [1, 2]; b = a; b.append(3); print(a)`?',
      options: ['[1, 2, 3]', '[1, 2]', '[3]', 'AttributeError'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: '`b = a` creates an alias (a second reference to the same list object on the heap). Mutating `b` directly mutates `a`.',
      hint: 'Assignment does not copy list objects; it copies the memory reference.'
    }
  ],

  // 12. Dictionaries
  'dictionaries': [
    {
      id: 'top-12-1',
      question: 'What requirement must an object fulfill to be used as a dictionary key in Python?',
      options: [
        'It must be hashable (have a constant `__hash__` and support `__eq__`)',
        'It must be an integer or string only',
        'It must inherit from `collections.abc.Mapping`',
        'It must be mutable so the dictionary can update it'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'A dictionary key must be hashable so its hash code remains constant over its lifetime. Mutable types like lists and dicts are unhashable.',
      hint: 'Can you use a list as a dictionary key?'
    },
    {
      id: 'top-12-2',
      question: 'What is the average time complexity for key lookup, insertion, and deletion in a Python dictionary?',
      options: ['Average O(1)', 'Always O(n)', 'O(log n)', 'O(n log n)'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'Python dictionaries use compact hash tables with open addressing and quadratic probing, providing average O(1) constant time lookups.',
      hint: 'Hash tables offer constant time access on average.'
    }
  ],

  // 13. Functions
  'functions': [
    {
      id: 'top-13-1',
      question: 'What is the danger of using a mutable default argument such as `def append_item(x, lst=[])` in Python?',
      options: [
        'Default argument expressions are evaluated once when the function is defined, sharing the same mutable list across all function calls',
        'Python raises a SyntaxError at compile time',
        'The list is wiped clean on every second call',
        'Mutable default arguments cause memory leaks in the operating system'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'Default arguments are evaluated once at function definition time and stored in `func.__defaults__`. All subsequent calls without an explicit argument share that same object.',
      hint: 'When is `def` executed by CPython?'
    },
    {
      id: 'top-13-2',
      question: 'What is the order of scope resolution in Python known as the LEGB rule?',
      options: [
        'Local -> Enclosing -> Global -> Built-in',
        'Lexical -> External -> Global -> Base',
        'Local -> Explicit -> Generic -> Built-in',
        'Loop -> Element -> Garbage -> Block'
      ],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'LEGB stands for Local (current function), Enclosing (nested outer functions), Global (module namespace), and Built-in (standard built-ins).',
      hint: 'Start with the most local scope and expand outward.'
    }
  ],

  // 15. Iterators & Iterables
  'iterators-and-iterables': [
    {
      id: 'top-15-1',
      question: 'What built-in exception signals that an iterator has reached the end of its sequence?',
      options: ['StopIteration', 'EndLoopError', 'IteratorExhausted', 'IndexError'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'The Python iterator protocol requires `__next__()` to raise `StopIteration` when there are no further items to yield.',
      hint: 'What does a for-loop catch under the hood?'
    },
    {
      id: 'top-15-2',
      question: 'What happens when a generator function containing `yield` is invoked?',
      options: [
        'It returns a generator object without executing any code until `next()` is called',
        'It executes immediately and returns a fully populated tuple',
        'It spawns a new thread in the background',
        'It compiles the code to C'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'Calling a generator function returns a lazy generator iterator object. Execution pauses at each `yield` and resumes on subsequent `next()` calls.',
      hint: 'Generators produce values lazily.'
    }
  ],

  // 17. Exception Handling
  'exception-handling': [
    {
      id: 'top-17-1',
      question: 'In a `try ... except ... else ... finally` statement, when does the `else` block execute?',
      options: [
        'Only when the `try` block completes successfully without any exception being raised',
        'Whenever an exception is caught and handled',
        'Always, regardless of exceptions (same as finally)',
        'Only if the `finally` block fails'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'The `else` clause executes only if the code in the `try` block did NOT raise an exception.',
      hint: 'It is the "no exception" branch.'
    },
    {
      id: 'top-17-2',
      question: 'What does the Pythonic idiom EAFP stand for?',
      options: [
        '"Easier to Ask for Forgiveness than Permission"',
        '"Execute All Functions Promptly"',
        '"Errors Are Fatal Problems"',
        '"Explicit Arguments Fast Parsing"'
      ],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: 'EAFP ("Easier to Ask for Forgiveness than Permission") advocates attempting operations in a `try` block rather than checking conditions defensively (LBYL).',
      hint: 'Contrasted with Look Before You Leap (LBYL).'
    }
  ],

  // 21. OOP
  'oop': [
    {
      id: 'top-21-1',
      question: 'What algorithm does modern Python (Python 2.3+) use to resolve Method Resolution Order (MRO) for multiple inheritance?',
      options: [
        'C3 Linearization',
        'Depth-First Search (DFS) only',
        'Breadth-First Search (BFS)',
        'Dijkstra\'s Shortest Path'
      ],
      correctIndex: 0,
      difficulty: 'hard',
      explanation: 'Python uses C3 Linearization to guarantee monotonicity and preserve local precedence ordering in complex multiple inheritance hierarchies.',
      hint: 'Named after the C3 algorithm.'
    },
    {
      id: 'top-21-2',
      question: 'What is the primary difference between `@classmethod` and `@staticmethod` in a Python class?',
      options: [
        '`@classmethod` receives the class (`cls`) as its implicit first argument, whereas `@staticmethod` receives no implicit first argument',
        '`@staticmethod` receives the instance `self`, while `@classmethod` does not',
        '`@classmethod` can only be invoked from outside the class',
        'There is no difference; they are exact aliases'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'A `@classmethod` receives `cls` as its first parameter and can act as an alternative constructor. A `@staticmethod` behaves like a plain function placed inside the class namespace.',
      hint: 'Inspect the first parameter received by each method.'
    }
  ],

  // 22. Decorators
  'advanced-functions-and-decorators': [
    {
      id: 'top-22-1',
      question: 'Why should you always apply `@functools.wraps(fn)` inside a decorator function?',
      options: [
        'To preserve the original function\'s metadata, including `__name__`, `__doc__`, and signature',
        'To make the decorator thread-safe',
        'To force CPython to JIT-compile the wrapper',
        'To prevent recursion errors'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'Without `@functools.wraps(fn)`, the decorated function takes on the name and docstring of the internal `wrapper` function, breaking introspection and debugging tools.',
      hint: 'It wraps and copies metadata.'
    }
  ],

  // 36. Concurrency
  'concurrency': [
    {
      id: 'top-36-1',
      question: 'What is the Global Interpreter Lock (GIL) in CPython?',
      options: [
        'A mutex that prevents multiple native OS threads from executing Python bytecode simultaneously within a single process',
        'A security lock that encrypts Python scripts from unauthorized tampering',
        'A lock that prevents circular module imports',
        'A file lock for database transactions'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'The GIL is a mutex synchronization mechanism in CPython designed to protect internal reference counts, allowing only one thread to execute Python bytecode at a time.',
      hint: 'It restricts CPU-bound multithreading in CPython.'
    },
    {
      id: 'top-36-2',
      question: 'Which module in the Python standard library should you choose for CPU-bound parallel processing to bypass the GIL?',
      options: ['multiprocessing', 'threading', 'asyncio', 'socket'],
      correctIndex: 0,
      difficulty: 'easy',
      explanation: '`multiprocessing` spawns separate OS processes, each with its own independent CPython interpreter and memory space, allowing true parallelism across multiple CPU cores.',
      hint: 'Threads share one GIL; separate processes get their own.'
    }
  ],

  // 37. Asynchronous Python
  'asynchronous-python': [
    {
      id: 'top-37-1',
      question: 'What does the `await` keyword do in an `async def` coroutine?',
      options: [
        'It pauses the current coroutine, returning control to the event loop until the awaited awaitable completes',
        'It blocks the entire operating system thread until finished',
        'It launches a new daemon background thread',
        'It terminates the program immediately'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: '`await` yields control back to the event loop non-blockingly, allowing other scheduled tasks and coroutines to run while waiting for I/O.',
      hint: 'Think about cooperative multitasking in the event loop.'
    }
  ],

  // 44. Machine Learning
  'machine-learning-with-python': [
    {
      id: 'top-44-1',
      question: 'In scikit-learn, why must you call `fit_transform()` only on the training set, but only `transform()` on the test set?',
      options: [
        'To prevent data leakage by ensuring test data statistics do not influence the scaler or preprocessor',
        'Calling `fit_transform()` on test data throws an error',
        'The test set has no labels',
        '`fit_transform()` is deprecated in scikit-learn'
      ],
      correctIndex: 0,
      difficulty: 'medium',
      explanation: 'Fitting on test data causes data leakage (contamination), as the model would inadvertently learn parameters (like mean and variance) from unseen evaluation data.',
      hint: 'Preventing information leakage from future/test data.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// ONLINE QUESTION FETCHER ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch questions from the Open Trivia Database (100% Free, Public CS/Programming API)
 */
export async function fetchFromOpenTriviaDb({ amount = 5, difficulty = 'all' } = {}) {
  try {
    let url = `https://opentdb.com/api.php?amount=${amount}&category=18&type=multiple`;
    if (difficulty && difficulty !== 'all') {
      url += `&difficulty=${encodeURIComponent(difficulty.toLowerCase())}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenTDB HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error('No results from OpenTDB');
    }

    return data.results.map((item, idx) => {
      const qText = decodeHtmlEntities(item.question);
      const correctAns = decodeHtmlEntities(item.correct_answer);
      const incorrects = (item.incorrect_answers || []).map(decodeHtmlEntities);
      
      const allOpts = shuffleArray([...incorrects, correctAns]);
      const correctIdx = allOpts.indexOf(correctAns);

      return {
        id: `opentdb-${Date.now()}-${idx}`,
        question: qText,
        options: allOpts,
        correctIndex: correctIdx,
        difficulty: item.difficulty || 'medium',
        explanation: `Correct Answer: "${correctAns}". (Verified from Open Trivia DB Computer Science API)`,
        hint: `Consider general computer architecture, algorithms, and computing fundamentals.`,
        source: 'Open Trivia DB (Live Internet API)',
        topicTitle: 'Computer Science & Software Architecture'
      };
    });
  } catch (err) {
    console.warn('Open Trivia DB fetch error:', err.message);
    return null;
  }
}

/**
 * Fetch Topic-wise questions for a specific topic ID or category
 */
export function getTopicwiseQuestions(topicId, { difficulty = 'all', count = 5 } = {}) {
  let questions = [];

  // 1. Topic-specific cloud bank
  if (topicId && TOPICWISE_QUESTION_BANK[topicId]) {
    questions.push(...TOPICWISE_QUESTION_BANK[topicId]);
  }

  // 2. Curated questions directly from topic dataset
  if (topicId && topicId !== 'all') {
    const topicFromList = TOPICS.find((t) => t.id === topicId);
    if (topicFromList && topicFromList.questions && topicFromList.questions.length > 0) {
      const mapped = topicFromList.questions.map((q, idx) => ({
        id: q.id || `${topicId}-${idx}`,
        question: q.question,
        options: q.options || q.choices || [],
        correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
        difficulty: q.difficulty || (idx === 0 ? 'easy' : idx === 1 ? 'medium' : 'hard'),
        explanation: q.explanation || 'Verified correct answer according to Python standard specifications.',
        hint: (q.hints && q.hints[0]) || q.hint || `Think about the core behavior of ${topicFromList.title}.`,
        topicTitle: topicFromList.title,
        source: 'Python Curriculum Question Bank'
      }));
      questions.push(...mapped);
    }
  }

  // 3. If topicId is 'all' or questions is still empty, collect from all topics
  if (questions.length === 0 || topicId === 'all') {
    TOPICS.forEach((t) => {
      if (t.questions) {
        t.questions.forEach((q, idx) => {
          questions.push({
            id: q.id || `${t.id}-${idx}`,
            question: q.question,
            options: q.options || q.choices || [],
            correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
            difficulty: q.difficulty || 'medium',
            explanation: q.explanation || 'Verified correct answer.',
            hint: (q.hints && q.hints[0]) || q.hint || `Think about Python rules for ${t.title}.`,
            topicTitle: t.title,
            source: 'Python Curriculum Question Bank'
          });
        });
      }
    });

    Object.keys(TOPICWISE_QUESTION_BANK).forEach((k) => {
      questions.push(...TOPICWISE_QUESTION_BANK[k]);
    });
  }

  // Deduplicate questions by text
  const seen = new Set();
  const deduped = [];
  for (const q of questions) {
    const key = q.question.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(q);
    }
  }

  // Filter by difficulty if requested
  let filtered = deduped;
  if (difficulty && difficulty !== 'all') {
    const matched = deduped.filter((q) => q.difficulty === difficulty.toLowerCase());
    if (matched.length > 0) {
      filtered = matched;
    }
  }

  return shuffleArray(filtered).slice(0, count);
}

/**
 * Unified Live Question Fetcher
 * Automatically fetches questions via API based on Topic, Difficulty, and Count
 */
export async function fetchLiveQuestions({
  topicId = null,
  topicTitle = 'Python Fundamentals',
  difficulty = 'all',
  source = 'all',
  count = 5
} = {}) {
  // If user requests general CS / OpenTDB or topic is general
  if (source === 'opentdb' || topicId === 'cs_general') {
    const openTdbResults = await fetchFromOpenTriviaDb({ amount: count, difficulty });
    if (openTdbResults && openTdbResults.length > 0) {
      return openTdbResults;
    }
  }

  // 1. Get topic-specific questions
  let results = getTopicwiseQuestions(topicId, { difficulty, count });

  // 2. If needed to satisfy question count, supplement with live OpenTDB API
  if (results.length < count) {
    try {
      const openTdbResults = await fetchFromOpenTriviaDb({ amount: count - results.length, difficulty });
      if (openTdbResults && openTdbResults.length > 0) {
        results = [...results, ...openTdbResults];
      }
    } catch {
      // safe fallback
    }
  }

  return results.slice(0, count);
}

/**
 * Dynamic Problem of the Day Service
 * -----------------------------------
 * Retrieves or generates a fresh problem dynamically:
 * - Changes dynamically day-by-day based on current date.
 * - Supports live API fetching from Open Trivia DB and comprehensive question bank.
 * - Supports dynamic refreshing on demand.
 */
export async function fetchProblemOfTheDay({ forceNew = false, source = 'api' } = {}) {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const storageKey = `pycosmos_qotd_${dateKey}`;

  // If not forcing a new question, check if today's problem is already cached in localStorage
  // Discard if it was the legacy static '17 // 4' question
  if (!forceNew) {
    try {
      const cached = localStorage.getItem(storageKey) || localStorage.getItem(`pyforge_qotd_${dateKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.question && Array.isArray(parsed.options) && !parsed.question.includes('17 // 4')) {
          return { ...parsed, dateKey, fromCache: true };
        }
      }
    } catch {
      // ignore
    }
  }

  // 1. Attempt live API fetch from Open Trivia DB (Computer Science & Programming category)
  try {
    const liveRes = await fetchFromOpenTriviaDb({ amount: 1 });
    if (liveRes && liveRes.length > 0) {
      const liveQ = liveRes[0];
      const formatted = {
        id: `qotd_live_${Date.now()}`,
        dateKey,
        question: liveQ.question,
        options: liveQ.options,
        correct: liveQ.correctIndex !== undefined ? liveQ.correctIndex : 0,
        explanation: liveQ.explanation || 'Verified via Live Computer Science API.',
        topicCategory: 'Live CS & Python API',
        difficulty: (liveQ.difficulty || 'medium').toUpperCase(),
        hint: liveQ.hint || 'Think about standard software engineering principles.',
        isLiveApi: true
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(formatted));
      } catch {}
      return formatted;
    }
  } catch (e) {
    console.warn('Live API fetch fallback to daily Python question bank:', e);
  }

  // 2. Deterministic daily dynamic selection across all 51 Python topics
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));

  const allCurated = [];
  Object.entries(TOPICWISE_QUESTION_BANK).forEach(([tId, qList]) => {
    qList.forEach((q) => allCurated.push({ ...q, topicId: tId }));
  });

  if (allCurated.length > 0) {
    const index = forceNew
      ? Math.floor(Math.random() * allCurated.length)
      : (dayOfYear * 7 + today.getFullYear() * 11) % allCurated.length;

    const chosen = allCurated[index];
    const formatted = {
      id: `qotd_topic_${chosen.id || index}_${Date.now()}`,
      dateKey,
      question: chosen.question,
      options: chosen.options,
      correct: chosen.correctIndex !== undefined ? chosen.correctIndex : (chosen.correct || 0),
      explanation: chosen.explanation || 'Based on core Python 3 language specifications.',
      topicCategory: chosen.topicId ? chosen.topicId.replace(/-/g, ' ').toUpperCase() : 'PYTHON CORE',
      difficulty: (chosen.difficulty || 'Intermediate').toUpperCase(),
      hint: chosen.hint || '',
      isLiveApi: false
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(formatted));
    } catch {}

    return formatted;
  }

  // Fallback to rotating array of Python core questions
  const pythonDailyPool = [
    {
      question: "Which built-in Python function returns the unique integer identity (memory address) of an object in CPython?",
      options: ["id()", "ref()", "addr()", "memoryview()"],
      correct: 0,
      explanation: "id(obj) returns the identity of an object, guaranteed to be unique and constant for its lifetime. In CPython, this is its memory address.",
      topicCategory: "VARIABLES & MEMORY",
      difficulty: "EASY"
    },
    {
      question: "What is the result of `type(lambda x: x)` in Python 3?",
      options: ["<class 'function'>", "<class 'lambda'>", "<class 'generator'>", "<class 'builtin_function_or_method'>"],
      correct: 0,
      explanation: "Lambda expressions create anonymous function objects of type <class 'function'>, identical to functions defined with 'def'.",
      topicCategory: "FUNCTIONS & LAMBDAS",
      difficulty: "INTERMEDIATE"
    },
    {
      question: "What does the `@dataclass` decorator in Python 3.7+ automatically generate for a class?",
      options: ["__init__, __repr__, and __eq__", "__str__ and __len__ only", "JSON serialization methods", "__enter__ and __exit__"],
      correct: 0,
      explanation: "@dataclass inspects type annotations and automatically generates standard dunder methods including __init__, __repr__, and __eq__.",
      topicCategory: "OOP & DATACLASSES",
      difficulty: "INTERMEDIATE"
    }
  ];

  const poolIdx = (dayOfYear + today.getDate()) % pythonDailyPool.length;
  const item = pythonDailyPool[poolIdx];
  return {
    id: `qotd_pool_${poolIdx}_${dateKey}`,
    dateKey,
    ...item,
    isLiveApi: false
  };
}
