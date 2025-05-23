# 24letters-site Development Guidelines

This document provides essential information for developers working on the 24letters-site project.

## Build and Configuration

### Prerequisites
- Node.js (v20.11.1 recommended)
- PNPM (v10.8.0+)

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development
- Start the development server with Turbopack:
   ```bash
   pnpm dev
   ```
- The site will be available at http://localhost:3000

### Build
- Build the production version:
   ```bash
   pnpm build
   ```
- Start the production server:
   ```bash
   pnpm start
   ```

### Type Checking
- Run TypeScript type checking:
   ```bash
   pnpm typecheck
   ```

### Linting
- Run ESLint:
   ```bash
   pnpm lint
   ```

## Code Style and Development Guidelines

### Code Style

The project uses:
- ESLint with Next.js recommended configurations
- Prettier for code formatting with the Tailwind CSS plugin
- TypeScript for type safety

### Component Library

The project uses shadcn/ui components with the "new-york" style. These components are built on top of Tailwind CSS and Radix UI.

### Path Aliases

The following path aliases are configured:
- `@/components`: UI components
- `@/ui`: shadcn/ui components
- `@/lib`: Utility functions and libraries
- `@/hooks`: React hooks
- `@/utils`: Utility functions

### MDX Support

The project supports MDX for content creation. MDX files can be placed in the `src/app` directory and will be processed by the Next.js MDX plugin.

### Continuous Integration

The CI workflow runs on pull requests, pushes to main, and merge groups. It performs:
- Dependency installation
- Linting
- Type checking

### Deployment

The project is configured to ignore TypeScript and ESLint errors during builds, with a note that these should be handled in GitHub workflows instead.

### Best Practices

1. Pages should be staticly generatable as much as possible. When a page needs to include something dynamic, that part of the code should be loaded lazily in the browser.
2. Follow the existing component structure and naming conventions
3. Use TypeScript for all new code
4. Ensure components are accessible
5. Use the shadcn/ui component library for consistent UI
6. Follow the Tailwind CSS class ordering with the prettier-plugin-tailwindcss
7. Use React Server Components (RSC) where appropriate