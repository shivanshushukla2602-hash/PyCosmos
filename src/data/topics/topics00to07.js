// Topics 0 to 7: Foundation
// 0. Setup & Fundamentals, 1. Variables & Memory, 2. Data Types, 3. Numbers, 4. Operators, 5. Input & Output, 6. Conditionals, 7. Loops

export const TOPICS_00_TO_07 = [
  // ─── 0. Python Setup & Fundamentals ──────────────────────────────────────────
  {
    id: "setup-and-fundamentals",
    topicNum: 0,
    title: "0. Python Setup & Fundamentals",
    category: "Foundation",
    level: "Beginner",
    stars: "",
    docRefTag: "Docs §1 & §2",
    docUrl: "https://docs.python.org/3/tutorial/appetite.html",
    summary: "Python runtime architecture, CPython VM, compilation pipeline from source to bytecode, REPL, and PEP 8 formatting.",
    whatIsIt: "Python is a high-level, dynamically typed, garbage-collected, general-purpose language created by Guido van Rossum in 1991. It prioritizes human readability, clean syntax, and rapid prototyping while scaling to high-performance distributed systems.",
    whyDoesItExist: "To eliminate the boilerplates, manual memory allocation, and compilation friction of C/C++ while delivering higher productivity, rich standard libraries ('batteries included'), and clean readable code across operating systems.",
    syntax: `# File execution: python script.py
# Interactive REPL: python -i
# Standard PEP 8 Indentation: 4 spaces per block
def greeting(name: str) -> str:
    # Code block demarcated by indentation
    return f"Welcome, {name}"`,
    basicExample: `import sys
import platform

print("Python Version:", platform.python_version())
print("CPython Implementation:", platform.python_implementation())
print("Bytecode Cache Active:", sys.dont_write_bytecode is False)`,
    stepByStepExecution: `When you invoke 'python main.py', the execution pipeline is:
1. Lexical Analysis: Source characters are parsed into tokens (keywords, literals, operators).
2. Syntax Parsing: Tokens construct the Concrete Syntax Tree (CST), simplified into an Abstract Syntax Tree (AST).
3. Bytecode Compilation: The AST compiler generates Python bytecode instructions stored as PyCodeObject instances (cached as .pyc files).
4. VM Evaluation Loop (ceval.c): The CPython virtual machine evaluates opcodes using an internal operand stack and heap-allocated PyObject pointers.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Expression Evaluation in the REPL",
        code: `x = 40 + 2
print("Calculated:", x)
print("Type of x:", type(x))`,
        explanation: "Expressions evaluate immediately in the CPython REPL loop, outputting the resulting PyObject representation."
      },
      {
        level: "Intermediate",
        title: "Inspecting Bytecode with the 'dis' Module",
        code: `import dis

def add_two(a, b):
    return a + b

# Disassemble bytecode to see raw VM opcodes
dis.dis(add_two)`,
        explanation: "Shows LOAD_FAST, BINARY_OP (or BINARY_ADD in older CPython), and RETURN_VALUE opcodes."
      },
      {
        level: "Tricky",
        title: "Whitespace Indentation and Invisible Character Pitfalls",
        code: `# Tab vs Space hazard:
def clean_block():
    val = 100
    if val > 50:
        msg = "Consistent 4 spaces"
    return msg

print(clean_block())`,
        explanation: "PEP 8 strictly mandates 4 spaces over tab characters. Python 3 throws TabError when tabs and spaces are mixed."
      }
    ],
    commonMistakes: [
      {
        title: "Mixing Tabs and Spaces (TabError)",
        wrongCode: `def calculate():
\tx = 10
    return x * 2 # Mixed tab on line 2, spaces on line 3`,
        correctCode: `def calculate():
    x = 10
    return x * 2 # Consistent 4 spaces`,
        whyItFails: "Python 3 disallows ambiguous indentation where tab stops vary across different text editors."
      }
    ],
    importantDifferences: [
      {
        title: "Python vs C vs Java",
        itemA: "Python",
        itemB: "C / C++",
        comparison: [
          "Memory: Automatic Reference Counting + Cyclic GC vs Manual malloc/free",
          "Typing: Dynamic strong typing vs Static compile-time typing",
          "Execution: Bytecode interpreted by VM vs Native AOT machine code binaries",
          "Speed: Moderate raw throughput, optimized via C extensions vs Maximum hardware execution speed"
        ]
      },
      {
        title: "CPython vs PyPy",
        itemA: "CPython (Reference)",
        itemB: "PyPy (JIT)",
        comparison: [
          "Runtime: Standard interpreter with Global Interpreter Lock (GIL)",
          "JIT: PyPy uses a tracing Just-In-Time compiler for 4x-7x speedup in long loops",
          "Compatibility: CPython has 100% C-API extension compatibility (NumPy, PyTorch)"
        ]
      }
    ],
    realWorldUse: "Powers scalable backend APIs at Instagram, Pinterest, and Netflix; scientific computing at CERN; AI workflows across PyTorch, TensorFlow, and Hugging Face.",
    interviewPerspective: [
      {
        question: "Is Python compiled or interpreted?",
        trap: "Answering 'Python is purely interpreted' is incorrect.",
        expectedAnswer: "Python is both: source files (.py) are compiled to bytecode (.pyc), which is then interpreted by the CPython virtual machine."
      },
      {
        question: "What is PEP 8?",
        trap: "Thinking it's just code formatting aesthetics.",
        expectedAnswer: "PEP 8 is the official Python Enhancement Proposal specifying style conventions (naming, 4-space indent, 79-char line limit, import ordering) to ensure readability."
      }
    ],
    questions: [
      {
        id: "q0_1",
        question: "What format does CPython compile Python source code into before execution?",
        choices: [".exe binary", "Python Bytecode (.pyc)", "Assembly code", "Java Class files"],
        correctIndex: 1,
        hints: ["It is an intermediate bytecode instruction set executed by the CPython VM."],
        solutionCode: `import dis\nprint("CPython uses bytecode")`,
        explanation: "Python compiles source files to platform-independent bytecode before running them on the CPython evaluation loop."
      }
    ],
    revisionSheet: [
      "CPython is the reference implementation written in C.",
      "Python 3 strictly enforces 4 spaces indentation; tabs and spaces cannot be mixed.",
      "__pycache__ stores compiled .pyc bytecode files to accelerate repeated executions.",
      "Python is dynamically typed (types checked at runtime) and strongly typed (no implicit incompatible coercions)."
    ],
    subtopics: [
      { id: "s0_1", text: "What is Python?", isStarred: false },
      { id: "s0_2", text: "Why Python?", isStarred: false },
      { id: "s0_3", text: "Python's features", isStarred: false },
      { id: "s0_4", text: "Python vs C/C++/Java", isStarred: false },
      { id: "s0_5", text: "Installing Python", isStarred: false },
      { id: "s0_6", text: "Python interpreter", isStarred: false },
      { id: "s0_7", text: "Python execution process", isStarred: false },
      { id: "s0_8", text: "Python versions", isStarred: false },
      { id: "s0_9", text: "CPython, PyPy and other implementations", isStarred: false },
      { id: "s0_10", text: "Running Python from terminal", isStarred: false },
      { id: "s0_11", text: "Python REPL", isStarred: false },
      { id: "s0_12", text: ".py files", isStarred: false },
      { id: "s0_13", text: "IDEs and editors", isStarred: false },
      { id: "s0_14", text: "VS Code / Jupyter Notebook", isStarred: false },
      { id: "s0_15", text: "Comments", isStarred: false },
      { id: "s0_16", text: "Indentation", isStarred: false },
      { id: "s0_17", text: "Statements", isStarred: false },
      { id: "s0_18", text: "Expressions", isStarred: false },
      { id: "s0_19", text: "Keywords", isStarred: false },
      { id: "s0_20", text: "Identifiers", isStarred: false },
      { id: "s0_21", text: "Naming conventions", isStarred: false },
      { id: "s0_22", text: "PEP 8 basics", isStarred: false }
    ],
    starterCode: `# 0. Python Setup & Fundamentals
import sys
import keyword

print("Python sys.version:", sys.version.split()[0])
print(f"Total Python reserved keywords: {len(keyword.kwlist)}")
print("Sample keywords:", keyword.kwlist[:8])`
  },

  // ───  
  {
    id: "variables-and-memory",
    topicNum: 1,
    title: "1. Variables & Memory",
    category: "Foundation",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §3.1",
    docUrl: "https://docs.python.org/3/reference/datamodel.html#objects-values-and-types",
    summary: "Object reference model, dynamic typing, id(), is vs ==, reference counting garbage collection, and None.",
    whatIsIt: "In Python, variables are not memory containers holding data directly; they are named references (pointers) bound to objects residing on the private heap.",
    whyDoesItExist: "Decoupling variable names from object memory enables dynamic typing, memory sharing (small integer interning), zero-copy assignments, and automated garbage collection via reference counting.",
    syntax: `# Variable assignment: variable_name = object_expression
a = 10
b = a          # Both names point to the same memory object
x, y = 1, 2    # Multiple assignment / tuple unpacking
x, y = y, x    # Idiomatic Python swap (zero temporary variables)`,
    basicExample: `x = 10
y = x
print("x value:", x, "y value:", y)
print("type(x):", type(x))
print("Memory address id(x):", id(x))
print("Same object (x is y):", x is y)`,
    stepByStepExecution: `When executing 'x = [1, 2, 3]':
1. CPython allocates a PyListObject on the heap.
2. The object header is initialized with ob_refcnt = 1 and ob_type pointing to PyList_Type.
3. The name 'x' is placed in the local namespace dictionary, mapping the string 'x' to the heap address.
4. When executing 'y = x', ob_refcnt increments to 2. No list is duplicated!
5. When 'del x' runs, ob_refcnt decrements to 1. The list remains alive because 'y' still references it.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Variable Swapping Without Temp Variables",
        code: `a = 100
b = 200
# Python evaluates RHS tuple (200, 100) first, then unpacks to LHS
a, b = b, a
print(f"a = {a}, b = {b}")`,
        explanation: "Tuple packing and unpacking allows atomic swaps in a single bytecode instruction."
      },
      {
        level: "Intermediate",
        title: "Identity (is) vs Equality (==)",
        code: `list_a = [1, 2, 3]
list_b = [1, 2, 3]

print("list_a == list_b (Values equal?):", list_a == list_b)
print("list_a is list_b (Same heap address?):", list_a is list_b)
print("id(list_a):", id(list_a))
print("id(list_b):", id(list_b))`,
        explanation: "'==' checks if values are equivalent via __eq__(), while 'is' checks if memory pointers match (id(a) == id(b))."
      },
      {
        level: "Tricky",
        title: "Integer Interning & Caching Trap",
        code: `p = 256
q = 256
print("p is q for 256:", p is q) # True (interned between -5 and 256)

m = 99999
n = 99999
print("m is n for 99999:", m is n) # May be False in interactive mode`,
        explanation: "CPython pre-allocates an array of small integers from -5 to 256 to save memory and optimize speed."
      }
    ],
    commonMistakes: [
      {
        title: "Using 'is' for Value Equality",
        wrongCode: `user_input = "hello"
if user_input is "hello":
    print("Matched!")`,
        correctCode: `user_input = "hello"
if user_input == "hello":
    print("Matched!")`,
        whyItFails: "'is' checks memory identity. While small strings can be interned, dynamic strings constructed at runtime will reside at different memory addresses, causing unexpected False."
      },
      {
        title: "Aliasing Mutable Objects",
        wrongCode: `a = [1, 2]
b = a
b.append(3) # Alters 'a' as well!`,
        correctCode: `a = [1, 2]
b = a.copy() # Shallow copy creates independent list object
b.append(3)`,
        whyItFails: "Assignment creates an alias (another reference to the same object), not a copy."
      }
    ],
    importantDifferences: [
      {
        title: "is vs ==",
        itemA: "is (Identity Operator)",
        itemB: "== (Equality Operator)",
        comparison: [
          "Compares: id(x) == id(y) (exact same memory location) vs x.__eq__(y) (equivalent data value)",
          "Overridable: Cannot be overloaded vs Overridden via __eq__",
          "Common use: Singletons like `x is None` or `x is True` vs All value comparisons (`x == 10`)"
        ]
      }
    ],
    realWorldUse: "Critical in debugging state mutations in Django ORM models, avoiding state bugs in React/FastAPI payloads, and managing memory in PyTorch tensors.",
    interviewPerspective: [
      {
        question: "Explain Python's memory model: variables vs objects.",
        trap: "Explaining that variables are boxes containing values.",
        expectedAnswer: "Python variables are labels/pointers pointing to heap-allocated objects. Objects contain reference counts, type pointers, and values. Assigning a variable increments the reference count."
      },
      {
        question: "How does Python handle garbage collection?",
        trap: "Believing Python only uses a tracing garbage collector like Java.",
        expectedAnswer: "Python primarily uses reference counting. When refcount hits zero, memory is freed immediately. A secondary cyclic garbage collector handles circular references."
      }
    ],
    questions: [
      {
        id: "q1_1",
        question: "What does the expression `a is b` evaluate in Python?",
        choices: ["Whether a and b have identical values", "Whether id(a) == id(b)", "Whether a and b have the same data type", "Whether a can be converted to b"],
        correctIndex: 1,
        hints: ["The 'is' operator checks object identity in memory."],
        solutionCode: `x = [1]; y = [1]\nprint(x is y) # False\nprint(x == y) # True`,
        explanation: "`a is b` returns True if and only if both variables point to the exact same object in heap memory."
      }
    ],
    revisionSheet: [
      "Variables are references (tags/pointers), not memory storage boxes.",
      "id(x) returns the memory address integer of the object.",
      "Always check `x is None` rather than `x == None` (None is a singleton).",
      "CPython caches small integers (-5 to 256) and some ASCII string literals."
    ],
    subtopics: [
      { id: "s1_1", text: "Variables", isStarred: false },
      { id: "s1_2", text: "Variable assignment", isStarred: false },
      { id: "s1_3", text: "Multiple assignment", isStarred: false },
      { id: "s1_4", text: "Chained assignment", isStarred: false },
      { id: "s1_5", text: "Swapping variables", isStarred: false },
      { id: "s1_6", text: "Dynamic typing", isStarred: false },
      { id: "s1_7", text: "Strong typing", isStarred: false },
      { id: "s1_8", text: "Object/reference model", isStarred: false },
      { id: "s1_9", text: "Identity vs equality", isStarred: false },
      { id: "s1_10", text: "id()", isStarred: false },
      { id: "s1_11", text: "type()", isStarred: false },
      { id: "s1_12", text: "is", isStarred: false },
      { id: "s1_13", text: "==", isStarred: false },
      { id: "s1_14", text: "Mutable vs immutable objects", isStarred: false },
      { id: "s1_15", text: "Variable scope introduction", isStarred: false },
      { id: "s1_16", text: "Garbage collection", isStarred: false },
      { id: "s1_17", text: "Reference counting", isStarred: false },
      { id: "s1_18", text: "None", isStarred: false }
    ],
    starterCode: `# 1. Variables & Memory
a = [10, 20, 30]
b = a
c = list(a)

print("a == b:", a == b, "| a is b:", a is b)
print("a == c:", a == c, "| a is c:", a is c)
print(f"id(a)={id(a)}, id(c)={id(c)}")`
  },

  // ───  
  {
    id: "data-types",
    topicNum: 2,
    title: "2. Data Types",
    category: "Foundation",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §3.2",
    docUrl: "https://docs.python.org/3/library/stdtypes.html",
    summary: "Built-in fundamental types, collection types, binary types, type conversion, and truthy/falsy evaluation.",
    whatIsIt: "Python categorizes every value into built-in data types: scalar primitives (int, float, complex, bool, str, NoneType), collections (list, tuple, dict, set, frozenset, range), and binary types (bytes, bytearray, memoryview).",
    whyDoesItExist: "Types define which operations are valid, how memory is allocated, and whether instances are mutable or hashable.",
    syntax: `# Implicit casting (type promotion)
x = 5 + 2.5       # int + float -> float (7.5)

# Explicit casting (constructors)
s = int("42")
f = float("3.14")
b = bool(0)       # False`,
    basicExample: `vals = [42, 3.14, True, "Pyradox", None, [1, 2], (3, 4), {5, 6}, {"key": "val"}]
for v in vals:
    print(f"Value: {str(v):<15} Type: {type(v).__name__:<10} Truthy: {bool(v)}")`,
    stepByStepExecution: `When evaluating bool(value):
1. CPython checks if the object's class implements __bool__(). If present, calls it and expects True or False.
2. If __bool__() is absent, CPython falls back to __len__(). If __len__() returns 0, the object is falsy; if > 0, it is truthy.
3. If neither exists, the object defaults to truthy.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Explicit Type Casting",
        code: `num_str = "105"
num_int = int(num_str)
print("Cast to int:", num_int, type(num_int))
print("Cast to float:", float(num_int), type(float(num_int)))`,
        explanation: "Type constructors validate and construct new instances of the requested type."
      },
      {
        level: "Intermediate",
        title: "Truthy and Falsy Rules",
        code: `falsy_items = [0, 0.0, "", [], (), {}, set(), None, False]
for item in falsy_items:
    assert bool(item) is False
print("All default empty/zero instances evaluate to False!")`,
        explanation: "Zero numbers, empty sequences, empty mappings, None, and False are falsy."
      },
      {
        level: "Tricky",
        title: "Binary Types: bytes vs bytearray",
        code: `raw_bytes = b"Hello"
# raw_bytes[0] = 65 -> TypeError (immutable)
mutable_bytes = bytearray(b"Hello")
mutable_bytes[0] = ord('J')
print("Mutated bytearray:", mutable_bytes.decode())`,
        explanation: "bytes is immutable like str; bytearray is a mutable sequence of raw 8-bit bytes (0-255)."
      }
    ],
    commonMistakes: [
      {
        title: "Comparing with bool() incorrectly",
        wrongCode: `flag = [1, 2]
if flag == True: # Won't execute! [1, 2] does not equal 1
    print("Found items")`,
        correctCode: `flag = [1, 2]
if flag: # Uses truthy evaluation
    print("Found items")`,
        whyItFails: "'==' compares equality, and True equals 1. A non-empty list is truthy, but it does not equal 1."
      }
    ],
    importantDifferences: [
      {
        title: "Mutable vs Immutable Built-ins",
        itemA: "Immutable",
        itemB: "Mutable",
        comparison: [
          "Types: int, float, bool, str, tuple, frozenset, bytes",
          "Types: list, dict, set, bytearray",
          "Hashability: Immutable objects are hashable (can be dict keys or set elements) if their items are hashable",
          "Thread-Safety: Immutable objects can be shared safely across threads without synchronization locks"
        ]
      }
    ],
    realWorldUse: "Used in data validation (Pydantic / FastAPI schemas), serialization for network I/O, and type checking via mypy.",
    interviewPerspective: [
      {
        question: "What makes an object hashable in Python?",
        trap: "Thinking immutability automatically guarantees hashability.",
        expectedAnswer: "An object is hashable if it has a hash value that never changes during its lifetime (implements __hash__) and can be compared to other objects (implements __eq__). Note: a tuple containing a mutable list is NOT hashable."
      }
    ],
    questions: [
      {
        id: "q2_1",
        question: "Which of the following built-in objects is mutable?",
        choices: ["tuple", "frozenset", "bytearray", "str"],
        correctIndex: 2,
        hints: ["It allows in-place byte reassignment."],
        solutionCode: `b = bytearray(b'abc')\nb[0] = ord('z')\nprint(b)`,
        explanation: "bytearray is a mutable sequence of integers in the range 0 <= x < 256."
      }
    ],
    revisionSheet: [
      "Python is strongly typed: '5' + 5 raises TypeError (no silent conversion).",
      "Truthy check relies on __bool__() first, then falls back to __len__().",
      "None is a singleton of type NoneType.",
      "Tuple containing a mutable list (e.g. `([1], 2)`) cannot be used as a dictionary key."
    ],
    subtopics: [
      { id: "s2_1", text: "int", isStarred: false },
      { id: "s2_2", text: "float", isStarred: false },
      { id: "s2_3", text: "complex", isStarred: false },
      { id: "s2_4", text: "bool", isStarred: false },
      { id: "s2_5", text: "str", isStarred: false },
      { id: "s2_6", text: "NoneType", isStarred: false },
      { id: "s2_7", text: "list", isStarred: false },
      { id: "s2_8", text: "tuple", isStarred: false },
      { id: "s2_9", text: "set", isStarred: false },
      { id: "s2_10", text: "frozenset", isStarred: false },
      { id: "s2_11", text: "dict", isStarred: false },
      { id: "s2_12", text: "range", isStarred: false },
      { id: "s2_13", text: "bytes", isStarred: false },
      { id: "s2_14", text: "bytearray", isStarred: false },
      { id: "s2_15", text: "memoryview", isStarred: false },
      { id: "s2_16", text: "Type conversion", isStarred: false },
      { id: "s2_17", text: "Type casting", isStarred: false },
      { id: "s2_18", text: "Implicit conversion", isStarred: false },
      { id: "s2_19", text: "Explicit conversion", isStarred: false },
      { id: "s2_20", text: "Truthy and falsy values", isStarred: false },
      { id: "s2_21", text: "bool() behavior", isStarred: false }
    ],
    starterCode: `# 2. Python Data Types
data_samples = {
    "integer": 42,
    "float": 3.14159,
    "complex": 2 + 3j,
    "frozenset": frozenset([1, 2, 3]),
    "bytes": b"Pyradox"
}

for name, val in data_samples.items():
    print(f"{name:<12} -> {repr(val):<20} (type: {type(val).__name__})")`
  },

  // ───  
  {
    id: "numbers",
    topicNum: 3,
    title: "3. Numbers & Math",
    category: "Foundation",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §3.1.1",
    docUrl: "https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex",
    summary: "Arbitrary-precision integers, IEEE-754 floats, decimal/fractions modules, and numeric representations.",
    whatIsIt: "Python supports arbitrary-precision integers (int), double-precision floating-point numbers (float), and complex numbers (complex). The standard library also supplies the decimal and fractions modules for exact arithmetic.",
    whyDoesItExist: "To prevent integer overflow errors present in C/Java (e.g. 32-bit int overflow), while providing high-precision tools for finance and scientific mathematics.",
    syntax: `large_int = 1_000_000_000   # Numeric underscores for readability
bin_val = 0b1010             # Binary (10 in decimal)
oct_val = 0o12               # Octal (10 in decimal)
hex_val = 0xA                # Hexadecimal (10 in decimal)
c = 3 + 4j                   # Complex number`,
    basicExample: `import sys
import decimal
from fractions import Fraction

# Arbitrary precision integer
huge = 2 ** 128
print("2^128 =", huge)

# Floating point precision issue
f = 0.1 + 0.2
print("0.1 + 0.2 =", f)

# Exact financial precision
d = decimal.Decimal('0.1') + decimal.Decimal('0.2')
print("Decimal exact:", d)`,
    stepByStepExecution: `CPython internally implements integers using the PyLongObject struct:
1. Integers are stored as an array of 'digits' in base 2^30.
2. When numbers grow larger than 64 bits, CPython automatically expands the digit array dynamically. Integer overflow cannot occur in Python 3!
3. Floating point numbers are wrapped as PyFloatObject containing a 64-bit C double (IEEE 754 standard).`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Binary, Octal, and Hex Representations",
        code: `num = 42
print("Binary:", bin(num))
print("Octal:", oct(num))
print("Hexadecimal:", hex(num))`,
        explanation: "Built-in bin(), oct(), and hex() functions format integers into prefixed strings."
      },
      {
        level: "Intermediate",
        title: "Exact Rational Arithmetic with fractions.Fraction",
        code: `from fractions import Fraction

f1 = Fraction(1, 3)
f2 = Fraction(1, 6)
result = f1 + f2
print(f"1/3 + 1/6 = {result} (Float: {float(result)})")`,
        explanation: "The Fraction class stores numerator and denominator separately to eliminate floating point rounding errors."
      },
      {
        level: "Tricky",
        title: "Floating-Point Inaccuracy & Decimal Solution",
        code: `print("0.1 + 0.2 == 0.3:", 0.1 + 0.2 == 0.3)
import math
print("math.isclose:", math.isclose(0.1 + 0.2, 0.3))`,
        explanation: "Binary floating-point cannot represent 0.1 exactly. Use math.isclose() for float comparisons or Decimal for financial systems."
      }
    ],
    commonMistakes: [
      {
        title: "Using float for Financial Calculations",
        wrongCode: `price = 0.70
tax = 1.05
total = price * tax # Yields 0.7350000000000001`,
        correctCode: `from decimal import Decimal
price = Decimal('0.70')
tax = Decimal('1.05')
total = price * tax # Yields Decimal('0.7350')`,
        whyItFails: "IEEE-754 floating point rounding errors accumulate over millions of transactions, violating financial audit compliance."
      }
    ],
    importantDifferences: [
      {
        title: "float vs Decimal vs Fraction",
        itemA: "float",
        itemB: "decimal.Decimal",
        comparison: [
          "Base: Binary base-2 (IEEE 754) vs Decimal base-10",
          "Precision: 53 bits (~15-17 significant digits) vs User-configurable (default 28 digits)",
          "Performance: Fast hardware CPU execution vs Slower software implementation"
        ]
      }
    ],
    realWorldUse: "Used in cryptography (RSA big integer keys), algorithmic trading (Decimal module), and physics simulations (complex numbers).",
    interviewPerspective: [
      {
        question: "Can an integer overflow in Python 3?",
        trap: "Answering 'Yes, at 2^63 - 1'.",
        expectedAnswer: "No. Python 3 integers have arbitrary precision limited only by available system memory. In Python 2, 'int' and 'long' were separate, but Python 3 unified them."
      }
    ],
    questions: [
      {
        id: "q3_1",
        question: "Why does `0.1 + 0.2 == 0.3` return False in Python?",
        choices: [
          "Python has a bug in addition",
          "0.1 and 0.2 cannot be represented precisely in IEEE 754 base-2 floating point",
          "Python integers have higher precedence than floats",
          "The equality operator does not support float comparisons"
        ],
        correctIndex: 1,
        hints: ["Think about representing 1/10 in binary base-2."],
        solutionCode: `import math\nprint(0.1 + 0.2) # 0.30000000000000004\nprint(math.isclose(0.1 + 0.2, 0.3)) # True`,
        explanation: "In binary floating-point representation, 0.1 is an infinitely repeating fraction, leading to a small rounding error."
      }
    ],
    revisionSheet: [
      "Python 3 integers have arbitrary precision; they never overflow.",
      "Division `/` always returns a float (`6 / 2` -> `3.0`).",
      "Use `math.isclose(a, b)` for comparing floating point numbers.",
      "Use `decimal.Decimal('0.1')` (passing a string, NOT float) for exact monetary math."
    ],
    subtopics: [
      { id: "s3_1", text: "Integers", isStarred: false },
      { id: "s3_2", text: "Floating-point numbers", isStarred: false },
      { id: "s3_3", text: "Complex numbers", isStarred: false },
      { id: "s3_4", text: "Scientific notation", isStarred: false },
      { id: "s3_5", text: "Integer overflow", isStarred: false },
      { id: "s3_6", text: "Floating-point precision", isStarred: false },
      { id: "s3_7", text: "decimal", isStarred: false },
      { id: "s3_8", text: "fractions", isStarred: false },
      { id: "s3_9", text: "Number formatting", isStarred: false },
      { id: "s3_10", text: "Binary numbers", isStarred: false },
      { id: "s3_11", text: "Octal numbers", isStarred: false },
      { id: "s3_12", text: "Hexadecimal numbers", isStarred: false },
      { id: "s3_13", text: "Numeric separators", isStarred: false }
    ],
    starterCode: `# 3. Numbers & Precision
from decimal import Decimal
import math

print("Regular float 0.1 + 0.2 == 0.3:", 0.1 + 0.2 == 0.3)
print("math.isclose(0.1 + 0.2, 0.3):", math.isclose(0.1 + 0.2, 0.3))

d_result = Decimal('0.1') + Decimal('0.2')
print("Decimal result:", d_result, "== Decimal('0.3'):", d_result == Decimal('0.3'))`
  },

  // ───  
  {
    id: "operators",
    topicNum: 4,
    title: "4. Operators",
    category: "Foundation",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §6",
    docUrl: "https://docs.python.org/3/reference/expressions.html#operator-precedence",
    summary: "Arithmetic, comparison, logical, bitwise, membership, identity operators, precedence, and short-circuit evaluation.",
    whatIsIt: "Operators are special syntactic symbols that perform computations, comparisons, or logical decisions on operands.",
    whyDoesItExist: "To express algebraic, bit-level, and boolean logic succinctly while triggering specialized dunder methods (__add__, __eq__, __contains__).",
    syntax: `# Floor division // vs True division /
q = 17 // 3    # 5
r = 17 % 3     # 2

# Short circuit logical operators
res = valid and compute_expensive() # compute_expensive() only called if valid is True

# Chained comparisons
if 10 < x <= 50: # Evaluated as (10 < x) and (x <= 50)
    ...`,
    basicExample: `a, b = 15, 4
print("a / b  (float division):", a / b)
print("a // b (floor division):", a // b)
print("a % b  (modulo):", a % b)
print("a ** b (exponent):", a ** b)
print("Bitwise AND (15 & 4):", a & b)`,
    stepByStepExecution: `Short-Circuit Evaluation:
When evaluating 'A or B':
1. Python evaluates expression A.
2. If bool(A) is True, Python returns A immediately without evaluating B.
3. If bool(A) is False, Python evaluates and returns B.
Notice that 'and' and 'or' do NOT return True or False; they return the actual operand value!`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Short-Circuiting in Action",
        code: `def get_fallback():
    print("Fallback evaluated!")
    return "Default User"

user = "Alice" or get_fallback()
print("Selected user:", user) # Fallback is never called!`,
        explanation: "Because 'Alice' is truthy, 'or' short-circuits and never executes the second operand."
      },
      {
        level: "Intermediate",
        title: "Chained Comparisons",
        code: `x = 25
print("10 <= x <= 30:", 10 <= x <= 30)
# Equivalent to: (10 <= x) and (x <= 30), but x is evaluated only once`,
        explanation: "Python allows mathematical interval chaining without repetitive boolean conjunctions."
      },
      {
        level: "Tricky",
        title: "Negative Floor Division Rounding Rule",
        code: `print(" 7 // 2 =", 7 // 2)   # 3
print("-7 // 2 =", -7 // 2)  # -4 (NOT -3!)`,
        explanation: "Python floor division rounds down towards negative infinity (floor), whereas C/Java truncate towards zero."
      }
    ],
    commonMistakes: [
      {
        title: "Confusing Bitwise & with Logical 'and'",
        wrongCode: `if [1, 2] & [2, 3]: # TypeError: unsupported operand type(s) for &: 'list' and 'list'
    print("Match")`,
        correctCode: `if set([1, 2]) & set([2, 3]): # Set intersection
    print("Match")`,
        whyItFails: "'&' is bitwise AND / set intersection, while 'and' is logical short-circuit conjunction."
      }
    ],
    importantDifferences: [
      {
        title: "and/or vs &/|",
        itemA: "and / or (Logical)",
        itemB: "& / | (Bitwise)",
        comparison: [
          "Operation: Evaluates truthiness with short-circuiting vs Bitwise binary computation or set operations",
          "Returns: The operand value that resolved the evaluation vs Numeric bitmask or set result",
          "Eagerness: Lazily skips remaining operands vs Eagerly evaluates both operands"
        ]
      }
    ],
    realWorldUse: "Bitmasks in file permissions (os.stat), network subnetting, and feature flag management in high-throughput APIs.",
    interviewPerspective: [
      {
        question: "What is the return value of `'hello' or 'world'` and `[] or 'backup'`?",
        trap: "Saying it returns True or False.",
        expectedAnswer: "`'hello' or 'world'` returns `'hello'` because it is truthy. `[] or 'backup'` returns `'backup'` because `[]` is falsy."
      }
    ],
    questions: [
      {
        id: "q4_1",
        question: "What is the output of `-11 // 4` in Python 3?",
        choices: ["-2", "-3", "-2.75", "2"],
        correctIndex: 1,
        hints: ["Python floor division rounds down towards negative infinity."],
        solutionCode: `print(-11 // 4) # Output: -3`,
        explanation: "-11 / 4 is -2.75. The nearest integer rounded down towards negative infinity is -3."
      }
    ],
    revisionSheet: [
      "Floor division `//` always rounds towards negative infinity.",
      "`and` and `or` return the resolving operand itself, not a boolean True/False.",
      "Precedence: `**` > unary `+,-` > `*, /, //, %` > `+, -` > comparisons > `not` > `and` > `or`.",
      "Chained comparison `a < b < c` evaluates `b` only once."
    ],
    subtopics: [
      { id: "s4_1", text: "+", isStarred: false },
      { id: "s4_2", text: "-", isStarred: false },
      { id: "s4_3", text: "*", isStarred: false },
      { id: "s4_4", text: "/", isStarred: false },
      { id: "s4_5", text: "//", isStarred: false },
      { id: "s4_6", text: "%", isStarred: false },
      { id: "s4_7", text: "**", isStarred: false },
      { id: "s4_8", text: "==", isStarred: false },
      { id: "s4_9", text: "!=", isStarred: false },
      { id: "s4_10", text: ">", isStarred: false },
      { id: "s4_11", text: "<", isStarred: false },
      { id: "s4_12", text: ">=", isStarred: false },
      { id: "s4_13", text: "<=", isStarred: false },
      { id: "s4_14", text: "Assignment operators", isStarred: false },
      { id: "s4_15", text: "and", isStarred: false },
      { id: "s4_16", text: "or", isStarred: false },
      { id: "s4_17", text: "not", isStarred: false },
      { id: "s4_18", text: "Bitwise operators (&, |, ^, ~, <<, >>)", isStarred: false },
      { id: "s4_19", text: "in", isStarred: false },
      { id: "s4_20", text: "not in", isStarred: false },
      { id: "s4_21", text: "is", isStarred: false },
      { id: "s4_22", text: "is not", isStarred: false },
      { id: "s4_23", text: "Operator precedence", isStarred: false },
      { id: "s4_24", text: "Associativity", isStarred: false },
      { id: "s4_25", text: "Short-circuit evaluation", isStarred: false }
    ],
    starterCode: `# 4. Operators & Short-circuiting
a = []
b = "Fallback String"
c = "Primary"

print("a or b:", a or b)
print("c or b:", c or b)
print("-15 // 4:", -15 // 4)`
  },

  // ───  
  {
    id: "input-and-output",
    topicNum: 5,
    title: "5. Input & Output",
    category: "Foundation",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §7.1",
    docUrl: "https://docs.python.org/3/tutorial/inputoutput.html",
    summary: "print(), input(), sep, end, escape sequences, raw strings, f-strings, format specifiers, and alignment.",
    whatIsIt: "Standard I/O functions allow Python programs to read streams from standard input (stdin) and format output streams to standard output (stdout).",
    whyDoesItExist: "To interface with terminal users, write logs, structure CLI tools, and format reports.",
    syntax: `# Print with custom separator and line ending
print("A", "B", "C", sep=" | ", end=" --> DONE\\n")

# Modern f-strings (PEP 498) with format specifiers
val = 1234.5678
print(f"Formatted: \${val:,.2f}")  # \$1,234.57`,
    basicExample: `name = "Pyradox"
version = 3.12
print(f"System: {name} | Version: {version:.2f}")

# Alignment & Padding
for item, price in [("Server", 450.5), ("Database", 1200.0)]:
    print(f"{item:<12} | \${price:>8.2f}")`,
    stepByStepExecution: `print(*objects, sep=' ', end='\\n', file=None, flush=False):
1. Converts each object to a string by invoking its __str__() method.
2. Writes the string representations to the destination file (default sys.stdout), interspersing 'sep'.
3. Appends the 'end' character.
4. If flush=True, forces an immediate flush of the C-level I/O buffer to the terminal device.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "print() Parameters: sep and end",
        code: `print("2026", "10", "05", sep="-")
for i in range(3):
    print(i, end=" -> ")
print("END")`,
        explanation: "'sep' alters delimiters between positional arguments; 'end' overrides the default newline."
      },
      {
        level: "Intermediate",
        title: "Advanced f-String Format Specifiers",
        code: `ratio = 0.856
number = 1000000
print(f"Percentage: {ratio:.1%}")
print(f"Separator: {number:,}")
print(f"Hex: {255:#x}")
print(f"Centered: {'HELLO':^20}")`,
        explanation: "f-strings support width, alignment (<, >, ^), precision, thousands separators, and percentage formatting."
      },
      {
        level: "Tricky",
        title: "f-String Debug Syntax (f'{var=}')",
        code: `score = 98.5
status = "PASSED"
# In Python 3.8+, using '=' inside f-strings prints the expression and its value
print(f"{score=}, {status=}")`,
        explanation: "Ideal for fast debugging without redundant typing of variable names."
      }
    ],
    commonMistakes: [
      {
        title: "Expecting input() to Return an Integer",
        wrongCode: `age = input("Enter age: ")
next_year = age + 1 # TypeError: can only concatenate str to str`,
        correctCode: `age = int(input("Enter age: "))
next_year = age + 1`,
        whyItFails: "input() ALWAYS returns a string (str), regardless of what the user typed."
      }
    ],
    importantDifferences: [
      {
        title: "f-strings vs .format() vs %-formatting",
        itemA: "f-strings (PEP 498)",
        itemB: ".format() / % formatting",
        comparison: [
          "Syntax: f'{var}' (evaluated inline at runtime) vs '{0}'.format(var) or '%s' % var",
          "Performance: Faster because bytecode evaluates expressions directly vs Slower string parsing lookup",
          "Readability: High clarity, no index tracking vs Prone to argument misalignment"
        ]
      }
    ],
    realWorldUse: "Formatting CLI logs, building table displays in terminals (rich library), and generating reports.",
    interviewPerspective: [
      {
        question: "Why are f-strings faster than `%` or `.format()`?",
        trap: "Thinking they do the same string substitution under the hood.",
        expectedAnswer: "f-strings are evaluated at runtime directly as optimized BUILD_STRING or FORMAT_VALUE bytecode instructions, avoiding runtime parsing of format strings."
      }
    ],
    questions: [
      {
        id: "q5_1",
        question: "What is the output of `f'{0.456:.1%}'`?",
        choices: ["0.5%", "45.6%", "45%", "0.456%"],
        correctIndex: 1,
        hints: ["The percentage specifier '%' multiplies by 100 and adds '%' with given decimal precision."],
        solutionCode: `print(f"{0.456:.1%}") # 45.6%`,
        explanation: "The percentage format specifier multiplies by 100 and rounds to 1 decimal place."
      }
    ],
    revisionSheet: [
      "input() always returns a str; cast with int() or float() as required.",
      "print() defaults to sep=' ' and end='\\n'.",
      "f-strings support expressions: f'{2 + 2 = }' yields '2 + 2 = 4'.",
      "Use raw strings r'C:\\new\\test' to prevent escape character interpretation (e.g. \\n)."
    ],
    subtopics: [
      { id: "s5_1", text: "print()", isStarred: false },
      { id: "s5_2", text: "input()", isStarred: false },
      { id: "s5_3", text: "sep", isStarred: false },
      { id: "s5_4", text: "end", isStarred: false },
      { id: "s5_5", text: "Escape sequences", isStarred: false },
      { id: "s5_6", text: "Raw strings", isStarred: false },
      { id: "s5_7", text: "Formatting output", isStarred: false },
      { id: "s5_8", text: "f-strings", isStarred: false },
      { id: "s5_9", text: ".format()", isStarred: false },
      { id: "s5_10", text: "% formatting", isStarred: false },
      { id: "s5_11", text: "Format specification", isStarred: false },
      { id: "s5_12", text: "Alignment", isStarred: false },
      { id: "s5_13", text: "Precision", isStarred: false },
      { id: "s5_14", text: "Number formatting", isStarred: false }
    ],
    starterCode: `# 5. Input & Output
item = "Neural Engine"
accuracy = 0.98765
latency_ms = 4.2

print(f"Model: {item:<15} | Acc: {accuracy:>7.2%} | Latency: {latency_ms:.1f}ms")`
  },

  // ───  
  {
    id: "conditional-statements",
    topicNum: 6,
    title: "6. Conditional Statements",
    category: "Foundation",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §4.1",
    docUrl: "https://docs.python.org/3/tutorial/controlflow.html#if-statements",
    summary: "if, elif, else, nested conditions, ternary expressions, structural pattern matching (match/case), and guards.",
    whatIsIt: "Branching constructs that execute specific blocks of code depending on whether boolean expressions evaluate to truthy or falsy.",
    whyDoesItExist: "To route program flow, enforce validation rules, and parse structured patterns.",
    syntax: `# Standard if / elif / else
if condition_a:
    action_a()
elif condition_b:
    action_b()
else:
    default_action()

# Ternary Conditional Expression
result = "Pass" if score >= 50 else "Fail"

# Structural Pattern Matching (Python 3.10+)
match command:
    case "quit":
        exit()
    case ["move", x, y] if x > 0: # Pattern with guard
        move_to(x, y)`,
    basicExample: `age = 20
status = "Adult" if age >= 18 else "Minor"
print(f"Status: {status}")

# Pattern matching example
point = (10, 0)
match point:
    case (0, 0):
        print("At Origin")
    case (x, 0):
        print(f"On X-axis at {x}")
    case (0, y):
        print(f"On Y-axis at {y}")
    case (x, y):
        print(f"In quadrant at ({x}, {y})")`,
    stepByStepExecution: `Structural Pattern Matching (PEP 634):
1. Evaluates subject expression once.
2. Iterates case patterns sequentially.
3. Tests structure, types, and sequence lengths.
4. Binds captured variables upon successful structural match.
5. Evaluates optional 'if guard'; if guard is truthy, executes the case body and terminates matching.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Ternary Conditional Expression",
        code: `is_authenticated = True
dashboard_access = "GRANTED" if is_authenticated else "DENIED"
print("Access:", dashboard_access)`,
        explanation: "One-line conditional expressions evaluate `<true_val> if <condition> else <false_val>`."
      },
      {
        level: "Intermediate",
        title: "Guards in Pattern Matching (match/case)",
        code: `def process_http_status(status):
    match status:
        case 200 | 201:
            return "Success"
        case 400 | 404 as err:
            return f"Client Error: {err}"
        case code if 500 <= code < 600:
            return f"Server Disaster: {code}"
        case _:
            return "Unknown Status"

print(process_http_status(503))`,
        explanation: "Combines multiple matches with `|`, value aliasing with `as`, and conditional guards with `if`."
      },
      {
        level: "Tricky",
        title: "Variable Shadowing in Pattern Matching",
        code: `EXPECTED_STATUS = 200
code = 404

match code:
    case EXPECTED_STATUS: # Traps! In match/case, a bare lowercase or camel name binds, capturing the value!
        print("This always runs and rebinds EXPECTED_STATUS!")`,
        explanation: "Bare names in match/case bind captured values. To match against constants, use qualified names like `Enum.STATUS`."
      }
    ],
    commonMistakes: [
      {
        title: "Using Assignment (=) Instead of Equality (==) in Conditions",
        wrongCode: `status = "inactive"
# if status = "active":  SyntaxError in Python!
`,
        correctCode: `status = "inactive"
if status == "active":
    print("Online")`,
        whyItFails: "Unlike C/Java where `if (x = 5)` accidentally assigns and passes, Python prevents assignments inside `if` statements (unless using the walrus operator `:=`)."
      }
    ],
    importantDifferences: [
      {
        title: "if/elif vs match/case",
        itemA: "if / elif / else",
        itemB: "match / case (PEP 634)",
        comparison: [
          "Mechanism: Evaluates boolean expressions vs Destructures object shapes & types",
          "Variables: Manually accessed (`obj[0]`) vs Unpacked and bound directly (`case (x, y)`)",
          "Readability: Long branches become messy vs Clear declarative structural decomposition"
        ]
      }
    ],
    realWorldUse: "Validating API request payloads, routing commands in chatbot engines, parsing AST nodes in compilers.",
    interviewPerspective: [
      {
        question: "How does Python's `match/case` differ from a C-style `switch` statement?",
        trap: "Calling it just syntax sugar for switch.",
        expectedAnswer: "Python's `match/case` is structural pattern matching: it inspects object types, unpacks sequences and mappings, validates shape, supports guards, and binds variables—far beyond simple primitive equality switching."
      }
    ],
    questions: [
      {
        id: "q6_1",
        question: "In Python structural pattern matching, what symbol represents the wildcard default case?",
        choices: ["default", "*", "_", "else"],
        correctIndex: 2,
        hints: ["An underscore matches any subject without binding a name."],
        solutionCode: `match 99:\n    case 1: print(1)\n    case _: print("Wildcard default")`,
        explanation: "The wildcard pattern `_` acts as the default fallback case."
      }
    ],
    revisionSheet: [
      "Python does not require parentheses around `if` conditions.",
      "Ternary syntax: `X if COND else Y`.",
      "`match/case` requires Python 3.10+.",
      "Use `_` for the default/wildcard pattern in `match`."
    ],
    subtopics: [
      { id: "s6_1", text: "if", isStarred: false },
      { id: "s6_2", text: "else", isStarred: false },
      { id: "s6_3", text: "elif", isStarred: false },
      { id: "s6_4", text: "Nested conditions", isStarred: false },
      { id: "s6_5", text: "Multiple conditions", isStarred: false },
      { id: "s6_6", text: "Conditional expressions / ternary operator", isStarred: false },
      { id: "s6_7", text: "Truthy/falsy conditions", isStarred: false },
      { id: "s6_8", text: "match", isStarred: false },
      { id: "s6_9", text: "case", isStarred: false },
      { id: "s6_10", text: "Pattern matching", isStarred: false },
      { id: "s6_11", text: "Guards in pattern matching", isStarred: false }
    ],
    starterCode: `# 6. Conditional Statements & Pattern Matching
def parse_command(cmd):
    match cmd.split():
        case ["deploy", ("prod" | "staging") as env]:
            return f"Initiating deployment to {env}!"
        case ["rollback", int(version)]:
            return f"Rolling back to v{version}"
        case _:
            return "Invalid command sequence"

print(parse_command("deploy prod"))
print(parse_command("rollback 4"))`
  },

  // ───  
  {
    id: "loops",
    topicNum: 7,
    title: "7. Loops & Iteration",
    category: "Foundation",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §4.2",
    docUrl: "https://docs.python.org/3/tutorial/controlflow.html#for-statements",
    summary: "while, for-in, range(), enumerate(), zip(), break, continue, pass, nested loops, and the unique while/for...else construct.",
    whatIsIt: "Iteration constructs that repeat a block of code over sequences, iterables, or while a boolean condition remains True.",
    whyDoesItExist: "Python's `for` loop is a generalized 'for-each' iterator: it consumes the Iterator Protocol (__iter__ / __next__) without manual indexing counters.",
    syntax: `# Standard for-each loop
for item in iterable:
    ...

# Index and item together
for idx, item in enumerate(items, start=0):
    ...

# Parallel traversal
for a, b in zip(list_a, list_b):
    ...

# Loop with else block
for x in items:
    if x == target:
        break
else:
    # Runs ONLY if the loop completed without encountering 'break'
    print("Target not found")`,
    basicExample: `names = ["Alice", "Bob", "Charlie"]
scores = [92, 85, 96]

for i, (name, score) in enumerate(zip(names, scores), start=1):
    print(f"Rank {i}: {name:<10} Score: {score}")`,
    stepByStepExecution: `When executing 'for item in sequence':
1. CPython calls iter(sequence), obtaining an iterator object with an active __next__() method.
2. The VM issues the FOR_ITER opcode at each cycle.
3. If an element exists, it binds to 'item' and executes the loop body.
4. When elements are exhausted, __next__() raises StopIteration.
5. CPython catches StopIteration internally and exits the loop cleanly. If present, the 'else:' block executes now.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "enumerate() for Clean Counter Iteration",
        code: `languages = ["Python", "Go", "Rust"]
for index, lang in enumerate(languages, 1):
    print(f"{index}. {lang}")`,
        explanation: "Avoids manual `i = 0; i += 1` counter tracking."
      },
      {
        level: "Intermediate",
        title: "The for...else Search Pattern",
        code: `numbers = [2, 4, 6, 8, 10]
target = 7

for num in numbers:
    if num == target:
        print("Found target!")
        break
else:
    print("Target was not present in the sequence.")`,
        explanation: "The 'else' block executes only if the loop terminates normally without triggering 'break'."
      },
      {
        level: "Tricky",
        title: "Modifying a List While Iterating Over It",
        code: `nums = [1, 2, 3, 4, 5]
# Bug trap: mutating while iterating skips elements!
# for x in nums:
#     if x % 2 == 0:
#         nums.remove(x)

# Correct pattern: iterate over a slice copy or use comprehension
nums = [x for x in nums if x % 2 != 0]
print("Filtered list:", nums)`,
        explanation: "Mutating a collection during iteration shifts internal indices, causing items to be skipped silently."
      }
    ],
    commonMistakes: [
      {
        title: "Using range(len(seq)) Instead of enumerate()",
        wrongCode: `items = ["a", "b", "c"]
for i in range(len(items)):
    print(i, items[i]) # Unpythonic and clunky`,
        correctCode: `items = ["a", "b", "c"]
for i, val in enumerate(items):
    print(i, val)`,
        whyItFails: "Using `range(len())` is unpythonic, adds unnecessary index lookup overhead, and reduces readability."
      }
    ],
    importantDifferences: [
      {
        title: "zip() vs zip_longest()",
        itemA: "zip(a, b)",
        itemB: "itertools.zip_longest(a, b)",
        comparison: [
          "Termination: Stops at the shortest input iterable vs Continues until the longest input iterable",
          "Missing values: Truncates silently vs Fills missing positions with fillvalue (default None)",
          "Import: Built-in global vs Requires `import itertools`"
        ]
      }
    ],
    realWorldUse: "Processing database result batches, streaming lines from gigabyte-sized log files, training neural net epochs.",
    interviewPerspective: [
      {
        question: "When does the `else` block of a `for` or `while` loop execute?",
        trap: "Saying 'when the loop condition is false' (for for-loops).",
        expectedAnswer: "The loop `else` block executes when the loop completes naturally without being terminated by a `break` statement."
      }
    ],
    questions: [
      {
        id: "q7_1",
        question: "What happens if a loop executes a `break` statement with an `else:` block attached?",
        choices: [
          "The else block executes before breaking",
          "The else block is completely skipped",
          "A RuntimeError is raised",
          "The loop restarts from the beginning"
        ],
        correctIndex: 1,
        hints: ["'else' in loops means 'if no break occurred'."],
        solutionCode: `for x in [1, 2]:\n    break\nelse:\n    print("Will NOT print")`,
        explanation: "If a loop terminates via `break`, the associated `else:` block is skipped."
      }
    ],
    revisionSheet: [
      "Use `enumerate(seq, start=1)` instead of maintaining manual index variables.",
      "Use `zip(a, b)` for simultaneous parallel iteration.",
      "`break` exits the nearest enclosing loop.",
      "`continue` skips immediately to the next iteration.",
      "`pass` is a syntactic null-statement placeholder."
    ],
    subtopics: [
      { id: "s7_1", text: "Basic while", isStarred: false },
      { id: "s7_2", text: "Infinite loops", isStarred: false },
      { id: "s7_3", text: "Loop conditions", isStarred: false },
      { id: "s7_4", text: "while ... else", isStarred: false },
      { id: "s7_5", text: "Basic for", isStarred: false },
      { id: "s7_6", text: "Iterating lists", isStarred: false },
      { id: "s7_7", text: "Iterating strings", isStarred: false },
      { id: "s7_8", text: "Iterating dictionaries", isStarred: false },
      { id: "s7_9", text: "range()", isStarred: false },
      { id: "s7_10", text: "enumerate()", isStarred: false },
      { id: "s7_11", text: "zip()", isStarred: false },
      { id: "s7_12", text: "break", isStarred: false },
      { id: "s7_13", text: "continue", isStarred: false },
      { id: "s7_14", text: "pass", isStarred: false },
      { id: "s7_15", text: "else with loops", isStarred: false },
      { id: "s7_16", text: "Nested loops", isStarred: false }
    ],
    starterCode: `# 7. Loops: enumerate, zip & loop-else
tasks = ["Data Ingestion", "Feature Extraction", "Model Training"]
status = ["Done", "Done", "In Progress"]

for i, (t, s) in enumerate(zip(tasks, status), 1):
    print(f"[{i}] {t:<20} -> {s}")`
  }
];
