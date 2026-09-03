#!/bin/sh
# evomedia-scheduler entrypoint: install the crontab from $SCHEDULE and run cron
# in the foreground. Job output is redirected to PID 1 so `docker compose logs
# evomedia-scheduler` shows every run; the full log is also kept at $RUN_LOG.
set -e

SCHEDULE="${SCHEDULE:-0 * * * *}"
RUN_LOG="${RUN_LOG:-/state/pipeline-runs.log}"
mkdir -p "$(dirname "$RUN_LOG")" /etc/crontabs

echo "evomedia-scheduler: schedule='${SCHEDULE}'  tz='${TZ:-UTC}'  log='${RUN_LOG}'"

# quick sanity check that we can reach the host Docker
if ! docker version >/dev/null 2>&1; then
  echo "WARNING: cannot talk to Docker via /var/run/docker.sock — pipeline runs will fail." >&2
fi

# busybox crontab line: "<schedule> <command>"; send job output to the container log
printf '%s /usr/local/bin/run-pipeline.sh >> /proc/1/fd/1 2>&1\n' "$SCHEDULE" > /etc/crontabs/root

if [ "${RUN_ON_START:-0}" = "1" ]; then
  echo "evomedia-scheduler: RUN_ON_START=1 — starting one run now"
  /usr/local/bin/run-pipeline.sh >> /proc/1/fd/1 2>&1 || \
    echo "evomedia-scheduler: initial run exited non-zero (see log)"
fi

exec crond -f -l 8
