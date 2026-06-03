# Mizora KZN — Source Code Backup

> **Generated:** 2026-06-03T03:53:34.912Z
> **Files:** 96
> **Size:** 4.09 MB
> **Status:** ✅ Ready to deploy anywhere

---

## 🚀 Quick Rebuild (3 Steps)

```bash
# 1. Install dependencies
bun install

# 2. Setup database
bun run db:push

# 3. Start development
bun run dev
```

Open `http://localhost:3000` — Done!

---

## 📦 Deploy to Platforms

### GitHub
```bash
# Initialize git repo
git init
git add .
git commit -m "Initial commit: Mizora KZN"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/mizora-kzn.git
git push -u origin main
```

### Vercel (Recommended)
1. Push code to GitHub (see above)
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select your GitHub repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Add environment variable: `DATABASE_URL` (if using PostgreSQL)
6. Done! Your site is live.

**OR using Vercel CLI:**
```bash
npm i -g vercel
vercel --prod
```

### Google AI Studio
1. Extract ZIP to a folder
2. Upload the folder to Google AI Studio
3. All source files are included — ready to analyze/modify

### Netlify
1. Push to GitHub
2. Connect repo at [netlify.com](https://netlify.com)
3. Build command: `bun run build`
4. Publish directory: `.next/static`
5. Deploy

### Railway / Render
1. Connect GitHub repo
2. Set build command: `bun install && bun run db:push && bun run build`
3. Set start command: `bun start`
4. Add env vars: `DATABASE_URL`

---

## 📁 What's Included

| Directory | Contents |
|-----------|----------|
| `src/` | Full source code — components, pages, API routes, styles, hooks, lib |
| `prisma/` | Database schema (SQLite by default, easy to switch to PostgreSQL) |
| `public/` | Static assets — images, logo, `index.html` (standalone page) |
| Config files | `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, etc. |

## 📁 What's Excluded (and why)

| Excluded | Reason | How to Restore |
|----------|--------|----------------|
| `node_modules/` | Too large, platform-specific | Run `bun install` |
| `.next/` | Build cache, auto-generated | Run `bun run dev` or `bun run build` |
| `.git/` | Version control, not needed for rebuild | Run `git init` |
| `*.db` files | Database data, not source code | Run `bun run db:push` to create fresh |
| `Caddyfile` | Sandbox-specific gateway config | Not needed outside sandbox |
| `upload/`, `download/` | Temporary/sandbox folders | Not needed for rebuild |
| `src/app/api/macs-chat/` | Z.ai sandbox-only API (not portable) | Removed — chat is sandbox-exclusive |
| `.z-ai-config` | Sandbox-specific SDK credentials | Not needed outside Z.ai sandbox |

---

## 🔧 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Database:** Prisma ORM (SQLite default, PostgreSQL for production)
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `file:./dev.db` | Database connection string |

---

## ✅ Verification Checklist

After extracting, verify your backup is complete:

- [ ] `package.json` exists and has dependencies listed
- [ ] `src/app/page.tsx` exists (main page)
- [ ] `src/app/layout.tsx` exists (root layout)
- [ ] `src/app/globals.css` exists (styles)
- [ ] `prisma/schema.prisma` exists (database schema)
- [ ] `public/images/mizora-logo.png` exists (brand assets)
- [ ] `.env.example` exists (environment template)
- [ ] `bun install` completes without errors
- [ ] `bun run dev` starts the server

---

See `BACKUP-MANIFEST.json` for complete file listing with sizes.
