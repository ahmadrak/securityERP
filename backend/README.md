# securityERP Backend — API Routes

**Base URL:** `http://localhost:4000`
**Framework:** NestJS
**Auth:** All routes except `auth/*` and `/` require `JwtAuthGuard` (`Authorization: Bearer <token>`) plus `RolesGuard` where a `@Roles(...)` decorator is present.

---

## auth/ (public)

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register a user (email + password) |
| POST | `/auth/login` | Log in, returns a JWT |

## users/ (ADMIN only)

| Method | Path |
|---|---|
| POST | `/users` |
| GET | `/users` |
| GET | `/users/:id` |
| DELETE | `/users/:id` |

## employees/

| Method | Path | Allowed roles |
|---|---|---|
| POST | `/employees` | ADMIN |
| GET | `/employees` | ADMIN, SUPERVISOR |
| GET | `/employees/:id` | ADMINu, SUPERVISOR |
| PATCH | `/employees/:id` | ADMIN, SUPERVISOR |
| DELETE | `/employees/:id` | ADMIN, SUPERVISOR |

## attendance/

| Method | Path | Allowed roles |
|---|---|---|
| POST | `/attendance/check-in/:employeeId` | ADMIN, GUARD (a GUARD can only check in for themselves) |
| POST | `/attendance/check-out/:employeeId` | ADMIN, GUARD (same restriction) |
| GET | `/attendance` | ADMIN, SUPERVISOR — query filters: `?date=` `?month=` `?active=true` `?employeeId=` `?locationId=` |
| GET | `/attendance/:employeeId` | ADMIN, SUPERVISOR, GUARD (a GUARD can only view their own record) |

## assignments/

| Method | Path | Allowed roles |
|---|---|---|
| POST | `/assignments` | ADMIN |
| GET | `/assignments` | ADMIN, SUPERVISOR |
| GET | `/assignments/:id` | ADMIN, SUPERVISOR |
| DELETE | `/assignments/:id` | ADMIN |

## clients/

| Method | Path | Allowed roles |
|---|---|---|
| POST | `/clients` | ADMIN |
| GET | `/clients` | ADMIN |
| GET | `/clients/:id` | ADMIN, SUPERVISOR |
| PATCH | `/clients/:id` | ADMIN |
| DELETE | `/clients/:id` | ADMIN |

## contracts/ (ADMIN only, all routes)

| Method | Path |
|---|---|
| POST | `/contracts` |
| GET | `/contracts` |
| GET | `/contracts/:id` |
| PATCH | `/contracts/:id` |
| DELETE | `/contracts/:id` |

## locations/ (ADMIN only, all routes)

| Method | Path |
|---|---|
| POST | `/locations` |
| GET | `/locations` |
| GET | `/locations/:id` |
| PATCH | `/locations/:id` |
| DELETE | `/locations/:id` |

## payroll/ (ADMIN only, all routes)

| Method | Path |
|---|---|
| POST | `/payroll` |
| GET | `/payroll` |
| GET | `/payroll/:id` |
| DELETE | `/payroll/:id` |
| POST | `/payroll/generate` |

## app

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check, public |

---
# securityERP Backend — API Routes

**Base URL:** `http://localhost:4000`
**Framework:** NestJS
**Auth:** All routes except `auth/*` and `/` require `JwtAuthGuard` (`Authorization: Bearer <token>`) plus `RolesGuard` where a `@Roles(...)` decorator is present.

---

## auth/ (public)

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register a user (email + password) |
| POST | `/auth/login` | Log in, returns a JWT |

## users/ (ADMIN only)

| Method | Path |
|---|---|
| POST | `/users` |
| GET | `/users` |
| GET | `/users/:id` |
| DELETE | `/users/:id` |

## employees/

| Method | Path | Allowed roles |
|---|---|---|
| POST | `/employees` | ADMIN |
| GET | `/employees` | ADMIN, SUPERVISOR |
| GET | `/employees/:id` | ⚠️ Any authenticated user — no `@Roles` decorator set |
| PATCH | `/employees/:id` | ADMIN, SUPERVISOR |
| DELETE | `/employees/:id` | ADMIN, SUPERVISOR |

## attendance/

| Method | Path | Allowed roles |
|---|---|---|
| POST | `/attendance/check-in/:employeeId` | ADMIN, GUARD (a GUARD can only check in for themselves) |
| POST | `/attendance/check-out/:employeeId` | ADMIN, GUARD (same restriction) |
| GET | `/attendance` | ADMIN, SUPERVISOR — query filters: `?date=` `?month=` `?active=true` `?employeeId=` `?locationId=` |
| GET | `/attendance/:employeeId` | ADMIN, SUPERVISOR, GUARD (a GUARD can only view their own record) |

## assignments/

| Method | Path | Allowed roles |
|---|---|---|
| POST | `/assignments` | ADMIN |
| GET | `/assignments` | ADMIN, SUPERVISOR |
| GET | `/assignments/:id` | ADMIN, SUPERVISOR |
| DELETE | `/assignments/:id` | ADMIN |

## clients/

| Method | Path | Allowed roles |
|---|---|---|
| POST | `/clients` | ADMIN |
| GET | `/clients` | ADMIN |
| GET | `/clients/:id` | ADMIN, SUPERVISOR |
| PATCH | `/clients/:id` | ADMIN |
| DELETE | `/clients/:id` | ADMIN |

## contracts/ (ADMIN only, all routes)

| Method | Path |
|---|---|
| POST | `/contracts` |
| GET | `/contracts` |
| GET | `/contracts/:id` |
| PATCH | `/contracts/:id` |
| DELETE | `/contracts/:id` |

## locations/ (ADMIN only, all routes)

| Method | Path |
|---|---|
| POST | `/locations` |
| GET | `/locations` |
| GET | `/locations/:id` |
| PATCH | `/locations/:id` |
| DELETE | `/locations/:id` |

## payroll/ (ADMIN only, all routes)

| Method | Path |
|---|---|
| POST | `/payroll` |
| GET | `/payroll` |
| GET | `/payroll/:id` |
| DELETE | `/payroll/:id` |
| POST | `/payroll/generate` |

## app

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check, public |

---

## Notes found during review

1. **No `shifts` module exists in the backend** — but the frontend has `/shifts` pages. Confirm what those pages actually call; they may be pointing at `assignments` or a missing endpoint.
2. **`GET /employees/:id`** is the only employee route without a `@Roles` decorator, so any authenticated user (including GUARD) can fetch any employee's details. Add `@Roles('ADMIN','SUPERVISOR')` if that's not intentional.

