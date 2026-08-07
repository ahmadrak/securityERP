# securityERP Frontend — Pages & Backend Connections

**Framework:** Next.js (App Router)
**API client:** `frontend/lib/api.ts` — axios instance, `baseURL: http://localhost:4000`, injects `Authorization: Bearer <token>` from `localStorage` on every request. This is correctly wired up.

---

| Page | Route | Calls |
|---|---|---|
| Login | `/login` | `POST /auth/login` |
| Dashboard | `/` | — |
| Employees list | `/employees` | `GET /employees` |
| Employee create | `/employees/create` | `POST /employees` |
| Employee detail | `/employees/[id]` | `GET /employees/:id` |
| Employee edit | `/employees/[id]/edit` | `PATCH /employees/:id` |
| Employee attendance | `/employees/[id]/attendance` | `GET /attendance/:employeeId` |
| Clients list | `/clients` | `GET /clients` |
| Client create/detail/edit | `/clients/create`, `/clients/[id]`, `/clients/[id]/edit` | `POST` / `GET` / `PATCH /clients` |
| Contracts list/create/detail/edit | `/contracts`, `/contracts/create`, `/contracts/[id]`, `/contracts/[id]/edit` | `/contracts` endpoints |
| Locations list/create/detail/edit | `/locations`, `/locations/create`, `/locations/[id]`, `/locations/[id]/edit` | `/locations` endpoints |
| Assignments list/create | `/assignments`, `/assignments/create` | `/assignments` endpoints |
| Shifts list/create/detail/edit | `/shifts`, `/shifts/create`, `/shifts/[id]`, `/shifts/[id]/edit` | ⚠️ No matching backend module found — verify what these actually call |
| Attendance | `/attendance` | `GET /attendance` |
| Payroll | `/payroll` | `/payroll` endpoints |
| Data | `/data` | — |
| Test | `/test` | Scratch/test page — remove before production |
