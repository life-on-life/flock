# 🐑 Flock

A cozy little tool for pastors to keep an eye on their discipleship groups.

Mentors track meetings and reflections with their disciples. Pastors get a bird's-eye view of how everyone's doing. Roles are context-aware — someone can be a mentor in one group and a disciple in another, and the app just gets it.

---

## What it does

- **Invite-based onboarding** — pastor invites mentors, mentors invite disciples
- **Meeting tracking** — attendance + reflection questions (default ones + custom per mentor)
- **Role-aware dashboards** — each user sees exactly what they need, nothing more
- **Pastor overview** — aggregated stats across all groups at a glance

## Stack

Monorepo with Turborepo + Bun, split across:

- `apps/api` — Bun + Elysia (end-to-end type-safe via Eden Treaty)
- `apps/web` — React + Vite + TanStack Router/Query
- `packages/db` — Drizzle ORM + PostgreSQL
- `packages/shared` — shared types & validators (Zod)

Auth via **Better Auth**. Local dev via **Docker Compose**.

## Roadmap

- [ ] Monorepo scaffold
- [ ] Database schema & migrations
- [ ] Auth + invite flow
- [ ] Group & membership API
- [ ] Web app shell & navigation
- [ ] Meeting tracking
- [ ] Reflection questions & answers
- [ ] Pastor dashboard
- [ ] CI/CD pipeline

Coming later: mobile app (React Native), material distribution, and notifications.

---

> _"And he gave the apostles, the prophets, the evangelists, the shepherds and teachers..."_
