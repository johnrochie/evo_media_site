# evomedia-siteanalyser — the existing SiteAnalyser Express app + batch runner.
#
# Long-running service: serves the dashboard + on-demand /api/* endpoints on
# port 4005. The scheduler also runs the batch CLI as a one-shot container off
# this same image (`docker compose run --rm evomedia-siteanalyser node
# scripts/analyse-batch.js ...`).
#
# Build context is the repo root (see docker/docker-compose.yml).

FROM node:22-bookworm-slim

WORKDIR /app

# chromium for the optional --render path (renderer.js, off by default).
# Puppeteer's own download is skipped — it uses the distro chromium.
RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium fonts-liberation ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && mkdir -p /data && chown node:node /data

ENV NODE_ENV=production \
    PORT=4005 \
    PUPPETEER_SKIP_DOWNLOAD=1 \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY website-upgrade-scanner-export/package.json website-upgrade-scanner-export/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

COPY website-upgrade-scanner-export/ ./
RUN chown -R node:node /app

USER node
EXPOSE 4005
CMD ["node", "server.js"]
