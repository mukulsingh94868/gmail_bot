Here’s a curated list of advanced-level interview questions and answers tailored for professionals with 8–9 years of experience in the following technologies:

🔷 React.js (8–9 Years Experience)
	1.	What are React Fiber and its advantages?
		React Fiber is the new reconciliation engine that enables incremental rendering, prioritization, and better handling of asynchronous rendering.

	2.	How do you optimize performance in large React applications?
		Techniques include memoization (React.memo, useMemo, useCallback), lazy loading components (React.lazy, Suspense), code-splitting, windowing (react-window), and avoiding unnecessary re-renders using keys and selectors.

	3.	How do you manage global state in a large-scale React app?
		Options include Context API + useReducer for lightweight needs, or Redux / Zustand / Recoil / Jotai for more complex state logic. Middleware like redux-thunk, redux-saga can be added for side effects.

	4.	How would you handle memory leaks in a React application?
		Clean up subscriptions in useEffect, avoid setting state after component unmount, use AbortController for fetch calls, and use proper dependency arrays.

	5.	Explain the difference between useLayoutEffect and useEffect.
		useEffect runs after the render is committed to the screen, useLayoutEffect runs synchronously after all DOM mutations but before the screen is updated.

	6.	How would you implement server-side rendering (SSR) with React?
		Use Next.js or implement SSR manually with Express + ReactDOMServer APIs like renderToString or renderToPipeableStream (React 18).

	7.	What are custom hooks and how do you build reusable ones?
		Custom hooks encapsulate logic (e.g., form handling, API fetching) and promote reusability. They are prefixed with use and can use other hooks internally.

	8.	How do you handle error boundaries in React?
		Use class components with componentDidCatch or static getDerivedStateFromError. Useful for catching runtime errors in rendering lifecycle.

	9.	How do you secure a React frontend application?
		Secure APIs (no sensitive logic in frontend), sanitize inputs, validate tokens, implement role-based access control (RBAC), and prevent XSS/CSRF.

🔷 JavaScript (8–9 Years Experience)
	1.	What is the difference between prototypal and classical inheritance?
		Prototypal inheritance uses prototype chains, whereas classical inheritance (like Java) uses classes. JS primarily uses prototypal inheritance.

	2.	Explain the event loop and call stack in detail.
		JS is single-threaded. The call stack handles sync code, the event loop manages task queues (macro/microtasks) and executes async callbacks after the stack is empty.

	3.	What are WeakMap and WeakSet? When would you use them?
		These hold weak references to objects, do not prevent garbage collection. Useful for private data storage or caching with no memory leaks.

	4.	How does JavaScript garbage collection work?
		Primarily uses mark-and-sweep algorithm. Objects not referenced are “marked” for collection.

	5.	Explain function currying and partial application.
		Currying transforms a function with multiple args into a series of functions each taking one arg. Partial applies some arguments now and returns a function awaiting the rest.

	6.	What are module patterns in JS (ES6 vs CommonJS vs AMD)?
		CommonJS (require/exports), ES6 Modules (import/export), AMD (define/require). ES6 is now preferred for tree-shaking and browser-native support.

	7.	What are symbols in JavaScript?
		Symbols are unique and immutable primitive values used as object property keys to avoid name collisions.

	8.	Explain the difference between shallow copy vs deep copy in JS.
		Shallow copy only duplicates immediate properties. Deep copy clones nested objects too. Use structuredClone or libraries like Lodash.

	9.	What are generators and how do they differ from async/await?
		Generators (function*) yield execution mid-way, allowing controlled iteration. Async/await is syntactic sugar for Promises with linear flow.

