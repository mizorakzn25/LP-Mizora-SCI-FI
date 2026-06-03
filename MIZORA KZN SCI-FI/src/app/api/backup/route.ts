import { NextResponse } from 'next/server';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════
// MIZORA KZN — FULLY PORTABLE SOURCE CODE BACKUP
// Produces a ZIP that can be directly deployed to:
// GitHub → Vercel → Google AI Studio → Netlify → Any platform
// ═══════════════════════════════════════════════════════════════

// Directories to INCLUDE
const INCLUDE_DIRS = [
  'src',
  'prisma',
  'public',
  'mini-services',
];

// Individual files to INCLUDE (only if they exist)
// Note: .gitignore and .env.example are GENERATED fresh in the ZIP
// (not copied from the project root which may have sandbox-specific entries)
const INCLUDE_FILES = [
  'package.json',
  'bun.lock',
  'tsconfig.json',
  'next.config.ts',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'components.json',
  'next-env.d.ts',
];

// Patterns/directories to EXCLUDE from the archive
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  '.turbo',
  'agent-ctx',
  'dev.log',
  'worklog.md',
  '.db-journal',
  'prisma/migrations',
  // Sandbox-specific / non-portable files
  'Caddyfile',
  'upload',
  'download',
  'db/custom.db',
  'examples',
  // MACS chat API — removed (Z.ai API is sandbox-only, not portable)
  'macs-chat',
  // Z.ai SDK config — sandbox-only, not needed outside Z.ai
  '.z-ai-config',
  // These are generated fresh in the ZIP (clean, portable versions)
  '.env.example',
  '.gitignore',
  '.env',
];

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

function shouldExclude(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  return EXCLUDE_PATTERNS.some(
    (pattern) =>
      normalized.includes(`/${pattern}`) ||
      normalized.startsWith(pattern + '/') ||
      normalized.endsWith(pattern) ||
      normalized === pattern
  );
}

