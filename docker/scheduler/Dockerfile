# evomedia-scheduler — thin cron container.
#
# On the configured interval it triggers the three-step pipeline sequence by
# shelling out to `docker compose run` against the other services. No business
# logic lives here — see docker/scheduler/run-pipeline.sh.
#
# Needs the host Docker socket mounted (it drives `docker compose`).

FROM docker:29-cli

RUN apk add --no-cache bash coreutils jq curl tzdata docker-cli-compose \
 && mkdir -p /state

COPY docker/scheduler/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/scheduler/run-pipeline.sh /usr/local/bin/run-pipeline.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/run-pipeline.sh

ENV COMPOSE_FILE=/compose/docker-compose.yml \
    COMPOSE_PROJECT_NAME=evomedia \
    PIPELINE_CONFIG=/config/pipeline.config.json \
    RUN_LOG=/state/pipeline-runs.log \
    SCHEDULE="0 * * * *" \
    RUN_ON_START=0 \
    TZ=UTC

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
