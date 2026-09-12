# Discipleship Monitoring App — Project Roadmap

## Problem Statement

A church leadership tool that enables a pastor to oversee discipleship groups, where mentors track meeting attendance and reflections with their disciples. Users can hold different roles in different groups, requiring a context-aware permission model.

---

## Requirements

- **Hierarchy:** Pastor → Discipleship Group → 1-2 Mentors + up to 3 Disciples
- **Roles are context-scoped:** A user can be a mentor in one group and a disciple in another
- **Authentication:** Invite-based (pastor invites mentors, mentors invite disciples)
- **Meeting tracking:** Attendance + experience reflection (default questions + custom mentor questions)
- **Material distribution:** Deferred — Duolingo-inspired, future feature
- **Web first, mobile (React Native) later**
- **Portfolio-quality:** Clean architecture, modern tooling, CI/CD

---

## Stack & Architecture

```
monorepo (Turborepo + Bun)
├── apps/
│   ├── api/          → Bun + Elysia (backend)
│   └── web/          → React + Vite + TanStack Router/Query
├── packages/
│   ├── db/           → Drizzle ORM + PostgreSQL schemas & migrations
│   ├── shared/       → Shared TypeScript types and validators (Zod/TypeBox)
│   └── ui/           → (later) Shared component library for web + React Native
```

**API layer:** Elysia with Eden Treaty for end-to-end type safety (Elysia's native tRPC equivalent)

**Auth:** Better Auth — modern, type-safe, supports invite flows

**Data model core concept — context-scoped membership:**

```
User ──┐
       ├── GroupMembership (userId, groupId, role: 'mentor' | 'disciple')
Group ─┘
       └── belongs to Pastor (userId with 'pastor' role at org level)
```

---

## Task Breakdown

### Task 1 — Monorepo Scaffold

**Objective:** Set up the Turborepo monorepo with Bun, defining workspaces for `api`, `web`, `db`, and `shared` packages.

**Implementation:**
- Init Turborepo, configure Bun workspaces
- Set up Biome (linter + formatter)
- Add root `turbo.json` with `dev`, `build`, and `lint` pipelines

**Tests:** Verify all workspaces resolve and `turbo dev` starts both apps.

**Done when:** Running `bun dev` from root starts both the API and web app with hot reload.

---

### Task 2 — Database Schema & Migrations

**Objective:** Define the core data model using Drizzle ORM in the `packages/db` package.

**Implementation:**
- Tables: `users`, `groups`, `group_memberships` (role enum: `pastor` | `mentor` | `disciple`), `meetings`, `meeting_attendances`, `reflection_questions`, `reflection_answers`
- Drizzle Kit for migrations
- Docker Compose for local PostgreSQL

**Tests:** Run migrations against a local PostgreSQL instance. Write a seed script.

**Done when:** `bun db:migrate` runs cleanly; `bun db:studio` (Drizzle Studio) shows all tables with correct relations.

---

### Task 3 — Auth: Registration & Invite Flow

**Objective:** Implement Better Auth in the API with an invite-token based onboarding flow.

**Implementation:**
- Email/password auth with JWT sessions
- Invite tokens stored in DB (linked to a group + role)
- Token validation on signup
- Pastor account is the first user (seeded)

**Tests:** Test invite token generation, expiry, and signup-via-invite endpoint.

**Done when:** Pastor can generate an invite link; opening it registers a new user and assigns them to the group with the correct role.

---

### Task 4 — Group & Membership API

**Objective:** Build Elysia routes for creating groups and managing memberships, exposed via Eden Treaty.

**Implementation:**
- CRUD for groups (pastor only)
- Endpoints to list members by group
- Context-aware auth middleware that resolves the user's role for the current group

**Tests:** Test role guards — a mentor cannot create groups; a disciple cannot see another group's data.

**Done when:** From the web app, a logged-in pastor can create a group and see their groups listed.

---

### Task 5 — Web App Shell & Navigation

**Objective:** Build the React web app with TanStack Router, authenticated layout, and role-aware navigation.

**Implementation:**
- Login/signup pages and protected routes
- Dashboard that adapts based on the user's roles across groups
- Example: "You are a mentor in Group A and a disciple in Group B"

**Tests:** Route guard tests — unauthenticated users are redirected to login.

**Done when:** A user with two group memberships sees both contexts on their dashboard and can switch between them.

---

### Task 6 — Meeting Tracking

**Objective:** Mentors can create a meeting record and mark attendance for their disciples.

**Implementation:**
- `POST /meetings` and attendance marking endpoints
- List meetings per group
- Elysia routes + Eden Treaty client hooks integrated with TanStack Query

**Tests:** Only the group's mentor can create meetings; attendance is scoped to group members.

**Done when:** Mentor opens their group, creates a meeting, marks each disciple as present/absent, and saves.

---

### Task 7 — Reflection Questions & Answers

**Objective:** After a meeting, disciples fill out reflection responses. Mentors can view responses.

**Implementation:**
- Default system questions seeded in DB
- Mentors can add custom questions per group
- Disciples submit answers per meeting
- Mentor sees a per-meeting response summary

**Tests:** Disciples can only answer their own group's questions; mentors can read all answers in their group.

**Done when:** After a meeting is recorded, a disciple logs in, answers reflection questions, and the mentor sees the filled responses.

---

### Task 8 — Pastor Dashboard

**Objective:** Pastor gets a bird's-eye view of all their groups' meetings and participation.

**Implementation:**
- Aggregated stats endpoint (attendance rates, recent meetings, response rates per group)
- Dashboard UI with charts (Recharts)

**Tests:** Verify aggregation logic with seeded data.

**Done when:** Pastor sees a dashboard with attendance summaries for all groups they oversee.

---

### Task 9 — CI/CD Pipeline

**Objective:** Add GitHub Actions for lint, test, and build on every PR; deploy to a cloud provider.

**Implementation:**
- CI pipeline with Turborepo remote caching
- API deployed to Railway or Fly.io
- Web deployed to Vercel or Cloudflare Pages
- Environment variable management per environment

**Tests:** A dummy PR triggers the full pipeline successfully.

**Done when:** Pushing a PR shows green checks; merging to `main` auto-deploys both apps.

---

## Future Features

- **Material distribution** — Duolingo-inspired lesson/content delivery through the app
- **React Native mobile app** — reusing `packages/shared` and `packages/ui`
- **Notifications** — meeting reminders, reflection nudges
- **Pastor reporting** — exportable reports per group or period
