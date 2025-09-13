# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo using npm workspaces and Turbo with the following structure:
- **apps/api** - NestJS backend API with OpenAI and Supabase integration
- **apps/web** - Next.js frontend application
- **packages/shared** - Shared utilities and types
- **packages/ui** - Shared UI components
- **packages/supabase** - Supabase client and types

## Development Commands

### Running the Applications
```bash
# Start all applications in development mode
turbo dev

# Run specific app
cd apps/api && npm run start:dev    # API with hot reload
cd apps/web && npm run dev          # Web app with Turbo
```

### Building
```bash
# Build all applications
turbo build

# Build specific app
cd apps/api && npm run build
cd apps/web && npm run build
```

### Testing (API only)
```bash
cd apps/api
npm run test                # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests
```

### Linting and Formatting
```bash
cd apps/api
npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting

cd apps/web
npm run lint               # ESLint for Next.js
```

## Architecture Overview

### Backend (NestJS API)
- **Modular architecture** with feature modules:
  - `SupabaseModule` - Database integration
  - `ArticlesModule` - Article management
  - `GenerateModule` - AI content generation
  - `DocumentsModule` - Document processing
  - `AiModule` - AI services integration
- **Configuration** via environment variables with global ConfigModule
- **Database**: Supabase (PostgreSQL) with pgvector for embeddings
- **AI Integration**: OpenAI API for content generation and embeddings

### Frontend (Next.js)
- **App Router** structure in `apps/web/app/`
- **Key pages**:
  - `/` - Homepage
  - `/generate` - AI content generation
  - `/documents` - Document management
- **Styling**: TailwindCSS v4
- **Components**: React with TypeScript

### Environment Variables
Required for development (defined in turbo.json):
- `OPENAI_API_KEY` - OpenAI API key
- `SUPABASE_URL` - Supabase project URL  
- `SUPABASE_KEY` - Supabase anon key

## Key Technologies
- **Package Manager**: npm with workspaces
- **Build System**: Turbo monorepo
- **Backend**: NestJS, Supabase, OpenAI, pgvector
- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Language**: TypeScript throughout