# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

## Architecture

This is a Next.js 15 site with App Router using TypeScript, Tailwind CSS, and MDX for blog posts.

### Key Directories
- `src/app/` - Next.js App Router pages and layouts
- `src/app/blocks/` - Homepage content blocks (Bio, Experience, etc.)
- `src/components/` - Reusable components (posts, UI components)
- `src/primitives/` - Basic layout primitives (Container, etc.)
- `posts/` - MDX blog posts with frontmatter
- `public/images/` - Static images

### Blog System
- Blog posts are stored as MDX files in `/posts/` directory
- Frontmatter structure: `title`, `publishedAt`, `isDraft`, `summary`, `image`
- Draft posts are only visible in development (`isDraft: true`)
- Posts are sorted by `publishedAt` date in descending order
- Blog utilities in `src/app/blog/utils.ts` handle file parsing and filtering

### Admin Features
- Upload page at `/upload` (development only)
- File upload API at `/api/upload` saves images to `public/images/`
- Admin layout in `src/app/(admin)/` with route group

### Styling
- Uses Tailwind CSS v4 with PostCSS
- Custom fonts: Inter (sans) and Gloock (serif) via Google Fonts
- Dark mode support with `next-themes`
- Custom Shiki syntax highlighting styles in `src/styles/shiki.css`

### Build Configuration
- TypeScript and ESLint errors are ignored during builds (handled in CI)
- MDX support configured with `@next/mdx`
- Plausible analytics integration
- OG image generation at `/og` route