import { isAppDebugEnabled } from "@/config/env";

type LogContext = Record<string, string | number | boolean | null | undefined>;

function writeLog(level: "debug" | "info" | "warn" | "error", message: string, context?: LogContext) {
  if (level === "debug" && !isAppDebugEnabled()) {
    return;
  }

  const payload = context ? [message, context] : [message];
  console[level](...payload);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    writeLog("debug", message, context);
  },
  info(message: string, context?: LogContext) {
    writeLog("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    writeLog("warn", message, context);
  },
  error(message: string, context?: LogContext) {
    writeLog("error", message, context);
  }
};
