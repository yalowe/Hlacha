/**
 * Performance Monitoring Utility
 * Tracks app performance metrics in development
 */

type PerformanceMetric = {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
};

const metrics: PerformanceMetric[] = [];
const activeTimers: Map<string, number> = new Map();

export const Performance = {
  /**
   * Start timing an operation
   */
  start(name: string): void {
    if (__DEV__) {
      activeTimers.set(name, Date.now());
    }
  },

  /**
   * End timing and log the result
   */
  end(name: string): number | undefined {
    if (!__DEV__) return undefined;

    const startTime = activeTimers.get(name);
    if (!startTime) {
      console.warn(`⚠️ Performance: No start time found for "${name}"`);
      return undefined;
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    
    metrics.push({
      name,
      startTime,
      endTime,
      duration,
    });

    activeTimers.delete(name);

    // Log if operation took longer than 1 second
    if (duration > 1000) {
      console.warn(`⚠️ Slow operation: ${name} took ${duration}ms`);
    } else if (duration > 100) {
      console.log(`⏱️  ${name}: ${duration}ms`);
    }

    return duration;
  },

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...metrics];
  },

  /**
   * Clear all metrics
   */
  clear(): void {
    metrics.length = 0;
    activeTimers.clear();
  },

  /**
   * Get summary statistics
   */
  getSummary(): Record<string, { count: number; avgDuration: number; maxDuration: number }> {
    const summary: Record<string, { count: number; total: number; max: number }> = {};

    metrics.forEach(metric => {
      if (!metric.duration) return;

      if (!summary[metric.name]) {
        summary[metric.name] = { count: 0, total: 0, max: 0 };
      }

      summary[metric.name].count++;
      summary[metric.name].total += metric.duration;
      summary[metric.name].max = Math.max(summary[metric.name].max, metric.duration);
    });

    const result: Record<string, { count: number; avgDuration: number; maxDuration: number }> = {};
    Object.entries(summary).forEach(([name, stats]) => {
      result[name] = {
        count: stats.count,
        avgDuration: Math.round(stats.total / stats.count),
        maxDuration: stats.max,
      };
    });

    return result;
  },
};

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  Performance.start(name);
  try {
    return await fn();
  } finally {
    Performance.end(name);
  }
}

/**
 * Measure sync function execution time
 */
export function measure<T>(name: string, fn: () => T): T {
  Performance.start(name);
  try {
    return fn();
  } finally {
    Performance.end(name);
  }
}
