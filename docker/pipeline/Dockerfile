# evomedia-pipeline — one-shot job image.
#
# Bundles two pipeline steps as invokable scripts (NOT a standing service):
#   - search + filter :  node scripts/lead-discovery/run.mjs ...
#   - CRM write       :  node scripts/lead-crm/sync-to-notion.mjs ...
#
# The scheduler runs these via `docker compose run --rm evomedia-pipeline <cmd>`,
# so the container starts, runs one step and exits.
#
# Build context is the repo root (see docker/docker-compose.yml).

FROM node:22-bookworm-slim

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    NODE_ENV=production

WORKDIR /app

# Only playwright is a real dependency here — the search script uses playwright +
# Node built-ins, the CRM script uses Node built-ins + global fetch only.
COPY docker/pipeline/package.json ./package.json
RUN npm install --no-audit --no-fund --omit=dev \
 && npx playwright install --with-deps chromium \
 && mkdir -p /data \
 && chown -R node:node /app /data /ms-playwright

COPY --chown=node:node scripts/ ./scripts/

USER node

# No long-running CMD — this image is invoked per job step.
ENTRYPOINT []
CMD ["node", "-e", "console.log('evomedia-pipeline: invoke a step, e.g. node scripts/lead-discovery/run.mjs --help')"]
