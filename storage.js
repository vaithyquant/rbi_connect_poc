/* ===========================================================
   RBI Connect — Storage Layer
   Wraps localStorage so the rest of the app can read/write
   "tables" without worrying about JSON encoding or first-run
   seeding. Keys are namespaced under "rbiconnect:" to avoid
   clashing with anything else in the browser.
   =========================================================== */

const STORAGE_PREFIX = "rbiconnect:";
const STORAGE_VERSION = "v1";

const Store = {
  _key(name) {
    return `${STORAGE_PREFIX}${STORAGE_VERSION}:${name}`;
  },

  get(name, fallback) {
    try {
      const raw = localStorage.getItem(this._key(name));
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Store.get failed for", name, e);
      return fallback;
    }
  },

  set(name, value) {
    try {
      localStorage.setItem(this._key(name), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Store.set failed for", name, e);
      return false;
    }
  },

  has(name) {
    return localStorage.getItem(this._key(name)) !== null;
  },

  clearAll() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  }
};

/* -----------------------------------------------------------
   First-run seeding: only writes seed data if nothing exists
   yet for that table, so user edits survive page reloads.
   ----------------------------------------------------------- */
function initStore() {
  if (!Store.has("seeded")) {
    Store.set("users", SEED_USERS);
    Store.set("questions", SEED_QUESTIONS);
    Store.set("posts", SEED_POSTS);
    Store.set("communities", SEED_COMMUNITIES);
    Store.set("ideas", SEED_IDEAS);
    Store.set("currentUser", CURRENT_USER);
    Store.set("seeded", true);
  }
}

function resetDemoData() {
  Store.clearAll();
  initStore();
}

/* -----------------------------------------------------------
   Lookup helpers shared across modules
   ----------------------------------------------------------- */
function getAllUsersById() {
  const users = Store.get("users", []);
  const current = Store.get("currentUser", CURRENT_USER);
  const map = {};
  map[current.id] = current;
  users.forEach((u) => (map[u.id] = u));
  return map;
}

function getUserById(id) {
  return getAllUsersById()[id] || null;
}

function timeAgo(isoString) {
  const then = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
