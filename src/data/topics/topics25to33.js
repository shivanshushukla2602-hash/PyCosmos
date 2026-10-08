// Topics 25 to 33: Python Internals, Memory, Types, Dataclasses, Regex, Stdlib, JSON, DB, APIs
// 25. Python Data Model, 26. Memory Management, 27. Type Hints, 28. Dataclasses,
// 29. Regex, 30. Standard Library, 31. JSON & Serialization, 32. Database Programming, 33. Networking & APIs

export const TOPICS_25_TO_33 = [
  // ───  
  {
    id: "python-data-model",
    topicNum: 25,
    title: "25. Python Data Model",
    category: "Python Internals",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §3",
    docUrl: "https://docs.python.org/3/reference/datamodel.html",
    summary: "Everything is an object, PyObject header, dunder methods, operator overloading, descriptor protocol (__get__, __set__), and __slots__.",
    whatIsIt: "The Python Data Model is the formal specification describing the API that user-defined classes must implement to integrate with the Python language syntax (arithmetic operators, indexing, slicing, iteration, context managers).",
    whyDoesItExist: "To provide a unified, predictable object interface ('protocols') where user-defined objects behave identically to built-in types without special-casing.",
    syntax: `# Custom sequence protocol:
class CustomSequence:
    def __len__(self):
        return len(self._items)
    def __getitem__(self, index):
        return self._items[index]

# Memory optimization via __slots__:
class Point:
    __slots__ = ('x', 'y') # Suppresses default __dict__!
    def __init__(self, x, y):
        self.x = x
        self.y = y`,
    basicExample: `class Polynomial:
    def __init__(self, *coeffs):
        self.coeffs = coeffs

    def __repr__(self):
        return "Poly" + str(self.coeffs)

    def __add__(self, other):
        return Polynomial(*(a + b for a, b in zip(self.coeffs, other.coeffs)))

p1 = Polynomial(1, 2, 3)
p2 = Polynomial(4, 5, 6)
print("p1 + p2 =", p1 + p2)`,
    stepByStepExecution: `CPython PyObject Memory Layout:
1. In CPython, EVERY object starts with a \'PyObject\' header:
   - \'ob_refcnt\': 64-bit integer tracking reference count.
   - \'ob_type\': Pointer to the object's type struct (\'PyTypeObject\').
2. When you invoke \'len(x)\', CPython does not inspect properties; it looks up \'x->ob_type->tp_as_sequence->sq_length\'.
3. If \'__slots__\' is defined on a class, CPython allocates a fixed C array of pointers instead of a dynamic \'__dict__\', reducing object memory by up to 60%.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Emulating Sequences (__len__ and __getitem__)",
        code: `class Deck:
    ranks = [str(n) for n in range(2, 11)] + list('JQKA')
    suits = ['spades', 'diamonds', 'clubs', 'hearts']

    def __init__(self):
        self._cards = [(r, s) for s in self.suits for r in self.ranks]

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, position):
        return self._cards[position]

deck = Deck()
print("Deck length:", len(deck))
print("First card:", deck[0])
print("Slicing works automatically:", deck[:3])`,
        explanation: "By implementing just `__len__` and `__getitem__`, Python provides slicing, iteration, and `in` membership for free!"
      },
      {
        level: "Intermediate",
        title: "The Descriptor Protocol (__get__, __set__)",
        code: `class PositiveInteger:
    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, instance, owner):
        if instance is None: return self
        return instance.__dict__.get(self.name, 0)

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError(f"{self.name} must be positive!")
        instance.__dict__[self.name] = value

class Product:
    price = PositiveInteger()
    quantity = PositiveInteger()

p = Product()
p.price = 250
p.quantity = 10
print(f"Product: price=\${p.price}, qty={p.quantity}")`,
        explanation: "Descriptors are the foundation behind `@property`, `@classmethod`, `@staticmethod`, and ORM field validations."
      },
      {
        level: "Tricky",
        title: "Memory Saving with __slots__",
        code: `import sys

class RegularPoint:
    def __init__(self, x, y):
        self.x, self.y = x, y

class SlottedPoint:
    __slots__ = ('x', 'y')
    def __init__(self, x, y):
        self.x, self.y = x, y

reg = RegularPoint(1, 2)
slotted = SlottedPoint(1, 2)

