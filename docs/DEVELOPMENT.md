# Parscade Frontend Development Guide

This document provides comprehensive guidance for developing and maintaining the Parscade React frontend application.

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + useReducer (auth), React Query (server state)
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Testing**: Vitest + jsdom
- **API Client**: Enterprise-grade Fetch wrapper with retry logic

### Project Structure
```
src/
├── app/                     # App-level configuration
│   ├── config/             # Environment and route configuration
│   └── providers/          # React Query and global providers
├── features/               # Feature-based architecture
│   ├── auth/              # Authentication flows
│   ├── dashboard/         # Main dashboard functionality
│   ├── account/           # User account management
│   ├── marketing/         # Public marketing pages
│   └── jobs/              # Job processing workflows
├── shared/                # Shared components and utilities
│   ├── components/        # Reusable UI components
│   ├── design/           # Design system and themes
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Shared services (logging, etc.)
│   └── utils/            # Utility functions
├── lib/                  # External library configurations
│   ├── api/              # API client and modules
│   ├── validation/       # Zod validation schemas
│   └── supabase.ts       # Supabase client
└── types/                # TypeScript type definitions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Access to Supabase project
- Backend API running locally or staging environment

### Installation
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables
# Edit .env with your Supabase and API settings

# Start development server
npm run dev
```

### Common Development Commands
```bash
# Development
npm run dev                 # Start Vite dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Check Prettier formatting
npm run format:fix         # Fix Prettier formatting
npm run typecheck          # Run TypeScript checking

# Testing
npm run test               # Run Vitest tests
npm run test:ui            # Run tests with UI
npm run test:run           # Run tests once (CI mode)

# Security
npm run security:audit     # Run npm security audit
```

## 🔧 Development Tools

### Built-in Development Tools
The application includes several development tools available only in development mode:

#### API Inspector 🔍
- **Access**: Click the blue 🔍 button in bottom-right corner
- **Features**:
  - Real-time API call monitoring
  - Request/response inspection
  - Validation schema checking
  - Error tracking and debugging
  - Performance metrics for each call

#### Performance Monitor ⚡
- **Access**: Click the purple ⚡ button in bottom-right corner
- **Features**:
  - Core Web Vitals monitoring (LCP, FCP, CLS)
  - Runtime performance metrics
  - Memory usage tracking
  - Bundle size analysis
  - React component performance

### Development Mode Indicator
- Orange "DEV MODE" indicator appears in top-right corner
- Only visible in development environment
- Helps distinguish between development and production builds

## 📋 Coding Standards

### File Organization
- Use feature-based architecture
- Group related files in feature directories
- Keep shared utilities in `src/shared/`
- Place API logic in `src/lib/api/modules/`

### Naming Conventions
```typescript
// Components: PascalCase
export const UserProfile: React.FC = () => { };

// Hooks: camelCase starting with 'use'
export const useUserProfile = () => { };

// Constants: SCREAMING_SNAKE_CASE
export const API_ENDPOINTS = { };

// Types/Interfaces: PascalCase
export interface UserProfile { }

// Files: kebab-case
user-profile.tsx
use-user-profile.ts
```

### Import Organization
Follow ESLint import order:
```typescript
// 1. Built-in modules (none in frontend)
// 2. External packages
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 3. Internal modules (using @ aliases)
import { apiClient } from '@/lib/api';
import { UserProfile } from '@/types/api-types';

// 4. Type imports
import type { FC } from 'react';
```

### Component Patterns
```typescript
// Use memo for expensive components
export const ExpensiveComponent = React.memo<Props>(({ prop1, prop2 }) => {
  // Use callbacks for event handlers
  const handleClick = useCallback(() => {
    // handler logic
  }, [dependencies]);

  // Use useMemo for expensive calculations
  const expensiveValue = useMemo(() => {
    return calculateExpensiveValue(prop1);
  }, [prop1]);

  return <div onClick={handleClick}>{expensiveValue}</div>;
});
```

## 🔐 Security Best Practices

### Input Validation
- All forms use Zod validation schemas
- API requests are validated before sending
- User input is sanitized using DOMPurify
- File uploads are restricted by type and size

### API Security
- Bearer token authentication
- Automatic token refresh
- Request timeout and retry logic
- HTTPS enforcement (HTTP only for localhost)
- Rate limiting on client side

### Content Security
- XSS prevention through input sanitization
- No inline scripts or styles
- Secure headers for all API requests
- URL validation for external links

