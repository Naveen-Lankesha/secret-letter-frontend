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
ENV VITE_API_BASE_URL=/api
ENV VITE_DEV_PORT=3000
ENV VITE_DEV_PROXY_TARGET=http://localhost:5000
ENV PORT=8080
ENV BACKEND_URL=http://secret-letter-backend:5000

COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs

EXPOSE 8080
CMD ["server.mjs"]
