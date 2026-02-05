# syntax=docker/dockerfile:1

# --- deps ---
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Install dependencies using lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci

# --- build ---
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Vite app (outputs to /app/dist)
RUN npm run build

# --- runtime (distroless) ---
# Distroless Node image: no shell/package manager; runs Node as entrypoint.
FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs

EXPOSE 8080
CMD ["server.mjs"]
