// Topics 8 to 16: Core Data Structures, Functions, and Iteration
// 8. Strings, 9. Lists, 10. Tuples, 11. Sets, 12. Dictionaries, 13. Functions, 14. Functional, 15. Iterators & Generators, 16. Comprehensions

export const TOPICS_08_TO_16 = [
  // ───  
  {
    id: "strings",
    topicNum: 8,
    title: "8. Strings",
    category: "Core Data Structures",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §3.1.2",
    docUrl: "https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str",
    summary: "Unicode strings, immutability, slicing, string methods, encoding/decoding (str vs bytes), and join performance.",
    whatIsIt: "A Python string (str) is an immutable sequence of Unicode code points (characters). Every text character in Python 3 natively supports UTF-8 / Unicode standards.",
    whyDoesItExist: "To provide robust, internationalized text processing without encoding nightmares, while optimizing memory via PEP 393 flexible string representations.",
    syntax: `# Slicing: [start:stop:step]
s = "Pyradox Platform"
sub = s[0:7]       # "Pyradox"
rev = s[::-1]      # Reverse string

# String methods
words = s.split(" ")
joined = "-".join(words)`,
    basicExample: `text = "  python architecture  "
cleaned = text.strip().title()
print("Cleaned string:", cleaned)
print("Reversed:", cleaned[::-1])
print("Starts with 'Py':", cleaned.startswith("Py"))
print("Total words:", len(cleaned.split()))`,
    stepByStepExecution: `CPython PEP 393 String Representation:
1. Python inspects the maximum Unicode character code point in the string:
   - 1-byte (Latin-1 / ASCII: 0-255)
   - 2-byte (UCS-2: 256-65535)
   - 4-byte (UCS-4: full Unicode / emojis)
2. Memory is allocated compactly based on that maximum character, saving up to 75% memory compared to uniform 4-byte allocations.
3. Because strings are immutable, operations like s += 'a' create a new PyUnicodeObject rather than modifying in-place.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "String Slicing with Negative Indices and Steps",
        code: `word = "DEVELOPER"
print("First 3 chars:", word[:3])
print("Last 3 chars:", word[-3:])
print("Every 2nd char:", word[::2])
print("Reversed string:", word[::-1])`,
        explanation: "Negative indexing counts backwards from the end (-1 is the last character)."
      },
      {
        level: "Intermediate",
        title: "str vs bytes: Encoding and Decoding",
        code: `text = "Café au Lait (Python \u03c0)"
# Encode string to raw bytes via UTF-8
byte_stream = text.encode("utf-8")
print("Byte stream:", byte_stream)
print("Byte length:", len(byte_stream), "vs Char length:", len(text))

# Decode bytes back to Unicode string
restored = byte_stream.decode("utf-8")
assert restored == text`,
        explanation: "str represents abstract Unicode characters; bytes represents raw octets (8-bit bytes)."
      },
      {
        level: "Tricky",
        title: "Efficient Concatenation: join() vs + in Loops",
        code: `parts = [f"item_{i}" for i in range(1000)]
# Fast O(N) approach:
result = ", ".join(parts)
print("Joined length:", len(result))`,
        explanation: "Repeated string concatenation `s += item` creates quadratic O(N^2) memory copies. `str.join()` calculates total memory upfront and executes in linear O(N) time."
      }
    ],
    commonMistakes: [
      {
        title: "Attempting In-Place String Mutation",
        wrongCode: `msg = "Hello"
msg[0] = "J" # TypeError: 'str' object does not support item assignment`,
        correctCode: `msg = "Hello"
msg = "J" + msg[1:] # Creates a new string`,
        whyItFails: "Strings are strictly immutable in Python to ensure hash stability and thread safety."
      }
    ],
    importantDifferences: [
      {
        title: "find() vs index()",
        itemA: "str.find(sub)",
        itemB: "str.index(sub)",
        comparison: [
          "Not found: Returns -1 vs Raises ValueError",
          "Best practice: Use when substring might be absent vs Use when substring is guaranteed or handled via try-except"
        ]
      }
    ],
    realWorldUse: "NLP tokenization, parsing JSON/HTML streams, sanitizing web inputs, and formatting SQL queries.",
    interviewPerspective: [
      {
        question: "Why are strings immutable in Python?",
        trap: "Only mentioning 'so they cannot be changed'.",
        expectedAnswer: "Immutability allows strings to be hashable (safe for dict keys and set elements), enables thread-safe memory sharing without locks, and allows string interning optimizations."
      }
    ],
    questions: [
      {
        id: "q8_1",
        question: "What does `'Python'[::-1]` return?",
        choices: ["'Python'", "'nohtyP'", "IndexError", "None"],
        correctIndex: 1,
        hints: ["A step of -1 traverses backwards from end to start."],
        solutionCode: `print('Python'[::-1]) # 'nohtyP'`,
        explanation: "Slicing with `step = -1` and omitted start/stop produces a reversed copy of the string."
      }
    ],
    revisionSheet: [
      "Strings are immutable sequences of Unicode characters.",
      "Always use `', '.join(list_of_strings)` for building strings in loops.",
      "`s.strip()` removes leading and trailing whitespace.",
      "`encode()` converts str -> bytes; `decode()` converts bytes -> str."
    ],
    subtopics: [
      { id: "s8_1", text: "Creating strings", isStarred: false },
      { id: "s8_2", text: "Single/double/triple quotes", isStarred: false },
      { id: "s8_3", text: "String indexing", isStarred: false },
      { id: "s8_4", text: "String slicing", isStarred: false },
      { id: "s8_5", text: "Negative indexing", isStarred: false },
      { id: "s8_6", text: "String immutability", isStarred: false },
      { id: "s8_7", text: "String concatenation", isStarred: false },
      { id: "s8_8", text: "String repetition", isStarred: false },
      { id: "s8_9", text: "Membership", isStarred: false },
      { id: "s8_10", text: "Iterating strings", isStarred: false },
      { id: "s8_11", text: "Escape characters", isStarred: false },
      { id: "s8_12", text: "Raw strings", isStarred: false },
      { id: "s8_13", text: "Unicode", isStarred: false },
      { id: "s8_14", text: "ASCII", isStarred: false },
      { id: "s8_15", text: "str vs bytes", isStarred: false },
      { id: "s8_16", text: "Encoding", isStarred: false },
      { id: "s8_17", text: "Decoding", isStarred: false },
      { id: "s8_18", text: "String searching", isStarred: false },
      { id: "s8_19", text: "find()", isStarred: false },
      { id: "s8_20", text: "index()", isStarred: false },
      { id: "s8_21", text: "count()", isStarred: false },
      { id: "s8_22", text: "startswith()", isStarred: false },
      { id: "s8_23", text: "endswith()", isStarred: false },
      { id: "s8_24", text: "Splitting", isStarred: false },
      { id: "s8_25", text: "Joining", isStarred: false },
      { id: "s8_26", text: "split()", isStarred: false },
      { id: "s8_27", text: "rsplit()", isStarred: false },
      { id: "s8_28", text: "splitlines()", isStarred: false },
      { id: "s8_29", text: "join()", isStarred: false },
      { id: "s8_30", text: "Replacing", isStarred: false },
      { id: "s8_31", text: "replace()", isStarred: false },
      { id: "s8_32", text: "Translation", isStarred: false },
      { id: "s8_33", text: "translate()", isStarred: false },
      { id: "s8_34", text: "maketrans()", isStarred: false },
      { id: "s8_35", text: "Case conversion", isStarred: false },
      { id: "s8_36", text: "upper()", isStarred: false },
      { id: "s8_37", text: "lower()", isStarred: false },
      { id: "s8_38", text: "capitalize()", isStarred: false },
      { id: "s8_39", text: "title()", isStarred: false },
      { id: "s8_40", text: "swapcase()", isStarred: false },
      { id: "s8_41", text: "casefold()", isStarred: false },
      { id: "s8_42", text: "Classification methods", isStarred: false },
      { id: "s8_43", text: "isalpha()", isStarred: false },
      { id: "s8_44", text: "isdigit()", isStarred: false },
      { id: "s8_45", text: "isdecimal()", isStarred: false },
      { id: "s8_46", text: "isnumeric()", isStarred: false },
      { id: "s8_47", text: "isalnum()", isStarred: false },
      { id: "s8_48", text: "isspace()", isStarred: false },
      { id: "s8_49", text: "islower()", isStarred: false },
      { id: "s8_50", text: "isupper()", isStarred: false },
      { id: "s8_51", text: "Stripping", isStarred: false },
      { id: "s8_52", text: "strip()", isStarred: false },
      { id: "s8_53", text: "lstrip()", isStarred: false },
      { id: "s8_54", text: "rstrip()", isStarred: false },
      { id: "s8_55", text: "Padding", isStarred: false },
      { id: "s8_56", text: "center()", isStarred: false },
      { id: "s8_57", text: "ljust()", isStarred: false },
      { id: "s8_58", text: "rjust()", isStarred: false },
      { id: "s8_59", text: "zfill()", isStarred: false },
      { id: "s8_60", text: "String formatting", isStarred: false },
      { id: "s8_61", text: "f-strings", isStarred: false },
      { id: "s8_62", text: "String performance", isStarred: false },
      { id: "s8_63", text: "join() vs repeated concatenation", isStarred: false }
    ],
    starterCode: `# 8. Strings & Performance
raw = "   Pyradox Cloud Platform v3.12   "
clean = raw.strip().upper()
tokens = clean.split()
reconstructed = "-".join(tokens)

print("Original:", repr(raw))
print("Tokens:", tokens)
print("Reconstructed:", reconstructed)`
  },

  // ───  
  {
    id: "lists",
    topicNum: 9,
    title: "9. Lists",
    category: "Core Data Structures",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §3.1.3 & §5.1",
    docUrl: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists",
    summary: "Dynamic arrays, over-allocation, list methods, shallow vs deep copying, list comprehensions, and memory internals.",
    whatIsIt: "A Python list is a mutable, ordered, dynamic array of object references. It supports heterogeneous types and scales dynamically.",
    whyDoesItExist: "To serve as the default general-purpose sequence for collecting, mutating, and manipulating ordered data items.",
    syntax: `# List creation & modification
items = [10, 20, 30]
items.append(40)       # O(1) amortized
items.insert(0, 5)     # O(N) shift
items.pop()            # O(1) remove from end

# Slicing & Copying
copy_shallow = items[:]
# Deep copy
import copy
copy_deep = copy.deepcopy(nested_items)`,
    basicExample: `numbers = [4, 1, 8, 3]
numbers.append(10)
numbers.sort()
print("Sorted list:", numbers)
print("Popped item:", numbers.pop())
print("Remaining:", numbers)`,
    stepByStepExecution: `CPython PyListObject Architecture:
1. Internally, a list is an array of pointers: PyObject** ob_item.
2. It tracks both size (len) and allocated capacity:
   - When items are appended and size exceeds capacity, CPython over-allocates extra slots:
     allocated = (size >> 3) + (size < 9 ? 3 : 6) + size.
3. This over-allocation guarantees that append() operates in O(1) amortized time.
4. However, inserting at index 0 requires shifting all N pointers, operating in O(N) time.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "append() vs extend()",
        code: `a = [1, 2]
a.append([3, 4]) # Appends list as a single sub-element: [1, 2, [3, 4]]
print("After append:", a)

b = [1, 2]
b.extend([3, 4]) # Unpacks and adds each element: [1, 2, 3, 4]
print("After extend:", b)`,
        explanation: "append() adds the argument as one object; extend() iterates over the argument and adds each element."
      },
      {
        level: "Intermediate",
        title: "Shallow Copy vs Deep Copy",
        code: `import copy

original = [[1, 2], [3, 4]]
shallow = original.copy()
deep = copy.deepcopy(original)

original[0][0] = 999
print("Shallow affected:", shallow) # [999, 2] because inner list reference was shared!
print("Deep unaffected:", deep)     # [1, 2] completely isolated`,
        explanation: "Shallow copies only clone the outer list container; deepcopy recursively copies all nested objects."
      },
      {
        level: "Tricky",
        title: "List Multiplication Trap `[[]] * N`",
        code: `# Bug trap:
matrix = [[0] * 3] * 3
matrix[0][0] = 1
print("All rows altered!", matrix)

# Correct idiom using list comprehension:
safe_matrix = [[0] * 3 for _ in range(3)]
safe_matrix[0][0] = 1
print("Only row 0 altered:", safe_matrix)`,
        explanation: "`[list] * 3` creates 3 references pointing to the exact same inner list in memory."
      }
    ],
    commonMistakes: [
      {
        title: "list.sort() Returns None",
        wrongCode: `nums = [3, 1, 2]
sorted_nums = nums.sort() # sorted_nums is None!`,
        correctCode: `nums = [3, 1, 2]
nums.sort() # In-place sort
# Or:
sorted_nums = sorted(nums) # Returns new sorted list`,
        whyItFails: "In Python API convention, methods that mutate objects in-place return None to prevent silent bugs."
      }
    ],
    importantDifferences: [
      {
        title: "sort() vs sorted()",
        itemA: "list.sort()",
        itemB: "sorted(iterable)",
        comparison: [
          "Target: Only available on list instances vs Any iterable (tuples, dicts, sets, generators)",
          "Mutation: Mutates the list in-place vs Allocates and returns a new sorted list",
          "Return: Always returns None vs Returns the new sorted list"
        ]
      }
    ],
    realWorldUse: "Queues and stacks (though collections.deque is preferred for queues), batch data staging, sorting records.",
    interviewPerspective: [
      {
        question: "What is the time complexity of `list.pop(0)` vs `list.pop()`?",
        trap: "Saying both are O(1).",
        expectedAnswer: "`list.pop()` removes from the end in O(1) time. `list.pop(0)` removes from the start, requiring all remaining N-1 pointers to be shifted down in memory, taking O(N) time. For FIFO queues, use `collections.deque`."
      }
    ],
    questions: [
      {
        id: "q9_1",
        question: "What will `a = [1]; b = a; b += [2]; print(a)` output?",
        choices: ["[1]", "[1, 2]", "AttributeError", "[2]"],
        correctIndex: 1,
        hints: ["`+=` on lists calls `__iadd__`, which extends the list in-place."],
        solutionCode: `a = [1]; b = a; b += [2]\nprint(a) # [1, 2]`,
        explanation: "For mutable lists, `+=` calls `extend()` in-place, mutating the original object shared by `a`."
      }
    ],
    revisionSheet: [
      "Lists are mutable dynamic arrays of pointers.",
      "`append()`, `pop()` at end are O(1) amortized.",
      "`insert(0, val)` and `pop(0)` are O(N).",
      "Use `copy.deepcopy()` for multi-dimensional nested structures."
    ],
    subtopics: [
      { id: "s9_1", text: "Creating lists", isStarred: false },
      { id: "s9_2", text: "Indexing", isStarred: false },
      { id: "s9_3", text: "Negative indexing", isStarred: false },
      { id: "s9_4", text: "Slicing", isStarred: false },
      { id: "s9_5", text: "Nested lists", isStarred: false },
      { id: "s9_6", text: "Mutability", isStarred: false },
      { id: "s9_7", text: "Adding elements", isStarred: false },
      { id: "s9_8", text: "append()", isStarred: false },
      { id: "s9_9", text: "extend()", isStarred: false },
      { id: "s9_10", text: "insert()", isStarred: false },
      { id: "s9_11", text: "Removing elements", isStarred: false },
      { id: "s9_12", text: "remove()", isStarred: false },
      { id: "s9_13", text: "pop()", isStarred: false },
      { id: "s9_14", text: "clear()", isStarred: false },
      { id: "s9_15", text: "Searching", isStarred: false },
      { id: "s9_16", text: "index()", isStarred: false },
      { id: "s9_17", text: "count()", isStarred: false },
      { id: "s9_18", text: "Sorting", isStarred: false },
      { id: "s9_19", text: "sort()", isStarred: false },
      { id: "s9_20", text: "sorted()", isStarred: false },
      { id: "s9_21", text: "reverse()", isStarred: false },
      { id: "s9_22", text: "reversed()", isStarred: false },
      { id: "s9_23", text: "Copying", isStarred: false },
      { id: "s9_24", text: "Shallow copy", isStarred: false },
      { id: "s9_25", text: "Deep copy", isStarred: false },
      { id: "s9_26", text: "List concatenation", isStarred: false },
      { id: "s9_27", text: "List repetition", isStarred: false },
      { id: "s9_28", text: "List comprehension", isStarred: false },
      { id: "s9_29", text: "Nested list comprehension", isStarred: false },
      { id: "s9_30", text: "Conditional comprehension", isStarred: false },
      { id: "s9_31", text: "del", isStarred: false },
      { id: "s9_32", text: "Aliasing", isStarred: false },
      { id: "s9_33", text: "List unpacking", isStarred: false }
    ],
    starterCode: `# 9. Lists & Memory
import sys

my_list = []
print(f"Empty list initial memory: {sys.getsizeof(my_list)} bytes")

for i in range(8):
    my_list.append(i)
    print(f"Length: {len(my_list)} | Allocated bytes: {sys.getsizeof(my_list)}")`
  },

  // ─── 10. Tuples ─────────────────────────────────────────────────────────────
  {
    id: "tuples",
    topicNum: 10,
    title: "10. Tuples",
    category: "Core Data Structures",
    level: "Beginner",
    stars: "",
    docRefTag: "Docs §5.3",
    docUrl: "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences",
    summary: "Immutable sequences, single-element tuples, extended unpacking (*rest), named tuples, and memory overhead comparison.",
    whatIsIt: "A tuple is an ordered, immutable sequence of Python objects. Once created, its length and object references cannot be added, removed, or reassigned.",
    whyDoesItExist: "To represent fixed heterogeneous records (like database rows or coordinates), ensure data integrity, and serve as hashable keys in dictionaries.",
    syntax: `t = (1, "Pyradox", 3.12)
single_item = (42,) # Trailing comma required!

# Extended unpacking (PEP 3132)
first, *middle, last = (10, 20, 30, 40, 50)`,
    basicExample: `point = (10, 20)
x, y = point
print(f"x={x}, y={y}")

# Extended unpacking
first, *rest, last = (1, 2, 3, 4, 5)
print("First:", first, "Middle:", rest, "Last:", last)`,
    stepByStepExecution: `CPython PyTupleObject Optimization:
1. Because tuples are immutable, CPython allocates exact memory with zero over-allocation headroom.
2. Tuples of length 1 to 20 are cached in a free-list pool to minimize malloc overhead on small allocations.
3. A tuple is hashable (has __hash__) only if every item inside it is also hashable.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Single Element Tuple Comma Requirement",
        code: `not_a_tuple = (42)  # Evaluates to integer 42!
is_a_tuple = (42,)  # True tuple of length 1
print("type(not_a_tuple):", type(not_a_tuple))
print("type(is_a_tuple):", type(is_a_tuple))`,
        explanation: "Parentheses without commas are treated as arithmetic grouping symbols."
      },
      {
        level: "Intermediate",
        title: "Named Tuples from collections",
        code: `from collections import namedtuple

Coordinate = namedtuple("Coordinate", ["lat", "lon"])
loc = Coordinate(lat=37.7749, lon=-122.4194)
print(f"Location: lat={loc.lat}, lon={loc.lon}")
print("Tuple indexing still works:", loc[0])`,
        explanation: "namedtuple provides self-documenting field names while retaining tuple immutability and memory compactness."
      },
      {
        level: "Tricky",
        title: "Tuple Containing a Mutable Object",
        code: `t = (1, [10, 20])
# t[1] = [30] -> TypeError (tuple is immutable)
t[1].append(30) # Legal! The list inside is mutated
print("Mutated tuple:", t)`,
        explanation: "Tuple immutability only guarantees that its internal references cannot change; the objects referenced may still mutate."
      }
    ],
    commonMistakes: [
      {
        title: "Forgetting Trailing Comma in Single-Element Tuple",
        wrongCode: `val = ("admin") # This is a str, not a tuple!`,
        correctCode: `val = ("admin",) # Trailing comma creates the tuple`,
        whyItFails: "Without a comma, Python treats parentheses as expression grouping."
      }
    ],
    importantDifferences: [
      {
        title: "Tuple vs List",
        itemA: "tuple",
        itemB: "list",
        comparison: [
          "Mutability: Strictly immutable vs Fully mutable",
          "Memory: Smaller footprint (no over-allocation) vs Larger footprint (grows dynamically)",
          "Hashability: Hashable (can be dict key) if contents hashable vs Never hashable",
          "Semantic use: Heterogeneous records (x, y, z) vs Homogeneous collections ([1, 2, 3])"
        ]
      }
    ],
    realWorldUse: "Returning multiple values from functions, database query row records, dictionary compound keys.",
    interviewPerspective: [
      {
        question: "Can a tuple be used as a dictionary key?",
        trap: "Answering 'Yes, always' without qualification.",
        expectedAnswer: "Yes, but only if all elements within the tuple are themselves hashable. For example, `(1, 2)` is valid, but `(1, [2, 3])` will raise TypeError: unhashable type: 'list'."
      }
    ],
    questions: [
      {
        id: "q10_1",
        question: "What is `type((5))` in Python?",
        choices: ["<class 'tuple'>", "<class 'int'>", "<class 'list'>", "SyntaxError"],
        correctIndex: 1,
        hints: ["A comma is required to create a single-element tuple."],
        solutionCode: `print(type((5))) # <class 'int'>\nprint(type((5,))) # <class 'tuple'>`,
        explanation: "` (5) ` is treated as an integer inside grouping parentheses; `(5,)` is a tuple."
      }
    ],
    revisionSheet: [
      "Tuples are immutable; once assigned, references cannot change.",
      "Single-element tuples must end with a comma: `(x,)`.",
      "Extended unpacking: `first, *rest = (1, 2, 3)`.",
      "Tuples use less memory than lists and instantiate faster."
    ],
    subtopics: [
      { id: "s10_1", text: "Creating tuples", isStarred: false },
      { id: "s10_2", text: "Tuple indexing", isStarred: false },
      { id: "s10_3", text: "Tuple slicing", isStarred: false },
      { id: "s10_4", text: "Tuple immutability", isStarred: false },
      { id: "s10_5", text: "Single-element tuple", isStarred: false },
      { id: "s10_6", text: "Tuple unpacking", isStarred: false },
      { id: "s10_7", text: "Extended unpacking", isStarred: false },
      { id: "s10_8", text: "Nested tuples", isStarred: false },
      { id: "s10_9", text: "count()", isStarred: false },
      { id: "s10_10", text: "index()", isStarred: false },
      { id: "s10_11", text: "Tuple vs list", isStarred: false },
      { id: "s10_12", text: "Tuple performance", isStarred: false },
      { id: "s10_13", text: "Named tuples", isStarred: false }
    ],
    starterCode: `# 10. Tuples & Unpacking
server_config = ("192.168.1.1", 8080, "production", "active", "tls_v1_3")
ip, port, env, *metadata = server_config

print(f"Host: {ip}:{port} ({env})")
print("Remaining metadata:", metadata)`
  },

  // ───  
  {
    id: "sets",
    topicNum: 11,
    title: "11. Sets",
    category: "Core Data Structures",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §5.4",
    docUrl: "https://docs.python.org/3/tutorial/datastructures.html#sets",
    summary: "Unordered collections of unique elements, hash tables, set algebra (union, intersection, difference), and frozenset.",
    whatIsIt: "A set is an unordered, mutable collection of unique, hashable objects. Python also provides `frozenset`, an immutable counterpart.",
    whyDoesItExist: "To perform instant O(1) membership testing and set operations (union, intersection, difference, symmetric difference) without duplicate values.",
    syntax: `s = {1, 2, 3, 3, 2}  # Yields {1, 2, 3}
empty_set = set()      # Note: {} creates an empty dictionary!

# Set mathematical operators:
union = set_a | set_b
intersection = set_a & set_b
difference = set_a - set_b
sym_diff = set_a ^ set_b`,
    basicExample: `emails = ["user@test.com", "admin@test.com", "user@test.com"]
unique_emails = set(emails)
print("Unique count:", len(unique_emails))
print("Is admin present:", "admin@test.com" in unique_emails) # O(1) lookup`,
    stepByStepExecution: `CPython PySetObject Hash Table:
1. When adding an element via s.add(x), Python computes hash(x).
2. The hash index locates a bucket in an open-addressing table.
3. If the bucket has an item, Python tests equality (item == x).
4. If equivalent, the duplicate is discarded. If empty, the pointer is stored.
5. Average time complexity for add(), remove(), and 'in' lookups is O(1).`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Deduplication and Fast Membership",
        code: `data = [10, 20, 20, 30, 40, 40, 50]
unique = set(data)
print("Deduplicated:", sorted(unique))
print("Membership test (30 in unique):", 30 in unique)`,
        explanation: "Converting a list to a set strips duplicates in O(N) time."
      },
      {
        level: "Intermediate",
        title: "Set Operations: Union, Intersection, Difference",
        code: `admin_roles = {"read", "write", "delete", "audit"}
user_roles = {"read", "comment"}

print("All roles (Union):", admin_roles | user_roles)
print("Common roles (Intersection):", admin_roles & user_roles)
print("Admin-only roles (Difference):", admin_roles - user_roles)`,
        explanation: "Set operations map cleanly to relational algebra."
      },
      {
        level: "Tricky",
        title: "frozenset as a Dictionary Key",
        code: `# Normal sets cannot be dict keys (unhashable)
# frozenset is immutable and hashable:
matrix_graph = {
    frozenset(["A", "B"]): 15, # Undirected edge between A and B
    frozenset(["B", "C"]): 25
}
print("Distance A-B:", matrix_graph[frozenset(["B", "A"])])`,
        explanation: "Because frozenset is immutable, it has a stable __hash__ and can be used in sets or as dictionary keys."
      }
    ],
    commonMistakes: [
      {
        title: "Creating Empty Set with {}",
        wrongCode: `empty = {} # Creates dict! type(empty) is dict`,
        correctCode: `empty = set() # Proper empty set`,
        whyItFails: "`{}` is reserved for empty dictionaries for historical backward compatibility."
      }
    ],
    importantDifferences: [
      {
        title: "set vs list Membership (in)",
        itemA: "item in set (O(1))",
        itemB: "item in list (O(N))",
        comparison: [
          "Lookup: Instant hash table lookup O(1) vs Linear scan through array O(N)",
          "1M items: ~50 nanoseconds vs ~10 milliseconds (200,000x difference)",
          "Constraint: Elements must be hashable vs Any object allowed"
        ]
      }
    ],
    realWorldUse: "Access control permissions, removing duplicate records in ETL pipelines, fast blacklist/whitelist lookups.",
    interviewPerspective: [
      {
        question: "Why can't a set contain a list?",
        trap: "Saying 'because lists are large'.",
        expectedAnswer: "Sets require every member to be hashable (have a stable __hash__ method). Lists are mutable, so their contents can change, which would corrupt the hash table bucket location."
      }
    ],
    questions: [
      {
        id: "q11_1",
        question: "What is the result of `{1, 2, 3} & {2, 3, 4}`?",
        choices: ["{1, 4}", "{2, 3}", "{1, 2, 3, 4}", "{}"],
        correctIndex: 1,
        hints: ["`&` calculates set intersection (elements present in both sets)."],
        solutionCode: `print({1, 2, 3} & {2, 3, 4}) # {2, 3}`,
        explanation: "The `&` operator computes set intersection, keeping only elements present in both sets."
      }
    ],
    revisionSheet: [
      "Sets are unordered collections of unique, hashable objects.",
      "Empty set must be created with `set()`, not `{}`.",
      "Lookup `x in s` is O(1) average time.",
      "`frozenset` is an immutable, hashable set."
    ],
    subtopics: [
      { id: "s11_1", text: "Creating sets", isStarred: false },
      { id: "s11_2", text: "Set uniqueness", isStarred: false },
      { id: "s11_3", text: "Set mutability", isStarred: false },
      { id: "s11_4", text: "Adding elements", isStarred: false },
      { id: "s11_5", text: "add()", isStarred: false },
      { id: "s11_6", text: "update()", isStarred: false },
      { id: "s11_7", text: "Removing", isStarred: false },
      { id: "s11_8", text: "remove()", isStarred: false },
      { id: "s11_9", text: "discard()", isStarred: false },
      { id: "s11_10", text: "pop()", isStarred: false },
      { id: "s11_11", text: "clear()", isStarred: false },
      { id: "s11_12", text: "Union", isStarred: false },
      { id: "s11_13", text: "Intersection", isStarred: false },
      { id: "s11_14", text: "Difference", isStarred: false },
      { id: "s11_15", text: "Symmetric difference", isStarred: false },
      { id: "s11_16", text: "Subset", isStarred: false },
      { id: "s11_17", text: "Superset", isStarred: false },
      { id: "s11_18", text: "Disjoint sets", isStarred: false },
      { id: "s11_19", text: "Set operators", isStarred: false },
      { id: "s11_20", text: "frozenset", isStarred: false }
    ],
    starterCode: `# 11. Sets & Set Algebra
tech_stack = {"Python", "Docker", "PostgreSQL", "FastAPI"}
candidate_skills = {"Python", "AWS", "FastAPI", "React"}

matching = tech_stack & candidate_skills
missing = tech_stack - candidate_skills

print("Matching skills:", matching)
print("Skills to learn:", missing)`
  },

  // ───  
  {
    id: "dictionaries",
    topicNum: 12,
    title: "12. Dictionaries",
    category: "Core Data Structures",
    level: "Beginner",
    stars: "Core",
    docRefTag: "Docs §5.5",
    docUrl: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries",
    summary: "Hash tables, key-value mappings, get() defaults, dict comprehensions, dictionary merging (|), and CPython compact dict memory layout.",
    whatIsIt: "A dictionary (dict) is a mutable, key-value associative mapping. In Python 3.7+, dictionaries are guaranteed to maintain insertion order.",
    whyDoesItExist: "To provide ultra-fast O(1) key lookups, data indexing, caching, JSON mapping, and object attribute storage (__dict__).",
    syntax: `# Dictionary creation
user = {"id": 101, "name": "Shivansh", "role": "Architect"}

# Safe retrieval with fallback default
role = user.get("role", "Guest")

# Dictionary merging (Python 3.9+)
merged = dict_a | dict_b`,
    basicExample: `profile = {"name": "Shivansh", "role": "Pro", "points": 1500}
profile["level"] = "Master"
print("Name:", profile.get("name"))
print("Missing key safe get:", profile.get("avatar", "default.png"))

# Iterating keys and values
for k, v in profile.items():
    print(f"{k:<8} -> {v}")`,
    stepByStepExecution: `CPython Compact Dict Architecture (Raymond Hettinger layout):
1. Older Python used sparse hash tables wasting 60% memory.
2. Python 3.6+ uses two arrays:
   - indices array: sparse array storing small integer indices (-1, 0, 1, 2...).
   - entries array: dense array storing [hash, key_ptr, value_ptr] sequentially.
3. This guarantees O(1) lookup speed, cuts memory usage by ~25%, and preserves insertion order for free!`,
    multipleExamples: [
      {
        level: "Simple",
        title: "setdefault() vs get()",
        code: `scores = {}
# setdefault retrieves value, or inserts default if key is absent:
scores.setdefault("math", []).append(95)
scores.setdefault("math", []).append(100)
print("Scores dictionary:", scores)`,
        explanation: "setdefault avoids the verbose `if key not in d: d[key] = []` check."
      },
      {
        level: "Intermediate",
        title: "Dictionary Comprehension with Conditionals",
        code: `metrics = {"cpu": 85, "mem": 92, "disk": 45, "gpu": 98}
# Filter metrics exceeding threshold
alerts = {k.upper(): f"{v}%" for k, v in metrics.items() if v >= 80}
print("Critical Alerts:", alerts)`,
        explanation: "Dict comprehensions construct new mappings concisely."
      },
      {
        level: "Tricky",
        title: "Dictionary Merging (|) and In-Place (|=)",
        code: `defaults = {"theme": "dark", "notifications": True, "lang": "en"}
user_settings = {"theme": "cyber", "notifications": False}

# Python 3.9+ union operator:
active_config = defaults | user_settings
print("Active Config:", active_config)`,
        explanation: "The `|` operator cleanly merges dictionaries, with the right operand taking precedence on conflicting keys."
      }
    ],
    commonMistakes: [
      {
        title: "Using mutable objects (like lists) as keys",
        wrongCode: `d = {}
# d[[1, 2]] = "Coordinates" -> TypeError: unhashable type: 'list'`,
        correctCode: `d = {}
d[(1, 2)] = "Coordinates" # Use immutable tuple as key`,
        whyItFails: "Dict keys MUST be hashable. Because lists can be mutated in-place, their hash would change, breaking lookup."
      }
    ],
    importantDifferences: [
      {
        title: "dict[key] vs dict.get(key, default)",
        itemA: "dict[key]",
        itemB: "dict.get(key, default)",
        comparison: [
          "Missing key: Raises KeyError vs Returns default value (default None)",
          "Intent: When key is strictly expected to exist vs When key is optional or uncertain",
          "Readability: Clear assertion of presence vs Safe defensive access"
        ]
      }
    ],
    realWorldUse: "JSON API parsing, caching (memoization), database records, configuration profiles.",
    interviewPerspective: [
      {
        question: "How did Python achieve ordered dictionaries without performance loss in Python 3.6+?",
        trap: "Thinking it uses a linked list like OrderedDict.",
        expectedAnswer: "It separated the hash index from the data entries. The entries array stores (hash, key, value) in order of insertion, while a compact sparse indices table handles hash mapping. This preserves order naturally and reduces memory."
      }
    ],
    questions: [
      {
        id: "q12_1",
        question: "What does `d = {}; print(d.get('status', 'offline'))` output?",
        choices: ["None", "'offline'", "KeyError", "False"],
        correctIndex: 1,
        hints: ["dict.get() returns the fallback default value when the key is missing."],
        solutionCode: `d = {}\nprint(d.get('status', 'offline')) # 'offline'`,
        explanation: "Because 'status' is not in `d`, `get()` returns the specified default value 'offline'."
      }
    ],
    revisionSheet: [
      "Dictionaries store key-value mappings with O(1) average lookup/insert.",
      "Keys must be hashable; values can be any object.",
      "Python 3.7+ guarantees insertion order preservation.",
      "Merge dictionaries with `d1 | d2` (Python 3.9+)."
    ],
    subtopics: [
      { id: "s12_1", text: "Creating dictionaries", isStarred: false },
      { id: "s12_2", text: "Key-value pairs", isStarred: false },
      { id: "s12_3", text: "Keys and values", isStarred: false },
      { id: "s12_4", text: "Accessing values", isStarred: false },
      { id: "s12_5", text: "[]", isStarred: false },
      { id: "s12_6", text: "get()", isStarred: false },
      { id: "s12_7", text: "Adding/updating", isStarred: false },
      { id: "s12_8", text: "Removing", isStarred: false },
      { id: "s12_9", text: "pop()", isStarred: false },
      { id: "s12_10", text: "popitem()", isStarred: false },
      { id: "s12_11", text: "del", isStarred: false },
      { id: "s12_12", text: "clear()", isStarred: false },
      { id: "s12_13", text: "keys()", isStarred: false },
      { id: "s12_14", text: "values()", isStarred: false },
      { id: "s12_15", text: "items()", isStarred: false },
      { id: "s12_16", text: "Iterating dictionaries", isStarred: false },
      { id: "s12_17", text: "Nested dictionaries", isStarred: false },
      { id: "s12_18", text: "Dictionary comprehension", isStarred: false },
      { id: "s12_19", text: "Conditional dictionary comprehension", isStarred: false },
      { id: "s12_20", text: "Dictionary unpacking (**)", isStarred: false },
      { id: "s12_21", text: "setdefault()", isStarred: false },
      { id: "s12_22", text: "fromkeys()", isStarred: false },
      { id: "s12_23", text: "update()", isStarred: false },
      { id: "s12_24", text: "Dictionary ordering", isStarred: false },
      { id: "s12_25", text: "Hashable objects", isStarred: false },
      { id: "s12_26", text: "Dictionary internals", isStarred: false },
      { id: "s12_27", text: "Hash tables", isStarred: false }
    ],
    starterCode: `# 12. Dictionaries & Merging
server_stats = {"reqs": 42000, "errors": 12, "uptime_hr": 350}
node_meta = {"region": "us-east-1", "az": "us-east-1a"}

# Python 3.9+ dictionary union
full_telemetry = server_stats | node_meta
print("Telemetry data:", full_telemetry)`
  },

  // ───  
  {
    id: "functions",
    topicNum: 13,
    title: "13. Functions",
    category: "Functions",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §4.7",
    docUrl: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
    summary: "First-class functions, parameters vs arguments, *args/**kwargs, positional-only (/), keyword-only (*), LEGB scope, closures, and recursion.",
    whatIsIt: "Functions are reusable blocks of code defined via `def` (or `lambda`). In Python, functions are first-class citizens: they can be passed as arguments, assigned to variables, returned from other functions, and have arbitrary attributes attached.",
    whyDoesItExist: "To encapsulate logic, eliminate repetition (DRY), enable modular abstraction, and support functional programming paradigms.",
    syntax: `# Parameter syntax hierarchy:
def complex_fn(pos_only, /, standard, *args, kw_only, **kwargs):
    ...
# / enforces positional-only on preceding parameters
# * enforces keyword-only on subsequent parameters`,
    basicExample: `def calculate_bill(subtotal: float, tax_rate: float = 0.08, *discounts, **metadata) -> float:
    total = subtotal * (1 + tax_rate)
    for d in discounts:
        total -= d
    print(f"Customer metadata: {metadata}")
    return max(0.0, total)

bill = calculate_bill(100.0, 0.10, 5.0, 2.5, customer_id="C901", coupon="SUMMER")
print(f"Final Bill: \${bill:.2f}")`,
    stepByStepExecution: `CPython Function Execution & Stack Frames:
1. When 'def' executes, CPython creates a PyFunctionObject on the heap containing the function's bytecode ('__code__'), globals pointer ('__globals__'), and default arguments ('__defaults__').
2. When called, CPython allocates a new PyFrameObject on the call stack.
3. Arguments are mapped into the frame's 'f_localsplus' array for fast index-based variable lookup (LOAD_FAST opcode).
4. Upon return, the frame is popped from the call stack and its refcounts decremented.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Flexible Arguments with *args and **kwargs",
        code: `def logger(event, *details, **context):
    print(f"EVENT: {event}")
    print(f"DETAILS ({len(details)}): {details}")
    print(f"CONTEXT: {context}")

logger("USER_LOGIN", "IP: 127.0.0.1", "Browser: Chrome", user_id=42, role="admin")`,
        explanation: "`*args` collects extra positional arguments into a tuple; `**kwargs` collects keyword arguments into a dict."
      },
      {
        level: "Intermediate",
        title: "Positional-Only (/) and Keyword-Only (*) Parameters",
        code: `def configure_node(ip: str, /, port: int, *, secure: bool = True):
    print(f"Connecting to {ip}:{port} (TLS={secure})")

# configure_node(ip="1.1.1.1", port=80) -> TypeError! ip is positional-only
configure_node("1.1.1.1", 80, secure=True)`,
        explanation: "Parameters before `/` cannot be called via keyword. Parameters after `*` must be supplied via keyword."
      },
      {
        level: "Tricky",
        title: "Mutable Default Argument Pitfall",
        code: `# Bug trap:
def append_item(val, target_list=[]):
    target_list.append(val)
    return target_list

print("Call 1:", append_item("A")) # ['A']
print("Call 2:", append_item("B")) # ['A', 'B'] -- SHARED!

# Idiomatic correct pattern:
def append_item_safe(val, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(val)
    return target_list

print("Safe Call 2:", append_item_safe("B")) # ['B']`,
        explanation: "Function default arguments are evaluated ONCE when the function definition is compiled, NOT on each call! A mutable default is shared across every call."
      }
    ],
    commonMistakes: [
      {
        title: "Using Mutable Default Arguments (e.g. def fn(arg=[]))",
        wrongCode: `def add_user(name, users=[]):
    users.append(name)
    return users`,
        correctCode: `def add_user(name, users=None):
    if users is None:
        users = []
    users.append(name)
    return users`,
        whyItFails: "Default arguments are evaluated once at module load time and stored in `fn.__defaults__`, causing mutations to persist across all calls."
      }
    ],
    importantDifferences: [
      {
        title: "global vs nonlocal",
        itemA: "global x",
        itemB: "nonlocal x",
        comparison: [
          "Scope targeted: Module-level global namespace vs Nearest enclosing (outer nested) function scope",
          "Module level: Valid at top level or inside functions vs SyntaxError if used at module top level",
          "Closures: Bypasses enclosing scopes vs Essential for mutating state inside closures"
        ]
      }
    ],
    realWorldUse: "API endpoints in FastAPI/Flask, middleware decorators, pipeline dispatchers.",
    interviewPerspective: [
      {
        question: "Explain the LEGB scope resolution rule in Python.",
        trap: "Forgetting the Enclosing scope or mixing up the order.",
        expectedAnswer: "Python resolves variable names in this exact order: Local (inside current function) -> Enclosing (nested outer function closures) -> Global (module level) -> Built-in (builtins module like len, range)."
      }
    ],
    questions: [
      {
        id: "q13_1",
        question: "Why should you never use `def func(items=[])` in Python?",
        choices: [
          "Lists cannot be passed as arguments in Python",
          "The default list is instantiated once at function definition time and shared across all calls",
          "Python raises a SyntaxError on mutable defaults",
          "It forces the return value to be None"
        ],
        correctIndex: 1,
        hints: ["Think about when the function signature is evaluated by the compiler."],
        solutionCode: `def f(a=None):\n    if a is None: a = []\n    return a`,
        explanation: "Default arguments are evaluated once when the function is defined. A mutable default is stored in `__defaults__` and shared across invocations."
      }
    ],
    revisionSheet: [
      "Functions are first-class objects (can be assigned, passed, returned).",
      "LEGB: Local -> Enclosing -> Global -> Built-in.",
      "Never use mutable default arguments; use `None` and initialize inside.",
      "`/` designates positional-only parameters; `*` designates keyword-only parameters."
    ],
    subtopics: [
      { id: "s13_1", text: "Defining functions", isStarred: false },
      { id: "s13_2", text: "Calling functions", isStarred: false },
      { id: "s13_3", text: "Parameters", isStarred: false },
      { id: "s13_4", text: "Arguments", isStarred: false },
      { id: "s13_5", text: "Return values", isStarred: false },
      { id: "s13_6", text: "Multiple return values", isStarred: false },
      { id: "s13_7", text: "Positional arguments", isStarred: false },
      { id: "s13_8", text: "Keyword arguments", isStarred: false },
      { id: "s13_9", text: "Default arguments", isStarred: false },
      { id: "s13_10", text: "Variable-length arguments", isStarred: false },
      { id: "s13_11", text: "*args", isStarred: false },
      { id: "s13_12", text: "**kwargs", isStarred: false },
      { id: "s13_13", text: "Positional-only parameters", isStarred: false },
      { id: "s13_14", text: "Keyword-only parameters", isStarred: false },
      { id: "s13_15", text: "Parameter ordering", isStarred: false },
      { id: "s13_16", text: "Function annotations", isStarred: false },
      { id: "s13_17", text: "Docstrings", isStarred: false },
      { id: "s13_18", text: "return", isStarred: false },
      { id: "s13_19", text: "Functions as objects", isStarred: false },
      { id: "s13_20", text: "First-class functions", isStarred: false },
      { id: "s13_21", text: "Higher-order functions", isStarred: false },
      { id: "s13_22", text: "Nested functions", isStarred: false },
      { id: "s13_23", text: "Local variables", isStarred: false },
      { id: "s13_24", text: "Global variables", isStarred: false },
      { id: "s13_25", text: "global", isStarred: false },
      { id: "s13_26", text: "nonlocal", isStarred: false },
      { id: "s13_27", text: "LEGB rule", isStarred: false },
      { id: "s13_28", text: "Recursion", isStarred: false },
      { id: "s13_29", text: "Lambda functions", isStarred: false },
      { id: "s13_30", text: "Closures", isStarred: false },
      { id: "s13_31", text: "Function attributes", isStarred: false }
    ],
    starterCode: `# 13. Functions: Positional-Only and Keyword-Only
def api_endpoint(route: str, /, method: str = "GET", *, auth_required: bool = True):
    return f"Handling {method} {route} (Authenticated={auth_required})"

print(api_endpoint("/api/v1/users"))
print(api_endpoint("/api/v1/metrics", "POST", auth_required=False))`
  },

  // ───  
  {
    id: "functional-programming",
    topicNum: 14,
    title: "14. Functional Programming",
    category: "Functions",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs Functional HOWTO",
    docUrl: "https://docs.python.org/3/howto/functional.html",
    summary: "map(), filter(), reduce(), lambdas, any(), all(), sorted() with key extractors, and pure functions.",
    whatIsIt: "Functional programming treats computation as the evaluation of mathematical functions, avoiding mutable state and side effects.",
    whyDoesItExist: "To enable cleaner transformations on stream pipelines, concise lambda expressions, and declarative data processing.",
    syntax: `# Lambda anonymous function:
square = lambda x: x ** 2

# Functional iterators
evens = filter(lambda x: x % 2 == 0, numbers)
doubled = map(lambda x: x * 2, numbers)

# Reduction
from functools import reduce
product = reduce(lambda acc, x: acc * x, [1, 2, 3, 4], 1)`,
    basicExample: `numbers = [1, 2, 3, 4, 5, 6]
evens_squared = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, numbers)))
print("Evens squared:", evens_squared)

# any() and all()
print("Are all numbers positive?", all(x > 0 for x in numbers))
print("Is any number > 5?", any(x > 5 for x in numbers))`,
    stepByStepExecution: `CPython map() and filter() Lazy Iteration:
1. 'map()' and 'filter()' return lazy iterator objects in Python 3 (unlike Python 2 which built eager lists).
2. Elements are computed on-demand one by one when 'next()' is called.
3. Memory consumption remains O(1) regardless of whether the source stream has 10 items or 10 billion items.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Sorting Complex Objects with custom lambda keys",
        code: `users = [
    {"username": "carol", "score": 92},
    {"username": "alice", "score": 99},
    {"username": "bob", "score": 85}
]
users_by_score = sorted(users, key=lambda u: u["score"], reverse=True)
for u in users_by_score:
    print(f"{u['username']}: {u['score']}")`,
        explanation: "The `key` parameter accepts a callable that extracts a comparison key from each element."
      },
      {
        level: "Intermediate",
        title: "functools.reduce for Cumulative Calculations",
        code: `from functools import reduce

# Calculate factorial using reduce
n = 5
factorial = reduce(lambda acc, x: acc * x, range(1, n + 1))
print(f"{n}! =", factorial)`,
        explanation: "reduce applies a function of two arguments cumulatively to the items of a sequence."
      },
      {
        level: "Tricky",
        title: "Late Binding Trap in Lambdas Created in Loops",
        code: `# Bug trap:
funcs = [lambda: i for i in range(3)]
print("Results:", [f() for f in funcs]) # [2, 2, 2] !

# Fix using default argument capture:
safe_funcs = [lambda i=i: i for i in range(3)]
print("Safe Results:", [f() for f in safe_funcs]) # [0, 1, 2]`,
        explanation: "Python closures look up names in the enclosing scope at invocation time, not at definition time! Using a default parameter binds the current loop value."
      }
    ],
    commonMistakes: [
      {
        title: "Unnecessary Use of map/filter Over Comprehensions",
        wrongCode: `res = list(map(lambda x: x * 2, filter(lambda x: x > 5, nums)))`,
        correctCode: `res = [x * 2 for x in nums if x > 5] # Cleaner, faster, and idiomatic`,
        whyItFails: "List comprehensions are generally faster (no lambda function call overhead) and significantly more readable in Python."
      }
    ],
    importantDifferences: [
      {
        title: "map() / filter() vs List Comprehensions",
        itemA: "map() / filter()",
        itemB: "Comprehensions",
        comparison: [
          "Evaluation: Lazy iterator (O(1) memory) vs Eager list allocation (O(N) memory)",
          "Pythonic style: Often considered less idiomatic vs Widely considered idiomatic Python",
          "Function overhead: Invokes a function per item vs Direct bytecode execution"
        ]
      }
    ],
    realWorldUse: "Data transformation pipelines (Apache Spark / PySpark), validation pipelines, sorting tabular records.",
    interviewPerspective: [
      {
        question: "Explain the lambda late binding problem and how to solve it.",
        trap: "Not knowing that closures bind variables by reference, not by value.",
        expectedAnswer: "Lambdas capture variables from enclosing scopes by reference. If defined in a loop, all lambdas look up the variable's final value. Fix by passing the current variable as a default argument: `lambda x=x: x`."
      }
    ],
    questions: [
      {
        id: "q14_1",
        question: "What does `all([])` evaluate to in Python?",
        choices: ["True", "False", "None", "ValueError"],
        correctIndex: 0,
        hints: ["Vacuous truth: are there any falsy elements in an empty list?"],
        solutionCode: `print(all([])) # True\nprint(any([])) # False`,
        explanation: "`all()` returns True if no elements of the iterable are false; on an empty sequence, it is vacuously True."
      }
    ],
    revisionSheet: [
      "`map(func, iter)` and `filter(func, iter)` return lazy iterators.",
      "List comprehensions are generally preferred over `map` + `filter` + `lambda`.",
      "`all()` requires every element to be truthy; `any()` requires at least one.",
      "Beware late binding closures in loops: bind variables using `lambda i=i: ...`."
    ],
    subtopics: [
      { id: "s14_1", text: "map()", isStarred: false },
      { id: "s14_2", text: "filter()", isStarred: false },
      { id: "s14_3", text: "reduce()", isStarred: false },
      { id: "s14_4", text: "zip()", isStarred: false },
      { id: "s14_5", text: "enumerate()", isStarred: false },
      { id: "s14_6", text: "any()", isStarred: false },
      { id: "s14_7", text: "all()", isStarred: false },
      { id: "s14_8", text: "sorted() with key", isStarred: false },
      { id: "s14_9", text: "Lambda + map", isStarred: false },
      { id: "s14_10", text: "Lambda + filter", isStarred: false },
      { id: "s14_11", text: "Lambda + sorted", isStarred: false },
      { id: "s14_12", text: "Generator expressions", isStarred: false },
      { id: "s14_13", text: "Comprehensions", isStarred: false }
    ],
    starterCode: `# 14. Functional Programming & Key Extractors
devices = [
    {"name": "Gateway-01", "ping_ms": 12.4, "online": True},
    {"name": "Core-Switch", "ping_ms": 1.8, "online": True},
    {"name": "Edge-Node", "ping_ms": 45.2, "online": False}
]

online_devices = list(filter(lambda d: d["online"], devices))
fastest = min(online_devices, key=lambda d: d["ping_ms"])

print("Fastest online device:", fastest["name"], f"({fastest['ping_ms']}ms)")`
  },

  // ───  
  {
    id: "iterators-and-generators",
    topicNum: 15,
    title: "15. Iterators & Generators",
    category: "Functions",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §9.8 & §9.9",
    docUrl: "https://docs.python.org/3/tutorial/classes.html#iterators",
    summary: "Iterator protocol (__iter__, __next__, StopIteration), generator functions with yield, yield from, and memory-efficient streaming.",
    whatIsIt: "An Iterable is an object capable of returning an Iterator. An Iterator is an object that implements `__next__()` and returns values one by one, raising `StopIteration` when finished. Generators are functions that produce iterators using `yield`.",
    whyDoesItExist: "To process massive, unbounded, or infinite data streams in O(1) constant memory without loading entire datasets into RAM.",
    syntax: `# Custom Iterator Protocol:
class CountUp:
    def __init__(self, limit):
        self.limit = limit
        self.val = 0
    def __iter__(self):
        return self
    def __next__(self):
        if self.val >= self.limit:
            raise StopIteration
        self.val += 1
        return self.val

# Generator Function:
def fibonacci(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b`,
    basicExample: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

gen = countdown(3)
print(next(gen)) # 3
print(next(gen)) # 2
print(next(gen)) # 1
# next(gen) would raise StopIteration!`,
    stepByStepExecution: `CPython Generator Frame Suspension:
1. When a generator function is called, CPython does NOT execute the code body immediately; it returns a PyGenObject.
2. The PyGenObject holds a pointer to its own execution frame (f_locals, instruction pointer f_lasti).
3. Calling next() resumes execution from f_lasti until the YIELD_VALUE opcode is reached.
4. The frame is suspended (state preserved in memory), returning the yielded value to the caller.
5. On subsequent next() calls, the frame resumes seamlessly from where it paused!`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Iterating Files with Lazy Generators",
        code: `def stream_large_dataset(count):
    for i in range(count):
        yield f"Record_{i:04d}"

stream = stream_large_dataset(5)
for record in stream:
    print("Streamed:", record)`,
        explanation: "Generators yield items one by one, consuming minimal memory regardless of dataset size."
      },
      {
        level: "Intermediate",
        title: "Delegating with 'yield from'",
        code: `def sub_pipeline():
    yield "Data extracted"
    yield "Data normalized"

def main_pipeline():
    yield "Pipeline START"
    yield from sub_pipeline() # Delegates cleanly to inner generator
    yield "Pipeline COMPLETE"

for step in main_pipeline():
    print("->", step)`,
        explanation: "`yield from` delegates all iteration, bidirectional `send()`, and exception handling to a sub-generator."
      },
      {
        level: "Tricky",
        title: "Generator Exhaustion: Can Only Be Consumed Once",
        code: `def get_numbers():
    yield 1
    yield 2

g = get_numbers()
print("First pass:", list(g))
print("Second pass:", list(g)) # EMPTY []!`,
        explanation: "Generators are single-use streams. Once exhausted (raised StopIteration), they cannot be reset without calling the function again."
      }
    ],
    commonMistakes: [
      {
        title: "Calling len() on a Generator",
        wrongCode: `gen = (x * 2 for x in range(10))
# print(len(gen)) -> TypeError: object of type 'generator' has no len()`,
        correctCode: `gen = (x * 2 for x in range(10))
# To count, consume it or use list:
count = sum(1 for _ in gen)`,
        whyItFails: "Generators do not know their future size because elements are produced lazily on demand."
      }
    ],
    importantDifferences: [
      {
        title: "Iterable vs Iterator",
        itemA: "Iterable",
        itemB: "Iterator",
        comparison: [
          "Dunder method: Implements `__iter__()` returning an iterator vs Implements `__iter__()` AND `__next__()`",
          "State: Can be iterated multiple times (like a list) vs State is consumed progressively and exhausted",
          "Examples: list, str, dict, tuple vs iter(list), generator objects, enumerate"
        ]
      },
      {
        title: "Generator vs List",
        itemA: "Generator",
        itemB: "List",
        comparison: [
          "Memory: O(1) constant memory (yields 1 at a time) vs O(N) memory (stores all elements in RAM)",
          "Evaluation: Lazy on-demand vs Eager instant evaluation",
          "Reusability: Single-pass only vs Multiple iterations, slicing, and index access"
        ]
      }
    ],
    realWorldUse: "Reading multi-gigabyte CSV/log files line by line, generating infinite sequences, streaming LLM response tokens.",
    interviewPerspective: [
      {
        question: "Explain the difference between `yield` and `return`.",
        trap: "Simply stating 'yield is for generators'.",
        expectedAnswer: "`return` exits the function permanently and deallocates the stack frame. `yield` produces a value and suspends the function's execution frame, freezing local variables and the instruction pointer so it can resume on the next `next()` call."
      }
    ],
    questions: [
      {
        id: "q15_1",
        question: "What exception signals the termination of an iterator in Python?",
        choices: ["IteratorError", "StopIteration", "IndexError", "GeneratorExit"],
        correctIndex: 1,
        hints: ["It is raised by __next__() when no further items exist."],
        solutionCode: `it = iter([1])\nnext(it) # 1\n# next(it) raises StopIteration`,
        explanation: "The Python iterator protocol dictates that `StopIteration` must be raised when iteration finishes."
      }
    ],
    revisionSheet: [
      "Iterable: implements `__iter__()`.",
      "Iterator: implements `__iter__()` and `__next__()`.",
      "`yield` pauses function frame execution; `yield from` delegates to sub-generators.",
      "Generators are single-pass only and cannot be rewound."
    ],
    subtopics: [
      { id: "s15_1", text: "Iterable", isStarred: false },
      { id: "s15_2", text: "Iterator", isStarred: false },
      { id: "s15_3", text: "iter()", isStarred: false },
      { id: "s15_4", text: "next()", isStarred: false },
      { id: "s15_5", text: "StopIteration", isStarred: false },
      { id: "s15_6", text: "Iterator protocol", isStarred: false },
      { id: "s15_7", text: "__iter__()", isStarred: false },
      { id: "s15_8", text: "__next__()", isStarred: false },
      { id: "s15_9", text: "Creating custom iterators", isStarred: false },
      { id: "s15_10", text: "Generators", isStarred: false },
      { id: "s15_11", text: "yield", isStarred: false },
      { id: "s15_12", text: "Generator expressions", isStarred: false },
      { id: "s15_13", text: "Generator functions", isStarred: false },
      { id: "s15_14", text: "yield from", isStarred: false },
      { id: "s15_15", text: "Lazy evaluation", isStarred: false },
      { id: "s15_16", text: "Generator advantages", isStarred: false },
      { id: "s15_17", text: "Generator vs list", isStarred: false }
    ],
    starterCode: `# 15. Iterators & Generators
def prime_stream(limit):
    def is_prime(num):
        if num < 2: return False
        return all(num % d != 0 for d in range(2, int(num**0.5) + 1))
    
    n = 2
    while n <= limit:
        if is_prime(n):
            yield n
        n += 1

print("Primes up to 30:", list(prime_stream(30)))`
  },

  // ───  
  {
    id: "comprehensions",
    topicNum: 16,
    title: "16. Comprehensions",
    category: "Functions",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §5.1.3",
    docUrl: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions",
    summary: "List, set, dict, and generator comprehensions, nested loops, conditional filtering, and readability guidelines.",
    whatIsIt: "Comprehensions are concise syntactic constructs that transform and filter iterables into new lists, sets, dictionaries, or generator expressions in a single readable line.",
    whyDoesItExist: "To replace boilerplate for-loops, eliminate append() method lookup overhead, and express data transformations idiomatically.",
    syntax: `# List:      [expr for item in iterable if condition]
# Set:       {expr for item in iterable if condition}
# Dict:      {key_expr: val_expr for item in iterable if condition}
# Generator: (expr for item in iterable if condition)

# If-Else Transformation:
# [true_expr if condition else false_expr for item in iterable]`,
    basicExample: `raw_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
# Squares of even numbers
even_squares = [x**2 for x in raw_numbers if x % 2 == 0]
print("Even squares:", even_squares)

# Set comprehension (deduplicates automatically)
words = ["python", "java", "PYTHON", "rust", "Java"]
unique_lower = {w.lower() for w in words}
print("Unique lower set:", unique_lower)`,
    stepByStepExecution: `CPython Bytecode Optimization in Comprehensions:
1. In Python 3.12, comprehensions are inlined or run as dedicated code blocks using the specialized LIST_APPEND opcode.
2. Unlike a traditional loop that performs 'getattr' lookup on 'list.append' for each iteration, LIST_APPEND pushes directly onto the internal C array, executing ~20-30% faster than manual for-loops.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Filtering vs Transformation (if vs if-else)",
        code: `nums = [1, 2, 3, 4, 5]
# 1. Filtering (if at the END):
evens_only = [x for x in nums if x % 2 == 0]

# 2. Transformation (if-else at the BEGINNING):
labels = ["EVEN" if x % 2 == 0 else "ODD" for x in nums]

print("Filtered:", evens_only)
print("Transformed:", labels)`,
        explanation: "Filtering conditions belong at the end; value mapping ternary expressions belong before the `for` keyword."
      },
      {
        level: "Intermediate",
        title: "Flattening a Nested Matrix",
        code: `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
# Read left-to-right matching loop nesting order:
flattened = [val for row in matrix for val in row]
print("Flattened list:", flattened)`,
        explanation: "Multiple `for` clauses in comprehensions execute in the exact order they would be written as nested loops."
      },
      {
        level: "Tricky",
        title: "Generator Expression vs List Comprehension Memory",
        code: `import sys

list_comp = [x for x in range(100000)]
gen_exp = (x for x in range(100000))

print("List memory:", sys.getsizeof(list_comp), "bytes")
print("Generator memory:", sys.getsizeof(gen_exp), "bytes")`,
        explanation: "Generator expressions compute items lazily, requiring only ~100-200 bytes regardless of size."
      }
    ],
    commonMistakes: [
      {
        title: "Overly Complex Nested Comprehensions",
        wrongCode: `res = [f(x, y, z) for x in a if cond1(x) for y in b if cond2(y) for z in c if cond3(z)]`,
        correctCode: `# Break down into readable loops or generator pipeline`,
        whyItFails: "Violates the Zen of Python ('Readability counts'). Deeply nested comprehensions are hard to debug and review."
      }
    ],
    importantDifferences: [
      {
        title: "List Comprehension vs Generator Expression",
        itemA: "[x for x in seq]",
        itemB: "(x for x in seq)",
        comparison: [
          "Output: Allocates an entire list in RAM vs Returns a lazy generator iterator",
          "Memory: O(N) memory proportional to size vs O(1) constant footprint (~112 bytes)",
          "Access: Supports len(), indexing, slicing vs Consumed once sequentially via next()"
        ]
      }
    ],
    realWorldUse: "Cleaning API responses, extracting database columns, preparing feature vectors for machine learning models.",
    interviewPerspective: [
      {
        question: "Why are list comprehensions faster than standard for-loops with append()?",
        trap: "Believing they bypass the Python interpreter.",
        expectedAnswer: "Comprehensions use the specialized C-level bytecode opcode LIST_APPEND, which avoids looking up the `append` attribute on the list object on every single iteration."
      }
    ],
    questions: [
      {
        id: "q16_1",
        question: "What is the output of `[x for x in range(5) if x % 2 == 0]`?",
        choices: ["[0, 2, 4]", "[2, 4]", "[1, 3]", "[0, 1, 2, 3, 4]"],
        correctIndex: 0,
        hints: ["0 % 2 is 0, so 0 is included."],
        solutionCode: `print([x for x in range(5) if x % 2 == 0]) # [0, 2, 4]`,
        explanation: "range(5) produces 0, 1, 2, 3, 4. Even numbers are 0, 2, 4."
      }
    ],
    revisionSheet: [
      "Use comprehensions for concise, readable transformations.",
      "Syntax for filtering: `[x for x in seq if cond]`.",
      "Syntax for ternary mapping: `[A if cond else B for x in seq]`.",
      "Parentheses `(x for x in seq)` create a generator expression."
    ],
    subtopics: [
      { id: "s16_1", text: "List comprehension", isStarred: false },
      { id: "s16_2", text: "Set comprehension", isStarred: false },
      { id: "s16_3", text: "Dictionary comprehension", isStarred: false },
      { id: "s16_4", text: "Generator comprehension", isStarred: false },
      { id: "s16_5", text: "Nested comprehensions", isStarred: false },
      { id: "s16_6", text: "Conditional comprehensions", isStarred: false },
      { id: "s16_7", text: "Multiple loops", isStarred: false },
      { id: "s16_8", text: "Comprehension vs normal loop", isStarred: false }
    ],
    starterCode: `# 16. Comprehensions
servers = [
    {"host": "auth.prod", "healthy": True, "load": 0.45},
    {"host": "db.prod", "healthy": False, "load": 0.95},
    {"host": "api.prod", "healthy": True, "load": 0.60}
]

healthy_hosts = [s["host"] for s in servers if s["healthy"]]
host_status_map = {s["host"]: ("OK" if s["healthy"] else "FAIL") for s in servers}

print("Healthy:", healthy_hosts)
print("Status map:", host_status_map)`
  }
];
