import { v4 as uuidv4 } from "uuid";
import type { LogEventSchema } from "@/query/analytics/logEvent/schema";

const SESSION_STORAGE_KEY = "zoe_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
}

export function logEvent(event: Omit<LogEventSchema, "sessionId">) {
  const eventData: LogEventSchema = {
    ...event,
    sessionId: getSessionId(),
  };

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/session", JSON.stringify(eventData));
  }
}