print("Has __dict__:", hasattr(reg, '__dict__'), "vs", hasattr(slotted, '__dict__'))
# Slotted instances use significantly less RAM in collections of millions of objects`,
        explanation: "`__slots__` prevents the creation of an instance dictionary, locking down attribute keys to save memory."
      }
    ],
    commonMistakes: [
      {
        title: "Overriding __eq__ Without Overriding __hash__",
        wrongCode: `class User:
    def __init__(self, uid): self.uid = uid
    def __eq__(self, other): return self.uid == other.uid
# In Python 3, defining __eq__ automatically sets __hash__ to None!
# u = User(1); s = {u} -> TypeError: unhashable type: 'User'`,
        correctCode: `class User:
    def __init__(self, uid): self.uid = uid
    def __eq__(self, other): return self.uid == other.uid
    def __hash__(self): return hash(self.uid)`,
        whyItFails: "If objects compare equal, their hash values MUST be equal. To prevent broken hash tables, Python unsets `__hash__` when `__eq__` is overridden."
      }
    ],
    importantDifferences: [
      {
        title: "__getattr__ vs __getattribute__",
        itemA: "__getattr__(self, name)",
        itemB: "__getattribute__(self, name)",
        comparison: [
          "Invocation: Called ONLY when the attribute was NOT found in normal lookups vs Called UNCONDITIONALLY for every single attribute access",
          "Risk: Safe and easy to use vs High risk of infinite recursion (must delegate to super().__getattribute__)",
          "Use case: Fallbacks, proxies, dynamic attributes vs Deep instrumentation, profilers, trace logs"
        ]
      }
    ],
    realWorldUse: "Building ORM layers (SQLAlchemy / Django ORM), PyTorch tensor overloading, Pydantic data validation.",
    interviewPerspective: [
      {
        question: "How do Python descriptors work and where are they used in Python?",
        trap: "Thinking descriptors are only `@property`.",
        expectedAnswer: "A descriptor is any object that defines `__get__`, `__set__`, or `__delete__`. Descriptors power `@property`, methods (binding `self`), `@classmethod`, `@staticmethod`, and ORM database columns."
      }
    ],
    questions: [
      {
        id: "q25_1",
        question: "What does defining `__slots__` on a class eliminate to save memory?",
        choices: ["__init__", "The instance `__dict__`", "Inheritance", "Methods"],
        correctIndex: 1,
        hints: ["Instances normally store dynamic attributes in a dictionary."],
        solutionCode: `class A: __slots__ = ('x',)\na = A()`,
        explanation: "`__slots__` suppresses the automatic creation of the per-instance `__dict__` dictionary, reducing memory overhead."
      }
    ],
    revisionSheet: [
      "Everything in Python is an object, starting with a PyObject header.",
      "Protocols are implemented by defining dunder methods (`__len__`, `__getitem__`).",
      "Overriding `__eq__` sets `__hash__ = None` unless explicitly defined.",
      "`__slots__` reduces memory usage when instantiating millions of objects."
    ],
    subtopics: [
      { id: "s25_1", text: "Everything is an object", isStarred: false },
      { id: "s25_2", text: "Object identity", isStarred: false },
      { id: "s25_3", text: "Object type", isStarred: false },
      { id: "s25_4", text: "Object value", isStarred: false },
      { id: "s25_5", text: "References", isStarred: false },
      { id: "s25_6", text: "Mutability", isStarred: false },
      { id: "s25_7", text: "Attribute lookup", isStarred: false },
      { id: "s25_8", text: "Special methods", isStarred: false },
      { id: "s25_9", text: "Dunder methods", isStarred: false },
      { id: "s25_10", text: "Operator overloading", isStarred: false },
      { id: "s25_11", text: "Descriptor protocol", isStarred: false },
      { id: "s25_12", text: "__getattribute__", isStarred: false },
      { id: "s25_13", text: "__getattr__", isStarred: false },
      { id: "s25_14", text: "__setattr__", isStarred: false },
      { id: "s25_15", text: "__slots__", isStarred: false }
    ],
    starterCode: `# 25. Python Data Model: Custom Protocols
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    def __repr__(self):
        return f"{self.celsius:.1f}°C"

    def __eq__(self, other):
        return self.celsius == other.celsius

    def __lt__(self, other):
        return self.celsius < other.celsius

temps = [Temperature(28.5), Temperature(14.0), Temperature(32.1)]
print("Sorted temps:", sorted(temps))`
  },

  // ───  
  {
    id: "memory-management",
    topicNum: 26,
    title: "26. Memory Management",
    category: "Python Internals",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §1.1 Memory",
    docUrl: "https://docs.python.org/3/c-api/memory.html",
    summary: "Stack vs Heap, reference counting, cyclic garbage collection (gc module), object interning, and memory leak diagnosis.",
    whatIsIt: "Python manages memory automatically using a private heap allocator (PyMalloc), reference counting for deterministic deallocation, and a generational cyclic garbage collector for reference cycles.",
    whyDoesItExist: "To free developers from manual malloc/free errors (segmentation faults, memory corruption, use-after-free) while preventing leaks.",
    syntax: `import sys
import gc

# Check reference count:
count = sys.getrefcount(obj) - 1 # Adjusted for getrefcount argument

# Cyclic Garbage Collector controls:
gc.collect()           # Force manual collection
gc.disable()           # Disable automatic cyclic collection
gc.get_count()         # Current generation counts (gen0, gen1, gen2)`,
    basicExample: `import sys
import gc

class Node:
    def __init__(self, val):
        self.val = val
        self.neighbor = None

# Reference cycle
a = Node("A")
b = Node("B")
a.neighbor = b
b.neighbor = a

del a
del b
# Ref counts are not zero due to cycle!
collected = gc.collect()
print("Cyclic objects collected by GC:", collected)`,
    stepByStepExecution: `CPython Memory Management Architecture:
1. PyMalloc: Allocator managing small objects (<= 512 bytes) using Arenas (256 KB), Pools (4 KB), and Blocks.
2. Reference Counting:
   - Every object's header tracks \'ob_refcnt\'.
   - When \'ob_refcnt\' hits 0, memory is returned immediately.
3. Generational Cyclic GC:
   - Divides objects into 3 generations (Gen 0: new objects, Gen 1: survived, Gen 2: long-lived).
   - Traverses container pointers (lists, dicts, custom objects) to detect and isolate unreachable circular reference islands.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Reference Counting Lifecycle with sys.getrefcount",
        code: `import sys

data = [1, 2, 3]
print("Initial refcount:", sys.getrefcount(data) - 1) # 1

alias = data
print("After alias:", sys.getrefcount(data) - 1)       # 2

del alias
print("After del alias:", sys.getrefcount(data) - 1)   # 1`,
        explanation: "`sys.getrefcount()` increments the count by 1 temporarily while holding the argument pointer."
      },
      {
        level: "Intermediate",
        title: "String Interning with sys.intern",
        code: `import sys

# Dynamic strings constructed at runtime are not always interned
s1 = sys.intern("very_long_custom_identifier_string")
s2 = sys.intern("very_long_custom_identifier_string")

print("s1 is s2 (Same memory address):", s1 is s2)`,
        explanation: "Interned strings are stored in a global string table, making string comparisons O(1) pointer checks."
      },
      {
        level: "Tricky",
        title: "Weak References with weakref",
        code: `import weakref

class CacheItem:
    def __init__(self, key):
        self.key = key

item = CacheItem("heavy_tensor")
# Weak reference does NOT increment reference count:
weak_item = weakref.ref(item)

print("Before del:", weak_item())
del item
print("After del:", weak_item()) # None! Automatically cleared`,
        explanation: "Weak references allow building in-memory caches without preventing garbage collection of unused objects."
      }
    ],
    commonMistakes: [
      {
        title: "Accidental Global Caches Causing Memory Leaks",
        wrongCode: `GLOBAL_CACHE = []
def process_request(data):
    GLOBAL_CACHE.append(data) # Never cleared, causes continuous RAM growth!`,
        correctCode: `from collections import deque
# Bounded queue or weakref cache
GLOBAL_CACHE = deque(maxlen=1000)`,
        whyItFails: "Because global references never leave scope, their reference counts never drop to zero, causing an out-of-memory crash over time."
      }
    ],
    importantDifferences: [
      {
        title: "Reference Counting vs Cyclic GC",
        itemA: "Reference Counting",
        itemB: "Cyclic Garbage Collector",
        comparison: [
          "Mechanism: Immediate, deterministic deallocation upon hitting 0 vs Periodic generational sweep",
          "Handles: All linear references vs Specifically resolves circular references (A -> B -> A)",
          "Overhead: Incremented/decremented on every pointer write vs Periodic CPU scan of Gen 0/1/2"
        ]
      }
    ],
    realWorldUse: "Tuning machine learning data loaders, debugging high-concurrency microservice memory spikes, avoiding circular reference leaks in long-running daemons.",
    interviewPerspective: [
      {
        question: "How does Python detect and collect circular reference memory leaks?",
        trap: "Thinking Python cannot collect cycles.",
        expectedAnswer: "CPython uses a generational cyclic garbage collector. It inspects container objects, tracks trial reference counts by subtracting internal container references, and identifies unreachable subgraphs where references only point to each other. Those isolated subgraphs are collected."
      }
    ],
    questions: [
      {
        id: "q26_1",
        question: "What is Python's primary (immediate) memory management mechanism?",
        choices: ["Mark and Sweep GC", "Reference Counting", "Manual free()", "Copying Collector"],
        correctIndex: 1,
        hints: ["Every object has an `ob_refcnt` header."],
        solutionCode: `import sys\nprint(sys.getrefcount(object()))`,
        explanation: "Python's primary memory management is reference counting. Generational cyclic GC runs as a secondary safeguard."
      }
    ],
    revisionSheet: [
      "Python primarily frees memory via Reference Counting immediately when refcount = 0.",
      "The secondary cyclic GC handles circular references (`gc.collect()`).",
      "CPython interns small integers (-5 to 256) and identifier strings.",
      "Use `weakref` for caches that should not keep objects alive."
    ],
    subtopics: [
      { id: "s26_1", text: "Stack vs heap concept", isStarred: false },
      { id: "s26_2", text: "Python object model", isStarred: false },
      { id: "s26_3", text: "References", isStarred: false },
      { id: "s26_4", text: "Reference counting", isStarred: false },
      { id: "s26_5", text: "Garbage collector", isStarred: false },
      { id: "s26_6", text: "Cyclic references", isStarred: false },
      { id: "s26_7", text: "gc module", isStarred: false },
      { id: "s26_8", text: "Object interning", isStarred: false },
      { id: "s26_9", text: "Integer caching", isStarred: false },
      { id: "s26_10", text: "String interning", isStarred: false },
      { id: "s26_11", text: "Shallow copy", isStarred: false },
      { id: "s26_12", text: "Deep copy", isStarred: false },
      { id: "s26_13", text: "copy module", isStarred: false }
    ],
    starterCode: `# 26. Memory Management & Garbage Collector
import gc
import sys

print("GC generation counts:", gc.get_count())
print("GC thresholds:", gc.get_threshold())`
  },

  // ───  
  {
    id: "type-hints",
    topicNum: 27,
    title: "27. Type Hints",
    category: "Python Internals",
    level: "Advanced",
    stars: "Core",
    docRefTag: "PEP 484 & PEP 604",
    docUrl: "https://docs.python.org/3/library/typing.html",
    summary: "Type annotations, typing module, Union/Optional, modern | pipe syntax, Generics, TypeVar, Protocols, and mypy static checking.",
    whatIsIt: "Type hints (PEP 484) allow developers to annotate variables, function parameters, and return types with static types.",
    whyDoesItExist: "To document APIs, enable IDE autocompletion, prevent production bugs via static type checkers (mypy, pyright), and power runtime serialization frameworks (Pydantic, FastAPI).",
    syntax: `# Modern Python 3.10+ union syntax:
def fetch_user(user_id: int) -> dict[str, str] | None:
    ...

# Generic Protocol (Structural Subtyping):
from typing import Protocol

class Renderable(Protocol):
    def render(self) -> str: ...`,
    basicExample: `from typing import TypeAlias

UserId: TypeAlias = int

def get_profile(uid: UserId) -> dict[str, str | int]:
    return {"id": uid, "username": f"user_{uid}", "status": 200}

print(get_profile(101))`,
    stepByStepExecution: `Type Hints at Runtime:
1. Python does NOT enforce type hints at runtime by default: calling \'get_profile("invalid")\' executes without TypeError in standard Python!
2. Annotations are stored in the function's \'__annotations__\' dictionary attribute.
3. Tools like \'mypy\' analyze code before execution.
4. Libraries like Pydantic inspect \'__annotations__\' at runtime to validate and coerce incoming payloads.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Modern Union (|) and Optional Types",
        code: `# Python 3.10+ modern syntax replaces Union[str, int] and Optional[str]
def format_id(id_val: int | str, prefix: str | None = None) -> str:
    p = prefix if prefix is not None else "ID"
    return f"{p}:{id_val}"

print(format_id(42))
print(format_id("ABC", "DEV"))`,
        explanation: "The `|` syntax (PEP 604) is cleaner and eliminates importing `Union` or `Optional`."
      },
      {
        level: "Intermediate",
        title: "Generics with TypeVar",
        code: `from typing import TypeVar, Sequence

T = TypeVar("T")

def first_element(seq: Sequence[T]) -> T | None:
    return seq[0] if seq else None

num = first_element([10, 20, 30])    # Inferred as int
name = first_element(["A", "B", "C"]) # Inferred as str
print(f"Num: {num}, Name: {name}")`,
        explanation: "`TypeVar` preserves type relationships between input parameters and return types."
      },
      {
        level: "Tricky",
        title: "Protocol for Duck-Typed Static Checking",
        code: `from typing import Protocol

class Greeter(Protocol):
    def greet(self) -> str: ...

class Human:
    def greet(self) -> str: return "Hello there!"

class Robot:
    def greet(self) -> str: return "01001000"

def broadcast(entity: Greeter) -> None:
    print("Broadcast:", entity.greet())

broadcast(Human())
broadcast(Robot())`,
        explanation: "Protocols (PEP 544) enable static type checkers to verify duck typing without requiring explicit subclassing."
      }
    ],
    commonMistakes: [
      {
        title: "Assuming Type Hints Enforce Runtime Types",
        wrongCode: `def square(x: int) -> int:
    return x * x
# Running square("5") will NOT raise a TypeError at runtime!
# Type hints are purely annotations unless checked by mypy or Pydantic.`,
        correctCode: `# Use Pydantic or manual runtime checks if runtime validation is required`,
        whyItFails: "Python runtime ignores type annotations during normal execution."
      }
    ],
    importantDifferences: [
      {
        title: "Protocol vs ABC (Abstract Base Class)",
        itemA: "Protocol (typing.Protocol)",
        itemB: "ABC (abc.ABC)",
        comparison: [
          "Typing system: Structural subtyping (duck typing verified statically) vs Nominal subtyping (requires explicit class inheritance)",
          "Coupling: Classes do not need to import or subclass the Protocol vs Classes must explicitly inherit from the ABC",
          "Verification: mypy checks interface compatibility vs Python enforces method implementation at runtime"
        ]
      }
    ],
    realWorldUse: "FastAPI request/response models, Pydantic data schemas, building enterprise libraries with strict mypy CI checks.",
    interviewPerspective: [
      {
        question: "Does Python enforce type annotations at runtime?",
        trap: "Saying 'Yes, it throws a TypeError if types mismatch'.",
        expectedAnswer: "No. Python remains dynamically typed at runtime. Type hints are metadata stored in `__annotations__` for static analysis tools (mypy) and frameworks (Pydantic/FastAPI) to inspect."
      }
    ],
    questions: [
      {
        id: "q27_1",
        question: "What is the modern (Python 3.10+) syntax for `Optional[str]`?",
        choices: ["str?", "str | None", "Nullable[str]", "maybe(str)"],
        correctIndex: 1,
        hints: ["Use the union pipe operator with None."],
        solutionCode: `val: str | None = None`,
        explanation: "In Python 3.10+, `str | None` replaces `Optional[str]` via PEP 604 union syntax."
      }
    ],
    revisionSheet: [
      "Type hints do not enforce types at runtime in standard Python.",
      "Use `int | str` instead of `Union[int, str]` in Python 3.10+.",
      "Use `typing.Protocol` for static duck typing.",
      "Run `mypy script.py` to statically verify type correctness."
    ],
    subtopics: [
      { id: "s27_1", text: "Type annotations", isStarred: false },
      { id: "s27_2", text: "Variable annotations", isStarred: false },
      { id: "s27_3", text: "Function annotations", isStarred: false },
      { id: "s27_4", text: "typing", isStarred: false },
      { id: "s27_5", text: "Any", isStarred: false },
      { id: "s27_6", text: "Union", isStarred: false },
      { id: "s27_7", text: "Optional", isStarred: false },
      { id: "s27_8", text: "Literal", isStarred: false },
      { id: "s27_9", text: "TypeVar", isStarred: false },
      { id: "s27_10", text: "Generic", isStarred: false },
      { id: "s27_11", text: "Callable", isStarred: false },
      { id: "s27_12", text: "Iterable", isStarred: false },
      { id: "s27_13", text: "Iterator", isStarred: false },
      { id: "s27_14", text: "Sequence", isStarred: false },
      { id: "s27_15", text: "Mapping", isStarred: false },
      { id: "s27_16", text: "TypedDict", isStarred: false },
      { id: "s27_17", text: "Protocol", isStarred: false },
      { id: "s27_18", text: "Type aliases", isStarred: false },
      { id: "s27_19", text: "Modern | union syntax", isStarred: false },
      { id: "s27_20", text: "Static type checking", isStarred: false },
      { id: "s27_21", text: "mypy concepts", isStarred: false }
    ],
    starterCode: `# 27. Modern Type Hints (Python 3.10+)
def serialize_metric(name: str, value: int | float, tags: list[str] | None = None) -> dict[str, str | float]:
    return {
        "metric": name,
        "val": float(value),
        "tags": ",".join(tags or [])
    }

print(serialize_metric("cpu_load", 78.4, ["core0", "prod"]))`
  },

  // ───  
  {
    id: "dataclasses",
    topicNum: 28,
    title: "28. Dataclasses",
    category: "Python Internals",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Docs §PEP 557",
    docUrl: "https://docs.python.org/3/library/dataclasses.html",
    summary: "@dataclass, field(), default_factory, frozen dataclasses (immutability), ordering, and post-init processing.",
    whatIsIt: "Dataclasses (PEP 557) provide a class decorator that automatically generates boilerplate dunder methods (`__init__`, `__repr__`, `__eq__`, `__hash__`, `__lt__`) from type-annotated class attributes.",
    whyDoesItExist: "To eliminate tedious manual `__init__` assignments (`self.a = a; self.b = b; self.c = c`), provide rich string representations, and support immutable data records.",
    syntax: `from dataclasses import dataclass, field

@dataclass(frozen=True, order=True)
class ServiceNode:
    name: str
    port: int = 8080
    tags: list[str] = field(default_factory=list, compare=False)`,
    basicExample: `from dataclasses import dataclass

@dataclass
class UserSession:
    user_id: str
    email: str
    role: str = "Learner"

session1 = UserSession("U101", "alex@pyradox.dev")
session2 = UserSession("U101", "alex@pyradox.dev")

print(session1) # Automatic pretty __repr__!
print("Equality check:", session1 == session2) # Automatic __eq__!`,
    stepByStepExecution: `How @dataclass Works Internally:
1. The decorator inspects \'cls.__annotations__\'.
2. It synthesizes Python code strings for \'__init__\', \'__repr__\', and \'__eq__\'.
3. It compiles those methods via \'exec()\' into code objects and binds them to the class dictionary.
4. If \'frozen=True\', it overrides \'__setattr__\' to raise \'FrozenInstanceError\' upon mutation attempts, and generates \'__hash__\'.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "default_factory for Mutable Attributes",
        code: `from dataclasses import dataclass, field

@dataclass
class ShoppingCart:
    owner: str
    # NEVER use items: list = [] in dataclasses! Use default_factory:
    items: list[str] = field(default_factory=list)

c1 = ShoppingCart("Alice")
c1.items.append("Python Book")
c2 = ShoppingCart("Bob")
print("Bob's cart remains empty:", c2.items)`,
        explanation: "Dataclasses strictly disallow mutable defaults like `[]` or `{}` and mandate `field(default_factory=list)`."
      },
      {
        level: "Intermediate",
        title: "Validation in __post_init__",
        code: `from dataclasses import dataclass

@dataclass
class Percentage:
    value: float

    def __post_init__(self):
        if not (0.0 <= self.value <= 100.0):
            raise ValueError(f"Percentage must be in 0-100 range, got {self.value}")

p = Percentage(88.5)
print("Valid percentage:", p.value)`,
        explanation: "`__post_init__` executes immediately after the synthesized `__init__` finishes, allowing validation."
      },
      {
        level: "Tricky",
        title: "Frozen Dataclasses as Hashable Dict Keys",
        code: `from dataclasses import dataclass

@dataclass(frozen=True)
class ConfigKey:
    env: str
    service: str

# Because frozen=True, Python generates __hash__() matching __eq__()
cache = {ConfigKey("prod", "auth"): "https://auth.prod.internal"}
print("Lookup:", cache[ConfigKey("prod", "auth")])`,
        explanation: "Frozen dataclasses are immutable and hashable, making them safe for sets and dictionary keys."
      }
    ],
    commonMistakes: [
      {
        title: "Using Mutable Default Directly (ValueError)",
        wrongCode: `@dataclass
class Team:
    members: list = [] # ValueError: mutable default <class 'list'> is not allowed!`,
        correctCode: `@dataclass
class Team:
    members: list = field(default_factory=list)`,
        whyItFails: "Dataclasses catch mutable default arguments at definition time to prevent shared-state bugs."
      }
    ],
    importantDifferences: [
      {
        title: "Dataclass vs Pydantic BaseModel",
        itemA: "dataclass (Standard Library)",
        itemB: "Pydantic (External)",
        comparison: [
          "Runtime validation: None by default (unless manual in __post_init__) vs Automatic runtime coercion and validation",
          "Dependencies: Zero external dependencies vs Requires `pydantic` package",
          "Performance: Fast instantiation vs Slightly higher overhead for parsing"
        ]
      }
    ],
    realWorldUse: "Transfer objects in microservices, configuration objects, event messaging payloads.",
    interviewPerspective: [
      {
        question: "Why does `@dataclass` forbid `field: list = []`?",
        trap: "Thinking it's a general syntax error.",
        expectedAnswer: "It prevents the classic Python mutable default argument trap where a single list is shared across every instance of the class. Instead, dataclasses require `field(default_factory=list)`."
      }
    ],
    questions: [
      {
        id: "q28_1",
        question: "How do you specify an empty list as a default value in a dataclass?",
        choices: ["items: list = []", "items: list = field(default_factory=list)", "items: list = list()", "items: list = None"],
        correctIndex: 1,
        hints: ["Use `field()` with a factory callable."],
        solutionCode: `from dataclasses import dataclass, field\n@dataclass\nclass A: items: list = field(default_factory=list)`,
        explanation: "Dataclasses require `field(default_factory=list)` to avoid sharing a single mutable list instance across objects."
      }
    ],
    revisionSheet: [
      "`@dataclass` auto-generates `__init__`, `__repr__`, `__eq__`.",
      "Use `field(default_factory=list)` for mutable defaults.",
      "Use `__post_init__` for custom validation and initialization.",
      "`@dataclass(frozen=True)` creates immutable, hashable instances."
    ],
    subtopics: [
      { id: "s28_1", text: "dataclass", isStarred: false },
      { id: "s28_2", text: "Fields", isStarred: false },
      { id: "s28_3", text: "Default values", isStarred: false },
      { id: "s28_4", text: "field()", isStarred: false },
      { id: "s28_5", text: "Frozen dataclasses", isStarred: false },
      { id: "s28_6", text: "Ordering", isStarred: false },
      { id: "s28_7", text: "Post initialization", isStarred: false },
      { id: "s28_8", text: "Dataclass vs normal class", isStarred: false },
      { id: "s28_9", text: "Dataclass vs dictionary", isStarred: false }
    ],
    starterCode: `# 28. Dataclasses
from dataclasses import dataclass, field

@dataclass(order=True)
class PriorityTask:
    priority: int
    name: str = field(compare=False)

tasks = [PriorityTask(3, "Update Docs"), PriorityTask(1, "Fix Critical Bug"), PriorityTask(2, "Refactor Core")]
print("Sorted tasks:", sorted(tasks))`
  },

  // ─── 29. Regular Expressions ────────────────────────────────────────────────
  {
    id: "regular-expressions",
    topicNum: 29,
    title: "29. Regular Expressions",
    category: "Standard Library",
    level: "Intermediate",
    stars: "",
    docRefTag: "Docs §re",
    docUrl: "https://docs.python.org/3/library/re.html",
    summary: "re module, character classes, anchors, quantifiers, capturing groups, named groups, raw regex strings, and regex flags.",
    whatIsIt: "Regular expressions (regex) are formal pattern-matching strings used to search, validate, and manipulate text strings via the `re` module.",
    whyDoesItExist: "To perform complex string searching, email/phone validation, token parsing, and text substitutions that simple string methods cannot achieve.",
    syntax: `import re

# Always use raw strings r"..." to prevent Python escape character parsing!
pattern = re.compile(r"^(\\w+)@([\\w\\.]+)\\.([a-z]{2,})$", re.IGNORECASE)
match = pattern.match("user@pyradox.io")
if match:
    username, domain, tld = match.groups()`,
    basicExample: `import re

log_line = "2026-10-05 [ERROR] Connection refused on port 8080"
# Named capturing groups (?P<name>pattern)
pattern = r"(?P<date>\\d{4}-\\d{2}-\\d{2}) \\[(?P<level>[A-Z]+)\\] (?P<msg>.*)"

m = re.match(pattern, log_line)
if m:
    print("Log dictionary:", m.groupdict())`,
    stepByStepExecution: `CPython re (SRE Engine) Architecture:
1. When you compile a regex, CPython parses the pattern into an Abstract Syntax Tree of regex opcodes.
2. The SRE engine compiles this to bytecode interpreted by a backtracking NFA (Nondeterministic Finite Automaton).
3. Pre-compiling via \'re.compile()\' caches the compiled regex object, saving CPU cycles when called repeatedly in loops.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "search() vs match() vs fullmatch()",
        code: `import re

text = "Error 404: Page Not Found"
print("search (anywhere):", bool(re.search(r"\\d{3}", text)))
print("match (at start only):", bool(re.match(r"\\d{3}", text)))
print("fullmatch (entire string):", bool(re.fullmatch(r"\\d{3}", "404")))`,
        explanation: "`match()` only matches at the beginning of the string; `search()` scans the entire string; `fullmatch()` requires the entire string to match."
      },
      {
        level: "Intermediate",
        title: "re.sub with a Replacement Function",
        code: `import re

text = "Prices: \$10, \$25, \$100"
# Dynamic replacement via callable:
def apply_discount(match):
    val = int(match.group(1))
    return f"\${val * 0.8:.0f}"

discounted = re.sub(r"\\$(\\d+)", apply_discount, text)
print("Discounted:", discounted)`,
        explanation: "`re.sub()` accepts a callback function that receives the Match object for custom dynamic replacements."
      },
      {
        level: "Tricky",
        title: "Greedy vs Non-Greedy (Lazy) Quantifiers",
        code: `import re

html = "<div>First</div><div>Second</div>"
greedy = re.findall(r"<div>.*</div>", html)
lazy = re.findall(r"<div>.*?</div>", html)

print("Greedy (matches to last </div>):", greedy)
print("Lazy (matches to nearest </div>):", lazy)`,
        explanation: "Adding `?` after a quantifier (`*?`, `+?`) makes it non-greedy, matching as few characters as possible."
      }
    ],
    commonMistakes: [
      {
        title: "Forgetting the Raw String Prefix (r'...')",
        wrongCode: `pattern = "\\d+\\s+\\w+" # Backslashes can be eaten by Python string escapes!`,
        correctCode: `pattern = r"\\d+\\s+\\w+" # Raw string preserves literal backslashes`,
        whyItFails: "Without `r`, Python interprets escape sequences (like `\\b` for backspace) before the regex engine even sees them."
      }
    ],
    importantDifferences: [
      {
        title: "re.match() vs re.search()",
        itemA: "re.match()",
        itemB: "re.search()",
        comparison: [
          "Anchor: Matches ONLY from the first character of the string (implicit `^`) vs Searches anywhere in the string",
          "Returns: Match if starting character matches vs Match at the first occurrence anywhere in the string"
        ]
      }
    ],
    realWorldUse: "Log parsing, email and phone number validation, scraping web content, sanitizing user inputs.",
    interviewPerspective: [
      {
        question: "What is catastrophic backtracking in regular expressions and how do you avoid it?",
        trap: "Assuming regex is always linear O(N).",
        expectedAnswer: "Catastrophic backtracking occurs when nested quantifiers (e.g. `(a+)+$`) cause the regex engine to explore an exponential number of permutations when matching fails, freezing the CPU (ReDoS attack). Prevent it by avoiding nested quantifiers, using atomic groups, or validating input length first."
      }
    ],
    questions: [
      {
        id: "q29_1",
        question: "How do you make a regex quantifier non-greedy (lazy)?",
        choices: ["Add `!`", "Add `?`", "Add `$`", "Wrap in parentheses"],
        correctIndex: 1,
        hints: ["`.*?` is non-greedy."],
        solutionCode: `import re\nre.findall(r'<.*?>', '<p>text</p>')`,
        explanation: "Appending `?` to a quantifier (`*?`, `+?`, `{n,m}?`) makes it lazy/non-greedy."
      }
    ],
    revisionSheet: [
      "Always write regexes with raw string literals: `r'\\d+'`.",
      "`re.search()` searches anywhere; `re.match()` checks only from the start.",
      "Use `(?P<name>pattern)` for named capturing groups.",
      "Pre-compile patterns with `re.compile()` inside high-throughput loops."
    ],
    subtopics: [
      { id: "s29_1", text: "What is regex?", isStarred: false },
      { id: "s29_2", text: "re module", isStarred: false },
      { id: "s29_3", text: "Character classes", isStarred: false },
      { id: "s29_4", text: "Quantifiers", isStarred: false },
      { id: "s29_5", text: "Anchors", isStarred: false },
      { id: "s29_6", text: "Groups", isStarred: false },
      { id: "s29_7", text: "Capturing groups", isStarred: false },
      { id: "s29_8", text: "Non-capturing groups", isStarred: false },
      { id: "s29_9", text: "Named groups", isStarred: false },
      { id: "s29_10", text: "search()", isStarred: false },
      { id: "s29_11", text: "match()", isStarred: false },
      { id: "s29_12", text: "fullmatch()", isStarred: false },
      { id: "s29_13", text: "findall()", isStarred: false },
      { id: "s29_14", text: "finditer()", isStarred: false },
      { id: "s29_15", text: "split()", isStarred: false },
      { id: "s29_16", text: "sub()", isStarred: false },
      { id: "s29_17", text: "Raw regex strings", isStarred: false },
      { id: "s29_18", text: "Regex flags", isStarred: false }
    ],
    starterCode: `# 29. Regular Expressions
import re

text = "Contact support at help@pyradox.io or billing@corp.org"
emails = re.findall(r"[\\w\\.-]+@[\\w\\.-]+\\.[a-z]{2,}", text)
print("Found emails:", emails)`
  },

  // ───  
  {
    id: "important-standard-library",
    topicNum: 30,
    title: "30. Standard Library",
    category: "Standard Library",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs Library Ref",
    docUrl: "https://docs.python.org/3/library/",
    summary: "collections (Counter, defaultdict, deque), itertools (chain, cycle, permutations), functools, datetime, math, random, and subprocess.",
    whatIsIt: "Python's standard library ('Batteries Included') provides an extensive collection of battle-tested modules for data structures, iteration, math, system interaction, and date handling.",
    whyDoesItExist: "To solve recurring engineering problems efficiently without third-party dependencies, maintaining high performance written in optimized C.",
    syntax: `from collections import Counter, defaultdict, deque
from itertools import chain, product, combinations
from datetime import datetime, timedelta
import subprocess`,
    basicExample: `from collections import Counter, defaultdict
from itertools import chain

# Word frequency counting in 1 line
words = ["python", "ai", "python", "cloud", "ai", "python"]
counts = Counter(words)
print("Top word:", counts.most_common(1))

# Defaultdict with list factory
grouped = defaultdict(list)
grouped["backend"].append("FastAPI")
print("Grouped:", dict(grouped))`,
    stepByStepExecution: `collections.deque C-Level Ring Buffer:
1. A Python \'list\' is a dynamic array; inserting or popping at index 0 requires O(N) memory copying.
2. \'collections.deque\' is implemented in C as a doubly linked list of fixed-size blocks (62 items per block).
3. Appending and popping from BOTH ends (\'appendleft\', \'popleft\', \'append\', \'pop\') operates in guaranteed O(1) time.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "datetime and timedelta Calculations",
        code: `from datetime import datetime, timedelta

now = datetime.now()
expiry = now + timedelta(days=7, hours=2)
print("Created at:", now.strftime("%Y-%m-%d %H:%M"))
print("Expires at:", expiry.strftime("%Y-%m-%d %H:%M"))`,
        explanation: "timedelta performs arithmetic operations on datetime objects cleanly."
      },
      {
        level: "Intermediate",
        title: "itertools Combinatorics: product and combinations",
        code: `from itertools import product, combinations

# Cartesian product (nested loop replacement):
suits = ['Spades', 'Hearts']
ranks = ['A', 'K']
deck = list(product(ranks, suits))
print("Cards:", deck)

# Combinations (order does not matter):
team = list(combinations(["Alice", "Bob", "Charlie"], 2))
print("Pairs:", team)`,
        explanation: "itertools provides memory-efficient, C-optimized iteration primitives."
      },
      {
        level: "Tricky",
        title: "subprocess.run Safe Process Execution",
        code: `import subprocess

# Safe execution without shell=True (prevents command injection)
res = subprocess.run(["python3", "--version"], capture_output=True, text=True)
print("Subprocess stdout:", res.stdout.strip())`,
        explanation: "Never use `shell=True` with unvalidated user input to avoid shell injection vulnerabilities."
      }
    ],
    commonMistakes: [
      {
        title: "Using list as a Queue Instead of collections.deque",
        wrongCode: `q = []
q.append(item)
task = q.pop(0) # O(N) SLOW! Shifts all pointers on every pop`,
        correctCode: `from collections import deque
q = deque()
q.append(item)
task = q.popleft() # O(1) FAST!`,
        whyItFails: "popping from index 0 of a list scales quadratically O(N^2) as queue size increases."
      }
    ],
    importantDifferences: [
      {
        title: "list vs collections.deque",
        itemA: "list",
        itemB: "collections.deque",
        comparison: [
          "Memory structure: Contiguous dynamic array vs Doubly-linked blocks of items",
          "pop(0) / insert(0): O(N) linear time vs O(1) constant time (`popleft()`)",
          "Random access (get [i]): O(1) instant pointer indexing vs O(N) traversing middle nodes"
        ]
      }
    ],
    realWorldUse: "Sliding window rate limiters (deque), token frequency analysis in NLP (Counter), job scheduling.",
    interviewPerspective: [
      {
        question: "When would you choose `collections.deque` over a standard Python `list`?",
        trap: "Saying deque is always faster than list.",
        expectedAnswer: "Use `deque` when you need FIFO queues or double-ended queues requiring O(1) appends and pops from both ends. Use `list` when you need fast O(1) random indexing access or slice operations."
      }
    ],
    questions: [
      {
        id: "q30_1",
        question: "What is the time complexity of `popleft()` on a `collections.deque`?",
        choices: ["O(1)", "O(N)", "O(log N)", "O(N^2)"],
        correctIndex: 0,
        hints: ["It is a doubly-linked structure optimized for both ends."],
        solutionCode: `from collections import deque\nq = deque([1, 2]); q.popleft()`,
        explanation: "`collections.deque` performs appends and pops from both ends in O(1) constant time."
      }
    ],
    revisionSheet: [
      "`collections.Counter` counts item frequencies instantly.",
      "`collections.deque` is the standard tool for FIFO queues (O(1) popleft).",
      "`itertools.chain` chains multiple iterables without copying.",
      "Use `datetime.timezone.utc` for timezone-aware timestamps."
    ],
    subtopics: [
      { id: "s30_1", text: "math", isStarred: false },
      { id: "s30_2", text: "random", isStarred: false },
      { id: "s30_3", text: "datetime", isStarred: false },
      { id: "s30_4", text: "collections", isStarred: false },
      { id: "s30_5", text: "itertools", isStarred: false },
      { id: "s30_6", text: "functools", isStarred: false },
      { id: "s30_7", text: "os", isStarred: false },
      { id: "s30_8", text: "sys", isStarred: false },
      { id: "s30_9", text: "pathlib", isStarred: false },
      { id: "s30_10", text: "subprocess", isStarred: false }
    ],
    starterCode: `# 30. Standard Library: Counter & itertools
from collections import Counter
from itertools import combinations

team = ["Dev1", "Dev2", "Dev3", "Dev4"]
pairs = list(combinations(team, 2))
print(f"Total pair combinations ({len(pairs)}):", pairs)`
  },

  // ─── 31. JSON & Serialization ───────────────────────────────────────────────
  {
    id: "json-and-serialization",
    topicNum: 31,
    title: "31. JSON & Serialization",
    category: "Standard Library",
    level: "Intermediate",
    stars: "",
    docRefTag: "Docs §json & §pickle",
    docUrl: "https://docs.python.org/3/library/json.html",
    summary: "JSON formatting, json.dumps/loads, json.dump/load (file I/O), custom encoders, pickle, and critical pickle security vulnerabilities.",
    whatIsIt: "Serialization converts in-memory Python objects into byte streams or text formats (JSON, Pickle) for transmission over networks or storage on disk.",
    whyDoesItExist: "To interface with REST APIs, store application state in databases, and cache serialized models.",
    syntax: `import json

# Object -> JSON String
json_str = json.dumps(data, indent=2)

# JSON String -> Object
data = json.loads(json_str)

# File read/write directly:
with open("data.json", "w") as f:
    json.dump(data, f)
with open("data.json", "r") as f:
    data = json.load(f)`,
    basicExample: `import json

payload = {
    "app": "Pyradox",
    "version": 3.12,
    "features": ["Auth", "Curriculum", "Playground"],
    "active": True,
    "meta": None
}

encoded = json.dumps(payload, indent=2)
print("Serialized JSON:\\n", encoded)
decoded = json.loads(encoded)
print("Decoded app name:", decoded["app"])`,
    stepByStepExecution: `Type Mapping Between Python and JSON:
- dict <---> Object
- list, tuple <---> Array
- str <---> String
- int, float <---> Number
- True / False <---> true / false
- None <---> null
Note: Sets, tuples, datetime objects, and custom classes do not map to JSON natively and require a custom JSONEncoder!`,
    multipleExamples: [
      {
        level: "Simple",
        title: "json.dump vs json.dumps ('s' is for String)",
        code: `import json
# json.dumps() -> dumps to STRING
s = json.dumps({"key": "value"})

# json.dump() -> dumps to FILE STREAM
# with open("out.json", "w") as f: json.dump({"key": "value"}, f)
print("Dumped string:", s)`,
        explanation: "`dumps`/`loads` work with strings in memory; `dump`/`load` read/write directly to file streams."
      },
      {
        level: "Intermediate",
        title: "Custom JSONEncoder for Datetime & Decimals",
        code: `import json
from datetime import datetime
from decimal import Decimal

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

data = {"timestamp": datetime.now(), "price": Decimal("99.95")}
print(json.dumps(data, cls=CustomEncoder))`,
        explanation: "Subclassing `json.JSONEncoder` enables custom serialization for unsupported types."
      },
      {
        level: "Tricky",
        title: "Pickle Security Warning (Remote Code Execution)",
        code: `import pickle
# NEVER unpickle untrusted data!
# Pickle executes arbitrary bytecode during deserialization (__reduce__).
# Always prefer JSON, msgpack, or Protocol Buffers for untrusted network payloads.`,
        explanation: "Unpickling untrusted data allows attackers to execute arbitrary system shell commands."
      }
    ],
    commonMistakes: [
      {
        title: "Attempting to JSON-Serialize a Set or datetime",
        wrongCode: `import json
# json.dumps({"tags": {"python", "ai"}}) -> TypeError: Object of type set is not JSON serializable`,
        correctCode: `import json
# Convert sets to lists or supply custom encoder:
json.dumps({"tags": list({"python", "ai"})})`,
        whyItFails: "JSON standard has no specification for set or datetime types."
      }
    ],
    importantDifferences: [
      {
        title: "JSON vs Pickle",
        itemA: "JSON",
        itemB: "Pickle",
        comparison: [
          "Format: Plain text (UTF-8) human-readable vs Binary Python-specific format",
          "Security: Safe to parse from untrusted sources vs Dangerous (allows arbitrary code execution)",
          "Portability: Universal across all programming languages vs Python-only"
        ]
      }
    ],
    realWorldUse: "Configuring REST APIs, storing document records in MongoDB/PostgreSQL JSONB, saving model weights.",
    interviewPerspective: [
      {
        question: "Why should you never use `pickle` to deserialize data received from untrusted clients?",
        trap: "Believing it only causes memory corruption.",
        expectedAnswer: "Pickle is an executable virtual machine. When deserializing, it calls the `__reduce__` method, which can instantiate any callable—including `os.system('rm -rf /')` or opening a reverse shell—leading to complete remote code execution."
      }
    ],
    questions: [
      {
        id: "q31_1",
        question: "What does Python's `None` serialize to in JSON?",
        choices: ["None", "null", "undefined", "empty string"],
        correctIndex: 1,
        hints: ["JSON standard representation of missing value."],
        solutionCode: `import json\nprint(json.dumps(None)) # 'null'`,
        explanation: "Python's `None` maps to JSON `null`."
      }
    ],
    revisionSheet: [
      "`json.dumps()` returns a string; `json.dump()` writes to a file.",
      "`json.loads()` parses a string; `json.load()` reads from a file.",
      "Sets and datetime objects require custom serialization handlers.",
      "NEVER unpickle untrusted data (severe RCE vulnerability)."
    ],
    subtopics: [
      { id: "s31_1", text: "JSON structure", isStarred: false },
      { id: "s31_2", text: "JSON vs Python dictionary", isStarred: false },
      { id: "s31_3", text: "json.dumps()", isStarred: false },
      { id: "s31_4", text: "json.loads()", isStarred: false },
      { id: "s31_5", text: "json.dump()", isStarred: false },
      { id: "s31_6", text: "json.load()", isStarred: false },
      { id: "s31_7", text: "Serialization", isStarred: false },
      { id: "s31_8", text: "Deserialization", isStarred: false },
      { id: "s31_9", text: "Pickle", isStarred: false },
      { id: "s31_10", text: "Security concerns with pickle", isStarred: false }
    ],
    starterCode: `# 31. JSON Serialization
import json

telemetry = {
    "node_id": "EDGE-99",
    "cpu_percent": 45.2,
    "services": ["auth", "redis", "nginx"],
    "healthy": True
}

json_payload = json.dumps(telemetry, indent=2)
print(json_payload)`
  },

  // ─── 32. Database Programming ───────────────────────────────────────────────
  {
    id: "database-programming",
    topicNum: 32,
    title: "32. Database Programming",
    category: "Standard Library",
    level: "Intermediate",
    stars: "",
    docRefTag: "Docs §sqlite3 & PEP 249",
    docUrl: "https://docs.python.org/3/library/sqlite3.html",
    summary: "Python Database API (PEP 249), sqlite3, connections, cursors, parameterized queries (SQL injection prevention), transactions, and ORMs.",
    whatIsIt: "Python Database API (DB-API 2.0 / PEP 249) defines a standard interface for connecting to relational databases (SQLite, PostgreSQL, MySQL).",
    whyDoesItExist: "To provide a uniform API across database drivers, enforce parameterized query security against SQL injection, and manage database transactions (commit/rollback).",
    syntax: `import sqlite3

# Connect to in-memory database
with sqlite3.connect(":memory:") as conn:
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE users (id INT, name TEXT)")
    # ALWAYS use parameterized queries (?, not f-strings!)
    cursor.execute("INSERT INTO users VALUES (?, ?)", (1, "Shivansh"))
    conn.commit()`,
    basicExample: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE metrics (id INTEGER PRIMARY KEY, name TEXT, val REAL)")

# Bulk insertion
records = [("cpu", 45.0), ("mem", 82.5), ("disk", 61.2)]
cur.executemany("INSERT INTO metrics (name, val) VALUES (?, ?)", records)
conn.commit()

cur.execute("SELECT name, val FROM metrics WHERE val > ?", (50.0,))
for row in cur.fetchall():
    print("High metric:", row)
conn.close()`,
    stepByStepExecution: `Database Transaction Lifecycle in sqlite3:
1. When \'connect()\' is called, sqlite3 automatically starts a transaction before any DML statement (INSERT/UPDATE/DELETE).
2. Changes are written to the database journal or WAL (Write-Ahead Log) file.
3. \'conn.commit()\' persists changes permanently to the database file.
4. If an exception occurs, \'conn.rollback()\' discards pending journal changes, restoring database integrity.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Row Factory for Dictionary-like Access",
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row # Enables column access by name!
cur = conn.cursor()
cur.execute("CREATE TABLE users (id INT, email TEXT)")
cur.execute("INSERT INTO users VALUES (?, ?)", (101, "alex@pyradox.dev"))

row = cur.execute("SELECT * FROM users WHERE id = 101").fetchone()
print(f"User email: {row['email']} (ID: {row['id']})")
conn.close()`,
        explanation: "`conn.row_factory = sqlite3.Row` allows accessing query columns by name like a dictionary."
      },
      {
        level: "Intermediate",
        title: "Preventing SQL Injection with Parameterized Queries",
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE accounts (username TEXT, balance INT)")
cur.execute("INSERT INTO accounts VALUES ('admin', 50000)")

malicious_input = "' OR '1'='1"
# SECURE: Database engine treats input purely as literal data
cur.execute("SELECT * FROM accounts WHERE username = ?", (malicious_input,))
print("Secure query matched rows:", len(cur.fetchall())) # 0 matches!`,
        explanation: "Parameterized placeholders `?` prevent user input from breaking out of string literals into SQL commands."
      },
      {
        level: "Tricky",
        title: "Context Manager for Automatic Commit & Rollback",
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
with conn:
    # Operations inside this block auto-commit on exit,
    # or automatically ROLLBACK if an unhandled exception occurs!
    conn.execute("CREATE TABLE ledger (amount INT)")
    conn.execute("INSERT INTO ledger VALUES (100)")
print("Auto-committed successfully!")`,
        explanation: "`with conn:` manages transactions, automatically issuing COMMIT or ROLLBACK."
      }
    ],
    commonMistakes: [
      {
        title: "Using f-strings for SQL Queries (SQL Injection Vulnerability)",
        wrongCode: `cur.execute(f"SELECT * FROM users WHERE username = '{user_input}'") # CATASTROPHIC SQL INJECTION!`,
        correctCode: `cur.execute("SELECT * FROM users WHERE username = ?", (user_input,)) # Parameterized`,
        whyItFails: "String formatting allows malicious users to inject SQL commands (`admin' --`), bypassing authentication."
      }
    ],
    importantDifferences: [
      {
        title: "Raw SQL (sqlite3) vs ORM (SQLAlchemy)",
        itemA: "Raw SQL / DB-API",
        itemB: "ORM (SQLAlchemy)",
        comparison: [
          "Abstraction: Direct SQL queries as text strings vs Python classes representing database tables",
          "Portability: Dialect-dependent SQL vs Database-agnostic query generation",
          "Control: Maximum raw SQL optimization vs Developer velocity and automated migrations"
        ]
      }
    ],
    realWorldUse: "Local desktop databases, caching embedded data, server backend database persistence with PostgreSQL / MySQL.",
    interviewPerspective: [
      {
        question: "Why should you never concatenate strings into SQL queries?",
        trap: "Only answering 'it can cause errors'.",
        expectedAnswer: "String concatenation leads directly to SQL injection vulnerabilities. Parameterized queries separate the SQL command structure from user data at the database engine protocol level, ensuring input cannot alter query execution."
      }
    ],
    questions: [
      {
        id: "q32_1",
        question: "What placeholder syntax is used for parameterized queries in standard `sqlite3`?",
        choices: ["?", "%s", ":val", "$1"],
        correctIndex: 0,
        hints: ["It is a single question mark."],
        solutionCode: `cur.execute("SELECT * FROM t WHERE id = ?", (1,))`,
        explanation: "The standard parameter placeholder for sqlite3 is `?`."
      }
    ],
    revisionSheet: [
      "Always use parameterized queries (`?`) to prevent SQL injection.",
      "Use `conn.row_factory = sqlite3.Row` for dictionary-style column access.",
      "Use `with conn:` to auto-commit on success and rollback on exceptions.",
      "Remember to close cursors and database connections when done."
    ],
    subtopics: [
      { id: "s32_1", text: "Database concepts", isStarred: false },
      { id: "s32_2", text: "SQLite", isStarred: false },
      { id: "s32_3", text: "sqlite3", isStarred: false },
      { id: "s32_4", text: "Connection", isStarred: false },
      { id: "s32_5", text: "Cursor", isStarred: false },
      { id: "s32_6", text: "SQL execution", isStarred: false },
      { id: "s32_7", text: "Parameterized queries", isStarred: false },
      { id: "s32_8", text: "Transactions", isStarred: false },
      { id: "s32_9", text: "Commit", isStarred: false },
      { id: "s32_10", text: "Rollback", isStarred: false },
      { id: "s32_11", text: "Fetching data", isStarred: false },
      { id: "s32_12", text: "ORM concept", isStarred: false },
      { id: "s32_13", text: "SQLAlchemy basics", isStarred: false },
      { id: "s32_14", text: "Connecting Python with MySQL", isStarred: false }
    ],
    starterCode: `# 32. Database Programming with sqlite3
import sqlite3

with sqlite3.connect(":memory:") as conn:
    conn.row_factory = sqlite3.Row
    conn.execute("CREATE TABLE servers (id INT, hostname TEXT, status TEXT)")
    conn.execute("INSERT INTO servers VALUES (?, ?, ?)", (1, "web-01.pyradox", "ACTIVE"))
    
    row = conn.execute("SELECT * FROM servers WHERE id = ?", (1,)).fetchone()
    print("Server record:", dict(row))`
  },

  // ───  
  {
    id: "networking-and-apis",
    topicNum: 33,
    title: "33. Networking & APIs",
    category: "Standard Library",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §urllib & requests",
    docUrl: "https://docs.python.org/3/library/urllib.request.html",
    summary: "HTTP methods (GET, POST, PUT, DELETE), status codes, headers, authentication, query parameters, and API integration with requests/urllib.",
    whatIsIt: "Networking in Python enables communication over TCP/IP protocols and interacting with RESTful web APIs over HTTP/HTTPS.",
    whyDoesItExist: "To integrate microservices, consume third-party SaaS APIs, query cloud services, and build distributed systems.",
    syntax: `# Standard urllib approach (zero dependencies):
import urllib.request
import json

req = urllib.request.Request(
    "https://api.github.com/zen",
    headers={"User-Agent": "PyradoxApp/1.0"}
)
with urllib.request.urlopen(req) as resp:
    data = resp.read().decode("utf-8")`,
    basicExample: `import urllib.request
import json

# Request headers and timeout
url = "https://httpbin.org/get"
req = urllib.request.Request(url, headers={"Accept": "application/json"})

try:
    with urllib.request.urlopen(req, timeout=5) as response:
        print("Status code:", response.status)
        payload = json.loads(response.read().decode("utf-8"))
        print("Origin IP:", payload.get("origin"))
except Exception as e:
    print("Network call failed:", e)`,
    stepByStepExecution: `HTTP Request/Response Cycle:
1. DNS Resolution: Resolves hostname to an IP address.
2. TCP Handshake: 3-way handshake establishing a reliable socket connection.
3. TLS Negotiation: Negotiates encryption ciphers and validates server certificates.
4. HTTP Payload: Sends HTTP method, path, headers, and request body.
5. Response: Parses status code, response headers, and streams the body.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "HTTP Status Code Categorization",
        code: `status_codes = {
    200: "OK (Success)",
    201: "Created (Resource saved)",
    400: "Bad Request (Client error)",
    401: "Unauthorized (Authentication required)",
    404: "Not Found",
    500: "Internal Server Error"
}
for code, desc in status_codes.items():
    print(f"HTTP {code}: {desc}")`,
        explanation: "1xx: Info, 2xx: Success, 3xx: Redirection, 4xx: Client Error, 5xx: Server Error."
      },
      {
        level: "Intermediate",
        title: "Bearer Token Authentication",
        code: `api_token = "secret_jwt_token_here"
headers = {
    "Authorization": f"Bearer {api_token}",
    "Content-Type": "application/json"
}
print("Constructed Auth Header:", headers["Authorization"][:15] + "...")`,
        explanation: "Standard REST APIs authenticate via the `Authorization: Bearer <TOKEN>` HTTP header."
      },
      {
        level: "Tricky",
        title: "Always Enforce Timeouts on Network Calls",
        code: `# Bug trap: urllib and requests WITHOUT timeouts can hang indefinitely!
# Always specify timeout:
# requests.get(url, timeout=(3.05, 27)) # Connect timeout, read timeout`,
        explanation: "Failing to set timeouts causes thread exhaustion when remote servers experience outages."
      }
    ],
    commonMistakes: [
      {
        title: "Omitting Timeouts on HTTP Requests",
        wrongCode: `import urllib.request
# urllib.request.urlopen("https://flaky-server.com") # HANGS INDEFINITELY!`,
        correctCode: `urllib.request.urlopen("https://flaky-server.com", timeout=5)`,
        whyItFails: "Without a timeout, socket connections block indefinitely if packets drop, causing server threads to deadlock."
      }
    ],
    importantDifferences: [
      {
        title: "urllib.request vs requests (Third-party)",
        itemA: "urllib (Standard Library)",
        itemB: "requests (Third-party)",
        comparison: [
          "Install: Built-in, zero dependencies vs Requires `pip install requests`",
          "API design: Verbose, requires manual decode/JSON parsing vs Human-friendly (`r.json()`, `r.status_code`)",
          "Session/Keep-Alive: Manual connection pooling vs Automatic connection reuse via `requests.Session()`"
        ]
      }
    ],
    realWorldUse: "Calling OpenAI/Claude LLM APIs, webhooks, microservice RPC, payment gateway integrations (Stripe).",
    interviewPerspective: [
      {
        question: "Explain the difference between PUT and PATCH HTTP methods.",
        trap: "Thinking they are identical update methods.",
        expectedAnswer: "`PUT` is idempotent and replaces the ENTIRE resource document with the new payload. `PATCH` applies a partial update, modifying only the specific fields provided in the payload."
      }
    ],
    questions: [
      {
        id: "q33_1",
        question: "Which HTTP status code range represents client-side errors?",
        choices: ["2xx", "3xx", "4xx", "5xx"],
        correctIndex: 2,
        hints: ["404 Not Found, 401 Unauthorized, 403 Forbidden."],
        solutionCode: `# 4xx = Client Errors`,
        explanation: "4xx status codes indicate client-side errors (e.g. 400 Bad Request, 404 Not Found)."
      }
    ],
    revisionSheet: [
      "Always configure explicit `timeout` on every network call.",
      "2xx = Success, 3xx = Redirect, 4xx = Client error, 5xx = Server error.",
      "Use `Authorization: Bearer <TOKEN>` for API key authentication.",
      "POST is for creation; PUT replaces entire resource; PATCH updates partially."
    ],
    subtopics: [
      { id: "s33_1", text: "HTTP basics", isStarred: false },
      { id: "s33_2", text: "Request/response", isStarred: false },
      { id: "s33_3", text: "HTTP methods", isStarred: false },
      { id: "s33_4", text: "Status codes", isStarred: false },
      { id: "s33_5", text: "REST APIs", isStarred: false },
      { id: "s33_6", text: "JSON APIs", isStarred: false },
      { id: "s33_7", text: "requests", isStarred: false },
      { id: "s33_8", text: "GET", isStarred: false },
      { id: "s33_9", text: "POST", isStarred: false },
      { id: "s33_10", text: "PUT", isStarred: false },
      { id: "s33_11", text: "PATCH", isStarred: false },
      { id: "s33_12", text: "DELETE", isStarred: false },
      { id: "s33_13", text: "Headers", isStarred: false },
      { id: "s33_14", text: "Parameters", isStarred: false },
      { id: "s33_15", text: "Request body", isStarred: false },
      { id: "s33_16", text: "Authentication", isStarred: false },
      { id: "s33_17", text: "API keys", isStarred: false },
      { id: "s33_18", text: "Error handling", isStarred: false },
      { id: "s33_19", text: "API integration", isStarred: false }
    ],
    starterCode: `# 33. Networking & Headers
headers = {
    "User-Agent": "PyradoxClient/3.12",
    "Accept": "application/json",
    "Authorization": "Bearer pyx_live_auth_token"
}

for k, v in headers.items():
    print(f"{k:<15}: {v}")`
  }
];
