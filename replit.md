# DataLens - AI-Powered Analytics Platform

## Overview

DataLens is an AI-powered data analysis platform designed for product managers to transform raw data into actionable insights. The application enables users to upload CSV/JSON datasets, automatically generates AI-driven insights, creates visualizations, and allows natural language querying of data. It features a modern dashboard interface with data preview capabilities, customizable charts, and shareable reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (replaces React Router)

**UI Component Strategy**
- Shadcn/ui component library built on Radix UI primitives (New York style variant)
- Tailwind CSS for utility-first styling with custom design tokens
- Design system inspired by Linear/Vercel dashboards focusing on data-density and clarity
- Responsive layout system with sidebar navigation using Radix UI Sidebar component

**State Management**
- TanStack Query (React Query) v5 for server state management, caching, and data fetching
- Query client configured with infinite stale time and disabled automatic refetching for optimal control
- Local component state using React hooks for UI-specific interactions

**Styling Approach**
- CSS variables-based theming system supporting light/dark modes
- Custom color palette using HSL color space for flexible theming
- Typography hierarchy using Inter (primary) and JetBrains Mono (monospace for data)
- Tailwind spacing primitives (2, 4, 6, 8, 12, 16) for consistent layout rhythm

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with ESM module system
- TypeScript for full-stack type safety
- HTTP server integrated with Vite in development mode for seamless SSR-ready architecture

**API Design Pattern**
- RESTful API endpoints under `/api` namespace
- Multipart form data handling for file uploads using Multer (memory storage strategy)
- JSON-based request/response for all other operations
- Request logging middleware tracking duration and responses for API routes

**Data Processing Pipeline**
- CSV parsing using PapaParse library with header detection and empty line skipping
- JSON data validation and normalization
- Dataset sampling (first 50 rows) for AI analysis to manage token costs
- Column type inference and statistics generation

**Storage Strategy**
- In-memory storage implementation (MemStorage class) as the current data persistence layer
- Storage interface (IStorage) defined for future database integration
- Drizzle ORM configured for PostgreSQL with schema definitions ready for migration
- Schema supports Users, Datasets, Visualizations, Insights, and Shares entities

### Data Schema

**Core Entities**
- **Users**: Authentication with username/password (bcrypt hashing)
- **Datasets**: Stores parsed data as JSONB, metadata (row count, file size, columns), and timestamps
- **Visualizations**: Chart configurations linked to datasets (chart type, config object)
- **Insights**: AI-generated insights with confidence scores tied to datasets
- **Shares**: Share tokens with optional password protection and download permissions

**Database Design Decisions**
- PostgreSQL chosen for JSONB support (flexible schema for varying dataset structures)
- UUID primary keys using `gen_random_uuid()` for security and distribution
- JSONB columns for flexible data and configuration storage
- Text arrays for column name storage
- Drizzle schema uses Zod for runtime validation

### Authentication & Security

**Current Implementation**
- Session-based authentication (infrastructure present but routes not fully implemented)
- Password hashing using bcryptjs (10 rounds default)
- Session storage configured with connect-pg-simple for PostgreSQL-backed sessions

**Security Considerations**
- Raw body preservation for webhook verification potential
- CORS configuration managed through Vite dev server
- File upload validation (CSV/JSON type checking, size limits, content validation)

## External Dependencies

### AI Integration

**OpenAI API**
- GPT-5 model (latest as of August 2025) for dataset analysis and natural language querying
- Two primary functions:
  - `analyzeDataset()`: Generates insights, identifies trends, correlations, and anomalies
  - `answerDataQuery()`: Natural language question answering over datasets
- API key required via `OPENAI_API_KEY` environment variable
- JSON-structured responses for predictable parsing

### Database

**Neon Serverless PostgreSQL**
- `@neondatabase/serverless` driver for edge-compatible database access
- Connection via `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations (output to `./migrations` directory)

### Third-Party UI Libraries

**Radix UI Primitives** (Complete suite)
- Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
- Navigation Menu, Popover, Progress, Radio Group, Select, Slider
- Switch, Tabs, Toast, Tooltip, and more
- Provides accessible, unstyled components as foundation

**Additional UI Dependencies**
- Recharts: Declarative charting library for data visualizations (Line, Bar, Pie charts)
- React Hook Form + Zod Resolvers: Form management with schema validation
- class-variance-authority (CVA): Component variant management
- cmdk: Command palette component
- Lucide React: Icon library

### Development Tools

**Replit Integration**
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Code navigation enhancement
- `@replit/vite-plugin-dev-banner`: Development environment indicator

**Build & Bundling**
- esbuild: Server-side code bundling for production
- TypeScript compiler for type checking (noEmit mode)
- PostCSS with Tailwind CSS and Autoprefixer

### File Processing

- **Multer**: Multipart/form-data handling for file uploads
- **PapaParse**: CSV parsing with automatic header detection and type inference

### Fonts

- Google Fonts CDN: Inter (primary UI), JetBrains Mono (data/code), DM Sans, Fira Code, Geist Mono, Architects Daughter
- Preconnect optimization for fonts.googleapis.com and fonts.gstatic.com