function walkDir(dir: string, base: string, files: string[]): void {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(base, fullPath);

    if (shouldExclude(relativePath)) continue;

    if (entry.isDirectory()) {
      walkDir(fullPath, base, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
}

// ─── Generate .env.example content ───
function generateEnvExample(): string {
  return `# ═══════════════════════════════════════════
# MIZORA KZN — Environment Variables
# ═══════════════════════════════════════════

# Database (SQLite — default, works locally)
DATABASE_URL="file:./dev.db"

# If using Prisma with PostgreSQL (for production/Vercel):
# DATABASE_URL="postgresql://user:password@localhost:5432/mizora_kzn?schema=public"
`;
}

// ─── Generate .gitignore content ───
function generateGitignore(): string {
  return `# dependencies
node_modules
/.pnp
.pnp.*

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# env files
.env
.env*.local

# Z.ai SDK config (sandbox-only, not needed for deployment)
.z-ai-config

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/migrations/

# database
*.db
*.db-journal

# logs
*.log
dev.log
server.log
`;
}

// ─── Generate next-env.d.ts content ───
function generateNextEnvDts(): string {
  return `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`;
}

// ─── Generate RESTORE-README.md content ───
function generateRestoreReadme(fileDetails: { archivePath: string; size: number }[], totalSize: number): string {
  const date = new Date().toISOString();
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  return `# Mizora KZN — Source Code Backup

> **Generated:** ${date}
> **Files:** ${fileDetails.length}
> **Size:** ${sizeMB} MB
> **Status:** ✅ Ready to deploy anywhere

---

## 🚀 Quick Rebuild (3 Steps)

\`\`\`bash
# 1. Install dependencies
bun install

# 2. Setup database
bun run db:push

# 3. Start development
bun run dev
\`\`\`

Open \`http://localhost:3000\` — Done!

---

## 📦 Deploy to Platforms

### GitHub
\`\`\`bash
# Initialize git repo
git init
git add .
git commit -m "Initial commit: Mizora KZN"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/mizora-kzn.git
git push -u origin main
\`\`\`

### Vercel (Recommended)
1. Push code to GitHub (see above)
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select your GitHub repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Add environment variable: \`DATABASE_URL\` (if using PostgreSQL)
6. Done! Your site is live.

**OR using Vercel CLI:**
\`\`\`bash
npm i -g vercel
vercel --prod
\`\`\`

### Google AI Studio
1. Extract ZIP to a folder
2. Upload the folder to Google AI Studio
3. All source files are included — ready to analyze/modify

### Netlify
1. Push to GitHub
2. Connect repo at [netlify.com](https://netlify.com)
3. Build command: \`bun run build\`
4. Publish directory: \`.next/static\`
5. Deploy

### Railway / Render
1. Connect GitHub repo
2. Set build command: \`bun install && bun run db:push && bun run build\`
3. Set start command: \`bun start\`
4. Add env vars: \`DATABASE_URL\`

---

## 📁 What's Included

| Directory | Contents |
|-----------|----------|
| \`src/\` | Full source code — components, pages, API routes, styles, hooks, lib |
| \`prisma/\` | Database schema (SQLite by default, easy to switch to PostgreSQL) |
| \`public/\` | Static assets — images, logo, \`index.html\` (standalone page) |
| Config files | \`package.json\`, \`tsconfig.json\`, \`next.config.ts\`, \`tailwind.config.ts\`, etc. |

## 📁 What's Excluded (and why)

| Excluded | Reason | How to Restore |
|----------|--------|----------------|
| \`node_modules/\` | Too large, platform-specific | Run \`bun install\` |
| \`.next/\` | Build cache, auto-generated | Run \`bun run dev\` or \`bun run build\` |
| \`.git/\` | Version control, not needed for rebuild | Run \`git init\` |
| \`*.db\` files | Database data, not source code | Run \`bun run db:push\` to create fresh |
| \`Caddyfile\` | Sandbox-specific gateway config | Not needed outside sandbox |
| \`upload/\`, \`download/\` | Temporary/sandbox folders | Not needed for rebuild |
| \`src/app/api/macs-chat/\` | Z.ai sandbox-only API (not portable) | Removed — chat is sandbox-exclusive |
| \`.z-ai-config\` | Sandbox-specific SDK credentials | Not needed outside Z.ai sandbox |

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

Copy \`.env.example\` to \`.env\` and configure:

\`\`\`bash
cp .env.example .env
\`\`\`

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| \`DATABASE_URL\` | Yes | \`file:./dev.db\` | Database connection string |

---

## ✅ Verification Checklist

After extracting, verify your backup is complete:

- [ ] \`package.json\` exists and has dependencies listed
- [ ] \`src/app/page.tsx\` exists (main page)
- [ ] \`src/app/layout.tsx\` exists (root layout)
- [ ] \`src/app/globals.css\` exists (styles)
- [ ] \`prisma/schema.prisma\` exists (database schema)
- [ ] \`public/images/mizora-logo.png\` exists (brand assets)
- [ ] \`.env.example\` exists (environment template)
- [ ] \`bun install\` completes without errors
- [ ] \`bun run dev\` starts the server

---

See \`BACKUP-MANIFEST.json\` for complete file listing with sizes.
`;
}

// ─── Generate Vercel config ───
function generateVercelJson(): string {
  return JSON.stringify({
    buildCommand: "bun run build",
    devCommand: "bun run dev",
    installCommand: "bun install",
    framework: "nextjs",
    regions: ["sin1"],
  }, null, 2);
}

export async function GET() {
  try {
    const projectRoot = path.resolve(process.cwd());

    // ── Collect all files from directories ──
    const allFiles: string[] = [];

    for (const dir of INCLUDE_DIRS) {
      const dirPath = path.join(projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        walkDir(dirPath, projectRoot, allFiles);
      }
    }

    // ── Add individual config files ──
    for (const file of INCLUDE_FILES) {
      const filePath = path.join(projectRoot, file);
      if (fs.existsSync(filePath)) {
        allFiles.push(filePath);
      }
    }

    // ── Validate and collect file details ──
    let totalSize = 0;
    const fileDetails: { fullPath: string; archivePath: string; size: number }[] = [];
    const emptyFiles: string[] = [];

    for (const fullPath of allFiles) {
      try {
        const stat = fs.statSync(fullPath);
        if (stat.size + totalSize > MAX_SIZE_BYTES) {
          continue;
        }
        const archivePath = path.relative(projectRoot, fullPath);

        // Check for empty files (potential issues)
        if (stat.size === 0) {
          emptyFiles.push(archivePath);
        }

        totalSize += stat.size;
        fileDetails.push({
          fullPath,
          archivePath,
          size: stat.size,
        });
      } catch {
        // Skip files that can't be stat'd
      }
    }

    // ── Generate manifest ──
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const manifest = {
      projectName: 'mizora-kzn',
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalFiles: fileDetails.length,
      totalSizeBytes: totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      deployTargets: ['github', 'vercel', 'netlify', 'railway', 'render', 'google-ai-studio'],
      rebuildInstructions: {
        steps: [
          '1. Extract this ZIP file to a folder',
          '2. Copy .env.example to .env and configure',
          '3. Run: bun install',
          '4. Run: bun run db:push',
          '5. Run: bun run dev',
          '6. Open http://localhost:3000',
        ],
        alternativeSteps: {
          npm: ['npm install', 'npx prisma db push', 'npm run dev'],
          yarn: ['yarn install', 'yarn db:push', 'yarn dev'],
          pnpm: ['pnpm install', 'pnpm db:push', 'pnpm dev'],
        },
        requirements: [
          'Bun runtime (v1.0+) OR Node.js 18+',
          'Next.js 16 auto-installed via package.json',
        ],
      },
      warnings: emptyFiles.length > 0
        ? [`The following files are empty (0 bytes): ${emptyFiles.join(', ')}`]
        : [],
      files: fileDetails.map((f) => ({
        path: f.archivePath,
        sizeBytes: f.size,
        status: f.size === 0 ? '⚠️ EMPTY' : '✅ OK',
      })),
    };

    // ── Create ZIP archive ──
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    // Add real project files
    for (const file of fileDetails) {
      archive.file(file.fullPath, { name: file.archivePath });
    }

    // ── Add generated deployment files ──

    // .env.example (with proper DATABASE_URL template)
    archive.append(Buffer.from(generateEnvExample()), { name: '.env.example' });

    // .gitignore (clean, portable version)
    archive.append(Buffer.from(generateGitignore()), { name: '.gitignore' });

    // next-env.d.ts (if not already included from real files)
    if (!fileDetails.some(f => f.archivePath === 'next-env.d.ts')) {
      archive.append(Buffer.from(generateNextEnvDts()), { name: 'next-env.d.ts' });
    }

    // vercel.json (for one-click Vercel deployment)
    archive.append(Buffer.from(generateVercelJson()), { name: 'vercel.json' });

    // BACKUP-MANIFEST.json
    archive.append(Buffer.from(JSON.stringify(manifest, null, 2)), { name: 'BACKUP-MANIFEST.json' });

    // RESTORE-README.md (comprehensive deployment guide)
    archive.append(Buffer.from(generateRestoreReadme(fileDetails, totalSize)), { name: 'RESTORE-README.md' });

    // ── Convert archive to buffer ──
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', resolve);
      archive.on('error', reject);
      archive.finalize();
    });

    const zipBuffer = Buffer.concat(chunks);

    const fileName = `mizora-kzn-source-${timestamp}.zip`;

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': zipBuffer.length.toString(),
        'X-Backup-File-Count': fileDetails.length.toString(),
        'X-Backup-Size-MB': (zipBuffer.length / (1024 * 1024)).toFixed(2),
        'X-Backup-Deploy-Ready': 'true',
        'X-Backup-Empty-Files': emptyFiles.length.toString(),
      },
    });
  } catch (error) {
    console.error('Backup generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate backup', details: String(error) },
      { status: 500 }
    );
  }
}
