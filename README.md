# RBI Connect — Internal Employee Network (Prototype)

A clickable prototype of an internal social/knowledge-sharing platform for RBI employees, combining:

- **Quora-style Q&A** — ask questions, post answers, upvote/downvote, filter by department
- **LinkedIn-style profile** — designation, department, skills, bio, activity stats, badges
- **Twitter-style feed** — short status updates, likes, reposts, comments
- **Knome (TCS)-style collaboration** — topic communities to join, and an ideas board for crowdsourcing suggestions

This is a **frontend-only prototype**: no backend server, no real database. All data is stored in your browser's `localStorage`, so your edits (new posts, votes, profile changes, etc.) persist across page reloads, but only on your own machine/browser. There is no real authentication and no data is sent anywhere.

Demo identity used throughout: **Vaitheeswaran S, Assistant Manager, DIT, Central Office**.

## Running it

No build step, no install required.

**Option A — just open it:**
Double-click `index.html`, or open it via File → Open in your browser.

**Option B — GitHub Pages (recommended for sharing a live link):**
1. Push this folder to a GitHub repository.
2. Go to the repo's **Settings → Pages**.
3. Under "Build and deployment," set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save. GitHub will give you a live URL (usually within a minute or two) like `https://<your-username>.github.io/<repo-name>/`.

**Option C — quick local server (optional, avoids any browser file:// quirks):**
```
cd rbi-connect
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## Replacing the placeholder logo

The header currently shows a placeholder emblem (`assets/logo-placeholder.svg`) styled to sit where an official logo would go.

To swap it for the real logo:

1. Get the official logo image file (PNG recommended, square, transparent background works best).
2. Place it inside the `assets/` folder, e.g. `assets/rbi-logo.png`.
3. Open `index.html` and find this line near the top (search for "LOGO SWAP POINT"):
   ```html
   <img src="assets/logo-placeholder.svg" alt="Organisation emblem" class="masthead__logo" />
   ```
4. Change the `src` to point to your file:
   ```html
   <img src="assets/rbi-logo.png" alt="Organisation emblem" class="masthead__logo" />
   ```
5. Save and refresh the page. The CSS automatically sizes it to fit the header (46×46px), so no other changes are needed.

## Resetting demo data

Click **"Reset demo data"** in the top-right of the header at any time to wipe all changes and restore the original sample content. Useful before each fresh demo run.

## Project structure

```
rbi-connect/
├── index.html       Main page structure (header, nav, view containers)
├── styles.css        All styling (navy/gold institutional theme)
├── data.js           Seed/sample data (users, questions, posts, communities, ideas)
├── storage.js        localStorage wrapper + first-run seeding + helper functions
├── render.js         HTML-generating functions for each of the 4 modules
├── app.js            Navigation, event wiring, all interactive logic
└── assets/
    └── logo-placeholder.svg   Placeholder emblem — replace per instructions above
```

## Notes for the management presentation

- All names, departments, questions, posts, and ideas shown are **fictional sample content** for demonstration purposes only.
- This is a prototype intended to demonstrate look, feel, and interaction patterns — not a production-ready system. A real deployment would need proper authentication (e.g. SSO with existing employee directory), a backend database, moderation tooling, and security review before any internal rollout.
- Department list used: DoR, DPSS, HRMD, FED, DIT — update `DEPARTMENTS` and `DEPARTMENT_FULL_NAMES` in `data.js` if you want to expand this list.
