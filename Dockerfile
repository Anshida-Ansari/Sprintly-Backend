# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install ALL dependencies (including devDeps needed by tsc & tsc-alias)
COPY package*.json ./
RUN npm ci

# Copy source and config files needed for the build
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript → JS (runs tsc then tsc-alias for path resolution)
RUN npm run build

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:22-alpine AS production

# Add a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Use the non-root user
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs
USER appuser

# Expose the application port
EXPOSE 2000

# Healthcheck — verifies the API is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:2000/health || exit 1

# Start the compiled application
CMD ["node", "dist/presentation/express/settings/index.js"]