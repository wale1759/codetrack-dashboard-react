# AuthContext — Detailed Code Explanation

> **File:** `src/context/AuthContext.jsx`
> **Tech stack:** React 19, `prop-types`, Vite, mock JSON data (`sim-data/data.json`)

---

## 1. What is this file?

`AuthContext.jsx` implements the **authentication layer** of the CodeTrack dashboard using React's **Context API**. It provides:

- A global, app-wide **React Context** (`AuthContext`) that holds the currently signed-in user.
- A **provider component** (`AuthProvider`) that owns all authentication state and logic.
- Three **auth operations** exposed to the whole app: `signIn`, `signUp`, and `signOut`.
- A derived boolean, `isAuthenticated`, so components can quickly branch on login state.

Because the app is currently a simulation, the "database" is a **hard-coded mock user list** loaded from a JSON file — there is no real backend, no HTTP calls, and no persistence. Everything lives in React state and dies on page refresh.

---

## 2. How it fits into the app (wiring)

The provider is mounted at the very top of the React tree in `src/main.jsx`:

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>          {/* 1. Auth wraps everything */}
      <DashboardProvider>   {/* 2. Dashboard data sits inside it */}
        <App />
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>,
);
```

Placement matters: anything **inside** `<AuthProvider>` (including `DashboardProvider` and every page/component) can read auth state via `useContext(AuthContext)`. Anything outside it cannot.

Companion files:

| File | Role |
|---|---|
| `src/context/AuthContext.jsx` | The context + provider (this document's subject) |
| `src/hooks/useAuth.js` | Placeholder consumer hook — **currently an empty file** (see §8) |
| `src/services/mockDataService.js` | Returns the parsed `sim-data/data.json` object |
| `sim-data/data.json` | The "database": `mock_auth_users` array + dashboard data |

---

## 3. Imports

```jsx
import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { getMockData } from "../services/mockDataService";
```

- **`createContext`** — React API that creates a Context object (the "channel" data flows through).
- **`useMemo`** — caches the context `value` object so it is only rebuilt when its inputs change (performance; see §5.3).
- **`useState`** — holds the two pieces of auth state (user list, current user).
- **`PropTypes`** — runtime prop validation for the provider's `children` prop.
- **`getMockData`** — thin service that imports and returns `sim-data/data.json`. Keeps the data source abstracted away, so swapping mock data for a real API later only touches the service.

---

## 4. Creating the context

```jsx
// Create the actual context, so if it's auth, say authContext
const AuthContext = createContext(null);
```

This creates the context object **once at module scope** (outside the component). Passing `null` as the default means: *if a component reads this context without a provider above it, it gets `null`* — a safe sentinel that makes "you forgot the provider" bugs detectable.

Two exports come from this file:

1. `AuthProvider` (named export from the `function` declaration) — used once in `main.jsx`.
2. `AuthContext` (named export at the bottom) — consumed by hooks/components via `useContext(AuthContext)`.

The context itself is deliberately **not** exported as default; the provider and raw context are separate named exports following the standard Context pattern.

---

## 5. The `AuthProvider` component

```jsx
export function AuthProvider({ children }) { /* ... */ }
```

It accepts a single prop, `children` — the entire component subtree rendered inside `<AuthProvider>...</AuthProvider>`. It produces no visible UI itself; its JSX (§5.8) just makes the context value available to `children`.

### 5.1 State: the mock user "database"

```jsx
const [mockUsers, setMockUsers] = useState(
  () => getMockData().mock_auth_users,
);
```

- `mockUsers` — the array of registered users (the fake database table).
- The arrow function passed to `useState` is a **lazy initializer**: React calls it only **once, on the first render**, not on every re-render. This avoids re-reading/deriving the JSON data on each render.
- It pulls the `mock_auth_users` array out of the JSON. Seeded content (`sim-data/data.json`):

```json
"mock_auth_users": [
  {
    "id": "00000000-0000-0000-0000-000000000001",
    "display_name": "Alex Rivera",
    "email": "alex@codetrack.test",
    "password": "password123",
    "plan": "free",
    "time_zone": "UTC"
  }
]
```

- `setMockUsers` is used only by `signUp` to append newly registered users.

> ⚠️ **Note:** This data lives in memory. Signing up adds a user to `mockUsers` for the current session only — a browser refresh re-imports the original JSON and the new account is gone.

### 5.2 State: the current user

```jsx
const [currentUser, setCurrentUser] = useState(null); // currentuser = null
```

- `currentUser` starts as `null` — **no one is signed in** on app load.
- `setCurrentUser` is the only way the session changes:
  - `signIn` sets it to the matched user object.
  - `signUp` sets it to the freshly created user (auto-login after registration).
  - `signOut` resets it to `null`.

The signed-in "session" **is** this piece of state — there are no tokens, cookies, or `localStorage` entries.

### 5.3 The memoized context value

```jsx
const value = useMemo(
  () => ({
    currentUser,
    isAuthenticated: Boolean(currentUser),
    signIn(email, password) { /* ... */ },
    signUp({ displayName, email, password }) { /* ... */ },
    signOut() { /* ... */ },
  }),
  [currentUser, mockUsers],
);
```

`useMemo` caches the object handed to every consumer. **Why this matters:**

- Without memoization, a **brand-new object** would be created on every `AuthProvider` render, and *every* component consuming the context would re-render on *every* provider render — even if nothing auth-related changed.
- With `useMemo`, the object is only rebuilt when `currentUser` or `mockUsers` actually change (i.e., on real auth events: sign in, sign up, sign out).
- Both dependencies are required for correctness, not just performance:
  - `currentUser` changes → `isAuthenticated` and `currentUser` must update for consumers.
  - `mockUsers` changes → `signIn`'s closure must see the **latest** user list (otherwise a user created via `signUp` couldn't sign in later — a classic *stale closure* bug).

### 5.4 `isAuthenticated` (derived state)

```jsx
isAuthenticated: Boolean(currentUser),
```

A convenience boolean derived from `currentUser`. Components can write `if (isAuthenticated)` instead of `if (currentUser)`. `Boolean(null)` → `false`; `Boolean({...user})` → `true`.

### 5.5 `signIn(email, password)`

```jsx
signIn(email, password) {
  const matchingUser = mockUsers.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password,
  );
  if (!matchingUser) {
    return {
      success: false,
      message: "That email or password doesn't look right",
    };
  }
  setCurrentUser(matchingUser);
  return { success: true, user: matchingUser };
}
```

Step by step:

1. **Lookup** — `Array.prototype.find` scans `mockUsers` for the first user whose email matches (case-insensitive, whitespace-trimmed) **and** whose password matches exactly (case-sensitive, no trim — passwords are compared literally).
2. **Failure path** — no match → returns a result object:
   `{ success: false, message: "That email or password doesn't look right" }`
   Note it deliberately does **not** reveal whether the email or the password was wrong (a mild security-conscious touch).
3. **Success path** — match found → `setCurrentUser(matchingUser)` promotes that user to the active session (React schedules a re-render; all consumers immediately see the user and `isAuthenticated: true`), then returns:
   `{ success: true, user: matchingUser }`

**Call signature:** positional — `signIn("alex@codetrack.test", "password123")`.

**Design note:** `signIn` is *synchronous* and returns a plain result object rather than a Promise. Real auth libraries are async; the calling UI would check `result.success` and show `result.message` on failure.

---

### 5.6 `signUp({ displayName, email, password })`

```jsx
signUp({ displayName, email, password }) {
  const emailInUse = mockUsers.some(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (emailInUse) {
    return {
      success: false,
      message: "An Account with that email already exists",
    };
  }

  const newUser = {
    id: crypto.randomUUID(),
    display_name: displayName.trim(),
    email: email.trim().toLowerCase(),
    password,
    plan: "free",
    time_zone: "UTC",
  };

  setMockUsers((user) => [...user, newUser]);
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}
```

Step by step:

1. **Uniqueness check** — `Array.prototype.some` tests whether *any* existing user already has that email (case-insensitive, trimmed). Duplicate accounts are blocked.
2. **Failure path** — email taken → `{ success: false, message: "An Account with that email already exists" }`.
3. **Build the new user** — shaped to match the mock "database" schema:

   | Field | Value | Notes |
   |---|---|---|
   | `id` | `crypto.randomUUID()` | Browser Web Crypto API — cryptographically random UUID v4. Requires a secure context (HTTPS or `localhost`). |
   | `display_name` | `displayName.trim()` | Whitespace removed. |
   | `email` | `email.trim().toLowerCase()` | Normalized so future lookups match. |
   | `password` | as typed | ⚠️ Stored **in plain text** in state — acceptable only because this is a mock. |
   | `plan` | `"free"` | Default plan for new accounts. |
   | `time_zone` | `"UTC"` | Default time zone. |

4. **Insert into the "database"** — `setMockUsers((user) => [...user, newUser])` uses a **functional state update**: the updater receives the previous array (`user`) and returns a *new* array with `newUser` appended (immutably — the original is never mutated). This form is correct even if multiple updates are batched.
5. **Auto sign-in** — `setCurrentUser(newUser)` immediately logs the new user in, so registration and login are one step.
6. **Return** — `{ success: true, user: newUser }`.

**Call signature:** single object argument — `signUp({ displayName, email, password })`. (Note this differs from `signIn`'s positional arguments — an API inconsistency to be aware of.)

### 5.7 `signOut()`

```jsx
signOut() {
  setCurrentUser(null);
}
```

The simplest operation: resets the session to `null`. Consumers instantly see `currentUser: null` and `isAuthenticated: false`. Takes no arguments and returns nothing.

### 5.8 Rendering the provider

```jsx
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

`AuthContext.Provider` publishes `value` to the tree. Every `useContext(AuthContext)` call below this point receives this exact (memoized) object.

### 5.9 Prop validation

```jsx
// To ensure data integrity
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
```

Declares that `children` is required and must be a renderable React node (element, array, string, fragment…). In development, forgetting to pass children produces a console warning. `PropTypes` is a **dev-only** runtime check — it is stripped out of production builds and does not throw; it only warns.

### 5.10 Exports

```jsx
export { AuthContext };
```

`AuthProvider` was already exported via its function declaration. This line additionally exposes the raw context so a consumer hook can read from it:

```js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
```

(The `null` default from §4 makes `context` falsy when the provider is missing, enabling that guard.)

---

## 6. Public API summary

The context value exposes exactly five things:

| Member | Type | Description |
|---|---|---|
| `currentUser` | `object \| null` | The signed-in user object, or `null` when signed out. |
| `isAuthenticated` | `boolean` | `true` iff `currentUser` is non-null. |
| `signIn(email, password)` | `function` | Validates credentials against `mockUsers`; sets the session; returns `{ success: false, message }` on failure or `{ success: true, user }` on success. |
| `signUp({ displayName, email, password })` | `function` | Blocks duplicate emails; creates a user; **auto signs in**; returns `{ success: false, message }` on failure or `{ success: true, user }` on success. |
| `signOut()` | `function` | Clears the session (`currentUser → null`). No return value. |

Example usage inside any component below the provider:

```jsx
import { useAuth } from "../hooks/useAuth"; // once the hook is implemented

function LoginForm() {
  const { signIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signIn("alex@codetrack.test", "password123");
    if (!result.success) {
      console.error(result.message); // show error in UI
    }
  };
  // ...
}
```

Seeded credentials you can sign in with right now:

| Email | Password |
|---|---|
| `alex@codetrack.test` | `password123` |

---

## 7. Data flow diagram

```
sim-data/data.json
      │  (imported at build time)
      ▼
mockDataService.getMockData()  ──►  mock_auth_users array
      │  (lazy useState initializer, once)
      ▼
┌──────────────────── AuthProvider ────────────────────────┐
│  state: mockUsers              state: currentUser        │
│      │                             │                     │
│      └────► useMemo(value) ◄───────┘                     │
│              │          deps: [currentUser, mockUsers]   │
│              ▼                                           │
│   <AuthContext.Provider value={value}>                   │
│        {children}   ◄── useContext(AuthContext)          │
│                     reads: currentUser,                  │
│             isAuthenticated, signIn/signUp/signOut       │
└──────────────────────────────────────────────────────────┘
```

---

## 8. Current limitations & gotchas

1. **No persistence.** The session and registered users live only in React state. A page refresh signs everyone out and forgets accounts created via `signUp`. Fix idea: mirror `mockUsers` / `currentUser` into `localStorage` via a `useEffect`.
2. **Plain-text passwords.** Fine for a simulation; never do this against a real backend (hash server-side, never ship credentials to the client).
3. **Synchronous, fake latency.** `signIn`/`signUp` return instantly. Real auth flows are async (network). If pages expect Promises, wrap these in `async` functions later.
4. **Empty consumer hook.** `src/hooks/useAuth.js` exists but is currently **empty (0 bytes)** — the context cannot be conveniently consumed until the `useAuth` hook from §5.10 is implemented.
5. **API shape inconsistency.** `signIn(email, password)` takes positional args; `signUp({ displayName, email, password })` takes an object. Worth unifying if this grows.
6. **Password matching is stricter than email matching.** Emails are trimmed + case-insensitive; passwords must match byte-for-byte with no trimming. Intentional, but worth knowing when testing.
7. **StrictMode double-rendering.** In development, `<StrictMode>` intentionally double-invokes render/lazy initializers. `getMockData()` is pure (returns the same imported object), so this is harmless here.
8. **`crypto.randomUUID()` secure-context requirement.** Works on `localhost` and HTTPS; would fail on plain-HTTP non-localhost hosts.
9. **Provider re-render scope.** Because `useMemo` depends on `currentUser`, every sign-in/out re-renders all context consumers. That's expected (and cheap here), but keep heavy trees partitioned if the app grows.

---

## 9. Possible next steps

- Implement `useAuth` (§5.10) and use it in Login/Signup/Dashboard pages.
- Persist session + registered users with `localStorage` for refresh survival.
- Normalize `signIn` to also accept an options object, or vice-versa.
- Add input validation (email format, password strength) before hitting the mock "database".
- When moving to a real backend, keep the same five-member context value (`currentUser`, `isAuthenticated`, `signIn`, `signUp`, `signOut`) but make the methods async and back them with API calls — the component-facing contract stays identical.



