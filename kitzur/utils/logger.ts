/**
 * Logger Utility
 * Provides safe logging that only outputs in development mode
 * Use this instead of console.log to keep production builds clean
 */

// Check if we're in development mode
// __DEV__ is available in React Native at runtime
// For TypeScript, we check NODE_ENV as well
const isDevelopment = 
  process.env.NODE_ENV === 'development' ||
  (typeof (global as any).__DEV__ !== 'undefined' && (global as any).__DEV__);

export const logger = {
  /**
   * Debug logs - only shown in development
   * Use for temporary debugging or development info
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Info logs - only shown in development
   * Use for general information
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Warning logs - shown in all environments
   * Use for non-critical issues that should be investigated
   */
  warn: (...args: any[]) => {
    console.warn(...args);
  },

  /**
   * Error logs - shown in all environments
   * Use for errors that need immediate attention
   */
  error: (...args: any[]) => {
    console.error(...args);
  },
};
