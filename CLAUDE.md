# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

**Development:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

**Code Quality:**
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Check Prettier formatting
- `npm run format:fix` - Fix Prettier formatting automatically
- `npm run typecheck` - Run TypeScript type checking

**Testing:**
- `npm run test` - Run Vitest tests
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once without watch mode

**Security:**
- `npm run security:audit` - Run npm security audit

## Architecture Overview

### Project Structure
```
src/
├── app/                     # App-level configuration and providers
│   ├── config/             # Environment and route configuration
│   └── providers/          # React Query and other global providers
├── features/               # Feature-based architecture
│   ├── auth/              # Authentication (login, signup, password reset)
│   ├── dashboard/         # Main dashboard with documents, jobs, projects
│   ├── account/           # User account settings and profile
│   ├── marketing/         # Public marketing pages
│   └── jobs/              # Job processing and details
├── shared/                # Shared components and utilities
│   ├── components/        # Reusable UI components
│   ├── design/           # Design system and theme configuration
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Shared services (logging, etc.)
│   └── utils/            # Utility functions
└── lib/                  # External library configurations
    ├── api/              # API client and modules
    ├── supabase.ts       # Supabase client configuration
    └── validation/       # Zod validation schemas
```

### Key Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + useReducer for auth, React Query for server state
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Testing**: Vitest + jsdom

### Feature-Based Architecture
The project uses a feature-based architecture where each domain (auth, dashboard, account, etc.) is self-contained:

- **Components**: Feature-specific UI components
- **Hooks**: Custom hooks for feature logic
- **Pages**: Route components for the feature
- **Services**: API calls and business logic
- **Types**: TypeScript definitions for the feature

### Design System
The project has a comprehensive design system in `src/shared/design/theme.ts`:
- **Colors**: Professional blue-based palette with refined gradients
- **Typography**: Inter font with consistent scale
- **Components**: Parscade-branded components (ParscadeButton, ParscadeCard, ParscadeStatusBadge)
- **Animations**: Subtle, professional animations with custom easing
- **Feature Gates**: Role/tier-based access control system

### Authentication Flow
- **Provider**: AuthProvider using React Context and useReducer
- **Multi-domain support**: Works on any domain without code changes
- **Hard logout**: Enterprise-grade session termination with cross-tab sync
- **Password reset**: Dedicated routes with auto-login handling
- **Email confirmation**: Resend confirmation emails

### API Architecture
- **Modular API**: Organized by feature in `src/lib/api/modules/`
- **Error handling**: Centralized error handling with user-friendly messages
- **Type safety**: Full TypeScript integration with Supabase types

### Responsive Design
- **Mobile-first**: Tailwind CSS mobile-first approach
- **Component variants**: Different layouts for mobile vs desktop
- **Flexible navigation**: Responsive header and sidebar

## Development Guidelines

### Import Organization
Follow the ESLint import order:
1. Built-in modules
2. External packages
3. Internal modules (using @ aliases)
4. Type imports (use `type` imports)

### Path Aliases
Use configured aliases for clean imports:
- `@/` - src root
- `@/app` - App configuration
- `@/shared` - Shared components and utilities
- `@/features` - Feature modules
- `@/lib` - Library configurations

### Component Patterns
- Use the Parscade design system components
- Follow atomic design principles (atoms, molecules, organisms)
- Implement proper error boundaries
- Use React.memo for expensive components
- Include proper TypeScript types

### State Management
- **Server state**: Use React Query (TanStack Query)
- **Auth state**: Use AuthContext
- **Local component state**: Use useState/useReducer
- **Shared UI state**: Use React Context sparingly

### Error Handling
- Use error boundaries for component errors
- Implement proper loading states
- Provide user-friendly error messages
- Log errors using the centralized logger

### Feature Development
When adding new features:
1. Create feature module in `src/features/[name]/`
2. Add navigation entry to `navigationStructure` in theme.ts
3. Implement access control using FeatureGate if needed
4. Follow existing patterns for API integration
5. Add appropriate error handling and loading states

### Code Quality Standards
- Run `npm run typecheck` before committing
- Use `npm run lint:fix` to fix linting issues
- Format code with `npm run format:fix`
- Write tests for business logic
- Follow the existing naming conventions

### Multi-Domain Deployment
The application is designed to work on any domain:
- No hardcoded domain restrictions
- Supabase handles CORS and domain validation
- Configure redirect URLs in Supabase dashboard for each domain
- Environment variables adapt automatically

### Testing Strategy
- Unit tests for business logic and utilities
- Component testing with Vitest and jsdom
- Test setup configured in `src/test/setup.ts`
- Run tests with `npm run test`