# Multi-stage Dockerfile for Parscade Frontend
# Optimized for build reliability and caching

# Build stage
FROM node:20-alpine as builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Clean install with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --loglevel=error

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

# Clear any existing cache and build
RUN rm -rf dist node_modules/.vite node_modules/.cache && \
    npm run build:prod

# Verify build output
RUN ls -la dist && \
    if [ ! -f dist/index.html ]; then \
        echo "Build failed: dist/index.html not found" && exit 1; \
    fi

# Production stage
FROM nginx:alpine

# Install runtime dependencies
RUN apk add --no-cache curl

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create healthcheck script
RUN echo '#!/bin/sh' > /healthcheck.sh && \
    echo 'curl -f http://localhost/health || exit 1' >> /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD /healthcheck.sh

# Create a non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -u 1001 -S nginx -G nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]