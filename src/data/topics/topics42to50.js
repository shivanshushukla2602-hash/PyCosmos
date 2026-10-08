// Topics 42 to 50: Web Development, Data Science, AI/ML, Projects, Professional, Built-ins, Confusing Concepts, Problem Solving
// 42. Web Development, 43. Data Science, 44. Machine Learning, 45. Advanced AI/ML,
// 46. Projects, 47. Professional Development, 48. Built-in Functions, 49. Confusing Concepts, 50. Problem Solving

export const TOPICS_42_TO_50 = [
  // ─── 42. Web Development with Python ─────────────────────────────────────────
  {
    id: "web-development-with-python",
    topicNum: 42,
    title: "42. Web Development with Python",
    category: "Development & AI/ML",
    level: "Advanced",
    stars: "",
    docRefTag: "Docs Frameworks",
    docUrl: "https://docs.python.org/3/howto/webservers.html",
    summary: "Flask microframework, Django full-stack batteries-included architecture (ORM, Admin), and FastAPI modern asynchronous APIs with Pydantic validation.",
    whatIsIt: "Web development in Python covers building web servers, RESTful APIs, and full-stack applications using WSGI (Flask, Django) and ASGI (FastAPI) frameworks.",
    whyDoesItExist: "To serve web pages, power mobile app backends, deliver high-performance microservices, and expose AI/ML models as accessible HTTP endpoints.",
    syntax: `# FastAPI ASGI Example:
# from fastapi import FastAPI
# from pydantic import BaseModel
# app = FastAPI()
# @app.get("/items/{item_id}")
# async def read_item(item_id: int):
#     return {"item_id": item_id, "status": "active"}`,
    basicExample: `# Simulated FastAPI route handler with Pydantic model:
class QueryRequest:
    def __init__(self, prompt: str, max_tokens: int = 100):
        if not prompt: raise ValueError("Prompt cannot be empty")
        self.prompt = prompt
        self.max_tokens = max_tokens

def generate_endpoint(payload: QueryRequest):
    return {"status": 200, "response": f"Generated response for '{payload.prompt}'"}

req = QueryRequest("Explain Python GIL", 50)
print("Endpoint response:", generate_endpoint(req))`,
    stepByStepExecution: `WSGI vs ASGI Web Server Gateway Interfaces:
1. WSGI (Web Server Gateway Interface - PEP 3333):
   - Synchronous, blocking request-response model used by Django and Flask.
   - Requires multi-threading or worker processes (gunicorn) to scale concurrent requests.
2. ASGI (Asynchronous Server Gateway Interface):
   - Built on Python \'asyncio\' used by FastAPI and Starlette.
   - Supports long-lived connections, WebSockets, background tasks, and streaming HTTP responses on a single event loop.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Flask-Style Minimal Routing Logic",
        code: `class MiniRouter:
    def __init__(self): self.routes = {}
    def route(self, path):
        def decorator(f):
            self.routes[path] = f
            return f
        return decorator

router = MiniRouter()

@router.route("/api/health")
def health():
    return {"status": "HEALTHY", "uptime": 99.9}

print("Route dispatch:", router.routes["/api/health"]())`,
        explanation: "Flask uses function decorators to register URL paths with handler functions."
      },
      {
        level: "Intermediate",
        title: "FastAPI Dependency Injection Pattern",
        code: `def get_db_session():
    # Setup connection
    session = {"connected": True}
    return session

def get_user_profile(user_id: int, db=get_db_session()):
    return {"user_id": user_id, "db_status": db["connected"]}

print("Service result:", get_user_profile(42))`,
        explanation: "FastAPI uses `Depends()` for clean dependency injection of auth, databases, and caches."
      },
      {
        level: "Tricky",
        title: "Django ORM QuerySet Lazy Evaluation",
        code: `# In Django ORM, queries are lazy:
# users = User.objects.filter(is_active=True) # Zero SQL executed yet!
# users = users.filter(role="Admin")          # Still zero SQL!
# for u in users:                              # SQL executes HERE on first iteration!`,
        explanation: "Django QuerySets chain filters in memory and only query the database when evaluated."
      }
    ],
    commonMistakes: [
      {
        title: "N+1 Query Problem in ORMs",
        wrongCode: `# for order in Order.objects.all():
#     print(order.customer.name) # Fires a separate SQL query for EVERY single order!`,
        correctCode: `# Use select_related (SQL JOIN) or prefetch_related:
# Order.objects.select_related("customer").all()`,
        whyItFails: "Executing database queries inside loops creates hundreds of redundant network roundtrips."
      }
    ],
    importantDifferences: [
      {
        title: "Flask vs Django vs FastAPI",
        itemA: "FastAPI",
        itemB: "Django",
        comparison: [
          "Architecture: Lightweight ASGI async-first API framework vs Monolithic full-stack batteries-included WSGI framework",
          "Validation: Native Pydantic + OpenAPI auto-documentation vs Django Forms + Django ORM models",
          "Best for: Microservices, AI/ML APIs, high concurrency vs Content sites, e-commerce, complex admin backends"
        ]
      }
    ],
    realWorldUse: "Building AI endpoints (FastAPI serving Hugging Face models), SaaS platforms (Django), microservices (Flask).",
    interviewPerspective: [
      {
        question: "Explain the difference between WSGI and ASGI.",
        trap: "Saying ASGI is just faster WSGI.",
        expectedAnswer: "WSGI (PEP 3333) is synchronous: each request blocks a server worker thread until finished. ASGI is asynchronous: built on Python's `asyncio` event loop, it supports async request handlers, WebSockets, HTTP/2, and long-lived server-sent event (SSE) streams on a single process."
      }
    ],
    questions: [
      {
        id: "q42_1",
        question: "Which modern Python framework provides automatic interactive Swagger/OpenAPI documentation?",
        choices: ["Flask", "FastAPI", "Bottle", "TurboGears"],
        correctIndex: 1,
        hints: ["It uses Pydantic schemas to generate OpenAPI specs automatically."],
        solutionCode: `# FastAPI auto-generates /docs and /redoc`,
        explanation: "FastAPI automatically generates interactive OpenAPI/Swagger documentation at `/docs`."
      }
    ],
    revisionSheet: [
      "FastAPI: Modern, async, typed with Pydantic, auto-generates OpenAPI docs.",
      "Flask: Lightweight WSGI microframework for small APIs.",
      "Django: Full-stack framework with built-in ORM, Admin panel, and auth.",
      "Always use `select_related()` / `prefetch_related()` in ORMs to eliminate N+1 queries."
    ],
    subtopics: [
      { id: "s42_1", text: "Flask basics", isStarred: false },
      { id: "s42_2", text: "Routes", isStarred: false },
      { id: "s42_3", text: "HTTP methods", isStarred: false },
      { id: "s42_4", text: "Templates", isStarred: false },
      { id: "s42_5", text: "Forms", isStarred: false },
      { id: "s42_6", text: "APIs", isStarred: false },
      { id: "s42_7", text: "JSON responses", isStarred: false },
      { id: "s42_8", text: "Django architecture", isStarred: false },
      { id: "s42_9", text: "ORM", isStarred: false },
      { id: "s42_10", text: "FastAPI basics", isStarred: false },
      { id: "s42_11", text: "Routing", isStarred: false },
      { id: "s42_12", text: "Pydantic", isStarred: false }
    ],
    starterCode: `# 42. Web Development Concepts: Request Dispatcher
routes = {}
def get(path):
    def dec(fn):
        routes[("GET", path)] = fn
        return fn
    return dec

@get("/api/v1/ping")
def ping():
    return {"status": "PONG", "cluster": "alpha"}

print("Available endpoints:", list(routes.keys()))
print("Ping response:", routes[("GET", "/api/v1/ping")]())`
  },

  // ─── 43. Data Science with Python ───────────────────────────────────────────
  {
    id: "data-science-with-python",
    topicNum: 43,
    title: "43. Data Science with Python",
    category: "Development & AI/ML",
    level: "Advanced",
    stars: "",
    docRefTag: "NumPy & Pandas",
    docUrl: "https://numpy.org/doc/stable/",
    summary: "NumPy ndarrays, vectorization, broadcasting, matrix operations, Pandas Series/DataFrames, aggregations, and data visualization.",
    whatIsIt: "Data Science with Python utilizes high-performance C-accelerated libraries (NumPy, Pandas, Matplotlib, Seaborn) to ingest, clean, manipulate, and analyze tabular and matrix datasets.",
    whyDoesItExist: "Pure Python loops are too slow for millions of numerical operations. NumPy executes vectorized matrix operations at raw C/Fortran SIMD CPU speeds.",
    syntax: `# Vectorized NumPy array math (No for-loops!):
# import numpy as np
# arr = np.array([1, 2, 3, 4])
# squared = arr ** 2 # Vectorized SIMD operation

# Pandas DataFrame indexing:
# import pandas as pd
# df = pd.read_csv("data.csv")
# active = df[df["status"] == "active"].groupby("department")["salary"].mean()`,
    basicExample: `# Pure Python simulation of vectorization vs loops:
data = list(range(1000))
# Vectorized mental model:
squared = [x**2 for x in data]
filtered = [x for x in squared if x > 500000]
print(f"Total processed: {len(data)}, Filtered count: {len(filtered)}")`,
    stepByStepExecution: `NumPy Vectorization & Memory Strides:
1. A Python \'list\' stores an array of pointers to individual heap \'PyObject\' instances (high cache miss overhead).
2. A NumPy \'ndarray\' stores a contiguous block of homogeneous primitive C types (e.g. \'int64\', \'float32\').
3. Operations use SIMD (Single Instruction, Multiple Data) CPU registers, processing 4 to 8 floating point numbers per clock cycle with zero Python interpreter overhead.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "NumPy Broadcasting Principle",
        code: `# Broadcasting allows operations between arrays of different shapes:
# 1D array (3 elements) + Scalar (1 element)
# [10, 20, 30] + 5 -> [15, 25, 35]
# Matrix (3x3) * Vector (1x3) stretches across rows automatically without duplicating data!`,
        explanation: "Broadcasting avoids allocating redundant memory by conceptually stretching smaller arrays across matching dimensions."
      },
      {
        level: "Intermediate",
        title: "Pandas groupby and Aggregation Pipeline",
        code: `# Typical Pandas analytics pipeline:
# df = pd.DataFrame({
#     "region": ["East", "West", "East", "West"],
#     "sales": [250, 180, 320, 290]
# })
# report = df.groupby("region")["sales"].agg(["mean", "sum", "count"])
print("Aggregated analytics report successfully compiled.")`,
        explanation: "`groupby()` splits data into groups, applies aggregation functions, and combines results."
      },
      {
        level: "Tricky",
        title: "Pandas SettingWithCopyWarning Trap",
        code: `# Bug trap: Chained indexing
# df[df["age"] > 30]["salary"] = 100000 # Triggers SettingWithCopyWarning!
# Correct idiom using .loc:
# df.loc[df["age"] > 30, "salary"] = 100000`,
        explanation: "Chained indexing `df[][]` may modify a temporary copy instead of the original DataFrame. Always use `.loc[row_indexer, col_indexer]`."
      }
    ],
    commonMistakes: [
      {
        title: "Iterating Over a Pandas DataFrame with a for-loop (iterrows)",
        wrongCode: `# for idx, row in df.iterrows(): # AVOID! 1000x SLOWER than vectorized methods!
#     df.at[idx, 'total'] = row['price'] * row['qty']`,
        correctCode: `# df['total'] = df['price'] * df['qty'] # Vectorized C execution`,
        whyItFails: "Using Python for-loops on DataFrames circumvents vectorization and incurs massive boxing/unboxing overhead."
      }
    ],
    importantDifferences: [
      {
        title: "Python List vs NumPy ndarray",
        itemA: "Python List",
        itemB: "NumPy ndarray",
        comparison: [
          "Memory: Array of pointers to heterogeneous PyObjects vs Contiguous block of homogeneous C types",
          "Speed: Slower, sequential interpretation vs 50x-100x faster via C/Fortran SIMD vectorization",
          "Operations: Concatenation (`+`), repetition (`*`) vs Element-wise algebraic operations (`arr1 + arr2`)"
        ]
      }
    ],
    realWorldUse: "Financial risk modeling, data cleaning in ETL pipelines, Exploratory Data Analysis (EDA) for machine learning.",
    interviewPerspective: [
      {
        question: "What is NumPy broadcasting and what are the two rules for broadcast compatibility?",
        trap: "Thinking arrays must have the exact same shape.",
        expectedAnswer: "Broadcasting describes how NumPy treats arrays with different shapes during arithmetic operations. Two dimensions are compatible when: 1. They are equal, or 2. One of them is 1. If trailing dimensions match, NumPy stretches the dimension of size 1 across the other without memory duplication."
      }
    ],
    questions: [
      {
        id: "q43_1",
        question: "Why is a NumPy array faster than a standard Python list for numeric calculations?",
        choices: [
          "NumPy compiles Python code to Java",
          "NumPy arrays store contiguous homogeneous C types in memory and utilize CPU SIMD vectorization",
          "NumPy disables garbage collection",
          "NumPy uses multiple threads automatically for all operations"
        ],
        correctIndex: 1,
        hints: ["Think about contiguous memory layout vs pointers to objects."],
        solutionCode: `# Contiguous memory + SIMD instructions`,
        explanation: "NumPy uses contiguous C memory buffers and vectorization, avoiding Python object pointer lookups."
      }
    ],
    revisionSheet: [
      "Never loop over DataFrames with Python for-loops; use vectorized operations.",
      "NumPy arrays store contiguous C data types.",
      "Use `df.loc[rows, cols]` instead of chained indexing (`df[][]`).",
      "Broadcasting enables element-wise operations on arrays of differing shapes."
    ],
    subtopics: [
      { id: "s43_1", text: "NumPy", isStarred: false },
      { id: "s43_2", text: "Arrays", isStarred: false },
      { id: "s43_3", text: "Dimensions", isStarred: false },
      { id: "s43_4", text: "Indexing", isStarred: false },
      { id: "s43_5", text: "Slicing", isStarred: false },
      { id: "s43_6", text: "Broadcasting", isStarred: false },
      { id: "s43_7", text: "Vectorization", isStarred: false },
      { id: "s43_8", text: "Matrix operations", isStarred: false },
      { id: "s43_9", text: "Pandas", isStarred: false },
      { id: "s43_10", text: "Series", isStarred: false },
      { id: "s43_11", text: "DataFrame", isStarred: false },
      { id: "s43_12", text: "groupby()", isStarred: false },
      { id: "s43_13", text: "Aggregation", isStarred: false },
      { id: "s43_14", text: "Data cleaning", isStarred: false }
    ],
    starterCode: `# 43. Data Science: Matrix Simulation
matrix = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
]

# Column sums (pure python simulation of axis=0)
col_sums = [sum(row[col_idx] for row in matrix) for col_idx in range(len(matrix[0]))]
print("Column-wise sums:", col_sums)`
  },

  // ─── 44. Machine Learning with Python ───────────────────────────────────────
  {
    id: "machine-learning-with-python",
    topicNum: 44,
    title: "44. Machine Learning with Python",
    category: "Development & AI/ML",
    level: "Advanced",
    stars: "",
    docRefTag: "scikit-learn Docs",
    docUrl: "https://scikit-learn.org/stable/",
    summary: "ML lifecycle, train/test split, feature scaling, encoding, scikit-learn estimators, pipelines, cross-validation, and metrics.",
    whatIsIt: "Machine Learning with Python involves training statistical models to detect patterns in empirical data and make predictions on unseen inputs using scikit-learn.",
    whyDoesItExist: "To automate classification, regression, clustering, and ranking tasks where explicit programmatic rules are impossible or intractable to handcraft.",
    syntax: `# Standard scikit-learn estimator pattern:
# from sklearn.pipeline import Pipeline
# from sklearn.preprocessing import StandardScaler
# from sklearn.ensemble import RandomForestClassifier

# pipeline = Pipeline([
#     ("scaler", StandardScaler()),
#     ("model", RandomForestClassifier(n_estimators=100))
# ])
# pipeline.fit(X_train, y_train)
# predictions = pipeline.predict(X_test)`,
    basicExample: `# Mathematical simulation of Linear Regression prediction: y = m*x + b
class SimpleLinearModel:
    def __init__(self, weight: float, bias: float):
        self.w = weight
        self.b = bias

    def predict(self, x_values: list[float]) -> list[float]:
        return [self.w * x + self.b for x in x_values]

model = SimpleLinearModel(weight=2.5, bias=10.0)
inputs = [1.0, 2.0, 3.0, 4.0]
print("Model predictions:", model.predict(inputs))`,
    stepByStepExecution: `The Machine Learning Lifecycle Pipeline:
1. Data Ingestion & Splitting: Divide historical data into Training set (e.g. 80%) and Test set (20%) via \'train_test_split\'.
2. Preprocessing & Feature Engineering: Impute missing values, scale numerical features (StandardScaler), encode categorical features (OneHotEncoder).
3. Model Training (\'fit\'): Adjust internal model parameters (weights, decision boundaries) to minimize loss on training data.
4. Model Evaluation (\'predict\'): Evaluate precision, recall, F1-score, and ROC-AUC on the held-out test set to ensure generalizability.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "The Uniform fit() and predict() API",
        code: `# scikit-learn's brilliant design: EVERY model adheres to identical interface:
# 1. estimator.fit(X, y) -> Trains model
# 2. estimator.predict(X_new) -> Makes predictions
# 3. estimator.score(X, y) -> Evaluates accuracy
print("Estimator protocol verified.")`,
        explanation: "Every algorithm in scikit-learn (RandomForest, SVM, LinearRegression) implements the same Estimator protocol."
      },
      {
        level: "Intermediate",
        title: "Preventing Data Leakage with sklearn.pipeline.Pipeline",
        code: `# Pipeline bundles preprocessing AND the model:
# When cross-validating, scaling transforms fit ONLY on the training fold,
# preventing data leakage from the validation fold!
print("Pipeline ensures zero data leakage across CV folds.")`,
        explanation: "Fitting scalers on the entire dataset before splitting leaks test information into the training phase."
      },
      {
        level: "Tricky",
        title: "Cross-Validation vs Single Train/Test Split",
        code: `# K-Fold Cross Validation:
# Divides data into K equal folds.
# Iteratively trains on K-1 folds and evaluates on the K-th fold.
# Returns K distinct accuracy scores to assess model variance.`,
        explanation: "Single train/test splits can yield misleading results due to lucky or unlucky data partitioning."
      }
    ],
    commonMistakes: [
      {
        title: "Data Leakage: Fitting Scalers Before Splitting",
        wrongCode: `# scaler.fit(ALL_DATA) # DATA LEAKAGE! Test distribution leaks into scaler!
# X_train, X_test = split(ALL_DATA)`,
        correctCode: `# X_train, X_test = split(ALL_DATA)
# scaler.fit(X_train)
# X_test_scaled = scaler.transform(X_test)`,
        whyItFails: "Fitting preprocessing steps on test data causes optimistic evaluation that fails in real-world production."
      }
    ],
    importantDifferences: [
      {
        title: "Overfitting vs Underfitting",
        itemA: "Overfitting (High Variance)",
        itemB: "Underfitting (High Bias)",
        comparison: [
          "Performance: 99% accuracy on training data, poor on test data vs Poor accuracy on both training and test data",
          "Model complexity: Overly complex (memorized training noise) vs Overly simplistic (failed to learn underlying pattern)",
          "Remedy: Regularization, more data, pruning trees, dropout vs Increase model capacity, add relevant features"
        ]
      }
    ],
    realWorldUse: "Customer churn prediction, credit card fraud detection, recommendation ranking, medical image classification.",
    interviewPerspective: [
      {
        question: "What is data leakage and how do scikit-learn Pipelines prevent it?",
        trap: "Only explaining leakage as copying test data.",
        expectedAnswer: "Data leakage occurs when information from outside the training dataset (such as test set mean/variance during scaling) influences model training. Using a `Pipeline` encapsulates feature transformations so that `.fit()` is called strictly on the training fold during cross-validation, while `.transform()` is applied to the validation fold."
      }
    ],
    questions: [
      {
        id: "q44_1",
        question: "Why should you never call `.fit()` on your test dataset?",
        choices: [
          "It raises a SyntaxError",
          "It causes data leakage, corrupting the validity of your model evaluation",
          "Test data has no labels",
          "Models cannot fit test data"
        ],
        correctIndex: 1,
        hints: ["Test data must represent completely unseen real-world observations."],
        solutionCode: `# scaler.transform(X_test), never fit(X_test)`,
        explanation: "Calling `.fit()` on test data leaks test distribution information, invalidating performance evaluation."
      }
    ],
    revisionSheet: [
      "Always split data into Train and Test sets before fitting scalers.",
      "Use `Pipeline` to prevent data leakage.",
      "Use K-Fold Cross-Validation (`cross_val_score`) to measure variance.",
      "Precision = True Positives / (TP + FP); Recall = True Positives / (TP + FN)."
    ],
    subtopics: [
      { id: "s44_1", text: "ML workflow", isStarred: false },
      { id: "s44_2", text: "Dataset", isStarred: false },
      { id: "s44_3", text: "Features", isStarred: false },
      { id: "s44_4", text: "Labels", isStarred: false },
      { id: "s44_5", text: "Training/testing", isStarred: false },
      { id: "s44_6", text: "Data preprocessing", isStarred: false },
      { id: "s44_7", text: "Feature scaling", isStarred: false },
      { id: "s44_8", text: "Encoding", isStarred: false },
      { id: "s44_9", text: "Train/test split", isStarred: false },
      { id: "s44_10", text: "Cross-validation", isStarred: false },
      { id: "s44_11", text: "Regression", isStarred: false },
      { id: "s44_12", text: "Classification", isStarred: false },
      { id: "s44_13", text: "scikit-learn", isStarred: false },
      { id: "s44_14", text: "Pipelines", isStarred: false }
    ],
    starterCode: `# 44. Machine Learning Evaluation Metrics
actual =    [1, 1, 0, 1, 0, 0, 1]
predicted = [1, 0, 0, 1, 0, 0, 1]

tp = sum(a == 1 and p == 1 for a, p in zip(actual, predicted))
fp = sum(a == 0 and p == 1 for a, p in zip(actual, predicted))
fn = sum(a == 1 and p == 0 for a, p in zip(actual, predicted))

precision = tp / (tp + fp) if (tp + fp) else 0
recall = tp / (tp + fn) if (tp + fn) else 0

print(f"Precision: {precision:.2%}, Recall: {recall:.2%}")`
  },

  // ─── 45. Advanced AI/ML Python ──────────────────────────────────────────────
  {
    id: "advanced-ai-ml-python",
    topicNum: 45,
    title: "45. Advanced AI/ML Python",
    category: "Development & AI/ML",
    level: "Advanced",
    stars: "",
    docRefTag: "PyTorch & Transformers",
    docUrl: "https://pytorch.org/docs/stable/",
    summary: "PyTorch neural networks, tensors, backpropagation (Autograd), Transformers, Hugging Face, vector embeddings, Vector DBs, and RAG architectures.",
    whatIsIt: "Advanced AI/ML in Python encompasses Deep Learning with PyTorch, Transformer language models, vector embeddings, and Retrieval-Augmented Generation (RAG) pipelines.",
    whyDoesItExist: "To build modern generative AI applications, fine-tune foundation models (LLMs), build semantic search systems, and deploy autonomous AI agents.",
    syntax: `# PyTorch Tensor & Automatic Differentiation:
# import torch
# import torch.nn as nn
# x = torch.tensor([2.0], requires_grad=True)
# y = x ** 3
# y.backward() # Computes dy/dx = 3*x^2 = 12.0
# print(x.grad) # tensor([12.])`,
    basicExample: `# Pure Python simulation of Dense Layer Forward Pass (dot product + ReLU):
def relu(x): return max(0.0, x)

inputs = [0.5, 1.2, -0.8]
weights = [0.4, -0.5, 0.9]
bias = 0.1

z = sum(i * w for i, w in zip(inputs, weights)) + bias
output = relu(z)
print("Forward activation output:", output)`,
    stepByStepExecution: `Retrieval-Augmented Generation (RAG) Architecture:
1. Ingestion: Documents are chunked into 500-token segments.
2. Embedding Generation: Each chunk passes through an embedding model (e.g. OpenAI text-embedding-3 or Hugging Face BERT) producing a dense float vector (e.g. 1536 dimensions).
3. Vector Indexing: Vectors stored in a Vector DB (Pinecone, ChromaDB, pgvector) with HNSW graph indexing.
4. User Query: Query is converted to a vector embedding.
5. Cosine Similarity Search: Vector DB retrieves top-K nearest document chunks.
6. Augmented Prompt: Retrieved context is injected into the LLM system prompt.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Cosine Similarity Between Vector Embeddings",
        code: `import math

def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    return dot / (mag1 * mag2)

vec_ai = [0.95, 0.88, 0.12]
vec_ml = [0.91, 0.85, 0.15]
vec_cooking = [0.05, 0.12, 0.98]

print("Sim(AI, ML):", f"{cosine_similarity(vec_ai, vec_ml):.4f}")
print("Sim(AI, Cooking):", f"{cosine_similarity(vec_ai, vec_cooking):.4f}")`,
        explanation: "Cosine similarity measures the cosine of the angle between two embedding vectors, evaluating semantic relatedness."
      },
      {
        level: "Intermediate",
        title: "PyTorch Module Structure Concept",
        code: `# class SimpleClassifier(nn.Module):
#     def __init__(self, in_features, num_classes):
#         super().__init__()
#         self.linear = nn.Linear(in_features, 64)
#         self.relu = nn.ReLU()
#         self.out = nn.Linear(64, num_classes)
#     def forward(self, x):
#         return self.out(self.relu(self.linear(x)))
print("PyTorch nn.Module forward graph concept verified.")`,
        explanation: "`nn.Module` is the base class for all neural network architectures in PyTorch."
      },
      {
        level: "Tricky",
        title: "Streaming Responses from LLM APIs",
        code: `# When generating text from LLMs, streaming tokens (Server-Sent Events)
# provides instantaneous interactive feedback to users:
# for chunk in client.chat.completions.create(model="gpt-4o", stream=True):
#     yield chunk.choices[0].delta.content or ""`,
        explanation: "Streaming uses generator protocols to yield tokens as they are sampled from the model's logits."
      }
    ],
    commonMistakes: [
      {
        title: "Tracking Gradients in Evaluation Mode (CUDA OOM)",
        wrongCode: `# During evaluation/testing:
# output = model(images) # Leaves computational graph in VRAM, causing Out-Of-Memory!`,
        correctCode: `# with torch.no_grad(): # Disables Autograd engine, freeing GPU VRAM
#     output = model(images)`,
        whyItFails: "PyTorch Autograd stores intermediate tensor activations for backward pass backpropagation unless explicitly disabled with `torch.no_grad()`."
      }
    ],
    importantDifferences: [
      {
        title: "Fine-Tuning vs RAG",
        itemA: "Fine-Tuning (Model Training)",
        itemB: "RAG (Retrieval Augmented Generation)",
        comparison: [
          "Mechanism: Modifies internal weights of the neural network vs Injects fresh knowledge dynamically into the prompt context",
          "Cost: High GPU compute cost, static snapshot in time vs Low compute cost, real-time updatable knowledge base",
          "Hallucinations: Still susceptible to hallucinating vs Drastically reduced through traceable document citations"
        ]
      }
    ],
    realWorldUse: "Enterprise semantic document search, AI customer support copilots, autonomous coding agents.",
    interviewPerspective: [
      {
        question: "What is the Transformer Self-Attention mechanism in NLP?",
        trap: "Reciting equations without intuition.",
        expectedAnswer: "Self-attention computes dynamic weights between every pair of tokens in a sequence using Query (Q), Key (K), and Value (V) matrices. It allows words to attend to contextual relationships regardless of their distance (e.g. connecting 'bank' to 'river' or 'money'), solving the vanishing gradient bottlenecks of older RNNs."
      }
    ],
    questions: [
      {
        id: "q45_1",
        question: "What context manager should be used during PyTorch model inference to save GPU memory and disable backprop tracking?",
        choices: ["torch.eval()", "torch.no_grad()", "torch.freeze()", "torch.detach()"],
        correctIndex: 1,
        hints: ["It stops tracking gradients."],
        solutionCode: `import torch\nwith torch.no_grad():\n    pass`,
        explanation: "`with torch.no_grad():` deactivates the Autograd engine, slashing memory consumption during inference."
      }
    ],
    revisionSheet: [
      "PyTorch tensors support GPU acceleration (`tensor.to('cuda')`).",
      "Always use `with torch.no_grad():` during model evaluation/inference.",
      "RAG combines Vector DB semantic search with LLM reasoning.",
      "Cosine similarity measures the angle between normalized vector embeddings."
    ],
    subtopics: [
      { id: "s45_1", text: "NumPy deeply", isStarred: false },
      { id: "s45_2", text: "Pandas deeply", isStarred: false },
      { id: "s45_3", text: "Scikit-learn", isStarred: false },
      { id: "s45_4", text: "TensorFlow", isStarred: false },
      { id: "s45_5", text: "PyTorch", isStarred: false },
      { id: "s45_6", text: "Neural networks", isStarred: false },
      { id: "s45_7", text: "Deep learning", isStarred: false },
      { id: "s45_8", text: "NLP", isStarred: false },
      { id: "s45_9", text: "Computer vision", isStarred: false },
      { id: "s45_10", text: "Transformers", isStarred: false },
      { id: "s45_11", text: "Hugging Face", isStarred: false },
      { id: "s45_12", text: "Embeddings", isStarred: false },
      { id: "s45_13", text: "Vector databases", isStarred: false },
      { id: "s45_14", text: "LLM APIs", isStarred: false },
      { id: "s45_15", text: "RAG", isStarred: false }
    ],
    starterCode: `# 45. Vector Embeddings & Similarity
import math

doc_embedding = [0.8, 0.6, 0.0]
query_embedding = [0.6, 0.8, 0.0]

dot_product = sum(d * q for d, q in zip(doc_embedding, query_embedding))
print("Dot product similarity score:", dot_product)`
  },

  // ───  
  {
    id: "python-project-development",
    topicNum: 46,
    title: "46. Python Project Development",
    category: "Projects & Problem Solving",
    level: "Advanced",
    stars: "Core",
    docRefTag: "Project Architecture",
    docUrl: "https://docs.python.org/3/tutorial/",
    summary: "Beginner, Intermediate, and Advanced project architectures: CLI tools, expense trackers, REST APIs, and full-stack AI applications.",
    whatIsIt: "Project development applies theoretical Python concepts to architect, build, and maintain production-grade applications with clean structure and separation of concerns.",
    whyDoesItExist: "Tutorial knowledge without end-to-end project building leaves gaps in configuration, state management, testing, error recovery, and deployment.",
    syntax: `# Standard Enterprise Python Layout:
# my_application/
# ├── pyproject.toml
# ├── README.md
# ├── .env.example
# ├── src/
# │   └── my_app/
# │       ├── __init__.py
# │       ├── core/
# │       ├── api/
# │       └── db/
# └── tests/
#     ├── conftest.py
#     └── test_core.py`,
    basicExample: `# Modular MVC Architecture in miniature:
class UserModel:
    def __init__(self, username): self.username = username

class UserService:
    def __init__(self): self.repo = []
    def register(self, username):
        user = UserModel(username)
        self.repo.append(user)
        return user

service = UserService()
u = service.register("shivansh")
print("Registered user:", u.username)`,
    stepByStepExecution: `Production Project Build Progression:
1. Level 1 (Beginner): CLI Calculator, To-Do manager, Number guessing game (focus: control flow, functions, file I/O).
2. Level 2 (Intermediate): Expense tracker, File organizer, Weather API consumer, Web scraper (focus: classes, requests, sqlite3).
3. Level 3 (Advanced): Full-stack FastAPI + React app, Authentication system with OTP and JWT, RAG Knowledge Assistant (focus: async, Docker, security, tests).`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Beginner: In-Memory Task Manager",
        code: `class TaskManager:
    def __init__(self): self.tasks = []
    def add(self, title): self.tasks.append({"title": title, "done": False})
    def complete(self, idx): self.tasks[idx]["done"] = True

tm = TaskManager()
tm.add("Learn Python 3.12")
tm.complete(0)
print("Tasks:", tm.tasks)`,
        explanation: "Simple state encapsulation using classes and list dictionaries."
      },
      {
        level: "Intermediate",
        title: "Intermediate: SQLite Persistent Repository",
        code: `import sqlite3

class PersistentRepo:
    def __init__(self):
        self.conn = sqlite3.connect(":memory:")
        self.conn.execute("CREATE TABLE kv (k TEXT PRIMARY KEY, v TEXT)")
    def set(self, k, v):
        self.conn.execute("INSERT OR REPLACE INTO kv VALUES (?, ?)", (k, v))
    def get(self, k):
        r = self.conn.execute("SELECT v FROM kv WHERE k = ?", (k,)).fetchone()
        return r[0] if r else None

repo = PersistentRepo()
repo.set("theme", "cyber_dark")
print("Persisted config:", repo.get("theme"))`,
        explanation: "Separating data access logic from business logic (Repository Pattern)."
      },
      {
        level: "Tricky",
        title: "Advanced: Application Factory Pattern",
        code: `def create_app(config_mode="dev"):
    # Factory instantiates routes, database pools, and middleware
    app = {"env": config_mode, "status": "BOOTED"}
    print(f"App initialized in {config_mode} mode")
    return app

app = create_app("prod")`,
        explanation: "Application factories allow spinning up multiple test instances with isolated configurations."
      }
    ],
    commonMistakes: [
      {
        title: "Monolithic Single-File Spaghetti Code",
        wrongCode: `# Placing models, database queries, HTML templates, and route handlers in 1 massive file`,
        correctCode: `# Separate concerns: models/, services/, api/, core/`,
        whyItFails: "Tightly coupled files become impossible to test and break under team collaboration."
      }
    ],
    importantDifferences: [
      {
        title: "Script vs Production Application",
        itemA: "Ad-hoc Script",
        itemB: "Production Application",
        comparison: [
          "Structure: Single flat `.py` file vs Modular package layout with `src/` directory",
          "Config: Hardcoded variables vs `.env` environment variables",
          "Reliability: Crashes on error vs Comprehensive logging, custom exceptions, and unit test coverage"
        ]
      }
    ],
    realWorldUse: "Building SaaS web apps, data pipeline orchestrators (Airflow), enterprise desktop utilities.",
    interviewPerspective: [
      {
        question: "Explain the Application Factory Pattern and why it is used in web frameworks.",
        trap: "Only explaining global app objects.",
        expectedAnswer: "Instead of creating a global application instance at module level, an application factory is a function that returns a configured app object. This allows dynamically injecting different configurations (e.g. test database vs production database) and ensures test runners have completely isolated app instances."
      }
    ],
    questions: [
      {
        id: "q46_1",
        question: "Where should source code ideally be placed in a modern Python package structure?",
        choices: ["In the root folder", "Inside a `src/<package_name>` directory", "Inside `bin/`", "In a `.py` archive"],
        correctIndex: 1,
        hints: ["The `src/` layout prevents accidental imports of uninstalled local files."],
        solutionCode: `# src/my_package/__init__.py`,
        explanation: "The `src-layout` ensures tests run against installed site-packages, preventing import pollution."
      }
    ],
    revisionSheet: [
      "Follow the `src/` layout for Python project architectures.",
      "Separate business logic (services) from transport logic (API routes).",
      "Always write automated unit tests for core services.",
      "Document APIs with OpenAPI/Swagger and README files."
    ],
    subtopics: [
      { id: "s46_1", text: "Calculator", isStarred: false },
      { id: "s46_2", text: "Number guessing game", isStarred: false },
      { id: "s46_3", text: "Rock-paper-scissors", isStarred: false },
      { id: "s46_4", text: "To-do list", isStarred: false },
      { id: "s46_5", text: "Contact book", isStarred: false },
      { id: "s46_6", text: "Expense tracker", isStarred: false },
      { id: "s46_7", text: "Quiz application", isStarred: false },
      { id: "s46_8", text: "File organizer", isStarred: false },
      { id: "s46_9", text: "Password manager", isStarred: false },
      { id: "s46_10", text: "Weather API application", isStarred: false },
      { id: "s46_11", text: "Web scraper", isStarred: false },
      { id: "s46_12", text: "REST API", isStarred: false },
      { id: "s46_13", text: "Database application", isStarred: false },
      { id: "s46_14", text: "Authentication system", isStarred: false },
      { id: "s46_15", text: "Flask/FastAPI backend", isStarred: false },
      { id: "s46_16", text: "Full-stack application", isStarred: false },
      { id: "s46_17", text: "ML application", isStarred: false },
      { id: "s46_18", text: "AI-powered application", isStarred: false }
    ],
    starterCode: `# 46. Project Architecture: Service Layer Pattern
class AuthService:
    def verify_otp(self, entered_code, valid_code):
        return entered_code == valid_code

auth = AuthService()
print("OTP 849201 check:", auth.verify_otp("849201", "849201"))`
  },

  // ─── 47. Professional Python Development ────────────────────────────────────
  {
    id: "professional-python-development",
    topicNum: 47,
    title: "47. Professional Python Development",
    category: "Projects & Problem Solving",
    level: "Advanced",
    stars: "",
    docRefTag: "CI/CD & Packaging",
    docUrl: "https://packaging.python.org/en/latest/",
    summary: "Git version control, project structure, virtual environments, .gitignore, Docker containerization, CI/CD, linting (Ruff/Oxlint), and pyproject.toml packaging.",
    whatIsIt: "Professional Python covers the enterprise software engineering lifecycle: source control, dependency pinning, linting, continuous integration, Docker multi-stage builds, and deployment.",
    whyDoesItExist: "To ensure that code runs consistently across development, staging, and production environments without 'it works on my machine' defects.",
    syntax: `# Modern Dockerfile for Python:
# FROM python:3.12-slim
# WORKDIR /app
# COPY pyproject.toml .
# RUN pip install --no-cache-dir .
# COPY src/ .
# CMD ["python", "-m", "my_app"]`,
    basicExample: `import platform
import os

print("Host OS:", platform.system())
print("Architecture:", platform.machine())
print("Environment CI active:", "CI" in os.environ)`,
    stepByStepExecution: `Continuous Integration (CI) Workflow:
1. Developer pushes git branch to GitHub.
2. GitHub Actions runner spins up an isolated Ubuntu container.
3. Steps execute:
   - Check out code.
   - Install Python 3.12.
   - Run Ruff / Flake8 linter and mypy type checks.
   - Run pytest test suite with code coverage assertions.
4. If any test or type check fails, the PR merge is blocked automatically!`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Essential .gitignore for Python",
        code: `# Critical .gitignore patterns:
# __pycache__/
# *.pyc
# .venv/
# .env
# .pytest_cache/
# dist/
# *.egg-info/`,
        explanation: "Prevents committing virtual environments, bytecode caches, and sensitive `.env` credentials to Git."
      },
      {
        level: "Intermediate",
        title: "pyproject.toml Packaging Metadata (PEP 621)",
        code: `# [project]
# name = "pyradox"
# version = "1.0.0"
# dependencies = ["fastapi>=0.110.0", "pydantic>=2.0"]
# [project.scripts]
# pyradox = "pyradox.cli:main"`,
        explanation: "PEP 621 standardizes dependency declarations and entrypoint CLI scripts in `pyproject.toml`."
      },
      {
        level: "Tricky",
        title: "Docker Multi-Stage Build for Python",
        code: `# Multi-stage builds compile C extensions in a builder image,
# copying ONLY clean binaries into the runtime image, cutting Docker image size from 1GB to 90MB!`,
        explanation: "Multi-stage builds remove gcc, build tools, and caches from final production containers."
      }
    ],
    commonMistakes: [
      {
        title: "Committing Virtual Environments (.venv) to Git",
        wrongCode: `git add .venv/ # COMMITTING 50,000 BINARY FILES!`,
        correctCode: `# Add .venv/ to .gitignore and commit pyproject.toml or requirements.txt instead`,
        whyItFails: "Virtual environment binaries are OS-specific and bloat Git repository size."
      }
    ],
    importantDifferences: [
      {
        title: "pip freeze vs Pinned Dependencies (pyproject.toml)",
        itemA: "pyproject.toml (Direct Dependencies)",
        itemB: "requirements.lock / pip freeze",
        comparison: [
          "Scope: Top-level packages required directly by the project vs Full transitive tree with exact pinned hashes",
          "Upgrades: Safe and clear vs Painful to distinguish direct from secondary sub-dependencies"
        ]
      }
    ],
    realWorldUse: "GitHub Actions CI/CD pipelines, deploying Kubernetes pods, distributing open-source PyPI libraries.",
    interviewPerspective: [
      {
        question: "Why should you use a multi-stage Docker build for Python applications?",
        trap: "Thinking Python doesn't need compilation.",
        expectedAnswer: "Many Python packages (NumPy, cryptography, psycopg2) compile C/Rust extensions during installation, requiring heavy compilers (`gcc`, `g++`, `libpq-dev`). Multi-stage builds compile packages in a temporary builder image and copy only the installed wheels/site-packages into a minimal runtime image, reducing container image size and eliminating security vulnerabilities."
      }
    ],
    questions: [
      {
        id: "q47_1",
        question: "Which file is the modern unified standard for Python project builds, metadata, and dependencies?",
        choices: ["setup.py", "requirements.txt", "pyproject.toml", "Makefile"],
        correctIndex: 2,
        hints: ["Specified in PEP 518 and PEP 621."],
        solutionCode: `# pyproject.toml`,
        explanation: "`pyproject.toml` is the official modern standard for Python project configuration and builds."
      }
    ],
    revisionSheet: [
      "Always include `.venv` and `.env` in `.gitignore`.",
      "Use `pyproject.toml` for unified project metadata and tooling.",
      "Use automated linters (Ruff) and static type checkers (mypy) in CI.",
      "Multi-stage Docker builds minimize production container sizes."
    ],
    subtopics: [
      { id: "s47_1", text: "Git + Python", isStarred: false },
      { id: "s47_2", text: "GitHub", isStarred: false },
      { id: "s47_3", text: "Project structure", isStarred: false },
      { id: "s47_4", text: "Virtual environments", isStarred: false },
      { id: "s47_5", text: "Dependency management", isStarred: false },
      { id: "s47_6", text: ".gitignore", isStarred: false },
      { id: "s47_7", text: "Environment variables", isStarred: false },
      { id: "s47_8", text: "Configuration", isStarred: false },
      { id: "s47_9", text: "Logging", isStarred: false },
      { id: "s47_10", text: "Testing", isStarred: false },
      { id: "s47_11", text: "Documentation", isStarred: false },
      { id: "s47_12", text: "Type hints", isStarred: false },
      { id: "s47_13", text: "Packaging", isStarred: false },
      { id: "s47_14", text: "CI/CD", isStarred: false },
      { id: "s47_15", text: "Docker + Python", isStarred: false }
    ],
    starterCode: `# 47. Professional Python: Environment Validation
import sys

def verify_runtime():
    major, minor = sys.version_info[:2]
    assert (major, minor) >= (3, 10), f"Python 3.10+ required, running {major}.{minor}"
    return f"Runtime verified: Python {major}.{minor}"

print(verify_runtime())`
  },

  // ───  
  {
    id: "python-built-in-functions",
    topicNum: 48,
    title: "48. Python Built-in Functions",
    category: "Projects & Problem Solving",
    level: "Intermediate",
    stars: "Core",
    docRefTag: "Docs §Built-in Functions",
    docUrl: "https://docs.python.org/3/library/functions.html",
    summary: "Complete mastery of Python's 68 built-in functions: Core, Conversion, Iteration, Aggregation, Object Manipulation, and Metaprogramming.",
    whatIsIt: "Python includes approximately 68 globally available built-in functions in the `builtins` namespace, requiring no import statements.",
    whyDoesItExist: "To provide universal, high-performance primitives for introspection, conversion, iteration, mathematics, and runtime object manipulation.",
    syntax: `# Core inspection:
type(obj); id(obj); len(obj); isinstance(obj, Class)
# Dynamic object manipulation:
getattr(obj, "attr", default); setattr(obj, "attr", val); hasattr(obj, "attr")
# Aggregation & iteration:
sum(iterable); min(iterable); max(iterable); any(iterable); all(iterable); sorted(iterable)`,
    basicExample: `class Config:
    timeout = 30
    retry = True

cfg = Config()
print("hasattr 'timeout':", hasattr(cfg, "timeout"))
print("getattr dynamic:", getattr(cfg, "timeout", 10))
setattr(cfg, "debug", True)
print("Dynamically added attribute:", cfg.debug)`,
    stepByStepExecution: `CPython Builtin Resolution:
1. Built-in functions reside in the \'builtins\' module.
2. They represent the final fallback step 'B' in the LEGB scope lookup order.
3. Because they are implemented directly in optimized C (\'bltinmodule.c\'), they execute significantly faster than equivalent Python-level loops.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "isinstance() with Tuple of Types",
        code: `val = 42.0
# Can test against multiple types using a tuple:
if isinstance(val, (int, float)):
    print("Numeric value confirmed:", val)`,
        explanation: "`isinstance()` supports tuples of types for concise polymorphism checks."
      },
      {
        level: "Intermediate",
        title: "Dynamic Attribute Access: getattr, setattr, hasattr",
        code: `class EventBus:
    def on_login(self, user): return f"Welcome {user}"
    def on_logout(self, user): return f"Goodbye {user}"

bus = EventBus()
event_type = "login"
handler = getattr(bus, f"on_{event_type}", None)
if handler:
    print(handler("Shivansh"))`,
        explanation: "`getattr` enables dynamic dispatch tables without bulky `if/elif` chains."
      },
      {
        level: "Tricky",
        title: "eval() and exec() Security Hazard",
        code: `# eval() evaluates an expression string; exec() executes arbitrary code strings
# NEVER run eval() on untrusted user strings:
# eval("__import__('os').system('rm -rf /')") # DANGEROUS!
safe_calc = eval("2 * 10 + 5", {"__builtins__": None}, {})
print("Sanitized eval result:", safe_calc)`,
        explanation: "`eval()` executes arbitrary code. When necessary, restrict globals via `{'__builtins__': None}`."
      }
    ],
    commonMistakes: [
      {
        title: "Shadowing Built-in Function Names",
        wrongCode: `list = [1, 2, 3] # SHADOWS BUILT-IN list() CONSTRUCTOR!
# new_list = list("abc") -> TypeError: 'list' object is not callable`,
        correctCode: `items = [1, 2, 3]`,
        whyItFails: "Assigning to variable names like `list`, `str`, `dict`, `id`, `type`, or `sum` shadows the built-in function in the local namespace."
      }
    ],
    importantDifferences: [
      {
        title: "isinstance() vs type() == ...",
        itemA: "isinstance(obj, Class)",
        itemB: "type(obj) == Class",
        comparison: [
          "Subclasses: Returns True for instances of subclasses (respects inheritance) vs Returns False for subclasses (exact match only)",
          "Pythonic: Preferred for polymorphism vs Unpythonic; breaks subclass substitutability"
        ]
      }
    ],
    realWorldUse: "Serialization engines, dynamic plugin architectures, data validation frameworks.",
    interviewPerspective: [
      {
        question: "Why should you use `isinstance(x, MyClass)` instead of `type(x) == MyClass`?",
        trap: "Thinking they do the same thing.",
        expectedAnswer: "`isinstance()` respects the inheritance hierarchy (returns True if `x` is an instance of a subclass of `MyClass`), supporting the Liskov Substitution Principle. `type(x) == MyClass` only checks for exact equality, which breaks when subclasses are passed."
      }
    ],
    questions: [
      {
        id: "q48_1",
        question: "What function returns all attributes and methods of an object?",
        choices: ["help()", "dir()", "vars()", "inspect()"],
        correctIndex: 1,
        hints: ["Short for 'directory'."],
        solutionCode: `dir([])`,
        explanation: "`dir(obj)` returns a list of valid attributes and method names for the object."
      }
    ],
    revisionSheet: [
      "Never shadow built-ins (avoid variables named `list`, `dict`, `str`, `id`, `type`, `sum`).",
      "Always use `isinstance()` instead of `type() == ...`.",
      "`getattr(obj, name, default)` provides safe dynamic attribute access.",
      "`dir(obj)` lists attributes; `callable(obj)` tests if an object can be called."
    ],
    subtopics: [
      { id: "s48_1", text: "print()", isStarred: false },
      { id: "s48_2", text: "input()", isStarred: false },
      { id: "s48_3", text: "type()", isStarred: false },
      { id: "s48_4", text: "id()", isStarred: false },
      { id: "s48_5", text: "len()", isStarred: false },
      { id: "s48_6", text: "isinstance()", isStarred: false },
      { id: "s48_7", text: "issubclass()", isStarred: false },
      { id: "s48_8", text: "dir()", isStarred: false },
      { id: "s48_9", text: "help()", isStarred: false },
      { id: "s48_10", text: "int(), float(), str(), bool()", isStarred: false },
      { id: "s48_11", text: "list(), tuple(), set(), dict()", isStarred: false },
      { id: "s48_12", text: "range(), iter(), next(), enumerate(), zip()", isStarred: false },
      { id: "s48_13", text: "sum(), min(), max(), all(), any()", isStarred: false },
      { id: "s48_14", text: "getattr(), setattr(), hasattr()", isStarred: false }
    ],
    starterCode: `# 48. Built-in Functions Inspection
data = [15, 82, 3, 94, 27]

print("Sum:", sum(data))
print("Min / Max:", min(data), "/", max(data))
print("Any > 90:", any(x > 90 for x in data))
print("All > 0:", all(x > 0 for x in data))`
  },

  // ─── 49. Important Python Concepts That Usually Cause Confusion ─────────────
  {
    id: "confusing-concepts",
    topicNum: 49,
    title: "49. Important Python Concepts That Usually Cause Confusion",
    category: "Projects & Problem Solving",
    level: "Advanced",
    stars: "",
    docRefTag: "Python Gotchas",
    docUrl: "https://docs.python.org/3/faq/programming.html",
    summary: "Dedicated breakdowns of the 30 most confusing Python concepts: Mutable vs immutable, is vs ==, shallow vs deep copy, *args vs **kwargs, list vs ndarray.",
    whatIsIt: "A curated masterclass dissecting deceptive Python behaviors, hidden memory semantics, and edge cases that trip up junior and intermediate developers.",
    whyDoesItExist: "To develop true mechanical sympathy with the Python runtime so you never get blindsided by aliasing, late binding closures, or mutation side effects in production.",
    syntax: `# Classic Tricky Comparisons:
# 1. Identity vs Value:  a is b  vs  a == b
# 2. Mutation vs Copy:    b = a   vs  b = a.copy()
# 3. Parameter capture:   lambda x=x: x
# 4. Scope Rebinding:    nonlocal vs global`,
    basicExample: `# Tricky concept: Multiple assignment with mutables
a = b = [1, 2]
b.append(3)
print("a is also mutated:", a) # [1, 2, 3]!

# Tricky concept: Tuple with mutable item
t = ([1],)
t[0].append(2)
print("Tuple mutated internally:", t) # ([1, 2],)`,
    stepByStepExecution: `Why a = b = [] creates aliasing:
1. Python evaluates the RHS expression \'[]\' first, allocating a single PyListObject at memory address \'0x...01\'.
2. It assigns reference \'b\' to \'0x...01\'.
3. It assigns reference \'a\' to \'0x...01\'.
4. No copy is ever made! Both names point to the exact same list in heap memory.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "remove() vs pop() vs del",
        code: `items = ["a", "b", "c", "d"]
items.remove("b") # Removes by VALUE (first occurrence)
popped = items.pop(1) # Removes by INDEX and RETURNS it
del items[0] # Removes by INDEX or SLICE (does not return value)
print("Remaining:", items)`,
        explanation: "`remove` takes a value; `pop` takes an index and returns the item; `del` is a statement that unbinds names or slices."
      },
      {
        level: "Intermediate",
        title: "append() vs extend()",
        code: `x = [1, 2]
x.append([3, 4]) # [1, 2, [3, 4]]
y = [1, 2]
y.extend([3, 4]) # [1, 2, 3, 4]
print("append:", x)
print("extend:", y)`,
        explanation: "`append` adds the object as a single element; `extend` unpacks and iterates over the sequence."
      },
      {
        level: "Tricky",
        title: "Late Binding Closures Demystified",
        code: `# Why does this print [4, 4, 4, 4]?
multipliers = [lambda x: i * x for i in range(4)]
print("Late binding results:", [m(2) for m in multipliers]) # 4 * 2 = 6? NO, i=3 so 3*2=6!

# Fixed using default argument capture:
fixed_multipliers = [lambda x, i=i: i * x for i in range(4)]
print("Fixed results:", [m(2) for m in fixed_multipliers]) # [0, 2, 4, 6]!`,
        explanation: "Closures look up variables in the enclosing scope when the function is CALLED, not when defined."
      }
    ],
    commonMistakes: [
      {
        title: "Modifying a Dictionary While Iterating",
        wrongCode: `d = {"a": 1, "b": 2}
# for k in d:
#     if d[k] == 1: del d[k] # RuntimeError: dictionary changed size during iteration!`,
        correctCode: `d = {"a": 1, "b": 2}
# Iterate over a list copy of keys:
for k in list(d.keys()):
    if d[k] == 1: del d[k]`,
        whyItFails: "Mutating hash tables during iteration breaks the internal hash table bucket traversal."
      }
    ],
    importantDifferences: [
      {
        title: "Python List vs NumPy Array",
        itemA: "Python List",
        itemB: "NumPy Array",
        comparison: [
          "Elements: Array of pointers to heterogeneous PyObjects vs Contiguous memory block of homogeneous C types",
          "Algebraic ops: `list + list` concatenates vs `arr + arr` performs element-wise vector addition",
          "Memory footprint: High overhead (each element has a PyObject header) vs Minimal raw binary storage"
        ]
      }
    ],
    realWorldUse: "Diagnosing state corruption bugs in multi-threaded web applications, optimizing data structures for high-speed ETL.",
    interviewPerspective: [
      {
        question: "Why does `a = ([1, 2],); a[0] += [3, 4]` raise a `TypeError` but STILL mutate the list inside the tuple?",
        trap: "Thinking it either completely fails or completely succeeds.",
        expectedAnswer: "`+=` on lists calls `__iadd__`, which extends the list in-place (mutating the list to `[1, 2, 3, 4]`). But `+=` then attempts to reassign the result to `a[0]`. Because tuples are immutable, the assignment step raises `TypeError: 'tuple' object does not support item assignment`. The list is mutated, but the exception is still raised!"
      }
    ],
    questions: [
      {
        id: "q49_1",
        question: "What is the difference between `list.sort()` and `sorted(list)`?",
        choices: [
          "`list.sort()` sorts in-place returning None; `sorted()` returns a new sorted list",
          "`sorted()` is in-place; `list.sort()` returns a new list",
          "They are identical aliases",
          "`list.sort()` only works on numbers"
        ],
        correctIndex: 0,
        hints: ["One mutates in place; one allocates a new list."],
        solutionCode: `a = [2, 1]; res = a.sort(); assert res is None`,
        explanation: "`list.sort()` mutates the list in-place and returns None; `sorted()` returns a new sorted copy."
      }
    ],
    revisionSheet: [
      "`b = a` creates an alias, NOT a copy.",
      "`is` checks identity (id(a) == id(b)); `==` checks value equality.",
      "Never mutate a collection while iterating directly over it.",
      "Fix closure late binding using default arguments: `lambda x, i=i: i * x`."
    ],
    subtopics: [
      { id: "s49_1", text: "Mutable vs immutable", isStarred: false },
      { id: "s49_2", text: "is vs ==", isStarred: false },
      { id: "s49_3", text: "Shallow copy vs deep copy", isStarred: false },
      { id: "s49_4", text: "Assignment vs copying", isStarred: false },
      { id: "s49_5", text: "Reference vs object", isStarred: false },
      { id: "s49_6", text: "*args vs **kwargs", isStarred: false },
      { id: "s49_7", text: "return vs print", isStarred: false },
      { id: "s49_8", text: "Iterable vs iterator", isStarred: false },
      { id: "s49_9", text: "Iterator vs generator", isStarred: false },
      { id: "s49_10", text: "List comprehension vs generator expression", isStarred: false },
      { id: "s49_11", text: "sort() vs sorted()", isStarred: false },
      { id: "s49_12", text: "append() vs extend()", isStarred: false },
      { id: "s49_13", text: "remove() vs pop() vs del", isStarred: false },
      { id: "s49_14", text: "Python list vs NumPy array", isStarred: false },
      { id: "s49_15", text: "Python dictionary vs JSON", isStarred: false }
    ],
    starterCode: `# 49. The Infamous Tuple In-Place Mutation Trap
t = ([1, 2],)
try:
    t[0] += [3, 4]
except TypeError as e:
    print("Caught expected TypeError:", e)

print("List inside tuple was STILL modified:", t)`
  },

  // ───  
  {
    id: "problem-solving-with-python",
    topicNum: 50,
    title: "50. Problem Solving with Python",
    category: "Projects & Problem Solving",
    level: "Advanced",
    stars: "Core",
    docRefTag: "DSA & CP Guide",
    docUrl: "https://docs.python.org/3/library/bisect.html",
    summary: "Competitive programming patterns in Python: Two Pointers, Sliding Window, Prefix Sums, Binary Search (bisect), Heaps (heapq), and DP memoization.",
    whatIsIt: "Problem solving with Python connects syntax mastery to Data Structures and Algorithms (DSA) for technical interviews, LeetCode challenges, and competitive programming.",
    whyDoesItExist: "To solve algorithmic problems within strict time limits (1-2 seconds) and memory limits (256MB) using idiomatic Python tricks and fast I/O.",
    syntax: `# Fast binary search with bisect:
import bisect
idx = bisect.bisect_left(sorted_arr, target)

# Min-heap priority queue with heapq:
import heapq
heap = []
heapq.heappush(heap, (priority, item))
top = heapq.heappop(heap)

# Recursion limit increase for deep trees/graphs:
import sys
sys.setrecursionlimit(200000)`,
    basicExample: `import bisect

# Two Pointers: Two Sum on sorted array in O(N)
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            return (left, right)
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return None

nums = [1, 3, 5, 8, 12, 18, 25]
print("Indices summing to 20:", two_sum_sorted(nums, 20))`,
    stepByStepExecution: `Python-Specific DSA Optimization Strategies:
1. Fast I/O: In competitive programming, use \'sys.stdin.read().split()\' instead of multiple \'input()\' calls (can be 5x faster).
2. Dynamic Programming: Decorate recursive functions with \'@functools.lru_cache(None)\' to turn exponential recursion into linear memoized DP.
3. String Concatenation: Build a list of characters/strings and call \'''.join()\' at the end to avoid quadratic memory copies.
4. Binary Search: Leverage C-implemented \'bisect.bisect_left\' and \'bisect.bisect_right\'.`,
    multipleExamples: [
      {
        level: "Simple",
        title: "Min-Heap Priority Queue with heapq",
        code: `import heapq

# Python heapq implements a MIN-heap:
tasks = []
heapq.heappush(tasks, (3, "Low Priority Task"))
heapq.heappush(tasks, (1, "CRITICAL EMERGENCY"))
heapq.heappush(tasks, (2, "Medium Task"))

# Pops in ascending priority order:
while tasks:
    priority, desc = heapq.heappop(tasks)
    print(f"[{priority}] {desc}")`,
        explanation: "`heapq` maintains a min-heap in O(log N) push and pop time."
      },
      {
        level: "Intermediate",
        title: "Sliding Window: Max Subarray Sum of Size K",
        code: `def max_sub_array_of_size_k(k, arr):
    max_sum = 0
    window_sum = 0
    for i in range(len(arr)):
        window_sum += arr[i]
        if i >= k - 1:
            max_sum = max(max_sum, window_sum)
            window_sum -= arr[i - (k - 1)]
    return max_sum

print("Max sum of window 3:", max_sub_array_of_size_k(3, [2, 1, 5, 1, 3, 2]))`,
        explanation: "Sliding window calculates aggregate metrics across subarrays in linear O(N) time."
      },
      {
        level: "Tricky",
        title: "Dynamic Programming Memoization with @cache",
        code: `from functools import cache

@cache # Python 3.9+ unbounded memoization
def knapsack(idx, remaining_weight, weights, values):
    if idx < 0 or remaining_weight <= 0:
        return 0
    # Option 1: Skip item
    ans = knapsack(idx - 1, remaining_weight, weights, values)
    # Option 2: Take item (if capacity permits)
    if weights[idx] <= remaining_weight:
        ans = max(ans, values[idx] + knapsack(idx - 1, remaining_weight - weights[idx], weights, values))
    return ans

weights = (2, 3, 4, 5)
values = (3, 4, 5, 6)
print("Max value in knapsack:", knapsack(len(weights)-1, 5, weights, values))`,
        explanation: "Automatic memoization via `@cache` implements top-down DP with minimal code."
      }
    ],
    commonMistakes: [
      {
        title: "Hitting RecursionError on Deep Trees/Graphs",
        wrongCode: `# Default recursion limit is 1000 in Python!
# Deep graph DFS crashes with RecursionError: maximum recursion depth exceeded`,
        correctCode: `import sys
sys.setrecursionlimit(200000) # Or convert recursive DFS to iterative with a stack`,
        whyItFails: "Python prevents C stack overflow by limiting Python frame recursion depth."
      }
    ],
    importantDifferences: [
      {
        title: "bisect_left vs bisect_right",
        itemA: "bisect.bisect_left",
        itemB: "bisect.bisect_right",
        comparison: [
          "Equal elements: Inserts BEFORE (to the left of) any existing equal elements vs Inserts AFTER (to the right of) any existing equal elements",
          "Returns: The FIRST index where item could be inserted to maintain sort vs The LAST index where item could be inserted"
        ]
      }
    ],
    realWorldUse: "Coding interviews at FAANG/Tier-1 tech companies, optimizing database query range scans, high-throughput stream aggregations.",
    interviewPerspective: [
      {
        question: "How do you implement a Max-Heap using Python's `heapq` module?",
        trap: "Looking for a non-existent `maxheappush` function.",
        expectedAnswer: "Python's `heapq` only implements a min-heap. To simulate a max-heap, multiply all numeric values by `-1` upon insertion, and multiply by `-1` again when popping."
      }
    ],
    questions: [
      {
        id: "q50_1",
        question: "What module in Python's standard library provides binary search algorithms for sorted sequences?",
        choices: ["binary_search", "bisect", "search", "algorithm"],
        correctIndex: 1,
        hints: ["Think of 'bisecting' a range."],
        solutionCode: `import bisect\nbisect.bisect_left([1, 3, 5], 3) # Index 1`,
        explanation: "The `bisect` module implements binary search algorithms for sorted sequences."
      }
    ],
    revisionSheet: [
      "Use `bisect.bisect_left` for O(log N) binary search on sorted sequences.",
      "Use `heapq` for O(log N) priority queues (min-heap by default; invert signs for max-heap).",
      "Decorate recursive DP functions with `@functools.cache`.",
      "Use `collections.defaultdict` and `Counter` to reduce boilerplate in hash map problems."
    ],
    subtopics: [
      { id: "s50_1", text: "Input handling", isStarred: false },
      { id: "s50_2", text: "Multiple test cases", isStarred: false },
      { id: "s50_3", text: "Fast input", isStarred: false },
      { id: "s50_4", text: "Arrays/lists", isStarred: false },
      { id: "s50_5", text: "Strings", isStarred: false },
      { id: "s50_6", text: "Hash maps", isStarred: false },
      { id: "s50_7", text: "Sets", isStarred: false },
      { id: "s50_8", text: "Two pointers", isStarred: false },
      { id: "s50_9", text: "Sliding window", isStarred: false },
      { id: "s50_10", text: "Prefix sums", isStarred: false },
      { id: "s50_11", text: "Binary search", isStarred: false },
      { id: "s50_12", text: "Sorting", isStarred: false },
      { id: "s50_13", text: "Recursion", isStarred: false },
      { id: "s50_14", text: "Backtracking", isStarred: false },
      { id: "s50_15", text: "Stack", isStarred: false },
      { id: "s50_16", text: "Queue", isStarred: false },
      { id: "s50_17", text: "Heap", isStarred: false },
      { id: "s50_18", text: "Linked list", isStarred: false },
      { id: "s50_19", text: "Trees", isStarred: false },
      { id: "s50_20", text: "Graphs", isStarred: false },
      { id: "s50_21", text: "Dynamic programming", isStarred: false },
      { id: "s50_22", text: "Python-specific competitive programming tricks", isStarred: false }
    ],
    starterCode: `# 50. Problem Solving: Binary Search with bisect
import bisect

sorted_ranks = [10, 25, 40, 55, 70, 85, 100]
score = 62

# Find insertion position to maintain sorted order
pos = bisect.bisect_left(sorted_ranks, score)
print(f"Score {score} belongs at rank index {pos} between {sorted_ranks[pos-1]} and {sorted_ranks[pos]}")`
  }
];
