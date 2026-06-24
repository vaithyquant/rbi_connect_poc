/* ===========================================================
   RBI Connect — Render Functions
   Each renderX() function returns an HTML string for a view.
   app.js is responsible for injecting these into #mainContent
   and wiring up event listeners afterwards.
   =========================================================== */

/* ----------------------- PROFILE VIEW ----------------------- */

function renderProfileView() {
  const user = Store.get("currentUser", CURRENT_USER);
  const questions = Store.get("questions", []);
  const posts = Store.get("posts", []);
  const ideas = Store.get("ideas", []);

  const myQuestionCount = questions.filter((q) => q.authorId === user.id).length;
  const myAnswerCount = questions.reduce(
    (sum, q) => sum + q.answers.filter((a) => a.authorId === user.id).length,
    0
  );
  const myPostCount = posts.filter((p) => p.authorId === user.id).length;
  const myIdeaCount = ideas.filter((i) => i.authorId === user.id).length;

  return `
    <div class="view-header">
      <div>
        <h1>My profile</h1>
        <div class="view-subtitle">Visible to colleagues across all departments</div>
      </div>
    </div>

    <div class="card profile-header">
      <div class="avatar avatar--lg">${escapeHtml(initials(user.name))}</div>
      <div>
        <h2 class="profile-header__name">${escapeHtml(user.name)}</h2>
        <div class="profile-header__role">${escapeHtml(user.designation)} &middot; ${escapeHtml(user.department)} (${escapeHtml(DEPARTMENT_FULL_NAMES[user.department] || "")})</div>
        <div class="profile-header__location">${escapeHtml(user.office)}, ${escapeHtml(user.location)} &middot; Joined ${escapeHtml(user.joined)}</div>
      </div>
    </div>

    <div class="card profile-section">
      <h2>Activity overview</h2>
      <div class="stat-grid">
        <div class="stat"><strong>${user.connections}</strong><span>Connections</span></div>
        <div class="stat"><strong>${myPostCount}</strong><span>Feed posts</span></div>
        <div class="stat"><strong>${myQuestionCount}</strong><span>Questions asked</span></div>
        <div class="stat"><strong>${myAnswerCount}</strong><span>Answers given</span></div>
        <div class="stat"><strong>${myIdeaCount}</strong><span>Ideas submitted</span></div>
        <div class="stat"><strong>${user.badges.length}</strong><span>Badges earned</span></div>
      </div>
    </div>

    <div class="card profile-section">
      <h2>About</h2>
      <div class="editable-field">
        <label for="bioInput">Bio</label>
        <textarea id="bioInput" rows="3">${escapeHtml(user.bio)}</textarea>
      </div>
      <button class="btn btn--outline btn--sm" id="saveBioBtn">Save bio</button>
    </div>

    <div class="card profile-section">
      <h2>Skills</h2>
      <div class="skills-row" id="skillsRow">
        ${user.skills.map((s, i) => `<span class="tag" data-skill-index="${i}">${escapeHtml(s)} <span class="remove-skill" style="cursor:pointer;color:var(--maroon);margin-left:4px;" title="Remove">&times;</span></span>`).join("")}
      </div>
      <div style="display:flex; gap:8px; margin-top:12px; max-width:360px;">
        <input type="text" id="newSkillInput" placeholder="Add a skill (e.g. Risk Analysis)" style="flex:1; padding:7px 10px; border:1px solid var(--border); border-radius:var(--radius); font-size:13.5px;" />
        <button class="btn btn--outline btn--sm" id="addSkillBtn">Add</button>
      </div>
    </div>

    <div class="card profile-section">
      <h2>Badges</h2>
      <div class="skills-row">
        ${user.badges.map((b) => `<span class="tag tag--gold">&#9733; ${escapeHtml(b)}</span>`).join("") || `<span style="color:var(--slate); font-size:13.5px;">No badges yet — contribute to Q&amp;A and Ideas to earn some.</span>`}
      </div>
    </div>
  `;
}

/* ----------------------- FEED VIEW ----------------------- */

function renderFeedView() {
  const posts = Store.get("posts", []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const user = Store.get("currentUser", CURRENT_USER);

  return `
    <div class="view-header">
      <div>
        <h1>Feed</h1>
        <div class="view-subtitle">Short updates from colleagues across departments</div>
      </div>
    </div>

    <div class="card composer">
      <div class="avatar avatar--md">${escapeHtml(initials(user.name))}</div>
      <div class="composer__body">
        <textarea id="newPostInput" placeholder="Share an update, a win, or something useful with your colleagues..." maxlength="280"></textarea>
        <div class="composer__actions">
          <button class="btn btn--gold btn--sm" id="submitPostBtn">Post</button>
        </div>
      </div>
    </div>

    <div id="postsList">
      ${posts.length ? posts.map(renderSinglePost).join("") : emptyState("No posts yet", "Be the first to share something with your colleagues.")}
    </div>
  `;
}

function renderSinglePost(post) {
  const author = getUserById(post.authorId) || { name: "Unknown", designation: "", department: "" };
  const currentUser = Store.get("currentUser", CURRENT_USER);
  const liked = (post.likedBy || []).includes(currentUser.id);
  const reposted = (post.repostedBy || []).includes(currentUser.id);

  return `
    <div class="card post" data-post-id="${post.id}">
      <div class="avatar avatar--md">${escapeHtml(initials(author.name))}</div>
      <div class="post__body">
        <div class="post__head">
          <span class="post__author">${escapeHtml(author.name)}</span>
          <span class="tag">${escapeHtml(author.department || "")}</span>
          <span class="post__meta">${escapeHtml(author.designation || "")} &middot; ${timeAgo(post.createdAt)}</span>
        </div>
        <div class="post__text">${escapeHtml(post.body)}</div>
        <div class="post__actions">
          <button class="like-btn ${liked ? "is-liked" : ""}" data-action="like">&#9825; <span>${post.likes}</span></button>
          <button class="repost-btn ${reposted ? "is-reposted" : ""}" data-action="repost">&#8635; <span>${post.reposts}</span></button>
          <button data-action="toggle-comments">&#128172; <span>${post.comments.length}</span></button>
        </div>
        <div class="comment-list" data-comments-for="${post.id}" hidden>
          ${post.comments.map(renderSingleComment).join("")}
          <form class="comment-form" data-comment-form="${post.id}">
            <input type="text" placeholder="Write a comment..." maxlength="200" required />
            <button class="btn btn--outline btn--sm" type="submit">Reply</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderSingleComment(comment) {
  const author = getUserById(comment.authorId) || { name: "Unknown" };
  return `
    <div class="comment">
      <div class="avatar avatar--sm">${escapeHtml(initials(author.name))}</div>
      <div><span class="comment__author">${escapeHtml(author.name)}</span>${escapeHtml(comment.body)}</div>
    </div>
  `;
}

/* ----------------------- Q&A VIEW ----------------------- */

let qaActiveFilter = "All";
let qaSortMode = "votes";

function renderQAView() {
  const allQuestions = Store.get("questions", []);
  const filters = ["All", ...DEPARTMENTS];

  let questions = qaActiveFilter === "All" ? allQuestions.slice() : allQuestions.filter((q) => q.tag === qaActiveFilter);
  questions.sort((a, b) =>
    qaSortMode === "votes" ? b.votes - a.votes : new Date(b.createdAt) - new Date(a.createdAt)
  );

  return `
    <div class="view-header">
      <div>
        <h1>Questions &amp; Answers</h1>
        <div class="view-subtitle">Ask, answer, and upvote what's useful — Quora-style knowledge sharing</div>
      </div>
    </div>

    <div class="card ask-form">
      <strong style="font-family:var(--font-display); color:var(--navy); font-size:15px;">Ask a question</strong>
      <input type="text" id="newQuestionTitle" placeholder="Question title — be specific" maxlength="140" />
      <textarea id="newQuestionBody" placeholder="Add detail to help colleagues answer accurately (optional)"></textarea>
      <div class="ask-form__row">
        <select id="newQuestionTag">
          ${DEPARTMENTS.map((d) => `<option value="${d}">${d}</option>`).join("")}
        </select>
        <div style="flex:1;"></div>
      </div>
      <div class="ask-form__actions">
        <button class="btn btn--gold btn--sm" id="submitQuestionBtn">Post question</button>
      </div>
    </div>

    <div class="qa-toolbar">
      <div class="filter-row" id="qaFilterRow">
        ${filters.map((f) => `<button class="filter-chip ${f === qaActiveFilter ? "is-active" : ""}" data-filter="${f}">${f}</button>`).join("")}
      </div>
      <div class="filter-row">
        <button class="filter-chip ${qaSortMode === "votes" ? "is-active" : ""}" data-sort="votes">Top voted</button>
        <button class="filter-chip ${qaSortMode === "recent" ? "is-active" : ""}" data-sort="recent">Most recent</button>
      </div>
    </div>

    <div id="questionsList">
      ${questions.length ? questions.map(renderSingleQuestion).join("") : emptyState("No questions here yet", "Try a different department filter, or ask the first question.")}
    </div>
  `;
}

function renderSingleQuestion(q) {
  const author = getUserById(q.authorId) || { name: "Unknown", designation: "" };
  const currentUser = Store.get("currentUser", CURRENT_USER);
  const userVote = (q.voters || {})[currentUser.id] || 0;
  const sortedAnswers = q.answers.slice().sort((a, b) => b.votes - a.votes);

  return `
    <div class="card question" data-question-id="${q.id}">
      <div class="vote-col">
        <button class="vote-btn ${userVote === 1 ? "is-active" : ""}" data-vote="1" title="Upvote">&#9650;</button>
        <span class="vote-count">${q.votes}</span>
        <button class="vote-btn ${userVote === -1 ? "is-active" : ""}" data-vote="-1" title="Downvote">&#9660;</button>
      </div>
      <div style="flex:1; min-width:0;">
        <h3 class="question__title">${escapeHtml(q.title)}</h3>
        <div class="question__meta">
          <span class="tag">${escapeHtml(q.tag)}</span>
          <span>${escapeHtml(author.name)} &middot; ${timeAgo(q.createdAt)}</span>
        </div>
        ${q.body ? `<div class="question__body">${escapeHtml(q.body)}</div>` : ""}
        <button class="question__toggle" data-action="toggle-answers">${q.answers.length} answer${q.answers.length === 1 ? "" : "s"} &darr;</button>
        <div class="answer-list" data-answers-for="${q.id}" hidden>
          ${sortedAnswers.map((a) => renderSingleAnswer(a, q.id)).join("") || `<div style="font-size:13px; color:var(--slate);">No answers yet — be the first to help.</div>`}
          <form class="answer-form" data-answer-form="${q.id}">
            <textarea placeholder="Write an answer..." required></textarea>
            <button class="btn btn--outline btn--sm" type="submit" style="align-self:flex-end;">Post</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderSingleAnswer(a, questionId) {
  const author = getUserById(a.authorId) || { name: "Unknown", designation: "" };
  return `
    <div class="answer" data-answer-id="${a.id}">
      <div class="avatar avatar--sm">${escapeHtml(initials(author.name))}</div>
      <div class="answer__body">
        <div class="answer__head">
          <span class="answer__author">${escapeHtml(author.name)}</span>
          <span class="answer__meta">${escapeHtml(author.designation || "")} &middot; ${timeAgo(a.createdAt)}</span>
        </div>
        ${escapeHtml(a.body)}
        <div style="margin-top:4px;">
          <button class="vote-btn answer-vote-btn" data-answer-vote="1" data-question-id="${questionId}" style="display:inline-flex; width:auto; padding:2px 8px; height:auto;">&#9650; ${a.votes}</button>
        </div>
      </div>
    </div>
  `;
}

/* ----------------------- COMMUNITIES & IDEAS VIEW ----------------------- */

let commTabMode = "communities";

function renderCommunitiesView() {
  return `
    <div class="view-header">
      <div>
        <h1>Communities &amp; Ideas</h1>
        <div class="view-subtitle">Topic groups and crowdsourced improvement ideas — Knome-style collaboration</div>
      </div>
    </div>

    <div class="tab-row">
      <button class="tab-btn ${commTabMode === "communities" ? "is-active" : ""}" data-tab="communities">Communities</button>
      <button class="tab-btn ${commTabMode === "ideas" ? "is-active" : ""}" data-tab="ideas">Ideas board</button>
    </div>

    <div id="commTabContent">
      ${commTabMode === "communities" ? renderCommunitiesTab() : renderIdeasTab()}
    </div>
  `;
}

function renderCommunitiesTab() {
  const communities = Store.get("communities", []);
  const currentUser = Store.get("currentUser", CURRENT_USER);

  return `
    <div class="community-grid">
      ${communities.map((c) => {
        const isMember = c.members.includes(currentUser.id);
        const visibleMembers = c.members.slice(0, 4).map((id) => getUserById(id)).filter(Boolean);
        return `
          <div class="card community-card" data-community-id="${c.id}">
            <span class="tag tag--gold">${escapeHtml(c.tag)}</span>
            <h3>${escapeHtml(c.name)}</h3>
            <p>${escapeHtml(c.description)}</p>
            <div class="community-card__footer">
              <div class="member-stack">
                ${visibleMembers.map((m) => `<div class="avatar avatar--sm" title="${escapeHtml(m.name)}">${escapeHtml(initials(m.name))}</div>`).join("")}
              </div>
              <button class="btn btn--sm ${isMember ? "btn--outline" : "btn--gold"}" data-action="toggle-join">${isMember ? "Joined ✓" : "Join"}</button>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderIdeasTab() {
  const ideas = Store.get("ideas", []).slice().sort((a, b) => b.votes - a.votes);
  const currentUser = Store.get("currentUser", CURRENT_USER);

  const statusClass = { Submitted: "submitted", "Under Review": "review", Planned: "planned" };

  return `
    <div class="card idea-form">
      <strong style="font-family:var(--font-display); color:var(--navy); font-size:15px;">Submit an idea</strong>
      <input type="text" id="newIdeaTitle" placeholder="Idea title" maxlength="120" />
      <textarea id="newIdeaBody" placeholder="Describe the idea and the problem it solves"></textarea>
      <div class="idea-form__actions">
        <button class="btn btn--gold btn--sm" id="submitIdeaBtn">Submit idea</button>
      </div>
    </div>

    <div id="ideasList">
      ${ideas.map((idea) => {
        const author = getUserById(idea.authorId) || { name: "Unknown" };
        const hasVoted = (idea.voters || []).includes(currentUser.id);
        return `
          <div class="card idea" data-idea-id="${idea.id}">
            <div class="vote-col">
              <button class="vote-btn ${hasVoted ? "is-active" : ""}" data-action="vote-idea">&#9650;</button>
              <span class="vote-count">${idea.votes}</span>
            </div>
            <div style="flex:1;">
              <h3 class="idea__title">${escapeHtml(idea.title)}</h3>
              <div class="idea__body">${escapeHtml(idea.body)}</div>
              <div class="idea__meta">
                <span class="status-pill status-pill--${statusClass[idea.status] || "submitted"}">${escapeHtml(idea.status)}</span>
                <span>${escapeHtml(author.name)} &middot; ${timeAgo(idea.createdAt)}</span>
              </div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

/* ----------------------- SHARED HELPERS ----------------------- */

function emptyState(title, sub) {
  return `<div class="card empty-state"><strong>${escapeHtml(title)}</strong>${escapeHtml(sub)}</div>`;
}

function renderSidenavProfileCard() {
  const user = Store.get("currentUser", CURRENT_USER);
  return `
    <div class="mini-avatar-row">
      <div class="avatar avatar--md">${escapeHtml(initials(user.name))}</div>
      <div>
        <div class="mini-name">${escapeHtml(user.name)}</div>
        <div class="mini-role">${escapeHtml(user.designation)}, ${escapeHtml(user.department)}</div>
      </div>
    </div>
    <div class="mini-stats">
      <div><strong>${user.connections}</strong>Connections</div>
      <div><strong>${user.badges.length}</strong>Badges</div>
    </div>
  `;
}
