# 🪔 Shree Jinalaya

Full-stack Jain derasar (temple) management platform — public website, admin dashboard, devotee portal, and API — organised as an npm-workspaces monorepo.

> _Jai Jinendra._ Designed around the Panch Parmeshthi colors of the Jain flag.

---

## 🏗 Monorepo layout

```
.
├── apps/
│   ├── frontend/       React app — public site + admin dashboard + devotee portal  (port 3000)
│   │   └── src/
│   │       ├── web/          Public website (Home, About, Festivals, Donate, Gallery, Contact)
│   │       ├── dashboard/    Admin console + devotee portal
│   │       └── routes/       Combined router (web + auth + dashboard)
│   └── backend/        Node.js + Express + MongoDB API  (port 5000)
├── packages/
│   └── shared/         Shared UI, contexts, hooks, utils, data
├── docs/               Architecture, API and deployment docs
├── infra/              Docker, nginx, infrastructure-as-code
├── scripts/            One-off utility scripts
├── .github/            GitHub Actions workflows
├── .husky/             Git hooks (pre-commit, commit-msg)
├── .claude/            Claude agent config
├── .gitignore
├── .graphifyignore
├── .nvmrc              Node 20.11.1
├── CLAUDE.md           AI agent guide
├── dev.sh              ./dev.sh [all|frontend|backend]
├── Makefile            make help / make dev / make install
├── README.md           ← you are here
├── setup.sh            ./setup.sh (first-time setup)
└── package.json        Workspace root
```

---

## 🚀 Quick start

```bash
# First time
./setup.sh             # checks node, installs deps, copies .env.example files
                       # or:  make setup

# Run everything
npm run dev            # frontend + backend concurrently
                       # or:  ./dev.sh   |   make dev

# One app at a time
npm run dev:frontend    # → http://localhost:3000  (web + dashboard)
npm run dev:backend     # → http://localhost:5000
```

After setup, edit `apps/backend/.env` and fill in `MONGO_URI` + `JWT_SECRET`.

The single frontend serves both the public website and the admin/devotee portal from one Vite dev server. Routes:

- `/`, `/about`, `/festivals`, `/donate`, `/gallery`, `/contact` → public site (`src/web/`)
- `/login`, `/register` → auth screens
- `/admin/*`, `/devotee/*` → dashboard + devotee portal (`src/dashboard/`)

---

## 📦 Workspaces

| Workspace | Purpose | Tech |
| --- | --- | --- |
| `@jinalaya/frontend` | Public site + admin dashboard + devotee portal | React 18, Vite, Tailwind, Framer Motion, Recharts |
| `@jinalaya/backend` | REST API | Node 20, Express, MongoDB, JWT, Razorpay |
| `@jinalaya/shared` | Cross-app components, contexts, hooks, utils, data | React, Tailwind |

The frontend imports the shared package via `"@jinalaya/shared": "workspace:*"`.

---

## 🎨 Design system

The full UI uses only the 5 Panch Parmeshthi colors:

| Color | Hex | Represents |
| --- | --- | --- |
| White | `#ffffff` | Arihants |
| Red | `#c8102e` | Siddhas |
| Yellow | `#ffc01e` / `#d68500` | Acharyas |
| Green | `#00843d` / `#054624` | Upadhyays |
| Black | `#1a1b22` | Sadhus |

No gradients are used. Legacy Tailwind names (`saffron`, `maroon`, `gold`, `forest`, `ink`, `cream`) are aliased to Jain palette tones via `tailwind.config.js`.

`<JainFlagStripe />` + `<JainFlagBadge />` (in `packages/shared/components/`) carry the 5-color identity across every layout.

---

## 🧭 Where to find things

| Looking for… | Path |
| --- | --- |
| Public homepage | `apps/frontend/src/web/pages/Home.jsx` |
| Hero slider | `apps/frontend/src/web/components/HeroSplit.jsx` |
| Donate form | `apps/frontend/src/web/pages/Donate.jsx` |
| Admin sidebar | `apps/frontend/src/dashboard/layouts/Sidebar.jsx` |
| Admin dashboard with charts | `apps/frontend/src/dashboard/pages/overview/Dashboard.jsx` |
| Income module (hall, bhojanshala) | `apps/frontend/src/dashboard/pages/income/` |
| Event-wise donations | `apps/frontend/src/dashboard/pages/events/EventDetails.jsx` |
| Devotee portal | `apps/frontend/src/dashboard/pages/user/` |
| Combined router | `apps/frontend/src/routes/AppRoutes.jsx` |
| Shared UI primitives | `packages/shared/components/` |
| React contexts | `packages/shared/context/` |
| Mock data | `packages/shared/data/mockData.js` |
| Tailwind palette | `apps/frontend/tailwind.config.js` |
| Backend models / controllers / routes | `apps/backend/src/` |
| AI agent guide | `CLAUDE.md` |

---

## 🛠 Common commands

```bash
make help               # list every Make target
make install             # npm install at root
make dev                  # frontend + backend
make dev-frontend         # frontend only (web + dashboard)
make dev-backend          # backend only
make build                # build the frontend
make lint                 # lint every workspace
make clean                # nuke node_modules + dist
make reset                # clean + install
```

---

## 🐳 Docker

```bash
cd infra
docker compose up --build
```

Brings up three containers: `mongo`, `backend` (5000), `frontend` (3000 → nginx serving the built SPA).

---

## 🙏 Credits

- Icons: [Lucide](https://lucide.dev)
- Fonts: Inter, Playfair Display, Cormorant Garamond
- Photos: Unsplash
- Built with devotion for the Jain sangh.
# jinseva
