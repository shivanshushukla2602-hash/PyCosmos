// Topics 17 to 24: Practical Python, OOP, Decorators, Context Managers, Scope
// 17. Exception Handling, 18. File Handling, 19. Modules, 20. Packages & Environments,
// 21. OOP, 22. Decorators, 23. Context Managers, 24. Python Scope & Namespaces

export const TOPICS_17_TO_24 = [
  // ───  
  {
    id: "exception-handling",
    topicNum: 17,
    title: "17. Exception Handling",
    category: "Practical Python",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §8",
    docUrl: "https://docs.python.org/3/tutorial/errors.html",
    summary: "Exception hierarchy, try-except-else-finally, custom exceptions, exception chaining (raise ... from), and EAFP vs LBYL philosophy.",
    whatIsIt: "Exception handling is Python's mechanism for intercepting runtime errors and managing unexpected conditions gracefully without crashing the application.",
    whyDoesItExist: "To enforce robust failure recovery, separate error-handling code from business logic, and support Python's core idiomatic philosophy: EAFP ('Easier to Ask for Forgiveness than Permission').",
    syntax: `try:
    # Code that might raise an exception
    result = perform_io()
except (ValueError, KeyError) as e:
    # Specific exception handling
    handle_client_error(e)
except Exception as e:
    # Fallback general exception
    log_unhandled(e)
    raise CustomError("Operation failed") from e
else:
    # Runs ONLY if NO exception was raised in try
    commit_transaction(result)
finally:
    # ALWAYS runs (cleanup, sockets, locks)
    release_resources()`,
    basicExample: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError as err:
        print(f"Error intercepted: {err}")
        return None
    finally:
        print("Division attempt recorded.")

print(safe_divide(10, 2))
print(safe_divide(10, 0))`,
    stepByStepExecution: `CPython Zero-Cost Exception Handling (PEP 654 / Python 3.11+):
1. In older Python versions, entering a 'try' block pushed a block onto an internal block stack (SETUP_FINALLY opcode).
2. In Python 3.11+, entering a 'try' block has ZERO runtime CPU overhead when no exception occurs! CPython stores an exception table in the code object.
3. When an exception is raised, CPython searches the exception table for the current instruction offset and jumps to the matching handler.
4. Exception chaining preserves the original traceback via the '__cause__' and '__context__' attributes.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "The try-except-else Pattern",
        code: `data = {"status": "ok", "payload": [1, 2, 3]}
try:
    val = data["payload"]
except KeyError:
    print("Missing payload key!")
else:
    print(f"Payload loaded successfully with {len(val)} items.")`,
        explanation: "The 'else' block ensures that code that depends on the try block succeeding does not accidentally catch unintended exceptions."
      },
      {
        level: "Intermediate",
        title: "Custom Exception Class & Exception Chaining",
        code: `class DatabaseConnectionError(Exception):
    """Raised when the database node fails to respond."""
    def __init__(self, host, port, original_error):
        super().__init__(f"Could not connect to database at {host}:{port}")
        self.host = host
        self.port = port
        self.original_error = original_error

try:
    raise ConnectionRefusedError("Connection timed out after 3000ms")
except ConnectionRefusedError as err:
    # Exception chaining via 'from'
    raise DatabaseConnectionError("10.0.0.1", 5432, err) from err`,
        explanation: "'raise NewException from original_error' links exceptions, displaying the full cause history in stack traces."
      },
      {
        level: "Tricky",
        title: "finally Executes Even on return or break",
        code: `def test_finally():
    try:
        return "FROM_TRY"
    finally:
        print("Finally ALWAYS executes!")

result = test_finally()
print("Returned:", result)`,
        explanation: "The `finally` block is guaranteed to execute before the function actually returns control to the caller."
      }
    ],
    commonMistakes: [
      {
        title: "Bare except: Catching BaseException",
        wrongCode: `try:
    run_service()
except: # BARE EXCEPT! Catches KeyboardInterrupt, SystemExit, and MemoryError!
    print("Error occurred")`,
        correctCode: `try:
    run_service()
except Exception as e: # Catches standard application exceptions
    print(f"Service error: {e}")`,
        whyItFails: "A bare `except:` or `except BaseException:` prevents users from stopping scripts with Ctrl+C (KeyboardInterrupt) and masks fatal system exits."
      }
    ],
    importantDifferences: [
      {
        title: "EAFP vs LBYL",
        itemA: "EAFP (Pythonic)",
        itemB: "LBYL (Traditional)",
        comparison: [
          "Motto: 'Easier to Ask for Forgiveness than Permission' vs 'Look Before You Leap'",
          "Style: try: d[key] except KeyError: default vs if key in d: val = d[key] else: default",
          "Concurrency: Atomic, immune to race conditions (TOCTOU) vs Susceptible to race conditions between check and access"
        ]
      }
    ],
    realWorldUse: "Database transaction rollbacks, retrying flaky network calls with backoff, validating HTTP requests in FastAPI.",
    interviewPerspective: [
      {
        question: "Explain the difference between `Exception` and `BaseException`.",
        trap: "Thinking they are interchangeable.",
        expectedAnswer: "`BaseException` is the root of the entire exception hierarchy. It includes system-exiting exceptions like `KeyboardInterrupt`, `SystemExit`, and `GeneratorExit`. Application code should almost always catch `Exception`, which subclasses `BaseException` for standard errors."
      }
    ],
    questions: [
      {
        id: "q17_1",
        question: "Which block in a try-except structure executes ONLY when NO exception occurs?",
        choices: ["finally", "else", "except", "catch"],
        correctIndex: 1,
        hints: ["It matches the 'else' concept in loops."],
        solutionCode: `try:\n    x = 10\nexcept:\n    pass\nelse:\n    print("No exceptions!")`,
        explanation: "The `else` block runs only if the `try` block completes successfully without raising any exceptions."
      }
    ],
    revisionSheet: [
      "Inherit custom exceptions from `Exception`, not `BaseException`.",
      "Never use bare `except:`; catch `Exception` or specific error types.",
      "Use `else:` for code that must run only if `try:` succeeded.",
      "Use `finally:` for guaranteed cleanup (closing files, releasing locks).",
      "`raise NewError from old_error` preserves the original traceback."
    ],
    subtopics: [
      { id: "s17_1", text: "Errors vs exceptions", isStarred: false },
      { id: "s17_2", text: "Syntax errors", isStarred: false },
      { id: "s17_3", text: "Runtime errors", isStarred: false },
      { id: "s17_4", text: "try", isStarred: false },
      { id: "s17_5", text: "except", isStarred: false },
      { id: "s17_6", text: "else", isStarred: false },
      { id: "s17_7", text: "finally", isStarred: false },
      { id: "s17_8", text: "Multiple exceptions", isStarred: false },
      { id: "s17_9", text: "Exception hierarchy", isStarred: false },
      { id: "s17_10", text: "Exception", isStarred: false },
      { id: "s17_11", text: "BaseException", isStarred: false },
      { id: "s17_12", text: "raise", isStarred: false },
      { id: "s17_13", text: "Custom exceptions", isStarred: false },
      { id: "s17_14", text: "Exception chaining", isStarred: false },
      { id: "s17_15", text: "as", isStarred: false },
      { id: "s17_16", text: "assert", isStarred: false },
      { id: "s17_17", text: "Best practices", isStarred: false },
      { id: "s17_18", text: "EAFP vs LBYL", isStarred: false }
    ],
    starterCode: `# 17. Exception Handling
class ValidationError(Exception):
    pass

def validate_age(age_val):
    try:
        age = int(age_val)
        if age < 0 or age > 120:
            raise ValidationError(f"Age {age} out of plausible human range (0-120)")
    except ValueError as e:
        raise ValidationError("Input must be a valid integer") from e
    else:
        return f"Age {age} verified"

print(validate_age("28"))`
  },

  // ───  
  {
    id: "file-handling",
    topicNum: 18,
    title: "18. File Handling",
    category: "Practical Python",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §7.2",
    docUrl: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files",
    summary: "open(), with context managers, text vs binary modes, buffering, tell()/seek(), pathlib.Path, and large file streaming.",
    whatIsIt: "File handling encompasses opening, reading, writing, seeking, and closing files on the operating system filesystem.",
    whyDoesItExist: "To persist data, stream large log or video files, ingest datasets, and interact with the OS file hierarchy safely using automatic resource cleanup.",
    syntax: `# Modern pathlib approach (PEP 428):
from pathlib import Path

p = Path("data/metrics.json")
p.parent.mkdir(parents=True, exist_ok=True)
p.write_text("{\\"status\\": \\"ok\\"}", encoding="utf-8")
content = p.read_text(encoding="utf-8")

# Context manager file access:
with open("dataset.csv", mode="r", encoding="utf-8") as f:
    for line in f: # Memory-efficient line-by-line iterator
        process_line(line)`,
    basicExample: `from pathlib import Path

file_path = Path("pyradox_sample.txt")
file_path.write_text("Python Roadmap\\nTopic 18: File Handling\\n", encoding="utf-8")

# Reading line by line safely
with open(file_path, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, start=1):
        print(f"Line {line_num}: {line.strip()}")

# Cleanup
file_path.unlink(missing_ok=True)`,
    stepByStepExecution: `CPython File I/O Architecture:
1. 'open()' delegates to C runtime 'fopen()' via the '_io' module, returning an 'io.TextIOWrapper' (text mode) or 'io.BufferedReader' (binary mode).
2. The 'with' statement calls 'f.__enter__()' which returns the file object.
3. Upon exiting the with-block, CPython guarantees 'f.__exit__()' is called, which calls 'close()' on the operating system file descriptor, even if an exception occurs.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Streaming Massive Files Without Out-Of-Memory (OOM)",
        code: `# Iterating a file object directly reads lazily via an internal buffer:
def count_errors(filepath):
    count = 0
    # Does NOT load entire file into RAM!
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            if "ERROR" in line:
                count += 1
    return count`,
        explanation: "File objects are iterators that stream chunks from disk, maintaining constant O(1) RAM usage."
      },
      {
        level: "Intermediate",
        title: "Modern Path Management with pathlib",
        code: `from pathlib import Path

base_dir = Path("./workspace")
target_file = base_dir / "logs" / "app.log" # Intuitive / operator!

print("File name:", target_file.name)
print("File suffix:", target_file.suffix)
print("Parent dir:", target_file.parent)`,
        explanation: "pathlib replaces clunky `os.path.join` and `os.path.exists` with an object-oriented API."
      },
      {
        level: "Tricky",
        title: "tell() and seek() Pointer Repositioning",
        code: `from pathlib import Path

p = Path("test_seek.bin")
p.write_bytes(b"ABCDEFGHIJ")

with open(p, "rb") as f:
    print("Initial position:", f.tell()) # 0
    f.seek(5) # Move pointer to 5th byte
    print("Byte at index 5:", f.read(1)) # b'F'
    print("New position:", f.tell()) # 6

p.unlink(missing_ok=True)`,
        explanation: "seek(offset, whence) repositions the file pointer; tell() reports current byte offset."
      }
    ],
    commonMistakes: [
      {
        title: "Omitting encoding='utf-8' on open()",
        wrongCode: `with open("data.txt", "r") as f: # Uses OS default encoding (e.g. Windows cp1252)!
    text = f.read()`,
        correctCode: `with open("data.txt", "r", encoding="utf-8") as f:
    text = f.read()`,
        whyItFails: "If encoding is omitted, Python falls back to locale-dependent defaults, causing UnicodeDecodeError across different operating systems."
      }
    ],
    importantDifferences: [
      {
        title: "f.read() vs f.readline() vs f.readlines()",
        itemA: "f.read()",
        itemB: "for line in f:",
        comparison: [
          "Memory: Loads entire file content into a single string (dangerous on gigabyte files) vs Streams one line at a time (O(1) memory)",
          "Use case: Small files like JSON or config files vs Large log files, CSVs, and data pipelines"
        ]
      }
    ],
    realWorldUse: "Ingesting training data in PyTorch datasets, writing web access logs, saving model checkpoints.",
    interviewPerspective: [
      {
        question: "Why should you always open files with a context manager (`with open(...)`)?",
        trap: "Only mentioning 'it looks cleaner'.",
        expectedAnswer: "The `with` statement ensures the file descriptor is closed immediately when execution exits the block, even if unhandled exceptions are raised, preventing OS file descriptor leaks."
      }
    ],
    questions: [
      {
        id: "q18_1",
        question: "What is the recommended modern module for handling filesystem paths in Python 3?",
        choices: ["os.path", "pathlib", "sys.path", "glob"],
        correctIndex: 1,
        hints: ["It provides the Path class with the `/` operator."],
        solutionCode: `from pathlib import Path\np = Path('.')`,
        explanation: "`pathlib` (PEP 428) is the modern object-oriented standard library module for filesystem paths."
      }
    ],
    revisionSheet: [
      "Always use `with open(...) as f:` to guarantee proper closure.",
      "Always explicitly specify `encoding='utf-8'` for text files.",
      "Iterate directly over the file object (`for line in f:`) to avoid loading large files into RAM.",
      "Use `pathlib.Path` for cross-platform path manipulation."
    ],
    subtopics: [
      { id: "s18_1", text: "Opening files", isStarred: false },
      { id: "s18_2", text: "open()", isStarred: false },
      { id: "s18_3", text: "Read mode", isStarred: false },
      { id: "s18_4", text: "Write mode", isStarred: false },
      { id: "s18_5", text: "Append mode", isStarred: false },
      { id: "s18_6", text: "Binary mode", isStarred: false },
      { id: "s18_7", text: "Text mode", isStarred: false },
      { id: "s18_8", text: "read()", isStarred: false },
      { id: "s18_9", text: "readline()", isStarred: false },
      { id: "s18_10", text: "readlines()", isStarred: false },
      { id: "s18_11", text: "write()", isStarred: false },
      { id: "s18_12", text: "writelines()", isStarred: false },
      { id: "s18_13", text: "seek()", isStarred: false },
      { id: "s18_14", text: "tell()", isStarred: false },
      { id: "s18_15", text: "File pointer", isStarred: false },
      { id: "s18_16", text: "flush()", isStarred: false },
      { id: "s18_17", text: "close()", isStarred: false },
      { id: "s18_18", text: "with", isStarred: false },
      { id: "s18_19", text: "Context managers", isStarred: false },
      { id: "s18_20", text: "CSV files", isStarred: false },
      { id: "s18_21", text: "JSON files", isStarred: false },
      { id: "s18_22", text: "Working with large files", isStarred: false },
      { id: "s18_23", text: "File encoding", isStarred: false },
      { id: "s18_24", text: "pathlib", isStarred: false },
      { id: "s18_25", text: "Directories", isStarred: false },
      { id: "s18_26", text: "File system operations", isStarred: false }
    ],
    starterCode: `# 18. File Handling with pathlib
from pathlib import Path

sample_path = Path("telemetry.log")
sample_path.write_text("2026-10-05 14:00:00 [INFO] Pyradox node online\\n2026-10-05 14:01:00 [WARN] CPU threshold 85%\\n", encoding="utf-8")

with open(sample_path, "r", encoding="utf-8") as f:
    for line in f:
        if "[WARN]" in line:
            print("Alert detected:", line.strip())

sample_path.unlink(missing_ok=True)`
  },

  // ───  
  {
    id: "modules",
    topicNum: 19,
    title: "19. Modules & Imports",
    category: "Practical Python",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §6",
    docUrl: "https://docs.python.org/3/tutorial/modules.html",
    summary: "What is a module, import mechanisms, sys.path, sys.modules cache, import aliases, and the if __name__ == '__main__' guard.",
    whatIsIt: "A module is simply a file containing Python definitions and statements (.py). It acts as an isolated namespace, preventing global variable collisions across codebases.",
    whyDoesItExist: "To organize large software systems into maintainable units, facilitate code reuse, and control export APIs.",
    syntax: `# Direct import
import math

# Selective import
from collections import defaultdict, Counter

# Aliased import
import numpy as np

# Module execution guard
if __name__ == "__main__":
    # Executes ONLY when script is run directly, NOT when imported
    main()`,
    basicExample: `import sys

print("Module cache contains 'sys':", "sys" in sys.modules)
print("Top search path:", sys.path[0])
print("Current module __name__:", __name__)`,
    stepByStepExecution: `CPython Module Import Mechanism:
1. When \'import foo\' executes, CPython checks \'sys.modules\' cache dictionary.
2. If already loaded, it returns the cached module instance immediately (modules are singletons!).
3. If not found, CPython iterates through the directory paths in \'sys.path\' looking for a matching file (\'foo.py\', \'foo.so\', or a \'foo/\' package).
4. CPython compiles the source to bytecode, allocates a new module object, and executes the module body in its new namespace.
5. The module is stored in \'sys.modules["foo"]\' and bound to the local name \'foo\'.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "The if __name__ == '__main__' Pattern",
        code: `def calculate_metrics():
    return {"latency": 4.5, "throughput": 12000}

# This block allows the file to be both reusable AND directly executable
if __name__ == "__main__":
    print("Running standalone diagnostic:", calculate_metrics())`,
        explanation: "When run directly (`python file.py`), `__name__` is `'__main__'`. When imported (`import file`), `__name__` is `'file'`."
      },
      {
        level: "Intermediate",
        title: "Inspecting and Modifying sys.path",
        code: `import sys

print("Total search paths:", len(sys.path))
# To dynamically add a plugin directory:
# sys.path.insert(0, "/custom/plugins/path")`,
        explanation: "`sys.path` is initialized from the current script directory, PYTHONPATH environment variable, and installed site-packages."
      },
      {
        level: "Tricky",
        title: "Module Reloading via importlib",
        code: `import math
import importlib

# Python caches imported modules in sys.modules
# Re-importing 'import math' does NOT re-execute the file!
# To force re-execution:
importlib.reload(math)
print("Reloaded successfully")`,
        explanation: "Normal `import` statements are idempotent and pull from `sys.modules`. Use `importlib.reload()` during live REPL development."
      }
    ],
    commonMistakes: [
      {
        title: "Naming Local Files After Standard Modules (Shadowing)",
        wrongCode: `# Creating a local file named 'math.py' or 'random.py'
import math # Accidentally imports your local math.py instead of the stdlib!`,
        correctCode: `# Name your files descriptively: my_math_utils.py`,
        whyItFails: "Because `sys.path[0]` is the current directory, local files shadow standard library modules."
      }
    ],
    importantDifferences: [
      {
        title: "import foo vs from foo import bar",
        itemA: "import foo",
        itemB: "from foo import bar",
        comparison: [
          "Namespace: Access via `foo.bar` (clear source provenance) vs Access directly via `bar` (can clash with local names)",
          "Reloading: `importlib.reload(foo)` updates references vs `bar` reference may still point to the old object",
          "Clarity: Explicit and traceable vs Shorter syntax"
        ]
      }
    ],
    realWorldUse: "Organizing Django apps, structuring FastAPI routers, modular microservice libraries.",
    interviewPerspective: [
      {
        question: "What exactly happens when you run `if __name__ == '__main__':`?",
        trap: "Giving a vague 'it runs main' answer.",
        expectedAnswer: "When CPython executes a script directly from the command line, it assigns the special string `'__main__'` to the module's `__name__` attribute. If the file is imported by another module, `__name__` is set to the module's filename. This conditional prevents execution of test/CLI code during imports."
      }
    ],
    questions: [
      {
        id: "q19_1",
        question: "Where does Python cache already-imported modules to avoid re-executing them?",
        choices: ["sys.path", "sys.modules", "os.environ", "__pycache__"],
        correctIndex: 1,
        hints: ["It is a dictionary mapping module names to loaded module objects."],
        solutionCode: `import sys\nprint(type(sys.modules)) # <class 'dict'>`,
        explanation: "`sys.modules` is the dictionary acting as Python's import cache."
      }
    ],
    revisionSheet: [
      "A module is a single Python `.py` file.",
      "Modules are singletons; they execute once and cache in `sys.modules`.",
      "`__name__ == '__main__'` protects entrypoint code from executing on import.",
      "Never name your files the same as standard library modules (e.g. `random.py`, `email.py`)."
    ],
    subtopics: [
      { id: "s19_1", text: "What is a module?", isStarred: false },
      { id: "s19_2", text: "import", isStarred: false },
      { id: "s19_3", text: "from ... import", isStarred: false },
      { id: "s19_4", text: "Import aliases", isStarred: false },
      { id: "s19_5", text: "as", isStarred: false },
      { id: "s19_6", text: "__name__", isStarred: false },
      { id: "s19_7", text: "__main__", isStarred: false },
      { id: "s19_8", text: "if __name__ == '__main__'", isStarred: false },
      { id: "s19_9", text: "Module search path", isStarred: false },
      { id: "s19_10", text: "sys.path", isStarred: false },
      { id: "s19_11", text: "Creating your own module", isStarred: false },
      { id: "s19_12", text: "Module namespaces", isStarred: false },
      { id: "s19_13", text: "Reloading modules", isStarred: false }
    ],
    starterCode: `# 19. Modules & sys.modules
import sys

print("Currently loaded standard modules count:", len(sys.modules))
print("Is 'sys' in sys.modules?", 'sys' in sys.modules)
print(f"Current module scope name: {__name__}")`
  },

  // ─── 20. Packages & Environments ────────────────────────────────────────────
  {
    id: "packages-and-environments",
    topicNum: 20,
    title: "20. Packages & Environments",
    category: "Practical Python",
    level: "Intermediate",
    stars: "",
    docRefTag: "Docs §6.4 & PEP 518",
    docUrl: "https://docs.python.org/3/tutorial/modules.html#packages",
    summary: "Packages, __init__.py, absolute vs relative imports, circular imports, pip, venv, requirements.txt, and pyproject.toml.",
    whatIsIt: "A package is a directory containing Python modules and (optionally) an `__init__.py` file. Virtual environments (`venv`) isolate package dependencies per project.",
    whyDoesItExist: "To structure hierarchical libraries (`package.subpackage.module`), prevent dependency version collisions across projects, and publish packages to PyPI.",
    syntax: `# Directory Structure:
# my_package/
# ├── __init__.py
# ├── core.py
# └── utils/
#     ├── __init__.py
#     └── helpers.py

# Creating and activating a virtual environment:
# python -m venv .venv
# source .venv/bin/activate (macOS/Linux)
# .venv\\Scripts\\activate (Windows)`,
    basicExample: `import importlib.util

print("Virtual environment active:", hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix))
print("Current Python Prefix:", sys.prefix)`,
    stepByStepExecution: `Virtual Environment Architecture (PEP 405):
1. A virtual environment is simply a directory containing a copy (or symlink) of the Python interpreter binary and a 'pyvenv.cfg' configuration file.
2. When the virtual environment's Python is executed, it reads 'pyvenv.cfg' and sets 'sys.prefix' to the venv directory while keeping 'sys.base_prefix' pointing to the system installation.
3. As a result, 'sys.path' prioritizes the venv's local 'site-packages', isolating your project from global system libraries.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Absolute vs Relative Imports",
        code: `# Inside my_package/utils/helpers.py:
# Absolute import:
# from my_package.core import Engine

# Explicit relative import (leading dot):
# from ..core import Engine
# from .sibling import format_data`,
        explanation: "A single dot `.` refers to the current directory; two dots `..` refer to the parent package."
      },
      {
        level: "Intermediate",
        title: "The Role of __all__ in __init__.py",
        code: `# In package/__init__.py:
__all__ = ["PublicService", "calculate_rate"]
# When a user runs 'from package import *',
# ONLY items listed in __all__ will be imported into their namespace.`,
        explanation: "`__all__` provides an explicit public API boundary for packages."
      },
      {
        level: "Tricky",
        title: "Circular Import Detection and Fix",
        code: `# module_a.py:
# import module_b
# def f(): module_b.g()

# module_b.py:
# import module_a
# def g(): module_a.f()
# Fix: Move import inside function or restructure shared logic into module_c`,
        explanation: "Circular imports occur when two modules depend on each other before their top-level execution finishes."
      }
    ],
    commonMistakes: [
      {
        title: "Installing Packages Globally Without Virtual Environments",
        wrongCode: `sudo pip install requests # POLLUTES SYSTEM ENVIRONMENT!`,
        correctCode: `python -m venv .venv\nsource .venv/bin/activate\npip install requests`,
        whyItFails: "Global package installation can break operating system system packages and causes conflicting version dependency hell."
      }
    ],
    importantDifferences: [
      {
        title: "requirements.txt vs pyproject.toml",
        itemA: "requirements.txt",
        itemB: "pyproject.toml (PEP 518/621)",
        comparison: [
          "Format: Flat list of pinned dependencies (`pkg==1.2.0`) vs Modern unified TOML configuration",
          "Scope: Primarily pip install instructions vs Builds, metadata, tools (ruff, mypy, pytest), and packaging",
          "Standard: De facto legacy standard vs Modern official packaging standard"
        ]
      }
    ],
    realWorldUse: "Docker containerization, pip packaging for PyPI distribution, continuous integration (CI/CD) pipelines.",
    interviewPerspective: [
      {
        question: "How do you resolve a circular import in Python?",
        trap: "Saying 'circular imports are impossible in Python'.",
        expectedAnswer: "1. Refactor shared dependencies into a separate third module. 2. Move the `import` statement inside the function that needs it (deferred import). 3. Use `import foo` instead of `from foo import bar` to access symbols dynamically via the module namespace."
      }
    ],
    questions: [
      {
        id: "q20_1",
        question: "What file in a directory historically designated it as a regular Python package?",
        choices: ["__main__.py", "__init__.py", "setup.py", "package.json"],
        correctIndex: 1,
        hints: ["It initializes the package namespace."],
        solutionCode: `# package/__init__.py`,
        explanation: "`__init__.py` marks a directory as a regular Python package and executes when the package is imported."
      }
    ],
    revisionSheet: [
      "Always create virtual environments (`python -m venv .venv`).",
      "Explicit relative imports: `from .module import func`.",
      "`__all__` in `__init__.py` dictates what `from pkg import *` exports.",
      "`pyproject.toml` is the modern standard for project metadata and tooling."
    ],
    subtopics: [
      { id: "s20_1", text: "Package", isStarred: false },
      { id: "s20_2", text: "Subpackage", isStarred: false },
      { id: "s20_3", text: "__init__.py", isStarred: false },
      { id: "s20_4", text: "Absolute imports", isStarred: false },
      { id: "s20_5", text: "Relative imports", isStarred: false },
      { id: "s20_6", text: "Circular imports", isStarred: false },
      { id: "s20_7", text: "pip", isStarred: false },
      { id: "s20_8", text: "PyPI", isStarred: false },
      { id: "s20_9", text: "Installing packages", isStarred: false },
      { id: "s20_10", text: "Uninstalling packages", isStarred: false },
      { id: "s20_11", text: "Requirements files", isStarred: false },
      { id: "s20_12", text: "requirements.txt", isStarred: false },
      { id: "s20_13", text: "Virtual environments", isStarred: false },
      { id: "s20_14", text: "venv", isStarred: false },
      { id: "s20_15", text: "Dependency management", isStarred: false },
      { id: "s20_16", text: "pyproject.toml", isStarred: false }
    ],
    starterCode: `# 20. Packages & Environments
import sys

print("Python executable:", sys.executable)
print("Base Prefix:", getattr(sys, "base_prefix", None))
print("Current Prefix:", sys.prefix)`
  },

  // ───  
  {
    id: "object-oriented-programming",
    topicNum: 21,
    title: "21. Object-Oriented Programming (OOP)",
    category: "OOP & Protocols",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §9",
    docUrl: "https://docs.python.org/3/tutorial/classes.html",
    summary: "Classes, instances, self, __init__, dunder methods, inheritance, MRO (C3 linearization), polymorphism, encapsulation, duck typing, and @property.",
    whatIsIt: "Object-Oriented Programming (OOP) in Python models real-world entities through classes containing state (attributes) and behavior (methods). Python supports multiple inheritance and dynamic duck typing.",
    whyDoesItExist: "To organize complex software into modular, reusable components with inheritance, encapsulation, and customized operators via dunder methods.",
    syntax: `class BankAccount:
    bank_name = "Global Reserve" # Class variable

    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner          # Instance variable
        self._balance = balance     # Protected convention

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    def __str__(self) -> str:
        return f"{self.owner}'s Account: \${self._balance:.2f}"`,
    basicExample: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    # Operator overloading for +
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(2, 4)
v2 = Vector(3, 1)
print("Vector addition:", v1 + v2)`,
    stepByStepExecution: `CPython Object Creation & __new__ vs __init__:
1. When \'User("Alice")\' is called, CPython first calls \'User.__new__(User, *args)\'.
2. \'__new__\' is the actual object constructor: it allocates raw memory for the PyObject instance and returns it.
3. CPython then calls \'instance.__init__(*args)\' (the initializer) to bind attributes to the newly created instance.
4. \'self\' is simply a reference to that newly created heap instance.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Instance Methods vs @classmethod vs @staticmethod",
        code: `class Server:
    default_port = 8080

    def __init__(self, host):
        self.host = host

    # Instance method (receives self)
    def connect(self):
        return f"Connecting to {self.host}:{self.default_port}"

    # Class method (receives cls) - great for alternative constructors
    @classmethod
    def from_url(cls, url):
        host = url.replace("https://", "").split("/")[0]
        return cls(host)

    # Static method (receives neither self nor cls)
    @staticmethod
    def is_valid_port(port):
        return 1 <= port <= 65535

s = Server.from_url("https://pyradox.dev/api")
print(s.connect())
print("Port valid:", Server.is_valid_port(8080))`,
        explanation: "`self` accesses instance state; `cls` accesses class-level state; `@staticmethod` is an isolated utility function inside the class namespace."
      },
      {
        level: "Intermediate",
        title: "Multiple Inheritance & Method Resolution Order (MRO)",
        code: `class A:
    def ping(self): print("Ping from A")

class B(A):
    def ping(self): print("Ping from B"); super().ping()

class C(A):
    def ping(self): print("Ping from C"); super().ping()

class D(B, C):
    def ping(self): print("Ping from D"); super().ping()

d = D()
d.ping()
print("MRO Order:", [cls.__name__ for cls in D.__mro__])`,
        explanation: "Python uses the C3 Linearization algorithm to compute deterministic Method Resolution Order (MRO) for multiple inheritance."
      },
      {
        level: "Tricky",
        title: "Class Variables vs Instance Variables Mutation Trap",
        code: `class Developer:
    skills = [] # CLASS VARIABLE (Shared by ALL instances!)

dev1 = Developer()
dev2 = Developer()
dev1.skills.append("Python")

print("dev2 skills altered!", dev2.skills) # ['Python']!

# Fix: Initialize mutable structures in __init__
class SafeDeveloper:
    def __init__(self):
        self.skills = []`,
        explanation: "Class variables defined at class level are shared across all instances. Modifying a mutable class variable mutates it for everyone."
      }
    ],
    commonMistakes: [
      {
        title: "Omitting 'self' as First Parameter in Methods",
        wrongCode: `class User:
    def get_name(): # Missing self!
        return "Alice"
u = User()
# u.get_name() -> TypeError: User.get_name() takes 0 positional arguments but 1 was given`,
        correctCode: `class User:
    def get_name(self):
        return "Alice"`,
        whyItFails: "When invoking `u.get_name()`, Python automatically passes `u` as the first argument (`User.get_name(u)`). Without `self`, it throws a TypeError."
      }
    ],
    importantDifferences: [
      {
        title: "__str__ vs __repr__",
        itemA: "__str__",
        itemB: "__repr__",
        comparison: [
          "Target audience: End-users / human readable presentation vs Developers / unambiguous debugging representation",
          "Called by: `print(obj)`, `str(obj)`, f'{obj}' vs `repr(obj)`, interactive REPL output",
          "Goal: Clean and friendly vs Ideally executable Python code that could recreate the object"
        ]
      }
    ],
    realWorldUse: "Django ORM models, PyTorch `nn.Module` neural network architectures, custom exception hierarchies.",
    interviewPerspective: [
      {
        question: "Explain Duck Typing in Python.",
        trap: "Confusing it with static inheritance.",
        expectedAnswer: "'If it walks like a duck and quacks like a duck, it is a duck.' In Python, an object's suitability is determined by the presence of certain methods and properties, rather than its inheritance from a specific class. E.g., any object with a `read()` method can be treated as a file."
      }
    ],
    questions: [
      {
        id: "q21_1",
        question: "What algorithm does Python use to determine the Method Resolution Order (MRO) in multiple inheritance?",
        choices: ["Depth-First Search", "Breadth-First Search", "C3 Linearization", "Dijkstra's Algorithm"],
        correctIndex: 2,
        hints: ["It guarantees monotonicity and preserves local precedence order."],
        solutionCode: `class A: pass\nprint(A.__mro__)`,
        explanation: "Python uses C3 Linearization to calculate the Method Resolution Order (MRO)."
      }
    ],
    revisionSheet: [
      "`__new__` creates the instance; `__init__` initializes attributes.",
      "Always include `self` as the first parameter of instance methods.",
      "Never put mutable objects (like lists or dicts) as class variables.",
      "Use `super().method()` to traverse the MRO cooperative hierarchy."
    ],
    subtopics: [
      { id: "s21_1", text: "Classes", isStarred: false },
      { id: "s21_2", text: "Objects", isStarred: false },
      { id: "s21_3", text: "Attributes", isStarred: false },
      { id: "s21_4", text: "Methods", isStarred: false },
      { id: "s21_5", text: "self", isStarred: false },
      { id: "s21_6", text: "__init__", isStarred: false },
      { id: "s21_7", text: "Instance variables", isStarred: false },
      { id: "s21_8", text: "Class variables", isStarred: false },
      { id: "s21_9", text: "Instance methods", isStarred: false },
      { id: "s21_10", text: "Class methods", isStarred: false },
      { id: "s21_11", text: "Static methods", isStarred: false },
      { id: "s21_12", text: "@classmethod", isStarred: false },
      { id: "s21_13", text: "@staticmethod", isStarred: false },
      { id: "s21_14", text: "Encapsulation", isStarred: false },
      { id: "s21_15", text: "Inheritance", isStarred: false },
      { id: "s21_16", text: "Single inheritance", isStarred: false },
      { id: "s21_17", text: "Multiple inheritance", isStarred: false },
      { id: "s21_18", text: "Multilevel inheritance", isStarred: false },
      { id: "s21_19", text: "Hierarchical inheritance", isStarred: false },
      { id: "s21_20", text: "Method overriding", isStarred: false },
      { id: "s21_21", text: "super()", isStarred: false },
      { id: "s21_22", text: "Polymorphism", isStarred: false },
      { id: "s21_23", text: "Duck typing", isStarred: false },
      { id: "s21_24", text: "Abstraction", isStarred: false },
      { id: "s21_25", text: "Abstract classes", isStarred: false },
      { id: "s21_26", text: "abc", isStarred: false },
      { id: "s21_27", text: "Abstract methods", isStarred: false },
      { id: "s21_28", text: "Properties", isStarred: false },
      { id: "s21_29", text: "@property", isStarred: false },
      { id: "s21_30", text: "Getters/setters", isStarred: false },
      { id: "s21_31", text: "Magic/dunder methods", isStarred: false },
      { id: "s21_32", text: "__str__", isStarred: false },
      { id: "s21_33", text: "__repr__", isStarred: false },
      { id: "s21_34", text: "__len__", isStarred: false },
      { id: "s21_35", text: "__eq__", isStarred: false },
      { id: "s21_36", text: "__lt__", isStarred: false },
      { id: "s21_37", text: "Operator overloading", isStarred: false },
      { id: "s21_38", text: "Object lifecycle", isStarred: false },
      { id: "s21_39", text: "__new__", isStarred: false },
      { id: "s21_40", text: "__del__", isStarred: false },
      { id: "s21_41", text: "MRO", isStarred: false },
      { id: "s21_42", text: "C3 linearization", isStarred: false },
      { id: "s21_43", text: "isinstance()", isStarred: false },
      { id: "s21_44", text: "issubclass()", isStarred: false }
    ],
    starterCode: `# 21. Object-Oriented Programming & Dunder Methods
class CloudCluster:
    def __init__(self, name, node_count):
        self.name = name
        self.node_count = node_count

    def __repr__(self):
        return f"CloudCluster('{self.name}', nodes={self.node_count})"

    def __add__(self, other):
        return CloudCluster(f"{self.name}+{other.name}", self.node_count + other.node_count)

c1 = CloudCluster("US-East", 12)
c2 = CloudCluster("EU-West", 8)
print("Combined cluster:", c1 + c2)`
  },

  // ───  
  {
    id: "advanced-functions-and-decorators",
    topicNum: 22,
    title: "22. Decorators & Advanced Functions",
    category: "OOP & Protocols",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §PEP 318",
    docUrl: "https://docs.python.org/3/glossary.html#term-decorator",
    summary: "Closures, decorator functions, decorators with arguments, functools.wraps, class decorators, lru_cache, and singledispatch.",
    whatIsIt: "A decorator is a callable that takes another function or class as an argument, extends or alters its behavior without modifying its source code, and returns the modified callable.",
    whyDoesItExist: "To implement cross-cutting concerns cleanly (logging, caching, authentication, timing, rate limiting) following the Open-Closed Principle.",
    syntax: `# Basic decorator:
from functools import wraps

def my_decorator(func):
    @wraps(func) # Preserves __name__ and __doc__
    def wrapper(*args, **kwargs):
        # Pre-execution logic
        result = func(*args, **kwargs)
        # Post-execution logic
        return result
    return wrapper

@my_decorator
def target_function():
    ...`,
    basicExample: `import time
from functools import wraps

def time_it(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        res = func(*args, **kwargs)
        elapsed = time.perf_counter() - t0
        print(f"[{func.__name__}] executed in {elapsed:.6f}s")
        return res
    return wrapper

@time_it
def compute_sum(n):
    return sum(range(n))

print("Sum result:", compute_sum(1000000))`,
    stepByStepExecution: `CPython Decorator Syntax Sugar Desugaring:
When CPython encounters:
@decorator
def my_func():
    pass

It translates it during compilation directly to:
def my_func():
    pass
my_func = decorator(my_func)

The name \'my_func\' is rebound to the wrapper callable returned by the decorator.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Memoization with @functools.lru_cache",
        code: `from functools import lru_cache

# Caches results of expensive recursive calls automatically
@lru_cache(maxsize=128)
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)

