# GD Prime HRM Platform

A standalone web app covering all **28 modules and 196 submodules** of the GD Prime HRM Platform
(GPPMC-GDP1-ARC-HRM-001, HRM Platform Module Architecture v1.0). It runs on **built-in sample data**:
no database, no sign-in, and no connection to the `gd-prime-hr` system.

## What's inside

- **Dashboard**: headcount, attendance today, pending approvals, vacancies, headcount by cluster, attendance by property, leave and probation lists.
- **Module map** (`/modules`): the eight groups (A-H) and three releases (R1 Foundation, R2 Control, R3 Intelligence).
- **A page for every module** (`/m/pay`, `/m/tka`, ...): key figures, working tables built from the sample data, the module's owner, users, records and KPIs, and its submodules filterable by release.
- **201 file** for every employee (`/employees/GP-1001`), with government numbers masked.
- **Search** across employees, modules and submodules.
- **View as** switch (demo of HRM-00.03 data scope): Executive, HR Manager and Payroll see pay; HR Officer, Cluster Head and Employee do not. Cluster Head sees only Cluster 1 properties; Employee sees only their own record.

Royal blue and gold design, light and dark mode, works on phones, tablets and desktops (installable as an app),
WCAG AA colour contrast, 44px touch targets, skip link, and SEO basics (titles, descriptions, Open Graph, sitemap).

## Sample data

About 140 fictional employees across Head Office and 13 properties in 5 clusters, with attendance, leave,
a semi-monthly payroll run, applicants, cases, trainings and more. It is generated from a fixed seed in
`src/lib/data.ts`, so it is the same every time. Names, numbers and amounts are illustrative only; payroll
figures are simplified and are not real contribution or tax computations.

## Run locally

```bash
npm install
npm run dev    # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Deploy

Import the repository in Vercel as a new project. No environment variables are needed.
Optionally set `NEXT_PUBLIC_SITE_URL` to the public address used in link previews.

## Where things live

| Path | What |
|---|---|
| `src/lib/modules.ts` | All modules and submodules, generated from the architecture document |
| `src/lib/data.ts` | Sample data |
| `src/lib/workspaces.ts` | Each module's key figures and tables |
| `src/lib/viewer.ts` | Demo roles and data scope |
| `src/components/app-shell.tsx` | Sidebar, mobile menu, search and View as |
| `src/app/globals.css` | Design tokens (royal blue, gold, light and dark) |
