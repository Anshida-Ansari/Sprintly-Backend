# ─── Stage 1: Builder ─────────────────────────────────────────────
FROM node:22 AS builder

WORKDIR /app

# Copy dependency files first
COPY package*.json ./
RUN npm ci

# Copy full source code
COPY . .

# Build TypeScript with more memory
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────
FROM node:22-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs
USER appuser

EXPOSE 2000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:2000/health || exit 1

CMD ["node", "dist/presentation/express/settings/index.js"]