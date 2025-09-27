# Multi-stage Dockerfile for Parscade Frontend
# Optimized for build reliability and caching with pnpm

# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy package manifests first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Declare build arguments for Vite environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_URL=http://localhost:3001
ARG VITE_API_TIMEOUT=30000
ARG VITE_ENABLE_ANALYTICS=true
ARG VITE_ENABLE_WEBHOOKS=true
ARG VITE_ENABLE_AI_FEATURES=false
ARG NODE_ENV=production

# Set environment variables from build arguments
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_TIMEOUT=${VITE_API_TIMEOUT}
ENV VITE_ENABLE_ANALYTICS=${VITE_ENABLE_ANALYTICS}
ENV VITE_ENABLE_WEBHOOKS=${VITE_ENABLE_WEBHOOKS}
ENV VITE_ENABLE_AI_FEATURES=${VITE_ENABLE_AI_FEATURES}
ENV NODE_ENV=${NODE_ENV}


RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]