# Parscade

Enterprise-grade document processing platform with intelligent parsing capabilities.

## 🌐 Multi-Domain Support

This application is designed to work seamlessly on **any domain or subdomain** without restrictions:

- ✅ Local development (`localhost`, `127.0.0.1`, `.local` domains)
- ✅ Staging environments (`staging.domain.com`, `preview-*.netlify.app`)
- ✅ Production domains (`parscade.com`, `app.parscade.com`, custom domains)
- ✅ Enterprise deployments on private domains

**Security**: All domain flexibility is implemented with enterprise-grade security measures - no wildcards, no security holes.

## Features

- **Secure Authentication**: Enterprise-grade auth with password reset flow
- **Document Processing**: AI-powered document parsing and data extraction
- **Real-time Dashboard**: Monitor processing workflows and analytics
- **Team Management**: Account settings and team collaboration tools
- **API Integration**: RESTful APIs and webhook support

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Environment variables configured

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ANALYTICS_KEY=your-analytics-key (optional)
```

### Multi-Domain Configuration

To deploy on multiple domains, configure your Supabase project:

1. **Supabase Dashboard → Authentication → URL Configuration**:

   ```
   Site URL: https://your-primary-domain.com
   Additional Redirect URLs:
   - https://staging.your-domain.com/*
   - https://your-custom-domain.com/*
   - http://localhost:3000/* (for development)
   ```

2. **No code changes required** - the app automatically adapts to any domain

### Development

```bash
npm run dev
```

The development server works on any local address:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://your-ip:5173`
- `http://myapp.local:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Password Reset Configuration

### Supabase Setup

1. **Authentication Settings**:
   - Site URL: `https://your-primary-domain.com`
   - Redirect URLs: Add all domains where your app will be hosted:
     ```
     https://your-domain.com/reset-password
     https://your-domain.com/auth/recovery
     https://staging.your-domain.com/reset-password
     https://staging.your-domain.com/auth/recovery
     https://app.your-domain.com/reset-password
     https://app.your-domain.com/auth/recovery
     http://localhost:3000/reset-password (for development)
     http://localhost:3000/auth/recovery (for development)
     ```

2. **Email Template** (Authentication → Email Templates → Reset Password):

   ```html
   <a href="{{ .ConfirmationURL }}">Reset Your Password</a>
   ```

3. **SMTP Configuration** (recommended for production):
   - Configure custom SMTP provider
   - Test email delivery

### Recovery Flow Features

- **Dedicated recovery routes**: `/reset-password` and `/auth/recovery`
- **Dashboard redirect prevention**: Never redirects to dashboard during password reset
- **Auto-login handling**: Gracefully handles Supabase auto-login from email links
- **Secure completion**: Forces fresh authentication with new password
- **Success messaging**: Clear confirmation and next steps

### Security Features

- Rate limiting (3 attempts per 15 minutes)
- Enterprise password requirements (8+ chars, mixed case, numbers, symbols)
- Session validation and token verification
- Secure redirect handling
- Recovery mode navigation blocking
- **Domain-agnostic security**: Works securely on any configured domain

## Deployment

### Any Domain Deployment

The application works on any domain without code changes:

1. **Deploy your built application** to any hosting provider
2. **Configure Supabase** with your domain in redirect URLs
3. **Set environment variables** for your domain
4. **Test the deployment** - everything should work automatically

### Docker

```bash
docker build -t parscade .
docker run -p 80:80 parscade
```

### Environment Variables for Build

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=your-url \
  --build-arg VITE_SUPABASE_ANON_KEY=your-key \
  -t parscade .
```

### Multi-Environment Deployment

Deploy the same codebase to multiple environments:

```bash
# Staging
VITE_SUPABASE_URL=staging-url npm run build

# Production
VITE_SUPABASE_URL=production-url npm run build

# Custom Domain
VITE_SUPABASE_URL=custom-url npm run build
```

## Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **State Management**: React Context + Reducers
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Validation**: Zod schemas
- **Logging**: Pino with Elasticsearch transport
- **Multi-Domain**: Dynamic origin detection with security preservation

## Security

- Input validation with Zod schemas
- CSRF protection on forms
- Secure session management
- Rate limiting on sensitive operations
- Enterprise password requirements (8+ character minimum)
- Comprehensive error handling without data leakage
- **Domain-flexible security**: Secure on any domain without hardcoded restrictions

## Hard Logout & Session Sanitization

This application implements enterprise-grade "hard logout" functionality that ensures complete session termination:

### Features

- **Global Token Revocation**: Uses `supabase.auth.signOut({ scope: 'global' })` to invalidate all sessions
- **Complete Storage Purge**: Clears localStorage, sessionStorage, cookies, and IndexedDB
- **Cross-Tab Synchronization**: Broadcasts logout events to all open tabs
- **Cache Prevention**: Sets `Clear-Site-Data` headers to prevent cached page restoration
- **Realtime Connection Cleanup**: Closes all Supabase realtime channels
- **Route Protection**: Protected routes include `Cache-Control: no-store` headers

### Security Guarantees

After logout, users are guaranteed to be signed out with:

- ✅ No silent re-login possible
- ✅ All tabs logged out simultaneously
- ✅ Page refresh keeps user logged out
- ✅ Back button doesn't show cached content
- ✅ All client-side auth data purged
- ✅ Server-side tokens revoked globally

### Implementation

```typescript
import { performHardLogout } from './utils/hardLogout';

// Trigger complete logout
await performHardLogout();
```

The system automatically handles cross-tab synchronization and server-side cleanup through the `/auth/logout` endpoint.

## Support

- Email: admin@parscade.com
- Documentation: Available in codebase
- Issues: Contact support team

## License

Proprietary - All rights reserved
