/* ===========================================================
   RBI Connect — App Controller
   Handles navigation between views and all interactive logic:
   creating posts/questions/answers/ideas, voting, liking,
   joining communities, editing profile, etc. Every mutation
   writes back to Store (localStorage) then re-renders.
   =========================================================== */

let currentView = "profile";

const VIEW_RENDERERS = {
  profile: renderProfileView,
  feed: renderFeedView,
  qa: renderQAView,
  communities: renderCommunitiesView
};

function init() {
  initStore();
  wireNavigation();
  wireResetButton();
  navigateTo("profile");
}

/* ----------------------- NAVIGATION ----------------------- */

function wireNavigation() {
  document.querySelectorAll(".sidenav__item").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.view));
  });
}

function navigateTo(view) {
  currentView = view;
  document.querySelectorAll(".sidenav__item").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === view);
  });
  document.getElementById("sidenavProfileCard").innerHTML = renderSidenavProfileCard();
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function renderCurrentView() {
  const main = document.getElementById("mainContent");
  main.innerHTML = VIEW_RENDERERS[currentView]();
  wireViewEvents(currentView);
}

function wireViewEvents(view) {
  if (view === "profile") wireProfileEvents();
  if (view === "feed") wireFeedEvents();
  if (view === "qa") wireQAEvents();
  if (view === "communities") wireCommunitiesEvents();
}

/* ----------------------- TOAST ----------------------- */

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const tpl = document.getElementById("tpl-toast");
  const node = tpl.content.cloneNode(true);
  node.querySelector(".toast").textContent = message;
  document.body.appendChild(node);
  setTimeout(() => {
    const t = document.querySelector(".toast");
    if (t) t.remove();
  }, 2400);
}

/* ----------------------- RESET ----------------------- */

function wireResetButton() {
  document.getElementById("resetDataBtn").addEventListener("click", () => {
    if (confirm("This will reset all demo data (posts, questions, ideas, profile edits) back to the original sample content. Continue?")) {
      resetDemoData();
      showToast("Demo data reset.");
      navigateTo(currentView);
    }
  });
}

/* ============================================================
   PROFILE
   ============================================================ */

function wireProfileEvents() {
  document.getElementById("saveBioBtn").addEventListener("click", () => {
    const user = Store.get("currentUser", CURRENT_USER);
    user.bio = document.getElementById("bioInput").value.trim();
    Store.set("currentUser", user);
    showToast("Bio updated.");
  });

  document.getElementById("addSkillBtn").addEventListener("click", addSkill);
  document.getElementById("newSkillInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  });

  document.querySelectorAll(".remove-skill").forEach((el) => {
    el.addEventListener("click", (e) => {
      const index = parseInt(e.target.closest("[data-skill-index]").dataset.skillIndex, 10);
      const user = Store.get("currentUser", CURRENT_USER);
      user.skills.splice(index, 1);
      Store.set("currentUser", user);
      renderCurrentView();
    });
  });
}

function addSkill() {
  const input = document.getElementById("newSkillInput");
  const value = input.value.trim();
  if (!value) return;
  const user = Store.get("currentUser", CURRENT_USER);
  user.skills.push(value);
  Store.set("currentUser", user);
  showToast("Skill added.");
  renderCurrentView();
}

/* ============================================================
   FEED
   ============================================================ */

function wireFeedEvents() {
  document.getElementById("submitPostBtn").addEventListener("click", () => {
    const input = document.getElementById("newPostInput");
    const body = input.value.trim();
    if (!body) return;

    const user = Store.get("currentUser", CURRENT_USER);
    const posts = Store.get("posts", []);
    posts.unshift({
      id: uid("p"),
      authorId: user.id,
      body,
      likes: 0,
      reposts: 0,
      likedBy: [],
      repostedBy: [],
      createdAt: new Date().toISOString(),
      comments: []
    });
    Store.set("posts", posts);
    showToast("Posted to feed.");
    renderCurrentView();
  });

  document.querySelectorAll(".post").forEach((postEl) => {
    const postId = postEl.dataset.postId;

    postEl.querySelector('[data-action="like"]').addEventListener("click", () => toggleLike(postId));
    postEl.querySelector('[data-action="repost"]').addEventListener("click", () => toggleRepost(postId));
    postEl.querySelector('[data-action="toggle-comments"]').addEventListener("click", () => {
      const panel = postEl.querySelector(`[data-comments-for="${postId}"]`);
      panel.hidden = !panel.hidden;
    });

    const commentForm = postEl.querySelector(`[data-comment-form="${postId}"]`);
    if (commentForm) {
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = commentForm.querySelector("input");
        const body = input.value.trim();
        if (!body) return;
        addComment(postId, body);
      });
    }
  });
}

