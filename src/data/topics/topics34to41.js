// Topics 34 to 41: Professional Python, Concurrency, Async, Internals & Performance
// 34. Testing, 35. Logging & Debugging, 36. Concurrency, 37. Asynchronous Python,
// 38. Python Internals, 39. Performance & Optimization, 40. Pythonic Programming, 41. Command-Line Python

export const TOPICS_34_TO_41 = [
  // ───  
  {
    id: "testing",
    topicNum: 34,
    title: "34. Testing",
    category: "Professional Python",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §unittest & pytest",
    docUrl: "https://docs.python.org/3/library/unittest.html",
    summary: "Unit testing, unittest, pytest fixtures, assertions, parameterized tests, mocking with unittest.mock, and TDD.",
    whatIsIt: "Testing is the automated verification of software correctness using assertion libraries, test runners, and isolation mocks.",
    whyDoesItExist: "To catch regressions early, document expected behavior, ensure edge-case safety, and enable confident refactoring.",
    syntax: `# unittest standard library:
import unittest

class TestCalculator(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(2 + 2, 4)

# Modern pytest style (concise):
# def test_addition():
#     assert 2 + 2 == 4`,
    basicExample: `import unittest

def normalize_email(email: str) -> str:
    return email.strip().lower()

class TestAuthUtilities(unittest.TestCase):
    def test_strip_spaces(self):
        self.assertEqual(normalize_email("  User@Pyradox.io "), "user@pyradox.io")

    def test_already_normalized(self):
        self.assertEqual(normalize_email("test@domain.com"), "test@domain.com")

suite = unittest.TestLoader().loadTestsFromTestCase(TestAuthUtilities)
runner = unittest.TextTestRunner(verbosity=1)
runner.run(suite)`,
    stepByStepExecution: `Test Fixture Lifecycle (setUp / tearDown):
1. Test Discovery: Finds files matching \'test_*.py\' or \'*_test.py\'.
2. For each test method:
   - Allocates a fresh TestCase instance (guaranteeing test isolation).
   - Invokes \'setUp()\': pre-allocates database connections or mock files.
   - Executes the test method containing assertions.
   - Invokes \'tearDown()\': closes resources and cleans up files.
3. Aggregates results into pass/fail/error counts.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Testing for Expected Exceptions",
        code: `import unittest

def parse_positive_int(s):
    val = int(s)
    if val <= 0: raise ValueError("Must be positive")
    return val

class TestExceptions(unittest.TestCase):
    def test_negative_raises_value_error(self):
        with self.assertRaises(ValueError):
            parse_positive_int("-5")

suite = unittest.TestLoader().loadTestsFromTestCase(TestExceptions)
unittest.TextTestRunner().run(suite)`,
        explanation: "`assertRaises` ensures functions fail with expected exception types on invalid inputs."
      },
      {
        level: "Intermediate",
        title: "Mocking External Services with unittest.mock",
        code: `from unittest.mock import Mock, patch

# Simulate an external third-party payment gateway
mock_payment_gateway = Mock()
mock_payment_gateway.charge.return_value = {"status": "SUCCESS", "tx_id": "TX99"}

res = mock_payment_gateway.charge(amount=100)
print("Mock response:", res)
mock_payment_gateway.charge.assert_called_once_with(amount=100)`,
        explanation: "`unittest.mock.Mock` isolates tests from slow, non-deterministic external networks and APIs."
      },
      {
        level: "Tricky",
        title: "pytest.mark.parametrize Concept",
        code: `# In pytest, parameterized tests run one test logic across multiple input cases:
# @pytest.mark.parametrize("inp,expected", [
#     ("hello", "HELLO"),
#     ("python", "PYTHON"),
#     ("", "")
# ])
# def test_upper(inp, expected):
#     assert inp.upper() == expected`,
        explanation: "Parameterized tests eliminate repetitive test method definitions."
      }
    ],
    commonMistakes: [
      {
        title: "Shared State Between Tests",
        wrongCode: `class TestBad(unittest.TestCase):
    shared_list = [] # CLASS VARIABLE SHARED BY ALL TESTS!
    def test_one(self): self.shared_list.append(1)
    def test_two(self): self.assertEqual(len(self.shared_list), 0) # FAILS!`,
        correctCode: `class TestGood(unittest.TestCase):
    def setUp(self):
        self.isolated_list = [] # Fresh per test`,
        whyItFails: "Shared class-level state creates test order dependencies, leading to flaky test suites."
      }
    ],
    importantDifferences: [
      {
        title: "unittest vs pytest",
        itemA: "unittest (Standard Library)",
        itemB: "pytest (Third-party Industry Standard)",
        comparison: [
          "Syntax: Class-based `self.assertEqual(a, b)` vs Plain Python `assert a == b`",
          "Fixtures: `setUp()` / `tearDown()` vs Modular, reusable `@pytest.fixture` dependency injection",
          "Ecosystem: Built-in vs Rich plugin ecosystem (pytest-cov, pytest-xdist, pytest-asyncio)"
        ]
      }
    ],
    realWorldUse: "CI/CD pipelines on GitHub Actions, preventing regressions during refactoring, ensuring compliance.",
    interviewPerspective: [
      {
        question: "What is the difference between a Mock and a Stub in unit testing?",
        trap: "Using the terms interchangeably.",
        expectedAnswer: "A Stub is a dummy object with canned responses used to supply data to the system under test. A Mock is an object that records calls and allows assertions on interactions (verifying whether a method was called, with which arguments, and how many times)."
      }
    ],
    questions: [
      {
        id: "q34_1",
        question: "How do you test that a function raises a `KeyError` in `unittest`?",
        choices: [
          "with self.assertRaises(KeyError): func()",
          "assert KeyError == func()",
          "self.expectError(KeyError, func)",
          "try: func() catch KeyError: pass"
        ],
        correctIndex: 0,
        hints: ["Use the context manager on self."],
        solutionCode: `with self.assertRaises(KeyError):\n    d = {}\n    _ = d['bad']`,
        explanation: "`with self.assertRaises(KeyError):` verifies that the enclosed code raises the expected exception."
      }
    ],
    revisionSheet: [
      "Use `unittest` for zero-dependency tests; use `pytest` for modern development.",
      "Keep tests isolated: use `setUp()` / fixtures, never shared class state.",
      "Use `unittest.mock.patch` to mock network and disk I/O.",
      "Test both happy paths and edge cases (empty lists, None, zero, negative)."
    ],
    subtopics: [
      { id: "s34_1", text: "Why testing?", isStarred: false },
      { id: "s34_2", text: "Unit testing", isStarred: false },
      { id: "s34_3", text: "unittest", isStarred: false },
      { id: "s34_4", text: "Test cases", isStarred: false },
      { id: "s34_5", text: "Assertions", isStarred: false },
      { id: "s34_6", text: "Test fixtures", isStarred: false },
      { id: "s34_7", text: "pytest", isStarred: false },
      { id: "s34_8", text: "Parameterized tests", isStarred: false },
      { id: "s34_9", text: "Mocking", isStarred: false },
      { id: "s34_10", text: "Code coverage", isStarred: false },
      { id: "s34_11", text: "Test-driven development basics", isStarred: false }
    ],
    starterCode: `# 34. Testing with unittest
import unittest

def calculate_discount(price, pct):
    if not (0 <= pct <= 1): raise ValueError("Percentage must be 0-1")
    return price * (1 - pct)

class TestPricing(unittest.TestCase):
    def test_normal_discount(self):
        self.assertAlmostEqual(calculate_discount(100, 0.2), 80.0)

suite = unittest.TestLoader().loadTestsFromTestCase(TestPricing)
unittest.TextTestRunner(verbosity=2).run(suite)`
  },

  // ─── 35. Logging & Debugging ────────────────────────────────────────────────
  {
    id: "logging-and-debugging",
    topicNum: 35,
    title: "35. Logging & Debugging",
    category: "Professional Python",
    level: "Intermediate",
    stars: "",
    docRefTag: "Docs §logging",
    docUrl: "https://docs.python.org/3/library/logging.html",
    summary: "logging levels (DEBUG, INFO, WARNING, ERROR, CRITICAL), handlers, formatters, rotating file logs, and pdb debugger.",
    whatIsIt: "Logging provides standardized event recording for software systems. Debugging is the systematic analysis and diagnosis of unintended behavior using breakpoints and stack inspection.",
    whyDoesItExist: "To diagnose issues in production where interactive debuggers cannot attach, monitor system health, and retain audit logs.",
    syntax: `import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("pyradox.auth")
logger.info("Service initialized")`,
    basicExample: `import logging

logging.basicConfig(level=logging.DEBUG, format="[%(levelname)s] %(message)s")
logger = logging.getLogger("demo")

logger.debug("Parsing request payload (Debug level)")
logger.info("User 'shivansh' logged in successfully")
logger.warning("Cache latency exceeded 50ms")
logger.error("Database connection dropped!")
logger.critical("Fatal: disk space 100% full!")`,
    stepByStepExecution: `Python Logging Architecture:
1. Logger: Entrypoint hierarchy (\'pyradox.auth.jwt\'). Propagates messages up to the root logger.
2. LogRecord: Formed automatically with metadata (timestamp, filename, line number, thread name).
3. Filter: Evaluates whether the record should proceed.
4. Handler: Directs the record to destinations (StreamHandler -> stdout, RotatingFileHandler -> disk, SocketHandler -> Datadog/ELK).
5. Formatter: Renders the final string format.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Exception Logging with logger.exception()",
        code: `import logging

logger = logging.getLogger("app")
try:
    1 / 0
except ZeroDivisionError:
    # logger.exception automatically captures and formats the active stack trace!
    logger.exception("Failed to calculate ratio")`,
        explanation: "`logger.exception()` logs at ERROR level and automatically appends the current traceback."
      },
      {
        level: "Intermediate",
        title: "Named Hierarchical Loggers",
        code: `import logging

parent_logger = logging.getLogger("pyradox")
child_logger = logging.getLogger("pyradox.security")

print("Child inherits from parent:", child_logger.parent.name == "pyradox")`,
        explanation: "Dot-delimited names create logger hierarchies inheriting levels and handlers."
      },
      {
        level: "Tricky",
        title: "breakpoint() and pdb Inspection",
        code: `# Python 3.7+ built-in breakpoint():
def process_data(val):
    # breakpoint() # Launches interactive PDB shell!
    # Common PDB commands:
    # n (next line), s (step into), c (continue), p var (print var), q (quit)
    return val * 2

print(process_data(5))`,
        explanation: "`breakpoint()` pauses execution and launches the interactive Python debugger."
      }
    ],
    commonMistakes: [
      {
        title: "Using print() in Production Code Instead of logging",
        wrongCode: `print(f"Error connecting to server: {err}") # Lost in background daemons!`,
        correctCode: `logger.error("Error connecting to server: %s", err)`,
        whyItFails: "`print()` lacks timestamps, log levels, formatting, and cannot be directed to rotating files or remote log aggregators."
      }
    ],
    importantDifferences: [
      {
        title: "print() vs logging",
        itemA: "print()",
        itemB: "logging",
        comparison: [
          "Destination: Standard output (stdout) only vs Configurable handlers (files, Syslog, stdout, Sentry)",
          "Levels: All outputs treated identically vs Granular filtering (DEBUG, INFO, WARNING, ERROR, CRITICAL)",
          "Performance: Unbuffered and synchronous vs Optimized formatting and configurable buffering"
        ]
      }
    ],
    realWorldUse: "Monitoring Kubernetes microservices, tracking authentication failures, audit logging compliance.",
    interviewPerspective: [
      {
        question: "Why should you pass `%s` args to `logger.info()` instead of using f-strings?",
        trap: "Thinking f-strings are always preferred.",
        expectedAnswer: "If a log level is disabled (e.g. `logger.debug()` in production running at INFO level), f-strings interpolate strings eagerly, wasting CPU cycles. Passing `%s` allows the logger to defer string formatting until it confirms the level is actually enabled."
      }
    ],
    questions: [
      {
        id: "q35_1",
        question: "Which logging method automatically appends the current exception stack trace?",
        choices: ["logger.error()", "logger.exception()", "logger.trace()", "logger.fatal()"],
        correctIndex: 1,
        hints: ["It is specifically designed for `except:` blocks."],
        solutionCode: `logger.exception("Failed")`,
        explanation: "`logger.exception()` logs an ERROR message and automatically attaches the current traceback."
      }
    ],
    revisionSheet: [
      "Never use `print()` for production diagnostics; use `logging`.",
      "Levels: DEBUG (10) < INFO (20) < WARNING (30) < ERROR (40) < CRITICAL (50).",
      "Use `logger.exception('msg')` inside `except` blocks.",
      "Use `breakpoint()` (Python 3.7+) to drop into the interactive PDB debugger."
    ],
    subtopics: [
      { id: "s35_1", text: "Debugging concepts", isStarred: false },
      { id: "s35_2", text: "print() debugging", isStarred: false },
      { id: "s35_3", text: "VS Code debugger", isStarred: false },
      { id: "s35_4", text: "Breakpoints", isStarred: false },
      { id: "s35_5", text: "Stack trace", isStarred: false },
      { id: "s35_6", text: "logging", isStarred: false },
      { id: "s35_7", text: "Log levels", isStarred: false },
      { id: "s35_8", text: "Logging to files", isStarred: false },
      { id: "s35_9", text: "Exception logging", isStarred: false },
      { id: "s35_10", text: "Debugging strategies", isStarred: false }
    ],
    starterCode: `# 35. Logging in Action
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("PyradoxCore")

logger.info("Initializing neural routing mesh...")
logger.warning("Worker thread 3 reached 82% threshold")`
  },

  // ───  
  {
    id: "concurrency",
    topicNum: 36,
    title: "36. Concurrency",
    category: "Professional Python",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §threading & §multiprocessing",
    docUrl: "https://docs.python.org/3/library/concurrency.html",
    summary: "Threads, Processes, the Global Interpreter Lock (GIL), ThreadPoolExecutor, ProcessPoolExecutor, Locks, and Race Conditions.",
    whatIsIt: "Concurrency is the execution of multiple computation tasks over overlapping time periods. Parallelism is the simultaneous hardware execution of multiple tasks on separate CPU cores.",
    whyDoesItExist: "To accelerate I/O-bound tasks (network/disk calls via threading) and compute-bound tasks (image processing, data science via multiprocessing).",
    syntax: `# High-level concurrent.futures API:
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# I/O Bound Tasks (Threads):
with ThreadPoolExecutor(max_workers=8) as executor:
    results = list(executor.map(fetch_url, url_list))

# CPU Bound Tasks (Separate OS Processes):
with ProcessPoolExecutor() as executor:
    results = list(executor.map(heavy_cpu_calc, data_chunks))`,
    basicExample: `from concurrent.futures import ThreadPoolExecutor
import time

def simulate_download(file_id):
    time.sleep(0.05) # Simulate network latency
    return f"File_{file_id}.dat"

t0 = time.perf_counter()
with ThreadPoolExecutor(max_workers=4) as executor:
    files = list(executor.map(simulate_download, range(4)))

print("Downloaded:", files)
print(f"Total time elapsed: {time.perf_counter() - t0:.3f}s")`,
    stepByStepExecution: `The Global Interpreter Lock (GIL):
1. CPython's memory management is NOT thread-safe (reference counts are modified concurrently).
2. The GIL is a mutual-exclusion lock that allows ONLY ONE OS thread to execute Python bytecode at any given moment.
3. For I/O-bound tasks: when a thread calls \'socket.recv()\' or \'time.sleep()\', CPython RELEASES the GIL, allowing other threads to run in parallel!
4. For CPU-bound tasks: threads contend for the single GIL, yielding zero multi-core speedup. Use \'multiprocessing\' to spawn separate processes with independent Python interpreters.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Thread Synchronization with threading.Lock",
        code: `import threading

counter = 0
lock = threading.Lock()

def safe_increment():
    global counter
    for _ in range(10000):
        with lock: # Prevents race conditions!
            counter += 1

threads = [threading.Thread(target=safe_increment) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print("Synchronized counter:", counter)`,
        explanation: "`threading.Lock()` serializes access to shared mutable state, preventing race conditions."
      },
      {
        level: "Intermediate",
        title: "concurrent.futures.as_completed for First-Finished Results",
        code: `from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def task(name, delay):
    time.sleep(delay)
    return f"{name} finished"

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = {
        executor.submit(task, "TaskA", 0.15): "A",
        executor.submit(task, "TaskB", 0.05): "B",
        executor.submit(task, "TaskC", 0.10): "C"
    }
    for f in as_completed(futures):
        print(f.result())`,
        explanation: "`as_completed()` yields results as soon as each individual worker finishes."
      },
      {
        level: "Tricky",
        title: "Multiprocessing Memory Isolation",
        code: `# In multiprocessing, each process runs in its own memory space!
# Modifying a global variable in a child process does NOT affect the parent.
# Communication requires multiprocessing.Queue, Pipe, or shared memory.`,
        explanation: "Processes do not share memory; state must be explicitly serialized via IPC."
      }
    ],
    commonMistakes: [
      {
        title: "Using Threads for CPU-Intensive Work (GIL Bottleneck)",
        wrongCode: `# Spawning 8 threads to compute mathematical factorials in Python
# Actually runs SLOWER than a single thread due to GIL thread-switching overhead!`,
        correctCode: `# Use ProcessPoolExecutor to utilize all physical CPU cores:
from concurrent.futures import ProcessPoolExecutor`,
        whyItFails: "Due to the GIL, CPU-bound threads fight over a single core, adding lock contention overhead."
      }
    ],
    importantDifferences: [
      {
        title: "Threading vs Multiprocessing",
        itemA: "threading (Threads)",
        itemB: "multiprocessing (Processes)",
        comparison: [
          "Memory: Shared memory space vs Completely isolated memory spaces",
          "GIL: Bound by the GIL (1 thread executes Python bytecode at a time) vs Bypasses the GIL (each process has its own GIL)",
          "Best for: I/O-bound tasks (HTTP requests, database queries, file reading) vs CPU-bound tasks (image processing, ML training)"
        ]
      }
    ],
    realWorldUse: "Concurrent web scrapers, downloading image batches, CPU-heavy data transformations across multi-core servers.",
    interviewPerspective: [
      {
        question: "What is Python's GIL and why does it exist?",
        trap: "Saying 'Python is single-threaded'.",
        expectedAnswer: "Python supports real OS threads, but CPython enforces a Global Interpreter Lock (GIL) so only one thread executes Python bytecode at a time. It exists because CPython's reference-counting memory management is not thread-safe. It protects against memory corruption while allowing C extensions and I/O operations to run in parallel."
      }
    ],
    questions: [
      {
        id: "q36_1",
        question: "Which model should you choose to utilize multiple CPU cores for heavy mathematical calculations in Python?",
        choices: ["threading", "multiprocessing", "asyncio", "generators"],
        correctIndex: 1,
        hints: ["Separate processes bypass the Global Interpreter Lock."],
        solutionCode: `from concurrent.futures import ProcessPoolExecutor`,
        explanation: "`multiprocessing` spawns distinct OS processes with independent GILs, running across separate CPU cores."
      }
    ],
    revisionSheet: [
      "Use `threading` for I/O-bound tasks (network, disk).",
      "Use `multiprocessing` for CPU-bound tasks (math, encryption).",
      "The GIL prevents multiple threads from executing Python bytecode simultaneously.",
      "`concurrent.futures.ThreadPoolExecutor` is the modern high-level concurrency API."
    ],
    subtopics: [
      { id: "s36_1", text: "Process", isStarred: false },
      { id: "s36_2", text: "Thread", isStarred: false },
      { id: "s36_3", text: "Concurrency", isStarred: false },
      { id: "s36_4", text: "Parallelism", isStarred: false },
      { id: "s36_5", text: "threading", isStarred: false },
      { id: "s36_6", text: "Threads", isStarred: false },
      { id: "s36_7", text: "Thread synchronization", isStarred: false },
      { id: "s36_8", text: "Locks", isStarred: false },
      { id: "s36_9", text: "Race conditions", isStarred: false },
      { id: "s36_10", text: "Deadlocks", isStarred: false },
      { id: "s36_11", text: "multiprocessing", isStarred: false },
      { id: "s36_12", text: "Processes", isStarred: false },
      { id: "s36_13", text: "Process pools", isStarred: false },
      { id: "s36_14", text: "concurrent.futures", isStarred: false },
      { id: "s36_15", text: "ThreadPoolExecutor", isStarred: false },
      { id: "s36_16", text: "ProcessPoolExecutor", isStarred: false }
    ],
    starterCode: `# 36. ThreadPoolExecutor
from concurrent.futures import ThreadPoolExecutor

def fetch_telemetry(sensor_id):
    return {"sensor": sensor_id, "reading": 24.5 + sensor_id}

with ThreadPoolExecutor(max_workers=3) as executor:
    readings = list(executor.map(fetch_telemetry, [1, 2, 3]))

print("Collected telemetry:", readings)`
  },

  // ───  
  {
    id: "asynchronous-python",
    topicNum: 37,
    title: "37. Asynchronous Python",
    category: "Professional Python",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §asyncio & PEP 492",
    docUrl: "https://docs.python.org/3/library/asyncio.html",
    summary: "async/await, coroutines, the Event Loop, asyncio.gather, Task management, async context managers, and high-concurrency I/O.",
    whatIsIt: "Asynchronous programming (asyncio) is single-threaded, cooperative multitasking where tasks voluntarily yield control back to an event loop while waiting for I/O operations.",
    whyDoesItExist: "To handle tens of thousands of concurrent network connections (WebSockets, microservices, chat apps) on a single thread with minimal RAM overhead.",
    syntax: `import asyncio

async def fetch_data(item_id: int) -> dict:
    # Non-blocking pause; yields control to event loop
    await asyncio.sleep(0.01)
    return {"id": item_id, "status": "READY"}

async def main():
    # Run multiple coroutines concurrently:
    results = await asyncio.gather(
        fetch_data(1),
        fetch_data(2),
        fetch_data(3)
    )
    print(results)

asyncio.run(main())`,
    basicExample: `import asyncio

async def worker(name, delay):
    print(f"[{name}] started")
    await asyncio.sleep(delay)
    print(f"[{name}] finished after {delay}s")
    return name

async def main():
    results = await asyncio.gather(
        worker("Alpha", 0.05),
        worker("Beta", 0.02),
        worker("Gamma", 0.04)
    )
    print("All workers done:", results)

asyncio.run(main())`,
    stepByStepExecution: `How the Asyncio Event Loop Works:
1. The Event Loop maintains a queue of ready Tasks and monitors operating system I/O multiplexers (epoll on Linux, kqueue on macOS).
2. When a coroutine hits \'await\', it pauses its execution frame and registers a callback with the event loop.
3. The event loop immediately switches to another ready coroutine—zero CPU cycles wasted waiting!
4. When the OS signals that socket data has arrived, the event loop awakens the suspended coroutine and resumes execution.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "asyncio.create_task for Background Execution",
        code: `import asyncio

async def heartbeat():
    for i in range(3):
        print(f"Heartbeat pulse {i+1}")
        await asyncio.sleep(0.02)

async def main():
    # create_task schedules the coroutine immediately without blocking
    task = asyncio.create_task(heartbeat())
    print("Main continues while heartbeat runs...")
    await task

asyncio.run(main())`,
        explanation: "`create_task` submits coroutines to run in the background on the event loop."
      },
      {
        level: "Intermediate",
        title: "Async Context Managers (__aenter__, __aexit__)",
        code: `import asyncio

class AsyncDatabaseClient:
    async def __aenter__(self):
        print("Connecting to async DB pool...")
        await asyncio.sleep(0.01)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Closing async DB pool...")
        await asyncio.sleep(0.01)

async def run_query():
    async with AsyncDatabaseClient() as db:
        print("Executing query...")

asyncio.run(run_query())`,
        explanation: "Async context managers use `async with` and implement `__aenter__` / `__aexit__`."
      },
      {
        level: "Tricky",
        title: "Blocking Code Inside Async Functions (Event Loop Freeze)",
        code: `import asyncio
import time

async def buggy_worker():
    # DISASTER: time.sleep() blocks the ENTIRE event loop, freezing all users!
    # time.sleep(5)
    # CORRECT:
    await asyncio.sleep(0.01)

# To run synchronous blocking code safely without freezing:
# await asyncio.to_thread(blocking_function, *args)`,
        explanation: "Never use synchronous blocking I/O (like `time.sleep` or synchronous `requests.get`) inside async code; use `asyncio.to_thread()`."
      }
    ],
    commonMistakes: [
      {
        title: "Calling Coroutines Without 'await'",
        wrongCode: `async def fetch(): return 42
async def main():
    res = fetch() # RuntimeWarning: coroutine 'fetch' was never awaited!
    print(res)    # Prints <coroutine object fetch at 0x...>`,
        correctCode: `async def main():
    res = await fetch() # Properly awaits result`,
        whyItFails: "Calling an async function does not execute it; it returns a coroutine object that must be `await`ed."
      }
    ],
    importantDifferences: [
      {
        title: "asyncio vs threading",
        itemA: "asyncio",
        itemB: "threading",
        comparison: [
          "Switching: Cooperative multitasking (yields only at explicit `await` points) vs Preemptive multitasking (OS interrupts threads at any time)",
          "Concurrency: 100,000+ connections easily on 1 thread vs Typically limited to ~1,000 threads due to OS stack memory",
          "Race conditions: No race conditions between awaits vs High race condition hazard, requires mutex locks"
        ]
      }
    ],
    realWorldUse: "High-performance web backends (FastAPI, Starlette, aiohttp), Discord/Telegram bots, streaming real-time LLM chat tokens.",
    interviewPerspective: [
      {
        question: "What happens if you execute a blocking function (like `time.sleep(10)`) inside an asyncio coroutine?",
        trap: "Assuming asyncio runs it on another thread.",
        expectedAnswer: "It freezes the entire event loop! Because asyncio is single-threaded, a blocking call prevents the event loop from servicing any other tasks or network events for 10 seconds. You must offload blocking calls using `asyncio.to_thread()`."
      }
    ],
    questions: [
      {
        id: "q37_1",
        question: "How do you run multiple coroutines concurrently and wait for all of them to finish?",
        choices: ["asyncio.wait_all()", "asyncio.gather()", "asyncio.join()", "asyncio.combine()"],
        correctIndex: 1,
        hints: ["It gathers all coroutines together."],
        solutionCode: `await asyncio.gather(c1(), c2())`,
        explanation: "`asyncio.gather(*coros)` runs multiple coroutines concurrently and returns their aggregated results in order."
      }
    ],
    revisionSheet: [
      "`async def` creates a coroutine; always `await` coroutine calls.",
      "Use `asyncio.run(main())` as the top-level application entrypoint.",
      "`asyncio.gather()` runs multiple coroutines concurrently.",
      "Never run blocking I/O on the event loop; use `await asyncio.to_thread(func)`."
    ],
    subtopics: [
      { id: "s37_1", text: "Synchronous vs asynchronous", isStarred: false },
      { id: "s37_2", text: "Blocking vs non-blocking", isStarred: false },
      { id: "s37_3", text: "async", isStarred: false },
      { id: "s37_4", text: "await", isStarred: false },
      { id: "s37_5", text: "Coroutines", isStarred: false },
      { id: "s37_6", text: "Event loop", isStarred: false },
      { id: "s37_7", text: "asyncio", isStarred: false },
      { id: "s37_8", text: "Tasks", isStarred: false },
      { id: "s37_9", text: "Futures", isStarred: false },
      { id: "s37_10", text: "Async context managers", isStarred: false },
      { id: "s37_11", text: "Async iterators", isStarred: false },
      { id: "s37_12", text: "Async generators", isStarred: false },
      { id: "s37_13", text: "Concurrent async operations", isStarred: false }
    ],
    starterCode: `# 37. Asynchronous Python
import asyncio

async def ping_service(name):
    await asyncio.sleep(0.01)
    return f"{name}: 200 OK"

async def main():
    services = ["Auth", "Billing", "Search"]
    results = await asyncio.gather(*(ping_service(s) for s in services))
    print("Health check results:", results)

asyncio.run(main())`
  },

  // ─── 38. Advanced Python Internals ──────────────────────────────────────────
  {
    id: "advanced-python-internals",
    topicNum: 38,
    title: "38. Advanced Python Internals",
    category: "Professional Python",
    level: "Advanced",
    stars: "",
    docRefTag: "Docs §dis & §inspect",
    docUrl: "https://docs.python.org/3/library/dis.html",
    summary: "Bytecode disassembler (dis), PyCodeObject, function frames, call stack inspection, metaclasses (type), and import hooks.",
    whatIsIt: "Python Internals refers to the underlying C architecture of CPython: the virtual machine instruction set (opcodes), frame objects, metaclasses, and the type creation protocol.",
    whyDoesItExist: "To understand how Python actually executes code under the hood, diagnose deep bugs, build domain-specific languages (DSLs), and optimize performance.",
    syntax: `import dis

# Inspect compiled bytecode:
dis.dis(function_or_code)

# Metaclass definition:
class Meta(type):
    def __new__(mcs, name, bases, attrs):
        # Intercept and customize class creation!
        return super().__new__(mcs, name, bases, attrs)`,
    basicExample: `import dis

def add(x, y):
    return x + y

print("Disassembled opcodes for add(x, y):")
dis.dis(add)`,
    stepByStepExecution: `CPython Metaclass Class Creation:
1. When CPython encounters a \'class MyClass:\' definition, it collects its body attributes into a dictionary.
2. It determines the metaclass (default is \'type\').
3. CPython calls \'metaclass.__new__(metaclass, name, bases, class_dict)\'.
4. The metaclass can inspect, rewrite, validate, or inject methods before the class object is instantiated!`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Inspecting Code Objects (__code__)",
        code: `def multiply(a, b):
    factor = 2
    return (a * b) * factor

co = multiply.__code__
print("Variable names:", co.co_varnames)
print("Constant values:", co.co_consts)
print("Arg count:", co.co_argcount)`,
        explanation: "Functions hold a `__code__` object storing compiled metadata (constants, local variable names, bytecode)."
      },
      {
        level: "Intermediate",
        title: "Custom Metaclass for Class Validation",
        code: `class EnforceDocstrings(type):
    def __new__(mcs, name, bases, attrs):
        for attr_name, attr_val in attrs.items():
            if callable(attr_val) and not attr_name.startswith("__"):
                if not getattr(attr_val, "__doc__", None):
                    raise TypeError(f"Method '{attr_name}' in class '{name}' MUST have a docstring!")
        return super().__new__(mcs, name, bases, attrs)

class StrictPlugin(metaclass=EnforceDocstrings):
    def execute(self):
        """Processes the plugin execution safely."""
        return "SUCCESS"

print("Class created successfully:", StrictPlugin)`,
        explanation: "Metaclasses enforce API contracts across large engineering teams."
      },
      {
        level: "Tricky",
        title: "Walking the Call Stack with inspect",
        code: `import inspect

def inner():
    caller_frame = inspect.currentframe().f_back
    print("Caller function name:", caller_frame.f_code.co_name)

def outer():
    inner()

outer()`,
        explanation: "Frame objects (`f_back`) allow inspecting caller frames, enabling debuggers and logging decorators."
      }
    ],
    commonMistakes: [
      {
        title: "Using Metaclasses When Class Decorators Would Suffice",
        wrongCode: `# Writing a 30-line metaclass just to add a logger to a class`,
        correctCode: `# Use a simple class decorator instead:
def add_logger(cls):
    cls.logger = logging.getLogger(cls.__name__)
    return cls`,
        whyItFails: "As Tim Peters noted: 'Metaclasses are deeper magic than 99% of users should ever worry about.' Prefer class decorators when possible."
      }
    ],
    importantDifferences: [
      {
        title: "Class Decorator vs Metaclass",
        itemA: "Class Decorator",
        itemB: "Metaclass",
        comparison: [
          "Inheritance: Does NOT inherit down to subclasses vs Subclasses automatically inherit the metaclass",
          "Timing: Runs AFTER the class is already constructed vs Intercepts class creation BEFORE the class exists",
          "Complexity: Simple function taking and returning a class vs Advanced OOP metaprogramming subclassing `type`"
        ]
      }
    ],
    realWorldUse: "Django Model base classes, SQLAlchemy declarative base, Pytest test discovery engines.",
    interviewPerspective: [
      {
        question: "What is `type` in Python?",
        trap: "Saying it only returns the type of an object.",
        expectedAnswer: "`type` is both the function that inspects types and the default metaclass of all classes in Python. In fact, `type` is an instance of itself! You can call `type(name, bases, dict)` dynamically to create new classes at runtime."
      }
    ],
    questions: [
      {
        id: "q38_1",
        question: "What is the root metaclass of all standard classes in Python?",
        choices: ["object", "type", "Class", "Meta"],
        correctIndex: 1,
        hints: ["Classes are instances of this metaclass."],
        solutionCode: `print(type(int)) # <class 'type'>`,
        explanation: "`type` is the default metaclass that constructs classes in Python."
      }
    ],
    revisionSheet: [
      "`dis.dis(func)` disassembles bytecode into human-readable opcodes.",
      "`__code__` holds compiled bytecode metadata (constants, varnames).",
      "Metaclasses inherit from `type` and customize class creation.",
      "Prefer class decorators over metaclasses for simple modifications."
    ],
    subtopics: [
      { id: "s38_1", text: "Python bytecode", isStarred: false },
      { id: "s38_2", text: "dis", isStarred: false },
      { id: "s38_3", text: "CPython", isStarred: false },
      { id: "s38_4", text: "Interpreter execution", isStarred: false },
      { id: "s38_5", text: ".pyc", isStarred: false },
      { id: "s38_6", text: "__code__", isStarred: false },
      { id: "s38_7", text: "Function frames", isStarred: false },
      { id: "s38_8", text: "Call stack", isStarred: false },
      { id: "s38_9", text: "Descriptors", isStarred: false },
      { id: "s38_10", text: "Properties internally", isStarred: false },
      { id: "s38_11", text: "Metaclasses", isStarred: false },
      { id: "s38_12", text: "type", isStarred: false },
      { id: "s38_13", text: "Custom metaclasses", isStarred: false },
      { id: "s38_14", text: "Abstract base classes", isStarred: false },
      { id: "s38_15", text: "Method Resolution Order", isStarred: false },
      { id: "s38_16", text: "Import system", isStarred: false },
      { id: "s38_17", text: "Import hooks", isStarred: false }
    ],
    starterCode: `# 38. Python Bytecode Disassembly
import dis

def fast_compute(x):
    return (x * 2) + 1

dis.dis(fast_compute)`
  },

  // ─── 39. Performance & Optimization ─────────────────────────────────────────
  {
    id: "performance-and-optimization",
    topicNum: 39,
    title: "39. Performance & Optimization",
    category: "Professional Python",
    level: "Advanced",
    stars: "",
    docRefTag: "Docs §timeit & §cProfile",
    docUrl: "https://docs.python.org/3/library/profile.html",
    summary: "Time complexity, Big-O, cProfile profiling, timeit benchmarking, list vs set lookup speeds, and memory optimization.",
    whatIsIt: "Performance optimization is the process of profiling, identifying algorithmic bottlenecks, and refactoring Python code to minimize CPU execution time and memory footprints.",
    whyDoesItExist: "To scale backend services to high requests-per-second, minimize AWS/cloud compute costs, and eliminate micro-stutters in data pipelines.",
    syntax: `# Benchmarking with timeit:
import timeit
time_taken = timeit.timeit("x = [i for i in range(100)]", number=10000)

# Profiling CPU bottlenecks with cProfile:
import cProfile
cProfile.run("heavy_function()")`,
    basicExample: `import timeit

# Compare lookup speed: Set O(1) vs List O(N)
setup_code = "data_list = list(range(10000)); data_set = set(data_list)"

list_time = timeit.timeit("9999 in data_list", setup=setup_code, number=1000)
set_time = timeit.timeit("9999 in data_set", setup=setup_code, number=1000)

print(f"List lookup time: {list_time:.6f}s")
print(f"Set lookup time:  {set_time:.6f}s (Speedup: ~{list_time/set_time:.0f}x faster!)")`,
    stepByStepExecution: `Python Performance Optimization Principles:
1. 'Premature optimization is the root of all evil' — ALWAYS profile before optimizing!
2. Identify the bottleneck: is it CPU-bound (slow Python loops), memory-bound (excessive allocations triggering GC), or I/O-bound (network/disk)?
3. Algorithmic gains (O(N^2) -> O(N log N)) always dwarf micro-optimizations.
4. Push inner loops to C: use built-in functions, itertools, comprehensions, or NumPy vectorization.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Local Variable Lookup Optimization",
        code: `# Accessing local variables (LOAD_FAST) is faster than globals (LOAD_GLOBAL)
import math

def slow_circle_areas(radii):
    return [math.pi * r * r for r in radii]

def fast_circle_areas(radii):
    pi = math.pi # Cache in local variable!
    return [pi * r * r for r in radii]`,
        explanation: "CPython accesses local variables in an array indexed by integer (LOAD_FAST), avoiding dictionary lookups."
      },
      {
        level: "Intermediate",
        title: "CPU Profiling with cProfile",
        code: `import cProfile

def simulate_pipeline():
    total = 0
    for i in range(100000):
        total += i
    return total

cProfile.run("simulate_pipeline()")`,
        explanation: "cProfile reports function call counts, total time (tottime), and cumulative time (cumtime)."
      },
      {
        level: "Tricky",
        title: "Disabling GC Temporarily During Bulk Batch Ingestion",
        code: `import gc

# For massive bulk insertions where allocations spike:
def bulk_batch():
    gc.disable() # Avoids frequent Gen0/Gen1 GC sweeps
    try:
        data = [i * 2 for i in range(500000)]
    finally:
        gc.enable()
        gc.collect()

bulk_batch()
print("Bulk batch finished")`,
        explanation: "Temporarily disabling GC avoids repetitive traversal of millions of container pointers during ingestion."
      }
    ],
    commonMistakes: [
      {
        title: "Optimizing Without Profiling First",
        wrongCode: `# Rewriting a fast function in C while the real bottleneck is an unindexed SQL query`,
        correctCode: `# Profile first with cProfile to locate the 95% CPU consumer`,
        whyItFails: "Developers frequently guess wrong about where code spends its time."
      }
    ],
    importantDifferences: [
      {
        title: "timeit vs time.time()",
        itemA: "timeit.timeit()",
        itemB: "time.time()",
        comparison: [
          "Resolution: Microsecond benchmarking, runs multiple loops, disables GC fluctuations vs Clock time, affected by OS context switching",
          "Best for: Micro-benchmarking code snippets vs High-level wall-clock measurement"
        ]
      }
    ],
    realWorldUse: "High-frequency trading feeds, real-time gaming engines, video encoding pipelines.",
    interviewPerspective: [
      {
        question: "How do you optimize slow Python code?",
        trap: "Immediately suggesting rewriting in C or Rust.",
        expectedAnswer: "1. Profile with cProfile to find actual bottlenecks. 2. Improve algorithms (reduce time complexity from O(N^2) to O(N)). 3. Leverage C-implemented built-ins (sets for lookups, comprehensions, collections.deque). 4. Use vectorization (NumPy) or JIT (PyPy). 5. Offload to C/Rust extensions only when necessary."
      }
    ],
    questions: [
      {
        id: "q39_1",
        question: "What is the average time complexity of checking membership (`x in collection`) for a set vs a list?",
        choices: ["O(1) for set vs O(N) for list", "O(N) for both", "O(log N) for set vs O(1) for list", "O(1) for both"],
        correctIndex: 0,
        hints: ["Sets use hash tables; lists use arrays."],
        solutionCode: `# set: O(1) average; list: O(N)`,
        explanation: "Set membership uses hash table lookups in O(1) average time; list membership scans elements in O(N)."
      }
    ],
    revisionSheet: [
      "Always profile first with `cProfile`.",
      "Use `timeit` for reliable micro-benchmarking.",
      "Set/dict membership is O(1); list membership is O(N).",
      "Local variable access (LOAD_FAST) is faster than global lookup (LOAD_GLOBAL)."
    ],
    subtopics: [
      { id: "s39_1", text: "Time complexity", isStarred: false },
      { id: "s39_2", text: "Space complexity", isStarred: false },
      { id: "s39_3", text: "Big-O in Python", isStarred: false },
      { id: "s39_4", text: "List vs set lookup", isStarred: false },
      { id: "s39_5", text: "Dictionary lookup", isStarred: false },
      { id: "s39_6", text: "Generator memory efficiency", isStarred: false },
      { id: "s39_7", text: "timeit", isStarred: false },
      { id: "s39_8", text: "Profiling", isStarred: false },
      { id: "s39_9", text: "cProfile", isStarred: false },
      { id: "s39_10", text: "Memory profiling concepts", isStarred: false },
      { id: "s39_11", text: "Algorithm optimization", isStarred: false },
      { id: "s39_12", text: "Avoiding unnecessary copies", isStarred: false },
      { id: "s39_13", text: "Efficient string operations", isStarred: false },
      { id: "s39_14", text: "Efficient loops", isStarred: false },
      { id: "s39_15", text: "Caching", isStarred: false },
      { id: "s39_16", text: "Memoization", isStarred: false }
    ],
    starterCode: `# 39. Benchmarking with timeit
import timeit

t = timeit.timeit("sum([x**2 for x in range(100)])", number=5000)
print(f"5000 iterations: {t:.4f}s")`
  },

  // ───  
  {
    id: "pythonic-programming",
    topicNum: 40,
    title: "40. Pythonic Programming",
    category: "Professional Python",
    level: "Advanced",
    stars: "Core",
    docRefTag: "PEP 20 & PEP 8",
    docUrl: "https://peps.python.org/pep-0020/",
    summary: "The Zen of Python (import this), idiomatic Python vs C/Java style, unpacking, enumerate, zip, any/all, and clean code principles.",
    whatIsIt: "Pythonic code is code that embraces Python's unique idioms, conventions, and philosophy to achieve high clarity, simplicity, and elegance.",
    whyDoesItExist: "To prevent developers from writing C/Java syntax with Python keywords, promoting readable, concise, and maintainable software.",
    syntax: `# The Zen of Python:
import this

# Pythonic Unpacking:
a, *middle, b = [1, 2, 3, 4, 5]

# Pythonic Multi-condition:
if 18 <= age <= 65:
    ...`,
    basicExample: `# Unpythonic (C-Style):
items = ["apple", "banana", "cherry"]
i = 0
while i < len(items):
    # print(i, items[i])
    i += 1

# Pythonic (Idiomatic):
for i, item in enumerate(items, 1):
    print(f"{i}. {item}")`,
    stepByStepExecution: `The Core Axioms of PEP 20 (The Zen of Python):
- Beautiful is better than ugly.
- Explicit is better than implicit.
- Simple is better than complex.
- Flat is better than nested.
- Readability counts.
- Special cases aren't special enough to break the rules.
- There should be one-- and preferably only one --obvious way to do it.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Idiomatic Truth Value Testing",
        code: `# Unpythonic:
seq = [1, 2]
if len(seq) > 0 and seq != None:
    pass

# Pythonic:
if seq:
    print("Sequence has items!")`,
        explanation: "Python sequences define truthiness natively; empty collections evaluate to False."
      },
      {
        level: "Intermediate",
        title: "Dictionary Defaults: get() and setdefault()",
        code: `# Unpythonic:
data = {}
key = "tags"
if key not in data:
    data[key] = []
data[key].append("python")

# Pythonic in 1 line:
data.setdefault("tags", []).append("fastapi")
print(data)`,
        explanation: "`setdefault()` is clean and atomic."
      },
      {
        level: "Tricky",
        title: "Context Managers Over Manual Resource Teardown",
        code: `# Pythonic file reading with automatic closing:
from pathlib import Path
content = Path("demo.txt").write_text("Pyradox", encoding="utf-8")
print("Written via pathlib in 1 line!")
Path("demo.txt").unlink(missing_ok=True)`,
        explanation: "Modern Python standard library provides single-expression idioms for common workflows."
      }
    ],
    commonMistakes: [
      {
        title: "Writing Java-Style Getters and Setters Everywhere",
        wrongCode: `class User:
    def __init__(self, name): self._name = name
    def get_name(self): return self._name
    def set_name(self, name): self._name = name`,
        correctCode: `class User:
    def __init__(self, name): self.name = name # Public attributes are Pythonic!
    # Add @property ONLY when validation logic is needed later`,
        whyItFails: "Java requires boilerplate getters/setters because it lacks properties. Python has `@property`, so start with public attributes."
      }
    ],
    importantDifferences: [
      {
        title: "Pythonic vs Non-Pythonic",
        itemA: "Pythonic Idiom",
        itemB: "Unpythonic Anti-pattern",
        comparison: [
          "Loop with index: `for i, x in enumerate(items):` vs `for i in range(len(items)):`",
          "Merging dicts: `d1 | d2` vs Manual loop updating each key",
          "Resource cleanup: `with open(...)` vs `f = open(...); ... f.close()`"
        ]
      }
    ],
    realWorldUse: "Writing clean pull requests, establishing enterprise style guides, passing senior Python technical interviews.",
    interviewPerspective: [
      {
        question: "What does 'Pythonic' mean?",
        trap: "Saying 'writing code in Python'.",
        expectedAnswer: "'Pythonic' refers to code that adheres to Python's idioms (PEP 20 - Zen of Python) and community conventions: prioritizing readability, utilizing built-in protocols (iterators, context managers, comprehensions), and preferring simplicity (EAFP) over verbose boilerplate."
      }
    ],
    questions: [
      {
        id: "q40_1",
        question: "What command displays the Zen of Python in the interpreter?",
        choices: ["import zen", "import this", "help('pythonic')", "python --zen"],
        correctIndex: 1,
        hints: ["Tim Peters' famous easter egg."],
        solutionCode: `import this`,
        explanation: "`import this` outputs the 19 guiding aphorisms of Python design (PEP 20)."
      }
    ],
    revisionSheet: [
      "Use `enumerate()` instead of `range(len())`.",
      "Use `zip()` for parallel sequences.",
      "Test truthiness directly: `if my_list:` (not `if len(my_list) > 0:`)",
      "Avoid unnecessary getters and setters; use public attributes or `@property`."
    ],
    subtopics: [
      { id: "s40_1", text: "Pythonic code", isStarred: false },
      { id: "s40_2", text: "EAFP", isStarred: false },
      { id: "s40_3", text: "Duck typing", isStarred: false },
      { id: "s40_4", text: "Comprehensions", isStarred: false },
      { id: "s40_5", text: "Unpacking", isStarred: false },
      { id: "s40_6", text: "Multiple assignment", isStarred: false },
      { id: "s40_7", text: "enumerate()", isStarred: false },
      { id: "s40_8", text: "zip()", isStarred: false },
      { id: "s40_9", text: "any()", isStarred: false },
      { id: "s40_10", text: "all()", isStarred: false },
      { id: "s40_11", text: "Context managers", isStarred: false },
      { id: "s40_12", text: "Generators", isStarred: false },
      { id: "s40_13", text: "Idiomatic loops", isStarred: false },
      { id: "s40_14", text: "Clean functions", isStarred: false },
      { id: "s40_15", text: "Avoiding unnecessary code", isStarred: false },
      { id: "s40_16", text: "Readability", isStarred: false },
      { id: "s40_17", text: "PEP 8", isStarred: false },
      { id: "s40_18", text: "PEP 20 — Zen of Python", isStarred: false }
    ],
    starterCode: `# 40. The Zen of Python
import this`
  },

  // ─── 41. Command-Line Python ────────────────────────────────────────────────
  {
    id: "command-line-python",
    topicNum: 41,
    title: "41. Command-Line Python",
    category: "Professional Python",
    level: "Intermediate",
    stars: "",
    docRefTag: "Docs §argparse",
    docUrl: "https://docs.python.org/3/library/argparse.html",
    summary: "sys.argv, argparse module, CLI flags, subparsers, environment variables (os.environ), and .env configuration management.",
    whatIsIt: "Command-Line Python covers building robust terminal command-line interfaces (CLIs) using `sys.argv`, `argparse`, and environment variable managers.",
    whyDoesItExist: "To build developer tools, automation scripts, Docker entrypoints, and microservice server configurations.",
    syntax: `import argparse
import os

parser = argparse.ArgumentParser(description="Pyradox CLI Tool")
parser.add_argument("--port", type=int, default=8000, help="Port to bind")
parser.add_argument("--env", choices=["dev", "prod"], default="dev")
parser.add_argument("-v", "--verbose", action="store_true")
# args = parser.parse_args()`,
    basicExample: `import argparse

parser = argparse.ArgumentParser(description="Deploy Service")
parser.add_argument("service", help="Name of service to deploy")
parser.add_argument("--replicas", type=int, default=3, help="Replica count")

# Simulating parsing command line: ['auth', '--replicas', '5']
args = parser.parse_args(["auth", "--replicas", "5"])
print(f"Deploying {args.service} with {args.replicas} replicas")`,
    stepByStepExecution: `argparse Lifecycle:
1. 'ArgumentParser' initializes with program description and help formatting.
2. 'add_argument()' registers positional arguments, options flags ('--port'), data types, choices, and default values.
3. 'parse_args()' reads 'sys.argv[1:]', validates types, enforces mandatory arguments, and outputs auto-generated '--help' menus on errors.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Reading Environment Variables with os.environ",
        code: `import os

# Safe lookup with fallback default
database_url = os.getenv("DATABASE_URL", "sqlite:///:memory:")
api_key = os.environ.get("PYRADOX_API_KEY", "demo_key_123")

print("Database Target:", database_url)
print("API Key Prefix:", api_key[:8] + "...")`,
        explanation: "`os.getenv(key, default)` reads system environment variables without raising KeyError if missing."
      },
      {
        level: "Intermediate",
        title: "Subcommands with subparsers (like git commit / git push)",
        code: `import argparse

parser = argparse.ArgumentParser(prog="pyradox")
subparsers = parser.add_subparsers(dest="command")

# Subcommand: init
init_parser = subparsers.add_parser("init")
init_parser.add_argument("--template", default="standard")

# Subcommand: run
run_parser = subparsers.add_parser("run")
run_parser.add_argument("--port", type=int, default=5000)

args = parser.parse_args(["run", "--port", "8080"])
print(f"Executed command: {args.command} on port {args.port}")`,
        explanation: "Subparsers allow structuring complex multi-command CLIs (like `docker run`, `kubectl apply`)."
      },
      {
        level: "Tricky",
        title: "Boolean Flag Arguments (action='store_true')",
        code: `import argparse

parser = argparse.ArgumentParser()
# Flag is False by default; becomes True if provided on command line
parser.add_argument("--debug", action="store_true")

print("Debug flag supplied:", parser.parse_args(["--debug"]).debug)
print("Debug flag omitted:", parser.parse_args([]).debug)`,
        explanation: "`action='store_true'` creates boolean toggle flags without requiring explicit '=True' values."
      }
    ],
    commonMistakes: [
      {
        title: "Using sys.argv Directly Without Validation",
        wrongCode: `import sys
# port = int(sys.argv[1]) -> Crashes with IndexError if user forgets arguments!`,
        correctCode: `import argparse # Handles missing args, type errors, and --help automatically`,
        whyItFails: "`sys.argv` is a raw string list requiring manual index checks, length validation, and type conversions."
      }
    ],
    importantDifferences: [
      {
        title: "sys.argv vs argparse",
        itemA: "sys.argv (Primitive)",
        itemB: "argparse (High-Level)",
        comparison: [
          "Validation: None; raw list of strings vs Validates types, enforces choices, catches missing args",
          "Help documentation: None vs Generates formatted `--help` / `-h` pages automatically",
          "Flags: Manual string parsing vs Clean positional, optional, and boolean flag handlers"
        ]
      }
    ],
    realWorldUse: "Building dev CLI tools, container entrypoint scripts in Docker, machine learning training scripts (`python train.py --epochs 50 --lr 0.001`).",
    interviewPerspective: [
      {
        question: "How should 12-Factor applications configure sensitive parameters (database credentials, API keys)?",
        trap: "Saying 'store them in config.py files'.",
        expectedAnswer: "Never commit credentials to code repositories. According to 12-Factor principles, configurations should be injected via environment variables (`os.environ`) or `.env` files managed by secret stores (HashiCorp Vault, AWS Secrets Manager)."
      }
    ],
    questions: [
      {
        id: "q41_1",
        question: "What action parameter in `add_argument()` creates a boolean toggle flag that defaults to False?",
        choices: ["action='store_true'", "action='boolean'", "type=bool", "action='flag'"],
        correctIndex: 0,
        hints: ["Stores True when the flag is present."],
        solutionCode: `parser.add_argument('--verbose', action='store_true')`,
        explanation: "`action='store_true'` sets the attribute to True if the flag is passed, and False otherwise."
      }
    ],
    revisionSheet: [
      "Use `argparse` instead of manual `sys.argv` indexing.",
      "`add_argument('--flag', action='store_true')` creates boolean switches.",
      "Use `os.getenv('KEY', 'default')` to safely read environment variables.",
      "Never commit API keys or database passwords to source control."
    ],
    subtopics: [
      { id: "s41_1", text: "Running scripts", isStarred: false },
      { id: "s41_2", text: "Command-line arguments", isStarred: false },
      { id: "s41_3", text: "sys.argv", isStarred: false },
      { id: "s41_4", text: "argparse", isStarred: false },
      { id: "s41_5", text: "CLI applications", isStarred: false },
      { id: "s41_6", text: "Environment variables", isStarred: false },
      { id: "s41_7", text: "os.environ", isStarred: false },
      { id: "s41_8", text: ".env files", isStarred: false },
      { id: "s41_9", text: "Configuration management", isStarred: false }
    ],
    starterCode: `# 41. Command-Line Arguments with argparse
import argparse

parser = argparse.ArgumentParser(description="Pyradox Training Runner")
parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
parser.add_argument("--learning-rate", type=float, default=0.001)

args = parser.parse_args(["--epochs", "25", "--learning-rate", "0.0005"])
print(f"Training config: epochs={args.epochs}, lr={args.learning_rate}")`
  }
];
