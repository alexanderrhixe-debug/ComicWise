# ComicWise - Quick Start Guide

**Last Updated:** 2025-12-02

## 🎯 Project Status: 42% Complete

**✅ COMPLETED:**

- Project setup with Next.js 16 + TypeScript
- Database schema (15 tables)
- Authentication system (Next-Auth v5)
- State management (Zustand)
- Developer tools configured

**⏳ PENDING:**

- Database queries implementation
- UI components (shadcn/ui)
- Auth pages
- Core pages (home, comics, reader)
- Admin dashboard
- Seed data

---

## 🚀 Getting Started (5 Minutes)

### Prerequisites

```powershell
node --version  # v20+
pnpm --version  # v9+
```

### Step 1: Environment Setup

Create `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` and set these **required** variables:

```env
# Minimum required for local development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/comicwise"
NEXTAUTH_SECRET="your-very-long-secret-min-32-characters-generate-with-openssl"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**

```powershell
# Option 1: Online
# Visit: https://generate-secret.vercel.app/32

# Option 2: PowerShell (if openssl installed)
openssl rand -base64 32
```

### Step 2: Database Setup

**Option A: Docker (Recommended)**

```powershell
# Create docker-compose.yml (if not exists)
# Then run:
docker-compose up -d
```

**Option B: Neon (Cloud)**

1. Sign up at https://neon.tech
2. Create a project
3. Copy connection string to `DATABASE_URL`

### Step 3: Push Schema to Database

```powershell
pnpm db:push
```

Expected output:

```
✓ Applying schema changes...
✓ 15 tables created
✓ Success!
```

### Step 4: Start Development Server

```powershell
pnpm dev
```

Open http://localhost:3000

---

## 📋 Available Commands

### Development

```powershell
pnpm dev              # Start dev server (with Turbopack)
pnpm build            # Build for production
pnpm start            # Start production server
```

### Database

```powershell
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio (GUI)
pnpm db:generate      # Generate migrations
pnpm db:seed          # Seed database (when implemented)
pnpm db:reset         # Reset & seed database
```

### Code Quality

```powershell
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm type-check       # TypeScript type check
pnpm cspell           # Spell check
```

### Maintenance

```powershell
pnpm check-updates    # Check for outdated packages
pnpm update-deps      # Interactive dependency update
```

---

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (sign-in, register)
│   ├── (root)/            # Main app pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── Providers.tsx      # App providers (SessionProvider)
│
├── db/                    # Database layer
│   ├── schema/            # ✅ Drizzle schema (15 tables)
│   ├── queries/           # ⏳ Database queries (TODO)
│   ├── mutations/         # ⏳ Database mutations (TODO)
│   ├── client.ts          # ✅ Drizzle client
│   └── index.ts           # ✅ Exports
│
├── lib/                   # Business logic
│   ├── actions/           # Server actions
│   │   └── auth/          # ✅ Auth actions (4 actions)
│   ├── auth.ts            # ✅ Next-Auth config
│   └── utils.ts           # ✅ Utility functions
│
├── components/            # React components
│   ├── ui/                # ⏳ shadcn/ui components (TODO)
│   ├── admin/             # ⏳ Admin components (TODO)
│   └── emails/            # ⏳ Email templates (TODO)
│
├── stores/                # Zustand state
│   ├── bookmark.store.ts  # ✅ Bookmark state
│   └── ui.store.ts        # ✅ UI state (theme, sidebar)
│
├── hooks/                 # Custom React hooks
│   ├── use-debounce.ts    # ✅ Debounce hook
│   └── use-media-query.ts # ✅ Media query hook
│
├── types/                 # TypeScript types
│   ├── index.ts           # ✅ Core types (Comic, Chapter, etc.)
│   └── auth.ts            # ✅ Auth types (User, Session)
│
├── services/              # External services
│   └── upload/            # ⏳ Upload adapters (TODO)
│
└── app-config/            # Configuration
    ├── env.ts             # ✅ Environment validation
    └── index.ts           # ✅ App constants
```

---

## 🔐 Authentication Flow

### Current Status: ✅ Backend Complete, ⏳ Pages Pending

**What's implemented:**

- ✅ Next-Auth v5 configuration
- ✅ Credentials provider (email/password)
- ✅ Google OAuth provider
- ✅ JWT sessions (7-day expiry)
- ✅ Password hashing (bcrypt)
- ✅ Route protection middleware
- ✅ Role-based access (user/admin/moderator)
- ✅ Server actions (register, login, reset password)

**What's pending:**

- ⏳ Sign-in page UI
- ⏳ Register page UI
- ⏳ Forgot password page UI
- ⏳ User profile page

### Testing Auth (via Drizzle Studio)

1. Start Drizzle Studio:

   ```powershell
   pnpm db:studio
   ```

2. Open http://localhost:4983

3. Manually insert a test user in the `user` table