function toggleLike(postId) {
  const user = Store.get("currentUser", CURRENT_USER);
  const posts = Store.get("posts", []);
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  post.likedBy = post.likedBy || [];
  const idx = post.likedBy.indexOf(user.id);
  if (idx === -1) {
    post.likedBy.push(user.id);
    post.likes += 1;
  } else {
    post.likedBy.splice(idx, 1);
    post.likes = Math.max(0, post.likes - 1);
  }
  Store.set("posts", posts);
  renderCurrentView();
}

function toggleRepost(postId) {
  const user = Store.get("currentUser", CURRENT_USER);
  const posts = Store.get("posts", []);
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  post.repostedBy = post.repostedBy || [];
  const idx = post.repostedBy.indexOf(user.id);
  if (idx === -1) {
    post.repostedBy.push(user.id);
    post.reposts += 1;
    showToast("Reposted to your network.");
  } else {
    post.repostedBy.splice(idx, 1);
    post.reposts = Math.max(0, post.reposts - 1);
  }
  Store.set("posts", posts);
  renderCurrentView();
}

function addComment(postId, body) {
  const user = Store.get("currentUser", CURRENT_USER);
  const posts = Store.get("posts", []);
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  post.comments.push({ authorId: user.id, body, createdAt: new Date().toISOString() });
  Store.set("posts", posts);
  renderCurrentView();
  // Re-open the comment panel after re-render since render defaults to hidden
  const panel = document.querySelector(`[data-comments-for="${postId}"]`);
  if (panel) panel.hidden = false;
}

/* ============================================================
   Q&A
   ============================================================ */

function wireQAEvents() {
  document.getElementById("submitQuestionBtn").addEventListener("click", () => {
    const titleInput = document.getElementById("newQuestionTitle");
    const bodyInput = document.getElementById("newQuestionBody");
    const tagSelect = document.getElementById("newQuestionTag");
    const title = titleInput.value.trim();
    if (!title) {
      showToast("Please add a question title.");
      return;
    }
    const user = Store.get("currentUser", CURRENT_USER);
    const questions = Store.get("questions", []);
    questions.unshift({
      id: uid("q"),
      title,
      body: bodyInput.value.trim(),
      tag: tagSelect.value,
      authorId: user.id,
      votes: 0,
      voters: {},
      createdAt: new Date().toISOString(),
      answers: []
    });
    Store.set("questions", questions);
    showToast("Question posted.");
    renderCurrentView();
  });

  document.querySelectorAll("#qaFilterRow [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      qaActiveFilter = btn.dataset.filter;
      renderCurrentView();
    });
  });

  document.querySelectorAll(".qa-toolbar [data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      qaSortMode = btn.dataset.sort;
      renderCurrentView();
    });
  });

  document.querySelectorAll(".question").forEach((qEl) => {
    const questionId = qEl.dataset.questionId;

    qEl.querySelectorAll(".vote-col > [data-vote]").forEach((btn) => {
      btn.addEventListener("click", () => voteQuestion(questionId, parseInt(btn.dataset.vote, 10)));
    });

    qEl.querySelector('[data-action="toggle-answers"]').addEventListener("click", () => {
      const panel = qEl.querySelector(`[data-answers-for="${questionId}"]`);
      panel.hidden = !panel.hidden;
    });

    const answerForm = qEl.querySelector(`[data-answer-form="${questionId}"]`);
    if (answerForm) {
      answerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const textarea = answerForm.querySelector("textarea");
        const body = textarea.value.trim();
        if (!body) return;
        addAnswer(questionId, body);
      });
    }

    qEl.querySelectorAll(".answer-vote-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const answerEl = btn.closest("[data-answer-id]");
        voteAnswer(questionId, answerEl.dataset.answerId);
      });
    });
  });
}

