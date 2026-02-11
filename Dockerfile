# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Accept build-time env vars (Vite inlines VITE_* at build time)
ARG VITE_ENV=production
ARG VITE_APP_ID=3018
ARG VITE_CLIENT_ID=cm-sunglasssis-web
ARG VITE_BASE_URL=/
ARG VITE_APP_HOST
ARG VITE_AUTH_HOST=https://development-auth.cmoney.tw
ARG GEMINI_API_KEY

# Write a .env file so Vite picks up the values
RUN printf "VITE_ENV=%s\nVITE_APP_ID=%s\nVITE_CLIENT_ID=%s\nVITE_BASE_URL=%s\nVITE_APP_HOST=%s\nVITE_AUTH_HOST=%s\nGEMINI_API_KEY=%s\n" \
    "$VITE_ENV" "$VITE_APP_ID" "$VITE_CLIENT_ID" "$VITE_BASE_URL" "$VITE_APP_HOST" "$VITE_AUTH_HOST" "$GEMINI_API_KEY" \
    > .env

RUN npm run build

# ---- Production stage ----
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run sets PORT env var (default 8080)
ENV PORT=8080
EXPOSE 8080

# nginx docker image uses envsubst on templates in /etc/nginx/templates/
# and outputs to /etc/nginx/conf.d/ on startup, replacing ${PORT} automatically
CMD ["nginx", "-g", "daemon off;"]
