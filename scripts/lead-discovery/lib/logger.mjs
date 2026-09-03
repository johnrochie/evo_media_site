/**
 * Tiny leveled logger for the lead-discovery scripts.
 *
 * Level comes from (highest priority first):
 *   - setLevel() called by the CLI (--verbose)
 *   - LEAD_LOG_LEVEL env var  (error | warn | info | debug)
 *   - default: info
 */

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

let current = LEVELS[process.env.LEAD_LOG_LEVEL] ?? LEVELS.info;

export function setLevel(name) {
  if (LEVELS[name] != null) current = LEVELS[name];
}

export function isDebug() {
  return current >= LEVELS.debug;
}

const stamp = () => new Date().toISOString().slice(11, 19);

function emit(level, consoleFn, icon, args) {
  if (LEVELS[level] <= current) consoleFn(`${stamp()} ${icon}`, ...args);
}

export const log = {
  error: (...a) => emit("error", console.error, "✗", a),
  warn: (...a) => emit("warn", console.warn, "!", a),
  info: (...a) => emit("info", console.log, "·", a),
  debug: (...a) => emit("debug", console.log, "  ·", a),
  step: (...a) => {
    if (LEVELS.info <= current) console.log(`\n${stamp()} ▸`, ...a);
  },
};