function voteQuestion(questionId, direction) {
  const user = Store.get("currentUser", CURRENT_USER);
  const questions = Store.get("questions", []);
  const q = questions.find((x) => x.id === questionId);
  if (!q) return;
  q.voters = q.voters || {};
  const current = q.voters[user.id] || 0;
  const next = current === direction ? 0 : direction;
  q.votes += next - current;
  q.voters[user.id] = next;
  Store.set("questions", questions);
  renderCurrentView();
  const panel = document.querySelector(`[data-answers-for="${questionId}"]`);
  if (panel) panel.hidden = false;
}

function addAnswer(questionId, body) {
  const user = Store.get("currentUser", CURRENT_USER);
  const questions = Store.get("questions", []);
  const q = questions.find((x) => x.id === questionId);
  if (!q) return;
  q.answers.push({ id: uid("a"), authorId: user.id, body, votes: 0, createdAt: new Date().toISOString() });
  Store.set("questions", questions);
  showToast("Answer posted.");
  renderCurrentView();
  const panel = document.querySelector(`[data-answers-for="${questionId}"]`);
  if (panel) panel.hidden = false;
}

function voteAnswer(questionId, answerId) {
  const questions = Store.get("questions", []);
  const q = questions.find((x) => x.id === questionId);
  if (!q) return;
  const a = q.answers.find((x) => x.id === answerId);
  if (!a) return;
  a.votes += 1;
  Store.set("questions", questions);
  renderCurrentView();
  const panel = document.querySelector(`[data-answers-for="${questionId}"]`);
  if (panel) panel.hidden = false;
}

/* ============================================================
   COMMUNITIES & IDEAS
   ============================================================ */

function wireCommunitiesEvents() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      commTabMode = btn.dataset.tab;
      renderCurrentView();
    });
  });

  if (commTabMode === "communities") {
    document.querySelectorAll(".community-card").forEach((cardEl) => {
      cardEl.querySelector('[data-action="toggle-join"]').addEventListener("click", () => {
        toggleJoinCommunity(cardEl.dataset.communityId);
      });
    });
  } else {
    const submitBtn = document.getElementById("submitIdeaBtn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const titleInput = document.getElementById("newIdeaTitle");
        const bodyInput = document.getElementById("newIdeaBody");
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();
        if (!title || !body) {
          showToast("Please add both a title and description.");
          return;
        }
        const user = Store.get("currentUser", CURRENT_USER);
        const ideas = Store.get("ideas", []);
        ideas.unshift({
          id: uid("i"),
          title,
          body,
          authorId: user.id,
          votes: 0,
          voters: [],
          status: "Submitted",
          createdAt: new Date().toISOString()
        });
        Store.set("ideas", ideas);
        showToast("Idea submitted.");
        renderCurrentView();
      });
    }

    document.querySelectorAll(".idea").forEach((ideaEl) => {
      ideaEl.querySelector('[data-action="vote-idea"]').addEventListener("click", () => {
        voteIdea(ideaEl.dataset.ideaId);
      });
    });
  }
}

function toggleJoinCommunity(communityId) {
  const user = Store.get("currentUser", CURRENT_USER);
  const communities = Store.get("communities", []);
  const c = communities.find((x) => x.id === communityId);
  if (!c) return;
  const idx = c.members.indexOf(user.id);
  if (idx === -1) {
    c.members.push(user.id);
    showToast(`Joined ${c.name}.`);
  } else {
    c.members.splice(idx, 1);
    showToast(`Left ${c.name}.`);
  }
  Store.set("communities", communities);
  renderCurrentView();
}

function voteIdea(ideaId) {
  const user = Store.get("currentUser", CURRENT_USER);
  const ideas = Store.get("ideas", []);
  const idea = ideas.find((x) => x.id === ideaId);
  if (!idea) return;
  idea.voters = idea.voters || [];
  const idx = idea.voters.indexOf(user.id);
  if (idx === -1) {
    idea.voters.push(user.id);
    idea.votes += 1;
  } else {
    idea.voters.splice(idx, 1);
    idea.votes = Math.max(0, idea.votes - 1);
  }
  Store.set("ideas", ideas);
  renderCurrentView();
}

/* ----------------------- BOOT ----------------------- */

document.addEventListener("DOMContentLoaded", init);
