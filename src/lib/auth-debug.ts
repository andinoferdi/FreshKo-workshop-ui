// Authentication Debug Utility
// This utility helps monitor and debug the Google OAuth + FreshKo store integration

interface AuthDebugLog {
  timestamp: number;
  source: string;
  event: string;
  data: any;
  level: "info" | "warning" | "error" | "success";
}

class AuthDebugger {
  private logs: AuthDebugLog[] = [];
  private maxLogs = 100;

  log(
    source: string,
    event: string,
    data: any,
    level: AuthDebugLog["level"] = "info"
  ) {
    const logEntry: AuthDebugLog = {
      timestamp: Date.now(),
      source,
      event,
      data,
      level,
    };

    this.logs.unshift(logEntry);

    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output with emoji indicators
    const emoji = {
      info: "ℹ️",
      warning: "⚠️",
      error: "❌",
      success: "✅",
    };

    console.log(`${emoji[level]} [${source}] ${event}:`, data);

    // Store in sessionStorage for persistence across page loads
    if (typeof window !== "undefined") {
      sessionStorage.setItem("freshko-auth-debug", JSON.stringify(this.logs));
    }
  }

  getLogs(source?: string): AuthDebugLog[] {
    if (source) {
      return this.logs.filter((log) => log.source === source);
    }
    return this.logs;
  }

  getLatestLog(source?: string): AuthDebugLog | null {
    const logs = this.getLogs(source);
    return logs.length > 0 ? logs[0] : null;
  }

  clearLogs() {
    this.logs = [];
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("freshko-auth-debug");
    }
  }

  // Load logs from sessionStorage on initialization
  loadStoredLogs() {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("freshko-auth-debug");
      if (stored) {
        try {
          this.logs = JSON.parse(stored);
        } catch (error) {
          console.warn("Failed to load stored auth debug logs:", error);
        }
      }
    }
  }

  // Generate a summary report
  getSummary(): {
    totalLogs: number;
    bySource: Record<string, number>;
    byLevel: Record<string, number>;
    recentErrors: AuthDebugLog[];
  } {
    const bySource: Record<string, number> = {};
    const byLevel: Record<string, number> = {};

    this.logs.forEach((log) => {
      bySource[log.source] = (bySource[log.source] || 0) + 1;
      byLevel[log.level] = (byLevel[log.level] || 0) + 1;
    });

    const recentErrors = this.logs
      .filter((log) => log.level === "error")
      .slice(0, 5);

    return {
      totalLogs: this.logs.length,
      bySource,
      byLevel,
      recentErrors,
    };
  }

  // Export logs for support/debugging
  exportLogs(): string {
    return JSON.stringify(
      {
        exported: new Date().toISOString(),
        logs: this.logs,
        summary: this.getSummary(),
      },
      null,
      2
    );
  }
}

// Create global instance
export const authDebugger = new AuthDebugger();

// Load stored logs on initialization
if (typeof window !== "undefined") {
  authDebugger.loadStoredLogs();
}

// Helper functions for common debugging scenarios
export const debugAuthFlow = {
  nextAuthSession: (status: string, session: any) => {
    authDebugger.log(
      "NextAuth",
      "Session Status Change",
      { status, session },
      status === "authenticated" ? "success" : "info"
    );
  },

  freshkoStore: (isAuthenticated: boolean, user: any) => {
    authDebugger.log(
      "FreshKo Store",
      "Auth State",
      { isAuthenticated, user },
      isAuthenticated ? "success" : "info"
    );
  },

  googleSync: (action: string, data: any, success: boolean = true) => {
    authDebugger.log(
      "Google Sync",
      action,
      data,
      success ? "success" : "error"
    );
  },

  storageOperation: (operation: string, data: any, success: boolean = true) => {
    authDebugger.log("Storage", operation, data, success ? "success" : "error");
  },

  error: (source: string, error: any) => {
    authDebugger.log(source, "Error", error, "error");
  },
};

// Expose debugger to window for manual debugging in console
if (typeof window !== "undefined") {
  (window as any).freshkoAuthDebugger = authDebugger;
  (window as any).debugAuthFlow = debugAuthFlow;
}