## 🧪 Testing Strategy

### Test Types
1. **Unit Tests**: Business logic and utilities
2. **Component Tests**: React component behavior
3. **Integration Tests**: API interactions
4. **E2E Tests**: User workflows (future enhancement)

### Testing Patterns
```typescript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserProfile user={user} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

## 🎨 Design System

### Theme Configuration
- Located in `src/shared/design/theme.ts`
- Professional blue-based color palette
- Inter font with consistent scale
- Custom Parscade-branded components

### Component Library
```typescript
// Use Parscade design system components
import { ParscadeButton, ParscadeCard, ParscadeStatusBadge } from '@/shared/design';

// Example usage
<ParscadeButton variant="primary" size="medium">
  Submit
</ParscadeButton>
```

### Animation Guidelines
- Use Framer Motion for complex animations
- Keep animations subtle and professional
- Use custom easing functions from theme
- Respect user's `prefers-reduced-motion` settings

## 🔌 API Integration

### API Client Usage
```typescript
import { documentsApi } from '@/lib/api';

// All API calls return typed responses
const documents = await documentsApi.listDocuments({
  page: 1,
  limit: 20,
  status: 'completed'
});
```

### Error Handling
```typescript
import { isApiError, getErrorMessage } from '@/lib/api';

try {
  await documentsApi.uploadDocument(file);
} catch (error) {
  if (isApiError(error)) {
    // Handle specific API errors
    console.log(error.code, error.statusCode);
  }

  // Get user-friendly error message
  const message = getErrorMessage(error);
  toast.error(message);
}
```

### Validation Schemas
- All API requests use Zod validation
- Schemas located in `src/lib/validation/`
- Runtime validation ensures type safety
- Automatic error handling for invalid data

## 🎯 Performance Optimization

### Bundle Optimization
- Feature-based code splitting
- Intelligent vendor chunking
- Dynamic imports for heavy components
- Tree shaking for unused code

### Runtime Performance
- React.memo for expensive components
- useCallback for event handlers
- useMemo for expensive calculations
- Virtualization for long lists

### Loading Strategies
- Progressive loading with preloading
- Skeleton screens for loading states
- Error boundaries for graceful failures
- Intelligent caching strategies

## 🔍 Debugging

### Development Tools
1. **React DevTools**: Component inspection and profiling
2. **API Inspector**: Built-in API call monitoring
3. **Performance Monitor**: Runtime performance metrics
4. **Browser DevTools**: Network, Console, and Performance tabs

### Logging
```typescript
import { logger } from '@/shared/services/logger';

// Structured logging with context
logger.info('User action completed', {
  context: { feature: 'documents', action: 'upload' },
  metadata: { fileSize: file.size, fileType: file.type }
});
```

### Error Tracking
- Centralized error boundaries
- Automatic error logging in development
- Context preservation for debugging
- User-friendly error messages

## 📊 Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- API response time tracking
- Memory usage analysis

### User Analytics
- Page view tracking
- User interaction events
- Error rate monitoring
- Feature usage analytics

## 🚢 Deployment

### Build Process
```bash
# Production build
npm run build

# Verify build output
npm run preview

# Type checking before deployment
npm run typecheck

# Lint checking
npm run lint
```

### Environment Configuration
- Development: `NODE_ENV=development`
- Staging: `NODE_ENV=production` + staging API
- Production: `NODE_ENV=production` + production API

### CI/CD Pipeline
1. Install dependencies
2. Run type checking
3. Run linting
4. Run tests
5. Build application
6. Deploy to target environment

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run typecheck
```

#### API Connection Issues
- Verify environment variables
- Check API endpoint availability
- Validate authentication tokens
- Review CORS configuration

#### Performance Issues
- Use Performance Monitor tool
- Check bundle size with `npm run build`
- Profile components with React DevTools
- Review network requests in browser

### Getting Help
1. Check this documentation first
2. Review existing code patterns
3. Use development tools for debugging
4. Consult team members for complex issues
5. Document solutions for future reference

## 🔄 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes following coding standards
3. Add tests for new functionality
4. Run quality checks locally
5. Submit pull request with clear description
6. Address review feedback
7. Merge after approval

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Components follow design system
- [ ] Error handling is implemented
- [ ] Tests cover new functionality
- [ ] Performance impact is minimal
- [ ] Accessibility standards are met
- [ ] Documentation is updated

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)

For project-specific questions, refer to the team documentation or reach out to the development team.