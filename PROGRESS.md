# Flock — Progress Report

> **Report date:** 2026-11-15 · **Branch:** `main` @ `bb80ae9` · **Commits:** 13
> Roadmap: [ROADMAP.md](./ROADMAP.md)

## TL;DR

Flock is at the **end of Phase 0 (Foundation)**. The monorepo, the Expo mobile app and the Elysia API are set up and run in dev mode. **There are no product features yet**: no database, no auth, no domain code, no tests, no CI. The planning documents are solid. Before Phase 1 starts, a handful of small tooling gaps should be closed (type-checking, env config, CI).

| Metric | Value |
| --- | --- |
| Overall MVP progress | **~8%** (Phase 0 ≈ 70%, Phases 1–6 at 0%) |
| Apps scaffolded | 2 / 3 (`api`, `mobile` · `web` planned for Phase 5) |
| Packages created | 0 / 2 (`db`, `shared`) |
| Hand-written source files | 3 (`api/src/index.ts`, `mobile/src/app/index.tsx`, `mobile/src/app/_layout.tsx`) |
| API endpoints | 1 (`GET /hi`) |
| Tests | 0 |
| CI workflows | 0 |

---

## Timeline

| Date | Milestone |
| --- | --- |
| 2026-09-11 | Repo created: MIT license, first README and roadmap |
| 2026-10-21 | Roadmap rewritten to be **mobile-first** |
| 2026-11-05 | Turborepo + Bun workspaces set up |
| 2026-11-06 | Expo app scaffolded (moved to `apps/mobile`) |
| 2026-11-07 | Biome added, root `check` / `lint` scripts |
| 2026-11-10 | Review fixes (app name, pinned `@types/bun`, `build` task); **Elysia API scaffolded** |
| 2026-11-15 | README, roadmap and this report rewritten |

Work so far has come in short bursts (Sept → Oct → one active week in early Nov), which is typical for a side project in the planning and setup stage.

---

## Phase status

| Phase | Status | Progress |
| --- | --- | --- |
| 0. Foundation & tooling | 🟡 In progress | ███████░░░ ~70% |
| 1. Data layer & shared domain | ⚪ Not started | ░░░░░░░░░░ 0% |
| 2. Auth & invites | ⚪ Not started | ░░░░░░░░░░ 0% |
| 3. Groups & mobile shell | ⚪ Not started | ░░░░░░░░░░ 0% |
| 4. Meetings & reflections | ⚪ Not started | ░░░░░░░░░░ 0% |
| 5. Pastor web dashboard | ⚪ Not started | ░░░░░░░░░░ 0% |
| 6. Release & operations | ⚪ Not started | ░░░░░░░░░░ 0% |

---

## What's done

### Monorepo
- Turborepo `2.11` with Bun `1.4.3` (pinned through `packageManager`), workspaces `apps/*` and `packages/*`
- Turbo tasks: `dev` (persistent, not cached), `build` (`^build`), and root-level `check` / `lint`
- Biome `2.6` with recommended rules, single quotes, no semicolons, no trailing commas, import sorting, and VCS-aware ignores

### Mobile: `apps/mobile`
- Latest Expo SDK (`~58`) with React Native `0.88`, React `19.3`, TypeScript `6.0` in strict mode
- Expo Router with a `src/app` layout, **typed routes** and **React Compiler** turned on
- `flock://` URL scheme registered, which the invite deep links will need later
- Path aliases `@/*` and `@/assets/*`; splash screen and adaptive icons configured
- Current screen: a single "Hello, Flock 🐑" page

### API: `apps/api`
- Elysia `2.0.0-rc.4` on Bun, with `bun --watch` hot reload
- One route: `GET /hi` → `Hello Flock 🐑`, listening on port 3000

### Documentation
- Clear problem statement, requirements and phased task breakdown
- New README explaining what Flock is for and why it exists

---

## Gaps & issues found during review

### 🔴 Close before Phase 1

