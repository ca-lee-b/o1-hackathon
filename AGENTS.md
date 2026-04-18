<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Finova — AI Financial Advisor

## Stack
- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 (PostCSS plugin, `@import "tailwindcss"` in globals.css)
- **Auth & DB:** Supabase (Auth, Postgres, RLS)
- **AI:** Anthropic Claude Sonnet (`@anthropic-ai/sdk`)
- **Language:** TypeScript (strict)

## Architecture
```
src/
  app/
    (auth)/          # Public: login, signup
    (app)/           # Authenticated: dashboard, transactions, goals, plan, recommendations, settings
    layout.tsx       # Root layout (Geist fonts, global CSS)
    page.tsx         # Root redirect (auth check → /dashboard or /login)
  components/        # Shared UI components (nav-link, charts, etc.)
  lib/
    supabase/
      client.ts      # Browser client (sync createClient)
      server.ts      # Server client (async createClient — always await)
      admin.ts       # Service-role client
    actions/         # Server Actions
    ai/              # AI/Claude integration
  types/
    database.ts      # All DB types (Profile, Goal, Account, Transaction, etc.)
```

## Design System
Dark financial UI. No gradients. No purple.

| Variable            | Value     | Usage                    |
|---------------------|-----------|--------------------------|
| `--bg-base`         | `#0A0A0F` | Page background          |
| `--bg-surface`      | `#13131A` | Cards, sidebar           |
| `--bg-elevated`     | `#1C1C26` | Inputs, hover states     |
| `--border`          | `#2A2A38` | All borders              |
| `--text-primary`    | `#F0F0F5` | Headings, body text      |
| `--text-secondary`  | `#8A8A9A` | Labels, descriptions     |
| `--text-muted`      | `#4A4A5A` | Disabled, placeholders   |
| `--accent-blue`     | `#2563EB` | Primary actions, links   |
| `--accent-blue-light` | `#60A5FA` | Hover/focus states     |
| `--accent-green`    | `#10B981` | Positive values, success |
| `--accent-red`      | `#EF4444` | Errors, negative values  |
| `--font-mono`       | JetBrains Mono, Fira Code, monospace | Financial data, code |

## Conventions
- Server components by default; `'use client'` only when needed (forms, hooks, interactivity)
- Supabase server client is async: `const supabase = await createClient()`
- Supabase browser client is sync: `const supabase = createClient()`
- All DB access gated by RLS — queries use the user's session automatically
- Use `@/` import alias for all internal imports
- Middleware at `src/middleware.ts` handles auth redirects and session refresh
- Server Actions in `src/lib/actions/` with `'use server'` directive

## Database Tables
`profiles`, `goals`, `accounts`, `transactions`, `plans`, `agent_actions`, `recommendations`
— All with RLS policies scoped to `auth.uid()`. See `supabase/migrations/001_initial_schema.sql`.
