# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Goals

**Content Assistant for Blog/Intranet with Fact-Links**

The main goal is to create a content generation system that produces draft articles with mandatory sources and citations.

**Key Features:**
- **RAG (Retrieval-Augmented Generation)** - AI-powered content generation based on reliable sources
- **Citations & Fact-linking** - Every generated statement must be backed by a verifiable source
- **Anti-hallucination measures** - Answer reliability scoring to prevent false information
- **Quality assurance** - "No phrase without a source" checklist approach

**Use Cases:**
- Blog article drafting with automatic fact-checking
- Corporate intranet content with source verification
- Research-backed content generation for professional use

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
  - `GenerateModule` - AI content generation with automatic history tracking
  - `DocumentsModule` - Document processing and vector search
  - `AiModule` - AI services integration
  - `HistoryModule` - Generation history tracking and search API
- **Configuration** via environment variables with global ConfigModule
- **Database**: Supabase (PostgreSQL) with pgvector for embeddings
- **AI Integration**: OpenAI API for content generation and embeddings
- **History Tracking**: Automatic saving of all generations with full-text search

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

## Code Explanation Requirements

**IMPORTANT**: When working on this project, always provide detailed explanations for:
- **What the code does** - Clear description of functionality
- **Why it's needed** - Purpose and business logic reasoning
- **How it works** - Technical implementation details
- **Architecture patterns** - Design patterns and architectural approaches used
- **Technology concepts** - Explanation of new technologies, libraries, or frameworks
- **Best practices** - Why certain approaches are preferred over alternatives

This is an educational project where understanding the "why" and "how" is as important as the working code itself.

## Development Plan

### Week 1 — Framework and Basic Functions

**Day 1** ✅
- Deploy monorepo (Turborepo + Next.js + NestJS)
- Setup workspaces (apps/*, packages/*)
- Setup local Supabase (Docker or cloud)

**Day 2** ✅
- Setup Next.js UI (Tailwind, basic layout)
- Create "New Draft" form (input: article topic)
- Setup NestJS API (endpoint /generate)

**Day 3** ✅
- Connect OpenAI SDK
- Implement OpenAIService (embeddings + text generation)
- Test draft generation by topic

**Day 4** ✅
- Setup documents table in Supabase
- Implement document saving with embedding
- Add API POST /documents for uploading new materials

**Day 5** ✅ **COMPLETED**
- Frontend: text upload functionality (article/link insertion)
- After upload → API saves embedding to Supabase
- Test similar document search by embedding (top 5)

**Day 6** ✅ **COMPLETED**
- Connect everything:
  - Input topic → find relevant documents → assistant writes draft
  - Return draft with citations/links to sources
- ✅ RAG-пайплайн реализован
- ✅ Frontend модернизирован с Markdown поддержкой
- ✅ Система цитат и источников

**Day 7** ✅ **COMPLETED**
- UI: display draft in Markdown ✅ (уже сделано в День 6)
- Add citations list at bottom (with clickable links) ✅ (уже сделано в День 6)
- 🔧 Fix embedding search issues (документы не находятся при поиске) ✅
- 📊 Add generation history tracking ✅
- ✅ Реализована полная система отслеживания истории генерации
- ✅ API endpoints: GET/POST /history, /history/search, /history/:id
- ✅ Автоматическое сохранение всех генераций в БД
- ✅ Полнотекстовый поиск по истории с поддержкой русского языка

### Week 2 — Improvements and "Wow" Effect

**Day 8**
- "Edit Draft" functionality (rich editor, e.g. react-quill or tiptap)
- Save final article version

**Day 9**
- Add source filtering: e.g., only last 30 days or specific categories

**Day 10**
- Basic authentication (Supabase Auth, Google OAuth)
- Link documents and drafts to users

**Day 11**
- "Intranet Assistant" mode:
  - Corporate document upload (pdf/docx → text)
  - Index these files in Supabase

**Day 12**
- Cheap deployment:
  - Vercel → apps/web
  - Render/Fly.io → apps/api
  - Supabase cloud (free tier)

**Day 13**
- UI polish (cards, article list, preview)
- "Generation History" feature

**Day 14**
- Final testing:
  - Scenario: upload articles → assistant writes new post with fact-links
  - Bug fixes
  - GitHub project setup (readme, screenshots, demo-link)