4. Use credentials to test sign-in API

---

## 📊 Database Schema Overview

### 15 Tables Implemented:

**Auth Tables (6):**

- `user` - User accounts with roles
- `account` - OAuth accounts
- `session` - User sessions
- `verificationToken` - Email verification
- `authenticator` - 2FA/WebAuthn
- `passwordResetToken` - Password reset tokens

**Content Tables (7):**

- `comic` - Main comic entities
- `chapter` - Comic chapters
- `comicImage` - Comic cover images
- `chapterImage` - Chapter page images
- `type` - Comic types (Manga, Manhwa, etc.)
- `author` - Authors
- `artist` - Artists
- `genre` - Genres
- `comicToGenre` - Comic-Genre relationship

**User Interaction (2):**

- `bookmark` - Reading progress
- `comment` - Chapter comments

**View Schema:**

```powershell
pnpm db:studio
# or inspect: src/db/schema/index.ts
```

---

## 🎨 UI Components (Next Steps)

### Install shadcn/ui Components

```powershell
# Install CLI globally (one-time)
pnpm add -g shadcn-ui

# Add components
pnpx shadcn@latest add button
pnpx shadcn@latest add card
pnpx shadcn@latest add input
pnpx shadcn@latest add form
pnpx shadcn@latest add dialog
pnpx shadcn@latest add dropdown-menu
pnpx shadcn@latest add skeleton
pnpx shadcn@latest add badge
pnpx shadcn@latest add tabs
pnpx shadcn@latest add pagination
```

Components will be added to `src/components/ui/`

---

## 🛠️ Next Development Tasks

### Priority 1: Database Layer

1. **Create queries** (`src/db/queries/`)
   - `comics.ts` - getAllComics, getComic, search
   - `chapters.ts` - getChapters, getChapterImages
   - `bookmarks.ts` - getUserBookmarks, isBookmarked

2. **Create mutations** (`src/db/mutations/`)
   - `comics.ts` - createComic, updateComic, deleteComic
   - `bookmarks.ts` - addBookmark, removeBookmark

### Priority 2: Auth Pages

1. Create sign-in page (`src/app/(auth)/sign-in/page.tsx`)
2. Create register page (`src/app/(auth)/register/page.tsx`)
3. Create forgot password page
4. Create auth layout with centered form

### Priority 3: Core Pages

1. Update home page with comic grid
2. Create comics listing page (`src/app/(root)/comics/page.tsx`)
3. Create comic detail page (`src/app/(root)/comics/[id]/page.tsx`)
4. Create chapter reader
   (`src/app/(root)/comics/[id]/read/[chapterId]/page.tsx`)

### Priority 4: Seed Data

1. Create `src/scripts/seed.ts`
2. Add sample comics (15+)
3. Add chapters for each comic
4. Add sample users
5. Run `pnpm db:seed`

---

## 📖 Documentation

- **PROJECT_AUDIT.md** - Complete task checklist (200+ tasks)
- **TASK_COMPLETION_SUMMARY.md** - Current progress report
- **README.md** - Project overview
- **QUICKSTART.md** - This file

---

## 🐛 Troubleshooting

### Database Connection Error

```
Error: getaddrinfo ENOTFOUND localhost
```

**Fix:** Ensure PostgreSQL is running

```powershell
docker-compose ps        # Check Docker containers
docker-compose up -d     # Start if not running
```

### Module Not Found Error

```
Error: Cannot find module '@/db'
```

**Fix:** TypeScript path aliases issue

```powershell
pnpm type-check          # Verify tsconfig.json
```

### Environment Variable Error

```
Error: DATABASE_URL environment variable is not set
```

**Fix:** Create `.env.local` from `.env.example`

```powershell
Copy-Item .env.example .env.local
```

### Drizzle Push Fails

```
Error: relation "user" already exists
```

**Fix:** Database already has tables

```powershell
# Option 1: Drop database and recreate
# Option 2: Use migrations instead
pnpm db:generate
pnpm db:migrate
```

---

## 🎓 Learning Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Next-Auth v5](https://authjs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## 🤝 Contributing

1. Check `PROJECT_AUDIT.md` for pending tasks
2. Pick a task from the checklist
3. Create a feature branch
4. Implement the feature
5. Run linting and type-check
6. Submit for review

---

## 📞 Support

**Issues?** Check these files:

1. `PROJECT_AUDIT.md` - Task progress
2. `TASK_COMPLETION_SUMMARY.md` - What's done
3. `.env.example` - Required environment variables

---

**Ready to Start?** Run these commands:

```powershell
# 1. Create environment file
Copy-Item .env.example .env.local

# 2. Edit .env.local with your DATABASE_URL and NEXTAUTH_SECRET

# 3. Push database schema
pnpm db:push

# 4. Start development
pnpm dev

# 5. Open Drizzle Studio (optional)
pnpm db:studio
```

**Happy coding! 🚀**
