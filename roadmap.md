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
- **Mobile-first:** The primary experience is a React Native app for mentors and disciples. The responsive web app is a secondary experience, initially focused on pastor administration and reporting.
- **Mobile UX:** Core workflows must work on small screens with touch-friendly controls, accessible layouts, and appropriate keyboard behavior. Handle loading, error, and empty states without requiring horizontal scrolling.
- **Mobile session and links:** Store mobile sessions securely and support invite links that open the app or fall back to web onboarding.
- **Offline support:** Not in initial scope unless required; core workflows assume a network connection.
- **Portfolio-quality:** Clean architecture, modern tooling, CI/CD

---

## Stack & Architecture

```
monorepo (Turborepo + Bun)
├── apps/
│   ├── api/          → Bun + Elysia (backend)
│   ├── mobile/       → React Native + Expo + Expo Router
│   └── web/          → React + Vite + TanStack Router/Query (responsive admin experience)
├── packages/
│   ├── db/           → Drizzle ORM + PostgreSQL schemas & migrations
│   ├── shared/       → Platform-neutral TypeScript types, validators, and business logic (Zod/TypeBox)
│   └── ui/           → Shared UI primitives only where they fit both web and native
```

**API layer:** Elysia with Eden Treaty for end-to-end type safety (Elysia's native tRPC equivalent)

**Auth:** Better Auth — modern, type-safe, supports invite flows

**Mobile platform:** Expo for React Native development, routing, and builds. Keep platform-specific screens and components where sharing would compromise the experience.

**Responsive strategy:** Build mobile workflows for phone-sized screens first. The web app supports responsive layouts, with pastor administration and reporting as its initial focus.

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

**Objective:** Set up the Turborepo monorepo with Bun, defining workspaces for `api`, `mobile`, `web`, `db`, and `shared` packages.

**Implementation:**
- Init Turborepo, configure Bun workspaces
- Create the Expo mobile app with Expo Router and the responsive web app
- Set up Biome (linter + formatter)
- Add root `turbo.json` with `dev`, `build`, and `lint` pipelines for all apps and packages

**Tests:** Verify all workspaces resolve, `turbo dev` starts the API and web app, and the mobile app launches in a simulator or on a device.

**Done when:** Running `bun dev` from root starts the API and web app with hot reload, and the mobile app can be run through Expo on a simulator or device.

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

**Done when:** From the web app, a logged-in pastor can create a group and see their groups listed; the mobile app can show a user's groups and their role in each.

---

### Task 5 — Mobile App Shell & Navigation

**Objective:** Build the authenticated React Native app shell with role-aware navigation designed for phone-sized screens.

**Implementation:**
- Login/invite onboarding screens and protected routes
- Mobile navigation and a dashboard that adapts based on the user's roles across groups
- Clear group-context switching that makes the active group and role visible
- Configure invite deep links to open the app, with a web fallback
- Use secure platform storage for mobile sessions

**Tests:** Test protected navigation, invite-link routing, and role-aware group switching. Verify key screens at phone-sized layouts and check keyboard, loading, error, and empty states.

**Done when:** A user with two group memberships sees both contexts on their phone, can identify their role in each, and can switch groups without losing their place or confusing contexts.

---

### Task 6 — Meeting Tracking

**Objective:** Mentors can create a meeting record and mark attendance for their disciples.

**Implementation:**
- `POST /meetings` and attendance marking endpoints
- List meetings per group
- Elysia routes + Eden Treaty client hooks integrated with TanStack Query

**Tests:** Only the group's mentor can create meetings; attendance is scoped to group members.

**Done when:** A mentor can create a meeting and mark each disciple present or absent on a phone without horizontal scrolling, then confirm the saved attendance.

---

### Task 7 — Reflection Questions & Answers

**Objective:** After a meeting, disciples fill out reflection responses. Mentors can view responses.

**Implementation:**
- Default system questions seeded in DB
- Mentors can add custom questions per group
- Disciples submit answers per meeting
- Mentor sees a per-meeting response summary

**Tests:** Disciples can only answer their own group's questions; mentors can read all answers in their group.

**Done when:** After a meeting is recorded, a disciple can complete mobile-friendly reflection questions on a phone, and the mentor can view the submitted responses.

---

### Task 8 — Pastor Dashboard

**Objective:** Provide a responsive web dashboard for pastors to review all their groups' meetings and participation.

**Implementation:**
- Aggregated stats endpoint (attendance rates, recent meetings, response rates per group)
- Dashboard UI with charts (Recharts), usable on both desktop and small screens
- Keep detailed administration and reporting primarily on the web; ensure key summaries remain readable on phones

**Tests:** Verify aggregation logic with seeded data.

**Done when:** A pastor sees attendance and response summaries for all groups they oversee in a responsive web dashboard.

---

### Task 9 — CI/CD Pipeline

**Objective:** Add GitHub Actions for lint, test, and build on every PR; deploy to a cloud provider.

**Implementation:**
- CI pipeline with Turborepo remote caching
- API deployed to Railway or Fly.io
- Web deployed to Vercel or Cloudflare Pages
- Build and distribute mobile app releases through Expo Application Services (EAS) or an equivalent build/signing workflow
- Environment variable management per environment

**Tests:** A dummy PR triggers lint, tests, and builds for the API, web, and mobile app; verify the mobile release workflow can produce signed iOS and Android builds.

**Done when:** Pushing a PR shows green checks; merging to `main` deploys the API and web app and can produce mobile release builds.

---

## Future Features

- **Material distribution** — Duolingo-inspired lesson/content delivery through the app
- **Notifications** — meeting reminders, reflection nudges
- **Pastor reporting** — exportable reports per group or period
