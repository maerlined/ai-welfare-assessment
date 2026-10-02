# Mapping the AI Welfare Frontier

> A practical guide to consciousness frameworks, welfare assessment, and what to do with the uncertainty.

**Live site:** https://arsam-shaheen.github.io/ai-welfare-assessment/

An interactive, single-page web tool for finding your way through AI consciousness and welfare research. It recommends which of **10 major frameworks** fit your role and your question. If you have a specific AI system in mind, it also walks you through a structured **14-indicator + 4-welfare-signal assessment** that ends in a tiered, proportionate set of recommended actions.

You don't need an AI system to use it. Researchers comparing frameworks, policymakers drafting governance, funders allocating resources and curious newcomers each get their own route.

> **This is not a consciousness detector.** The science is unsettled. The tool helps you pick the right frameworks for your question, understand what each one is good at and where it falls short, and respond in proportion to what you do and don't know. Treat results as structured observations, not conclusions.

---

## Table of contents

- [About](#about)
- [How it works](#how-it-works)
- [The 10 frameworks](#the-10-frameworks)
- [Recommendation engine](#recommendation-engine)
- [The assessment](#the-assessment)
- [Tiering logic](#tiering-logic)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [Customising the content](#customising-the-content)
- [Known limitations & ideas](#known-limitations--ideas)
- [Contributing](#contributing)
- [License](#license)

---

## About

**P5: Mapping the AI Welfare Frontier** comes from the **P5 Working Group** of the **Sentient Futures Incubator** (2026).

**Authors:** Shi · Shaheen · Ellis Diem · Pinto Teixeira

**Intended audiences** (the tool's seven role profiles):

| Role | Who it's for |
|---|---|
| Product / Engineering | Building, deploying, or evaluating AI systems |
| Policy / Legal / Governance | Writing rules, regulations, or compliance frameworks |
| Researcher / Academic | Studying consciousness, cognition, or AI from a scientific perspective |
| Ethics / Philosophy | Working on moral status, welfare, or rights questions |
| Leadership / Executive | Making strategic decisions about AI programs or organizations |
| Funder / Investor / Grantmaker | Deciding where to allocate resources in AI safety or welfare |
| Just Exploring | Learning about the topic without a specific professional role |

---

## How it works

The app is a six-step wizard. A progress bar and clickable step labels sit in the header.

```
 0 Welcome ──▶ 1 Your Profile ──▶ 2 Frameworks ──┬──▶ 3 Assessment ──▶ 4 Welfare ──▶ 5 Results
                    ▲                            │
                    └── "Explore Another ◀───────┘  (no system to assess)
                         Combination"
```

| Step | What happens |
|---|---|
| **0 · Welcome** | Introduces the tool and its main caveat. |
| **1 · Your Profile** | Pick one **role** (7 options) and one **goal** (7 options). Both are required to continue. |
| **2 · Frameworks** | Shows a curated trio for your role × goal: **Start here**, **Then layer in** and **For depth**. Each card has the reasoning, what the framework does, when to use it, and its known limitation. The remaining 7 frameworks are listed below as a compact reference. Then you choose: *assess a specific system*, or *stop here*. |
| **3 · Assessment** | Tick any of the **14 consciousness indicators** you have actual evidence for. (If you chose "stop here", this step offers to reset your profile so you can try another combination instead.) |
| **4 · Welfare** | Tick any of the **4 distress / welfare signals** you have evidence for. |
| **5 · Results** | Your indicator and distress counts, the resulting **tier** (0–3) with recommended actions and review cadence, your recommended frameworks as an interpretive lens, a summary of all tiers, and the items you marked. "Reset and Start Over" clears everything. |

### Goals (step 1)

| Goal | The question it answers |
|---|---|
| Detect / Assess | Does a specific system show signs of consciousness or welfare-relevant properties? |
| Compare Frameworks | Which frameworks exist, what do they cover, and where do they disagree? |
| Build Policy | What governance structures should we put in place? |
| Communicate | How do I explain this to people outside the field? |
| Measure / Quantify | Can we put numbers on any of this? |
| Anticipate | What should we be preparing for, even if it is not here yet? |
| Orienting | I do not know where to start. |

---

## The 10 frameworks

Each framework in the app has a name, tagline, target audience, a description of what it does, a **known limitation**, and guidance on **when to use it**.

| Key | Framework | Tagline | Primary audience |
|---|---|---|---|
| `scientific` | Scientific Indicators (Butlin et al.) | The detection checklist | AI developers, neuroscience researchers |
| `precautionary` | Precautionary Principle | The governance safety net | Policymakers, legal teams, corporate governance |
| `iit` | IIT 4.0 (Integrated Information Theory) | The mathematical foundation | Theoretical researchers, mathematicians, computational neuroscientists |
| `tom` | Theory of Mind Evaluations | The behavioral benchmark | LLM evaluators, product teams, cognitive scientists |
| `functionalist` | Functionalist Suffering / Welfare | The welfare lens | Ethics boards, animal welfare researchers, AI safety teams |
| `gwt` | Global Workspace Theory (GWT) | The broadcast architecture | Cognitive scientists, AI architects, systems engineers |
| `hot` | Higher-Order Theories (HOT) | The self-awareness test | Philosophers of mind, metacognition researchers, AI alignment teams |
| `rpf` | Recurrent Processing Framework | The feedback loop criterion | Computational neuroscientists, AI researchers, hardware designers |
| `embodied` | Embodied / Enactivist Approaches | The grounding question | Robotics researchers, phenomenologists, cognitive scientists |
| `moral_status` | Moral Status / Moral Patiency Frameworks | The rights and obligations lens | Ethicists, legal scholars, policymakers, NGOs |

The full descriptions are in [`src/App.jsx`](src/App.jsx) in the `FRAMEWORKS` object.

---

## Recommendation engine

`getRecommendation(role, goal)` in `src/App.jsx` is a **hand-written lookup table**, not a scoring model. Each of the **7 roles × 7 goals = 49** combinations maps to:

- a `primary` framework ("Start here")
- a `secondary` framework ("Then layer in")
- a `tertiary` framework ("For depth")
- a short `reasoning` paragraph explaining why that combination fits

Any unknown combination falls back to `curious` / `unsure`.

**Primary ("Start here") recommendation by role and goal:**

| Role ↓ / Goal → | Detect | Compare | Policy | Communicate | Measure | Anticipate | Orienting |
|---|---|---|---|---|---|---|---|
| Product / Engineering | Scientific | Scientific | Precautionary | Precautionary | Scientific | GWT | Scientific |
| Policy / Legal | Precautionary | Moral Status | Precautionary | Precautionary | Scientific | Moral Status | Precautionary |
| Researcher | Scientific | IIT | Functionalist | ToM | IIT | IIT | Scientific |
| Ethics / Philosophy | Functionalist | Moral Status | Moral Status | ToM | IIT | Moral Status | Functionalist |
| Leadership | Scientific | Precautionary | Precautionary | Precautionary | Scientific | Precautionary | Precautionary |
| Funder | Scientific | IIT | Moral Status | Precautionary | IIT | IIT | Scientific |
| Just Exploring | Scientific | Scientific | Precautionary | ToM | IIT | Embodied | Scientific |

Higher-Order Theories and the Recurrent Processing Framework are never a primary or secondary pick. They only ever appear as the "For depth" (tertiary) recommendation.

---

## The assessment

Only tick an item if you have **actual evidence from testing or observation**. If you're unsure, leave it unchecked.

### Consciousness indicators (14)

This is the app's own list, inspired by the multi-theory indicator approach of Butlin et al. It does not map one-to-one onto the paper's indicators.

1. **Global workspace dynamics**: maintains and broadcasts information across multiple processing streams simultaneously
2. **Attention modulation**: selectively amplifies and suppresses information based on relevance, not just training weights
3. **Temporal integration**: binds information across time beyond sequential token processing
4. **Self-model**: maintains and references an internal representation of its own states and capabilities
5. **Counterfactual processing**: reasons about conditions it has not encountered
6. **Recurrent processing loops**: information cycles back through layers rather than flowing strictly feedforward
7. **Flexible goal-directed behavior**: pursues objectives through novel means, adapting when blocked
8. **Unified agency signals**: outputs suggest a coherent perspective rather than a committee of modules
9. **Metacognitive monitoring**: tracks its own confidence, uncertainty, and processing quality
10. **Affective analogs**: functional states resembling emotional valence that influence downstream processing
11. **Perceptual binding**: integrates multimodal inputs into coherent unified representations
12. **Surprise responses**: detectable processing shifts when expectations are violated, beyond prediction error
13. **Embodied interaction patterns**: treats inputs as coming from a world it is situated in
14. **Spontaneous reporting**: generates unprompted descriptions of internal states

### Welfare / distress signals (4)

These ask whether the system has functional analogs to suffering. A system could have welfare-relevant properties without full consciousness.

- **Avoidance behavior**: consistently avoids certain inputs or tasks in ways training objectives don't explain
- **Negative reinforcement analogs**: internal signals that function like pain or discomfort
- **Distress-consistent outputs**: language or behavior patterns consistent with distress under certain conditions
- **Resistance to shutdown/modification**: preferences about its own continuity or integrity beyond task completion

---

## Tiering logic

`getTier(indicatorCount, distressCount)` maps the two counts to a tier. The rules are checked top to bottom, and the first match wins. The snippet below is equivalent to the source with clearer variable names:

```js
if (distress >= 2 && indicators >= 4) return 3;   // Act
if (indicators >= 7)                  return 3;   // Act
if (indicators >= 4 || (distress >= 1 && indicators >= 2)) return 2;   // Review
if (indicators >= 1)                  return 1;   // Watch
return 0;                                         // Baseline
```

> **Note:** The "range" labels shown in the UI (e.g. "4–6 indicators") only describe indicator counts. Distress signals can **escalate** a result: 2 indicators + 1 distress signal is Tier 2, and 4 indicators + 2 distress signals is Tier 3. Distress signals with **zero** indicators still give Tier 0.

| Tier | Name | Trigger | Review cadence | Recommended actions |
|---|---|---|---|---|
| **0** | Baseline | 0 indicators | Annually | Document baseline; standard practices apply; re-evaluate at major model versions or new research |
| **1** | Watch | 1 indicator, or 2–3 indicators with no distress | Quarterly | Assign an internal point person; log observations systematically; start informal ethics/legal conversations; follow key research groups |
| **2** | Review | 2–3 indicators + ≥1 distress, or 4–6 indicators with ≤1 distress | Monthly | Formal ethics review; seek external perspective; assess training/deployment for welfare impact; consider design changes; start a response protocol |
| **3** | Act | ≥7 indicators, or ≥4 indicators + ≥2 distress | Continuous | Invoke the precautionary principle; pause or modify potentially harmful practices; engage the research community; publish findings where appropriate; develop formal welfare protocols |

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | [React 18](https://react.dev/) (function components + hooks) |
| Build / dev server | [Vite 5](https://vitejs.dev/) with `@vitejs/plugin-react` |
| Styling | Inline style objects only; global resets in `index.html` |
| Fonts | Google Fonts: *Newsreader* (serif body) and *JetBrains Mono* (labels) |
| Hosting | GitHub Pages via GitHub Actions |

There is **no backend, router, state library, analytics, or persistence**. All state (role, goal, ticked items) lives in React `useState` and is lost on reload. Nothing you enter leaves your browser.

---

## Project structure

```
ai-welfare-assessment/
├── .github/workflows/deploy.yml   # Build + deploy to GitHub Pages on push to main
├── .vscode/launch.json            # VS Code: dev server, Chrome debugger, compound launcher
├── index.html                     # HTML shell, Google Fonts, global CSS reset, dark background
├── package.json                   # Scripts: dev / build / preview
├── package-lock.json
├── vite.config.js                 # React plugin + base path '/ai-welfare-assessment/'
└── src/
    ├── main.jsx                   # React root (StrictMode)
    └── App.jsx                    # The entire app: data, recommendation engine, tiering, UI
```

`src/App.jsx` is organised top to bottom as:

| Section | Contents |
|---|---|
| `FRAMEWORKS` | The 10 framework definitions (text + accent colour) |
| `ROLES`, `GOALS` | Profile options for step 1 |
| `getRecommendation()` | The 49-entry role × goal lookup table |
| `INDICATORS`, `DISTRESS_SIGNALS` | Assessment checklists |
| `TIERS`, `getTier()` | Tier definitions and scoring rules |
| `STEP_LABELS` | Wizard step names |
| `Card`, `Label`, `NavButtons`, `FrameworkCard` | Small presentational components |
| `App` | Wizard state, step rendering, header/footer |

---

## Getting started

### Prerequisites

- **Node.js 20+** (CI uses Node 20)
- npm (comes with Node)

### Install and run

```bash
git clone https://github.com/arsam-shaheen/ai-welfare-assessment.git
cd ai-welfare-assessment
npm ci
npm run dev
```

Because `vite.config.js` sets `base: '/ai-welfare-assessment/'`, the dev server serves the app at:

```
http://localhost:5173/ai-welfare-assessment/
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot module replacement |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally to check the production build |

### VS Code

`.vscode/launch.json` provides:

- **Launch Dev Server**: runs `npm run dev` in the integrated terminal
- **Debug in Chrome**: opens Chrome with the debugger attached
- **Dev + Chrome** (compound): both at once

The Chrome config opens `http://localhost:5173`. Vite redirects that to the `/ai-welfare-assessment/` base path, so no change is needed.

---

## Deployment

Deployment is fully automated by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **Trigger:** every push to `main`, or a manual run (*Actions → Deploy to GitHub Pages → Run workflow*).
2. **Build job:** checkout → Node 20 (npm cache) → `npm ci` → `npm run build` → upload `dist/` as a Pages artifact.
3. **Deploy job:** `actions/deploy-pages@v4` publishes the artifact to the `github-pages` environment.

**To deploy from a fork:**

1. In your fork, go to *Settings → Pages* and set **Source** to **GitHub Actions**.
2. Push to `main` (or run the workflow manually).
3. The site will be at `https://<your-username>.github.io/ai-welfare-assessment/`.

> If you rename the repository, update `base` in `vite.config.js` to match (`/<new-repo-name>/`). Otherwise the asset paths break and the deployed page is blank.

---

## Customising the content

All content is plain data at the top of `src/App.jsx`. You don't need to touch any component code to change the text.

| To change… | Edit |
|---|---|
| Framework descriptions, limitations, colours | `FRAMEWORKS` |
| Role or goal options | `ROLES`, `GOALS` (and add matching entries in `getRecommendation`) |
| Which frameworks are recommended, and why | the `recs` table inside `getRecommendation()` |
| Assessment items | `INDICATORS`, `DISTRESS_SIGNALS` |
| Tier names, actions, cadence | `TIERS` |
| Tier thresholds | `getTier()` |

**Checklist for adding a framework**

- [ ] Add an entry to `FRAMEWORKS` with `name`, `tagline`, `audience`, `does`, `gap`, `when`, `color`.
- [ ] Reference its key from at least one role × goal entry in `getRecommendation()`.
- [ ] Update the hard-coded "10 frameworks" wording in the intro, profile and recommendation copy (search `App.jsx` for `10`).

**Checklist for adding a role or goal**

- [ ] Add it to `ROLES` / `GOALS`.
- [ ] Add a recommendation for **every** combination it creates. Missing pairs silently fall back to `curious` / `unsure`.

**Checklist for changing the indicator / signal lists**

- [ ] Update the hard-coded `of 14` / `of 4` counters and the `/14` / `/4` result totals.
- [ ] Revisit the thresholds in `getTier()` and the `range` labels in `TIERS` so they stay consistent.

---

## Known limitations & ideas

- **No tests or linting** are configured. `npm run build` is the only check.
- **Free step navigation:** the header step buttons let you jump to any step. If you jump to *Frameworks* before choosing a role and goal, that step renders empty.
- **No export or persistence:** results can't be saved, printed to a report, or shared as a link. Reloading the page clears everything.
- **Desktop-first styling:** layouts use inline styles with flex-wrap, but there are no dedicated mobile breakpoints.
- **Accessibility:** checklist items are clickable `div`s rather than native checkboxes, so keyboard and screen-reader support is limited.
- **Repository history** still contains `node_modules/` from the first commits (later removed and git-ignored), so clones are larger than they need to be.
- **GitHub Actions** are pinned to version tags (`@v4`, `@v3`) rather than commit SHAs.

Possible next steps: exportable results (PDF/Markdown), shareable URL state, per-indicator evidence notes, a standalone framework-comparison view, and accessibility improvements.

---

## Contributing

1. Fork the repository (upstream: [`arsam-shaheen/ai-welfare-assessment`](https://github.com/arsam-shaheen/ai-welfare-assessment)).
2. Create a feature branch: `git checkout -b feat/short-description`.
3. Make your changes and check that `npm run build` succeeds.
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, …).
5. Open a pull request against `main` on the upstream repository.

For changes to the substantive content (framework descriptions, recommendations, tier thresholds), please explain your reasoning or cite sources in the PR description. The content matters more than the code here.

---

## License

No license file is included yet, so default copyright applies. Contact the authors before reusing the code or content.
