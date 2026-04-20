# Stage 1: Build stage
FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production stage
FROM node:22-alpine

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files
COPY --from=base /app/dist ./dist

# Expose your port (change if needed)
EXPOSE 2000

# Start app
CMD ["node", "dist/presentation/express/settings/index.js"]