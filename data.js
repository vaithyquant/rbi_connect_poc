/* ===========================================================
   RBI Connect — Seed Data
   This file defines the starting ("factory") data used the
   first time the app loads, or after a reset. Everything here
   is fictional sample content for demo purposes only.
   =========================================================== */

const DEPARTMENTS = ["DoR", "DPSS", "HRMD", "FED", "DIT"];

const DEPARTMENT_FULL_NAMES = {
  DoR: "Department of Regulation",
  DPSS: "Department of Payment and Settlement Systems",
  HRMD: "Human Resource Management Department",
  FED: "Foreign Exchange Department",
  DIT: "Department of Information Technology"
};

const CURRENT_USER = {
  id: "u-001",
  name: "Vaitheeswaran S",
  designation: "Assistant Manager",
  department: "DIT",
  office: "Central Office",
  location: "Mumbai",
  joined: "2021",
  bio: "Working on internal platforms and digital initiatives at DIT, CO. Interested in process automation and employee experience.",
  skills: ["Process Automation", "SQL", "Project Coordination", "Core Banking Systems", "Data Analysis"],
  badges: ["Early Adopter"],
  connections: 18,
  avatarInitials: "VS"
};

const SEED_USERS = [
  { id: "u-002", name: "Anjali Mehta", designation: "Manager", department: "HRMD", office: "Central Office", location: "Mumbai", avatarInitials: "AM" },
  { id: "u-003", name: "Suresh Pillai", designation: "Deputy General Manager", department: "DoR", office: "Central Office", location: "Mumbai", avatarInitials: "SP" },
  { id: "u-004", name: "Neha Kulkarni", designation: "Assistant Manager", department: "DPSS", office: "Regional Office", location: "Pune", avatarInitials: "NK" },
  { id: "u-005", name: "Ravi Shankar", designation: "Manager", department: "FED", office: "Regional Office", location: "Chennai", avatarInitials: "RS" },
  { id: "u-006", name: "Priya Nair", designation: "Assistant General Manager", department: "DIT", office: "Central Office", location: "Mumbai", avatarInitials: "PN" },
  { id: "u-007", name: "Arvind Joshi", designation: "Manager", department: "DoR", office: "Regional Office", location: "Delhi", avatarInitials: "AJ" },
  { id: "u-008", name: "Lakshmi Iyer", designation: "Assistant Manager", department: "HRMD", office: "Central Office", location: "Mumbai", avatarInitials: "LI" }
];

const SEED_QUESTIONS = [
  {
    id: "q-001",
    title: "What is the updated process for claiming LFC for dependent parents?",
    body: "With the recent circular on LFC eligibility, can someone confirm whether dependent parents staying in a different city can be included in a single block-year claim, and what proofs are now mandatory?",
    tag: "HRMD",
    authorId: "u-004",
    votes: 14,
    createdAt: daysAgo(6),
    answers: [
      { id: "a-001", authorId: "u-002", body: "Dependent parents can be included if they are listed in your service record as dependents. You'll need address proof for their current residence plus the standard travel tickets/boarding passes. The recent circular mainly tightened the definition of 'dependent' income threshold, not the travel rules.", votes: 9, createdAt: daysAgo(5) },
        { id: "a-002", authorId: "u-008", body: "Adding to Anjali's point — if parents reside in a different city than yours, you may also claim that as a separate leg, but it must still fall within the same block year and overall fare cap.", votes: 5, createdAt: daysAgo(4) }
    ]
  },
  {
    id: "q-002",
    title: "Best practices for securing API endpoints exposed to other departments?",
    body: "We're exposing a few internal REST APIs from DIT for DPSS to consume for settlement data lookups. What's the recommended internal standard for auth — mutual TLS, API keys, or OAuth2 client credentials?",
    tag: "DIT",
    authorId: "u-006",
    votes: 21,
    createdAt: daysAgo(10),
    answers: [
      { id: "a-003", authorId: "u-001", body: "For inter-department APIs we've generally standardised on OAuth2 client credentials flow with short-lived tokens, plus mTLS for anything touching settlement or core banking data. API keys alone aren't considered sufficient for production traffic.", votes: 12, createdAt: daysAgo(9) }
    ]
  },
  {
    id: "q-003",
    title: "Clarification needed: KYC documentation for NRE account fund transfers",
    body: "For an NRE-to-NRE fund transfer above a certain threshold, is a fresh FATCA declaration required, or is the one on file at account opening sufficient if there's no change in residential status?",
    tag: "FED",
    authorId: "u-005",
    votes: 8,
    createdAt: daysAgo(3),
    answers: [
      { id: "a-004", authorId: "u-007", body: "If there's no change in residential status or other KYC particulars, the existing FATCA declaration on file remains valid. A fresh declaration is only triggered by periodic KYC review cycles or a change in status.", votes: 6, createdAt: daysAgo(2) }
    ]
  },
  {
    id: "q-004",
    title: "Guidance on risk-based supervision framework for small finance banks",
    body: "Could someone from DoR point me to the latest internal note summarising changes to the risk-based supervision approach as applicable to SFBs? Looking for something more digestible than the full circular.",
    tag: "DoR",
    authorId: "u-008",
    votes: 11,
    createdAt: daysAgo(15),
    answers: []
  },
  {
    id: "q-005",
    title: "Any internal tool to track UPI transaction failure trends by bank?",
    body: "For a presentation, I need a quick way to see month-on-month UPI failure rate trends segmented by issuing bank. Does DPSS maintain an internal dashboard for this, or do we pull it manually each time?",
    tag: "DPSS",
    authorId: "u-001",
    votes: 17,
    createdAt: daysAgo(8),
    answers: [
      { id: "a-005", authorId: "u-004", body: "Yes, there's an internal dashboard refreshed weekly. I'll share the access request link with you separately — it covers failure rate by bank, by TPAP, and by error code.", votes: 10, createdAt: daysAgo(7) }
    ]
  }
];