| # | Issue | Where | Suggested fix |
| --- | --- | --- | --- |
| 1 | No type-checking anywhere: no `typecheck` script or Turbo task, and `apps/api` has no `tsconfig.json` | `apps/api`, `turbo.json` | Add a shared tsconfig preset, `tsc --noEmit` scripts and a `typecheck` Turbo task |
| 2 | No CI. Nothing stops broken code from reaching `main` | `.github/` | GitHub Actions: install (frozen lockfile) → `check` → `typecheck` → `test` |
| 3 | API doesn't export its type, so Eden Treaty clients can't be generated | `apps/api/src/index.ts` | `export type App = typeof app` |
| 4 | Port is hard-coded as the string `'3000'`; no env handling | `apps/api/src/index.ts` | Read `PORT` from validated env, falling back to `3000`; add `.env.example` |

### 🟡 Housekeeping

| # | Issue | Where | Suggested fix |
| --- | --- | --- | --- |
| 5 | Two linters set up: the mobile `lint` script runs `expo lint` (ESLint) while the repo uses Biome | `apps/mobile/package.json` | Remove `expo lint`; let Biome own linting |
| 6 | `build` Turbo task exists, but no workspace defines a `build` script, so it does nothing | `turbo.json` | Add builds as they become meaningful (API bundle, web, EAS) |
| 7 | Root `.gitignore` only covers `node_modules` and `.turbo` | `.gitignore` | Add `.env*`, `!.env.example`, `.DS_Store`, `coverage`, `dist` |
| 8 | Leftover Expo template `LICENSE` (© 650 Industries) inside the app | `apps/mobile/LICENSE` | Delete it; the root MIT license covers the repo |
| 9 | Template defaults still present: splash color `#208AEF`, default Expo icons, `web.output: "server"` | `apps/mobile/app.json` | Replace with Flock branding once it exists; check whether Expo web output is needed at all |
| 10 | Elysia is on a **release candidate** (`^2.0.0-rc.4`), and the caret range can pull in breaking RC updates | `apps/api/package.json` | Pin the exact RC version until 2.0 stable ships |
| 11 | `@expo/ui`, `expo-glass-effect`, `expo-symbols`, `expo-device` came with the template but aren't used yet | `apps/mobile/package.json` | Keep or prune on purpose once the UI direction is decided |

### 📄 Documentation inconsistencies (fixed in this pass)

- The old README listed `apps/web` as part of the current stack and called mobile "coming later", which contradicted the mobile-first roadmap. **Fixed.**
- The old roadmap put `pastor` in the `group_memberships.role` enum, while the data model said pastor was an org-level role. **Fixed:** pastor is now a church-level role.
- The old roadmap's auth task relied on an `invites` table that wasn't in the schema task. **Fixed.**
- The old roadmap said "JWT sessions", but Better Auth uses database sessions (plus secure storage on mobile). **Fixed.**
- The old roadmap built the web app during scaffolding, which goes against mobile-first. **Moved to Phase 5.**
- CI was the last task. **Basic CI moved to Phase 0**, and deployment stays in Phase 6.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Elysia 2.0 RC has breaking changes before stable | Medium | Medium | Pin the version; keep route code thin; add integration tests early |
| Bleeding-edge stack (Expo 58 / RN 0.88 / TS 6 / React 19.3), where libraries may lag behind | Medium | Medium | Check compatibility before adding each dependency (Better Auth Expo plugin, TanStack Query) |
| Group-scoped permissions get complex and leak data between groups | Medium | **High** | Central group-context guard + dedicated role-guard test suite (Phase 3) |
| Sensitive pastoral data (reflections) | — | **High** | Decide the privacy model now (Open question #1); least-privilege by default |
| Scope creep (materials, notifications) before the core loop is finished | Medium | Medium | Keep future features behind Phase 4 completion |
| Bursty side-project pace | High | Medium | Small, demo-able phases; CI so that short sessions stay safe |

---

## Recommended next steps

1. **Finish Phase 0:** add tsconfig + `typecheck`, the GitHub Actions CI, env config + `/health`, export the `App` type, remove `expo lint`, and clean up `.gitignore` and the stray LICENSE. *(about 1 session)*
2. **Answer open questions #1–#3** in the roadmap (reflection privacy, Better Auth org plugin vs. custom tables, TypeBox vs. Zod). Phases 1 and 2 depend on them.
3. **Start Phase 1:** Docker Compose Postgres, `packages/db` schema + migrations + seed, and `packages/shared` with the group size rules and their tests.
4. Set up a first **Eden Treaty client in the mobile app** against `/health`, to prove end-to-end type safety before auth makes things more complicated.

---

_Next report: at the end of Phase 1, or in two weeks, whichever comes first._