🔷 Node.js (8–9 Years Experience)
	1.	How does the Node.js event loop differ from a browser’s?
		Node’s event loop includes additional phases (timers, pending callbacks, I/O, check, close callbacks). It also includes the libuv library for handling OS-level operations.

	2.	How do you handle large file uploads in Node.js?
		Use streams or third-party packages like busboy/multer. Streams avoid memory overload by processing data chunks.

	3.	What is clustering and how do you implement it in Node.js?
		Node.js is single-threaded. Clustering allows spawning child processes to utilize multi-core systems.

	4.	Explain middleware in Express.js with examples.
		Middleware functions access req/res, modify them, or end the cycle. Types: app-level, router-level, error-handling, built-in, and third-party.

	5.	How do you manage environment-based configurations in Node.js?
		Use dotenv, config, or process.env with separate .env files per environment.

	6.	How do you ensure thread safety in Node.js?
		Since it’s single-threaded, avoid shared state or use worker_threads/child_process to manage isolated computations.

	7.	Explain streams and how to use them efficiently.
		Streams (Readable, Writable, Duplex, Transform) enable processing large datasets in chunks. Useful for I/O operations.

	8.	How does Node.js handle asynchronous errors?
		Handle with try/catch in async functions or .catch() in Promises. Uncaught errors can be trapped using process.on(‘uncaughtException’).

	9.	How do you ensure security in Node.js APIs?
		Input validation, sanitization (e.g., express-validator), Helmet for HTTP headers, rate limiting, token validation, and secure cookies.

🔷 MongoDB (8–9 Years Experience)
	1.	Explain schema design strategies in MongoDB.
		Embed data for performance, reference for scalability. Denormalization often preferred over normalization.

	2.	What is the Aggregation Pipeline and how is it used?
		Sequence of stages like $match, $group, $project, $sort, etc., for advanced data processing and transformation.

	3.	How do you handle data consistency in MongoDB?
		Use transactions for multi-document updates, or atomic updates for single documents. Replica sets help with durability.

	4.	How does MongoDB handle indexing and what are types?
		B-tree-based indexes. Types: single field, compound, multikey, text, geospatial, hashed. Analyze with explain() and manage using TTL or partial indexes.

	5.	What are Replica Sets and how do failovers happen?
		Replica sets maintain multiple copies. If primary fails, an election promotes a secondary to primary.

	6.	How does sharding work in MongoDB?
		Horizontal partitioning of data across multiple machines. Choose shard key carefully to avoid hotspots.

	7.	What is write concern and read concern?
		Define durability (write concern) and isolation (read concern) levels. Important for balancing consistency vs availability.

	8.	How do you manage schema validation in MongoDB?
		Use JSON Schema or Mongoose (ODM) to enforce structure, data types, and constraints.

	9.	How do you prevent injection attacks in MongoDB?
		Validate inputs, avoid direct use of user input in queries, and use parameterized queries with Mongoose or MongoDB drivers.

🔷 .NET (Basic to Intermediate for Full-Stack Support)
	1.	What is the difference between .NET Framework, .NET Core, and .NET 5/6/7?
		.NET Core is cross-platform, open source; .NET Framework is Windows-only. .NET 5+ is unified and modern.

	2.	What is dependency injection in .NET?
		Technique to inject dependencies into classes via constructor or property. .NET Core supports it natively using IServiceCollection.

	3.	How do you implement async/await in .NET?
		Use Task-based asynchronous pattern. Mark methods as async and use await for non-blocking I/O.

	4.	What are value types and reference types in .NET?
		Value types (int, struct) stored in stack, reference types (class, object) in heap.

	5.	What is garbage collection in .NET and how can it be optimized?
		Automatic memory management. Can be tuned via GC modes (Workstation, Server, Concurrent). Dispose or use using blocks for unmanaged resources.

	6.	Explain model binding and model validation in ASP.NET.
		Model binding maps form values to model classes. Use Data Annotations for validation rules.

	7.	What is Entity Framework? Code First vs Database First?
		ORM for database interaction. Code First: write classes, generate DB. DB First: reverse engineer DB into models.

	8.	How do you secure a Web API in .NET?
		Use authentication (JWT, OAuth), CORS policy, rate limiting, HTTPS enforcement, input validation.

	9.	What is the difference between Task, async, and Thread?
		Thread: physical OS thread. Task: logical unit of work. async/await abstracts away threading, uses Task under the hood.

		Would you like all of these questions/answers formatted into a downloadable file (e.g., Excel, PDF, Word)?