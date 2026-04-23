# ─── Stage 1: Builder ─────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Use cache mount for faster npm install
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy full source code
COPY . .

# Build TypeScript with more memory
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────
FROM node:22-alpine AS production

# Set production environment
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

# Install production dependencies only with cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Create logs directory with correct permissions
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs

USER appuser

EXPOSE 2000

# Use node itself for healthcheck to avoid dependency on wget/curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:2000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "dist/presentation/express/settings/index.js"]