const SEED_POSTS = [
  {
    id: "p-001",
    authorId: "u-006",
    body: "Rolled out the updated incident-reporting workflow on the internal portal today. Average time-to-acknowledge for P1 tickets is down from 40 minutes to under 12. Small change, solid impact. 🎯",
    likes: 23,
    reposts: 4,
    createdAt: daysAgo(1),
    comments: [
      { authorId: "u-001", body: "Great work — the new escalation matrix really helps.", createdAt: daysAgo(1) }
    ]
  },
  {
    id: "p-002",
    authorId: "u-003",
    body: "Attended a useful session on proportionality in regulation for co-operative banks this week. The shift towards differentiated regulatory treatment by asset size is going to be a long-term theme — worth tracking closely.",
    likes: 31,
    reposts: 6,
    createdAt: daysAgo(2),
    comments: []
  },
  {
    id: "p-003",
    authorId: "u-008",
    body: "Reminder: the annual wellness check-up camp at CO is scheduled for next week. Slots are filling up fast — please book through the HRMD portal if you haven't already.",
    likes: 45,
    reposts: 12,
    createdAt: daysAgo(2),
    comments: [
      { authorId: "u-002", body: "Thanks for the reminder, just booked mine.", createdAt: daysAgo(2) },
      { authorId: "u-005", body: "Does this apply to RO staff too or CO only?", createdAt: daysAgo(1) }
    ]
  },
  {
    id: "p-004",
    authorId: "u-005",
    body: "Spent the morning reviewing FEMA compliance filings from a few AD Category-I banks. Documentation quality has improved noticeably since the last cycle — good to see process improvements actually landing on the ground.",
    likes: 18,
    reposts: 2,
    createdAt: daysAgo(4),
    comments: []
  },
  {
    id: "p-005",
    authorId: "u-001",
    body: "Exploring whether a lightweight internal knowledge base could cut down repeat queries across departments. If you've dealt with something similar, would love to hear what worked (and what didn't).",
    likes: 27,
    reposts: 3,
    createdAt: daysAgo(5),
    comments: [
      { authorId: "u-006", body: "We tried something similar in DIT two years back — happy to share lessons learned over a call.", createdAt: daysAgo(5) }
    ]
  }
];

const SEED_COMMUNITIES = [
  {
    id: "c-001",
    name: "Digital Payments Forum",
    description: "Cross-department discussion space for UPI, RTGS/NEFT, and emerging payment rail topics.",
    members: ["u-001", "u-004", "u-005", "u-006"],
    tag: "DPSS"
  },
  {
    id: "c-002",
    name: "Regulatory Updates Circle",
    description: "Discuss and digest recent circulars, master directions, and supervisory guidance.",
    members: ["u-003", "u-007", "u-008"],
    tag: "DoR"
  },
  {
    id: "c-003",
    name: "People & Culture",
    description: "HR policy clarifications, wellness initiatives, and employee engagement ideas.",
    members: ["u-002", "u-008", "u-001"],
    tag: "HRMD"
  },
  {
    id: "c-004",
    name: "Tech & Automation Guild",
    description: "Internal tools, automation ideas, and tech know-how sharing across departments.",
    members: ["u-001", "u-006"],
    tag: "DIT"
  },
  {
    id: "c-005",
    name: "Forex & External Sector Watch",
    description: "Discussions on FEMA, external sector data, and forex market developments.",
    members: ["u-005", "u-007"],
    tag: "FED"
  }
];

const SEED_IDEAS = [
  {
    id: "i-001",
    title: "Unified internal search across all department portals",
    body: "A single search bar that indexes circulars, FAQs, and internal wiki pages across departments would save significant time currently spent searching department by department.",
    authorId: "u-001",
    votes: 34,
    status: "Under Review",
    createdAt: daysAgo(12)
  },
  {
    id: "i-002",
    title: "Mentorship pairing for new recruits",
    body: "A structured 6-month mentorship pairing program for new Assistant Managers, matched by department and interest area, could improve onboarding experience significantly.",
    authorId: "u-002",
    votes: 28,
    status: "Planned",
    createdAt: daysAgo(20)
  },
  {
    id: "i-003",
    title: "Quarterly cross-department shadowing program",
    body: "Allow employees to shadow a colleague in a different department for 2-3 days per quarter to build broader institutional understanding.",
    authorId: "u-007",
    votes: 19,
    status: "Submitted",
    createdAt: daysAgo(9)
  },
  {
    id: "i-004",
    title: "Centralised dashboard for internal tool access requests",
    body: "Currently access requests for different internal tools go through different forms/processes. A single request portal with status tracking would reduce friction.",
    authorId: "u-006",
    votes: 41,
    status: "Under Review",
    createdAt: daysAgo(4)
  }
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
