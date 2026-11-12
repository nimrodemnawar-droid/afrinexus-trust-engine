# Architecture rules

- Keep identity and access roles in the protected `public.user_roles` table; admin delegation must use authenticated, role-checked database functions so browser-side changes cannot grant privileges.
- Keep plan requests in `public.plan_applications`, with owner-scoped submissions and reads and admin-only review enforced by database policies; the dashboard is a client of those existing controls.