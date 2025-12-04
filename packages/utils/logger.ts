import {isDevMode} from '../firebase/emulator-utils';

/**
 * Logger utility that only logs in dev mode (localhost or lyrist-dev)
 *
 * Usage:
 *   import {logger} from '../utils/logger';
 *   logger.log('[MyComponent]', 'some message', data);
 *   logger.error('[MyComponent]', 'error message', error);
 *   logger.warn('[MyComponent]', 'warning message');
 */

type LogFn = (...args: any[]) => void;

interface Logger {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
  info: LogFn;
  debug: LogFn;
}

// Cache the dev mode check (it won't change during runtime)
let _isDevMode: boolean | null = null;

const checkDevMode = (): boolean => {
  if (_isDevMode === null) {
    _isDevMode = isDevMode();
  }
  return _isDevMode;
};

const noop: LogFn = () => {};

export const logger: Logger = {
  log: (...args) => {
    if (checkDevMode()) console.log(...args);
  },
  warn: (...args) => {
    if (checkDevMode()) console.warn(...args);
  },
  info: (...args) => {
    if (checkDevMode()) console.info(...args);
  },
  debug: (...args) => {
    if (checkDevMode()) console.debug(...args);
  },
  // Always log errors regardless of environment
  error: (...args) => {
    console.error(...args);
  },
};

/**
 * Create a prefixed logger for a specific module
 *
 * Usage:
 *   const log = createLogger('[useSave]');
 *   log('some message'); // logs: [useSave] some message
 *   log.error('failed'); // logs: [useSave] failed
 */
export function createLogger(prefix: string) {
  const prefixedLog = Object.assign((...args: any[]) => logger.log(prefix, ...args), {
    warn: (...args: any[]) => logger.warn(prefix, ...args),
    error: (...args: any[]) => logger.error(prefix, ...args),
    info: (...args: any[]) => logger.info(prefix, ...args),
    debug: (...args: any[]) => logger.debug(prefix, ...args),
  });
  return prefixedLog;
}
