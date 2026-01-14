# Sacred Blog

A modern, production-ready blog platform for religious associations, built with Next.js 15 App Router.

## Features

### Public Blog
- **Homepage** with featured and recent articles
- **Article pages** with rich content, comments, and SEO optimization
- **Category pages** for organized content browsing
- **Full-text search** functionality
- **Responsive design** optimized for all devices

### Admin Dashboard
- **Dashboard** with statistics overview
- **Articles** - Full CRUD with rich text editor, SEO fields, publish/draft system
- **Categories** - Manage article categories with colors
- **Tags** - Organize content with tags
- **Comments** - Moderate reader comments
- **Administrators** - Manage admin users

### Technical Features
- Server Components first approach
- Server Actions for mutations
- NextAuth.js authentication
- PostgreSQL with Prisma ORM
- SEO optimized (sitemap, robots.txt, meta tags, Open Graph)
- Modern UI with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Editor**: TipTap
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sacred-blog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sacred_blog"
AUTH_SECRET="your-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

5. Seed the database with initial data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

After seeding, you can log in with:
- **Email**: admin@sacredblog.org
- **Password**: admin123

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/       # Login page
│   ├── admin/              # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── articles/
│   │   ├── categories/
│   │   ├── tags/
│   │   ├── comments/
│   │   └── admins/
│   ├── blog/               # Public blog pages
│   │   ├── [slug]/
│   │   ├── category/[slug]/
│   │   └── search/
│   └── api/auth/           # NextAuth API routes
├── actions/                # Server Actions
├── components/
│   ├── admin/              # Admin UI components
│   ├── blog/               # Blog UI components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities and configurations
└── types/                  # TypeScript types
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the application:
```bash
npm run build
npm run start
```

## License

MIT