print("Fib(50):", fib(50))
print("Cache info:", fib.cache_info())`,
        explanation: "lru_cache memoizes function return values based on input arguments, turning O(2^N) recursion into O(N)."
      },
      {
        level: "Intermediate",
        title: "Decorator with Arguments (3-Level Closure)",
        code: `from functools import wraps

def repeat(num_times):
    def decorator_repeat(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                res = func(*args, **kwargs)
            return res
        return wrapper
    return decorator_repeat

@repeat(num_times=3)
def greet(name):
    print(f"Hello, {name}!")

greet("Shivansh")`,
        explanation: "When a decorator takes arguments, an outer factory function returns the actual decorator."
      },
      {
        level: "Tricky",
        title: "Preserving Metadata with functools.wraps",
        code: `def bad_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@bad_decorator
def sample():
    """Important docstring"""
    pass

print("Name lost:", sample.__name__) # 'wrapper' !
# Always use @functools.wraps(func) to copy over __name__, __doc__, and __module__!`,
        explanation: "Without `@wraps`, the original function's introspection metadata is overwritten by the wrapper."
      }
    ],
    commonMistakes: [
      {
        title: "Forgetting to Use @functools.wraps",
        wrongCode: `def my_dec(f):
    def wrapper(*args, **kwargs):
        return f(*args, **kwargs)
    return wrapper`,
        correctCode: `from functools import wraps
def my_dec(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return f(*args, **kwargs)
    return wrapper`,
        whyItFails: "Without `@wraps`, tools like Sphinx docs, pytest, and debugger traces see the wrapper name instead of the original function."
      }
    ],
    importantDifferences: [
      {
        title: "Function Decorator vs Class Decorator",
        itemA: "Function Decorator",
        itemB: "Class Decorator",
        comparison: [
          "Target: Wraps a callable function vs Modifies or instruments an entire class definition",
          "Syntax: `@my_func_dec def f():` vs `@dataclass class User:`",
          "Returns: A replacement wrapper function vs The modified class or a proxy class"
        ]
      }
    ],
    realWorldUse: "Authentication route guards in FastAPI (`@app.get('/', dependencies=[Depends(auth)])`), Django login_required, metric counters.",
    interviewPerspective: [
      {
        question: "How do you write a decorator that accepts arguments?",
        trap: "Only writing 2 levels of nested functions.",
        expectedAnswer: "You write a function that takes the decorator's arguments and returns the actual decorator. That decorator in turn takes the target function and returns the wrapper (3 levels total: factory -> decorator -> wrapper)."
      }
    ],
    questions: [
      {
        id: "q22_1",
        question: "Why should you always apply `@functools.wraps(func)` inside a decorator wrapper?",
        choices: [
          "To make the decorated function run faster",
          "To preserve the original function's name, docstring, and annotations",
          "To convert the function into a generator",
          "To prevent the function from raising exceptions"
        ],
        correctIndex: 1,
        hints: ["Think about what happens to `__name__` and `__doc__`."],
        solutionCode: `from functools import wraps\n# @wraps(f) copies __name__, __doc__`,
        explanation: "`@functools.wraps` copies over metadata like `__name__`, `__doc__`, and parameter annotations from the decorated function."
      }
    ],
    revisionSheet: [
      "A decorator desugars to: `func = decorator(func)`.",
      "Always decorate the wrapper with `@functools.wraps(func)`.",
      "Decorators with arguments require 3 levels of nested functions.",
      "`@functools.lru_cache` provides automatic memoization caching."
    ],
    subtopics: [
      { id: "s22_1", text: "First-class functions", isStarred: false },
      { id: "s22_2", text: "Higher-order functions", isStarred: false },
      { id: "s22_3", text: "Closures", isStarred: false },
      { id: "s22_4", text: "Decorators", isStarred: false },
      { id: "s22_5", text: "Function decorators", isStarred: false },
      { id: "s22_6", text: "Decorator with arguments", isStarred: false },
      { id: "s22_7", text: "functools.wraps", isStarred: false },
      { id: "s22_8", text: "Multiple decorators", isStarred: false },
      { id: "s22_9", text: "Class decorators", isStarred: false },
      { id: "s22_10", text: "functools", isStarred: false },
      { id: "s22_11", text: "partial()", isStarred: false },
      { id: "s22_12", text: "lru_cache()", isStarred: false },
      { id: "s22_13", text: "singledispatch()", isStarred: false }
    ],
    starterCode: `# 22. Decorators in Action
from functools import wraps

def audit_log(action_name):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            print(f"[AUDIT] Starting action '{action_name}'...")
            res = func(*args, **kwargs)
            print(f"[AUDIT] Action '{action_name}' completed successfully.")
            return res
        return wrapper
    return decorator

@audit_log("DEPLOY_CONTAINER")
def deploy(service_id):
    return f"Service {service_id} live on port 8000"

print(deploy("AUTH_SRV"))`
  },

  // ───  
  {
    id: "context-managers",
    topicNum: 23,
    title: "23. Context Managers",
    category: "OOP & Protocols",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §3.3.9 & PEP 343",
    docUrl: "https://docs.python.org/3/reference/datamodel.html#context-managers",
    summary: "with statement, context manager protocol (__enter__, __exit__), exception suppression, and @contextlib.contextmanager generator utility.",
    whatIsIt: "A context manager is an object that controls the runtime context of a code block executed via the `with` statement.",
    whyDoesItExist: "To guarantee deterministic allocation and release of system resources (database transactions, thread locks, temp files, network sockets) without manual try-finally boilerplate.",
    syntax: `# Class-based protocol:
class ManagedResource:
    def __enter__(self):
        # Acquire resource
        return resource
    def __exit__(self, exc_type, exc_val, exc_tb):
        # Release resource
        # Return True to suppress exception, False/None to propagate

# Generator utility (contextlib):
from contextlib import contextmanager
@contextmanager
def managed_resource():
    # Setup
    yield resource
    # Teardown`,
    basicExample: `class Timer:
    def __enter__(self):
        import time
        self.t0 = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.elapsed = time.perf_counter() - self.t0
        print(f"Elapsed block time: {self.elapsed:.5f}s")
        return False # Do not suppress exceptions

with Timer():
    sum(range(500000))`,
    stepByStepExecution: `CPython with Statement Execution Flow:
1. The expression following \'with\' is evaluated to obtain a context manager object.
2. CPython calls the manager's \'__enter__()\' method. The return value is bound to the target in the optional \'as\' clause.
3. The body of the with block is executed.
4. If no exception occurred: \'__exit__(None, None, None)\' is called.
5. If an exception occurred: \'__exit__(exc_type, exc_val, exc_tb)\' is called with the exception details.
   - If \'__exit__\' returns True, CPython suppresses the exception and continues execution normally.
   - If \'__exit__\' returns False (or None), CPython re-raises the exception.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "The @contextlib.contextmanager Generator Shortcut",
        code: `from contextlib import contextmanager

@contextmanager
def temporary_flag(settings, key, temp_val):
    old_val = settings.get(key)
    settings[key] = temp_val
    try:
        yield settings # Execution pauses here for with-block!
    finally:
        settings[key] = old_val # Cleanup guaranteed!

config = {"debug": False}
with temporary_flag(config, "debug", True):
    print("Inside context debug:", config["debug"])

print("Outside context debug:", config["debug"])`,
        explanation: "`@contextmanager` turns a generator with a single `yield` into a full context manager. Code before yield is __enter__; code after is __exit__."
      },
      {
        level: "Intermediate",
        title: "Exception Suppression with contextlib.suppress",
        code: `import os
from contextlib import suppress

# Clean alternative to try: os.remove(...) except FileNotFoundError: pass
with suppress(FileNotFoundError):
    os.remove("non_existent_file.tmp")
print("Cleanly ignored missing file error!")`,
        explanation: "`suppress(*exceptions)` safely silences specified exceptions within the block."
      },
      {
        level: "Tricky",
        title: "Suppressing Exceptions via __exit__ Return Value",
        code: `class IgnoreZeroDivision:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is ZeroDivisionError:
            print("Suppressed ZeroDivisionError cleanly!")
            return True # Returning True suppresses exception!
        return False

with IgnoreZeroDivision():
    x = 10 / 0
print("Continued execution past error!")`,
        explanation: "Returning `True` from `__exit__` tells Python that the exception was handled and should not propagate."
      }
    ],
    commonMistakes: [
      {
        title: "Accidentally Suppressing All Exceptions in __exit__",
        wrongCode: `def __exit__(self, *args):
    self.cleanup()
    return True # SILENTLY SUPPRESSES ALL BUGS AND CRASHES!`,
        correctCode: `def __exit__(self, *args):
    self.cleanup()
    return False # Normal propagation`,
        whyItFails: "Returning True unconditionally causes all syntax and logic bugs inside the block to vanish silently without warnings."
      }
    ],
    importantDifferences: [
      {
        title: "__enter__/__exit__ vs try-finally",
        itemA: "with (Context Manager)",
        itemB: "try ... finally",
        comparison: [
          "Reusability: Packaged into reusable classes or generator decorators vs Duplicated in every usage location",
          "Readability: High clarity, expresses intent in 1 line vs Verbose multi-line indentation",
          "Exception control: Can inspect and selectively suppress exceptions via __exit__ vs Requires extra except clauses"
        ]
      }
    ],
    realWorldUse: "Database transaction sessions (`with db.begin():`), threading locks (`with lock:`), temporary directories (`with tempfile.TemporaryDirectory():`).",
    interviewPerspective: [
      {
        question: "How do you suppress an exception inside a custom context manager?",
        trap: "Saying 'call raise None'.",
        expectedAnswer: "In the `__exit__(self, exc_type, exc_val, exc_tb)` method, return `True`. If `__exit__` returns `True`, Python intercepts the active exception and silences it."
      }
    ],
    questions: [
      {
        id: "q23_1",
        question: "What must `__exit__()` return in order to suppress an exception raised inside a `with` block?",
        choices: ["None", "True", "False", "raise StopIteration"],
        correctIndex: 1,
        hints: ["A truthy boolean signals that the exception has been handled."],
        solutionCode: `def __exit__(self, *args):\n    return True # Suppresses exception`,
        explanation: "Returning `True` from `__exit__` tells Python to suppress the exception and resume normal execution."
      }
    ],
    revisionSheet: [
      "Context managers implement `__enter__()` and `__exit__()`.",
      "`__enter__()` return value is bound to `as <var>`.",
      "Returning `True` from `__exit__` suppresses the active exception.",
      "Use `@contextlib.contextmanager` to write generator-based context managers."
    ],
    subtopics: [
      { id: "s23_1", text: "with", isStarred: false },
      { id: "s23_2", text: "Context manager protocol", isStarred: false },
      { id: "s23_3", text: "__enter__", isStarred: false },
      { id: "s23_4", text: "__exit__", isStarred: false },
      { id: "s23_5", text: "Custom context managers", isStarred: false },
      { id: "s23_6", text: "contextlib", isStarred: false },
      { id: "s23_7", text: "@contextmanager", isStarred: false }
    ],
    starterCode: `# 23. Context Managers with contextlib
from contextlib import contextmanager

@contextmanager
def database_transaction(session_name):
    print(f"BEGIN TRANSACTION: {session_name}")
    try:
        yield {"session": session_name, "active": True}
        print("COMMIT TRANSACTION")
    except Exception as e:
        print(f"ROLLBACK TRANSACTION due to: {e}")
        raise

with database_transaction("USER_UPDATE") as tx:
    print(f"Executing queries on {tx['session']}...")`
  },

  // ───  
  {
    id: "python-scope-and-namespaces",
    topicNum: 24,
    title: "24. Scope & Namespaces",
    category: "OOP & Protocols",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §9.2",
    docUrl: "https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces",
    summary: "Namespaces (Local, Global, Built-in), LEGB resolution order, global, nonlocal, variable shadowing, and closures.",
    whatIsIt: "A namespace is a mapping from names to objects (implemented internally as Python dictionaries). A scope is a textual region of a Python program where a namespace is directly accessible without prefix notation.",
    whyDoesItExist: "To avoid name collisions, isolate variables across functions and modules, and support modular closures with clear lexical scoping.",
    syntax: `# The LEGB Rule:
# L = Local (inside current function)
# E = Enclosing (nested outer function)
# G = Global (module-level)
# B = Built-in (builtins module: len, range, str)

x = 10 # Global

def outer():
    x = 20 # Enclosing
    def inner():
        nonlocal x # Rebinds outer x
        x = 30
    inner()
    return x`,
    basicExample: `counter = 0

def increment():
    global counter
    counter += 1

increment()
increment()
print("Global counter:", counter)`,
    stepByStepExecution: `CPython Name Resolution & Variable Binding:
1. Python inspects functions at COMPILE time: any variable assigned inside a function (\'x = 1\') is marked as LOCAL for that entire function.
2. If code attempts to read \'x\' before that assignment, Python throws \'UnboundLocalError\', even if a global variable \'x\' exists!
3. The \'global x\' statement tells the compiler: 'Do not treat x as local; resolve assignments directly in the module globals dict.'
4. The \'nonlocal x\' statement tells the compiler: 'Look in the nearest enclosing function frame for x.'`,
    multipleExamples: [
      {
        level: "Simple",
        title: "The UnboundLocalError Trap",
        code: `x = 10

def try_increment():
    # Because 'x +=' assigns to x, Python treats x as local to this function!
    # Reading x before assignment raises UnboundLocalError!
    # x += 1
    pass

# Correct pattern:
def safe_increment():
    global x
    x += 1

safe_increment()
print("x incremented:", x)`,
        explanation: "Python analyzes functions statically: if a variable is assigned anywhere in the function, it is treated as local throughout the function."
      },
      {
        level: "Intermediate",
        title: "Closures with nonlocal State",
        code: `def make_counter(start=0):
    count = start
    def step():
        nonlocal count # Rebinds count in enclosing scope
        count += 1
        return count
    return step

c1 = make_counter(10)
print("c1 step:", c1()) # 11
print("c1 step:", c1()) # 12`,
        explanation: "A closure retains access to variables in its enclosing scope even after the outer function has finished executing."
      },
      {
        level: "Tricky",
        title: "Inspecting Local and Global Dictionaries",
        code: `def inspect_scopes():
    local_val = "SECRET"
    print("locals() keys:", list(locals().keys()))
    # globals() is the actual module dictionary:
    globals()["DYNAMIC_GLOBAL"] = 42

inspect_scopes()
print("Dynamically created global:", DYNAMIC_GLOBAL)`,
        explanation: "`locals()` returns the local namespace; `globals()` returns the dictionary of the current module."
      }
    ],
    commonMistakes: [
      {
        title: "Overusing global Instead of Class/Return Values",
        wrongCode: `user_id = None
def set_user(uid):
    global user_id
    user_id = uid`,
        correctCode: `class Session:
    def __init__(self):
        self.user_id = None`,
        whyItFails: "Global variables introduce hidden coupling, break concurrency, and make unit testing extremely difficult."
      }
    ],
    importantDifferences: [
      {
        title: "global vs nonlocal",
        itemA: "global",
        itemB: "nonlocal",
        comparison: [
          "Target namespace: Module-level global namespace vs Nearest enclosing function namespace",
          "Scope: Can be declared anywhere vs Only valid inside nested functions",
          "Creation: Can create a new global variable vs Target variable MUST already exist in outer scope"
        ]
      }
    ],
    realWorldUse: "Closures in factory functions, memoization caches, and isolating variable scopes in plugin systems.",
    interviewPerspective: [
      {
        question: "Why does `a = 1; def f(): print(a); a = 2` raise an `UnboundLocalError`?",
        trap: "Thinking it prints 1 then changes a to 2.",
        expectedAnswer: "During bytecode compilation, Python marks any variable assigned inside a function as local. Because `a = 2` exists in `f()`, `a` is strictly local. When `print(a)` runs before the assignment, local `a` has not yet been bound, raising `UnboundLocalError`."
      }
    ],
    questions: [
      {
        id: "q24_1",
        question: "What keyword allows a nested function to modify a variable in its enclosing parent function?",
        choices: ["global", "nonlocal", "outer", "parent"],
        correctIndex: 1,
        hints: ["It binds to the enclosing lexical scope."],
        solutionCode: `def outer():\n    x = 1\n    def inner():\n        nonlocal x\n        x = 2`,
        explanation: "The `nonlocal` keyword allows rebinding variables in the nearest enclosing non-global scope."
      }
    ],
    revisionSheet: [
      "LEGB: Local -> Enclosing -> Global -> Built-in.",
      "Assigning to a variable inside a function makes it local by default.",
      "Use `global` to rebind module-level variables.",
      "Use `nonlocal` to rebind enclosing function variables in closures."
    ],
    subtopics: [
      { id: "s24_1", text: "Namespace", isStarred: false },
      { id: "s24_2", text: "Local namespace", isStarred: false },
      { id: "s24_3", text: "Global namespace", isStarred: false },
      { id: "s24_4", text: "Built-in namespace", isStarred: false },
      { id: "s24_5", text: "LEGB", isStarred: false },
      { id: "s24_6", text: "Scope", isStarred: false },
      { id: "s24_7", text: "global", isStarred: false },
      { id: "s24_8", text: "nonlocal", isStarred: false },
      { id: "s24_9", text: "Closures", isStarred: false },
      { id: "s24_10", text: "Name resolution", isStarred: false },
      { id: "s24_11", text: "Variable shadowing", isStarred: false }
    ],
    starterCode: `# 24. Scope & Closures
def create_accumulator(initial=0):
    total = initial
    def add(amount):
        nonlocal total
        total += amount
        return total
    return add

acc = create_accumulator(100)
print("+25:", acc(25))
print("+50:", acc(50))`
  }
];
