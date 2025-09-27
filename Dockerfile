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

RUN pnpm run build

# Production stage
FROM nginx:alpine

ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_URL
ARG VITE_API_BASE_URL
ARG VITE_PORT
ARG VITE_WORKER_BASE_URL
ARG VITE_ENABLE_ANALYTICS
ARG VITE_ENABLE_WEBHOOKS
ARG VITE_ENABLE_AI_FEATURES
ARG NODE_ENV
ARG ENABLE_BILLING

# Make them available to the Vite build as environment variables
# (Vite reads only variables starting with VITE_ during build)
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_PORT=$VITE_PORT \
    VITE_WORKER_BASE_URL=$VITE_WORKER_BASE_URL \
    VITE_ENABLE_ANALYTICS=$VITE_ENABLE_ANALYTICS \
    VITE_ENABLE_WEBHOOKS=$VITE_ENABLE_WEBHOOKS \
    VITE_ENABLE_AI_FEATURES=$VITE_ENABLE_AI_FEATURES \
    NODE_ENV=$NODE_ENV \
    ENABLE_BILLING=$ENABLE_BILLING

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]