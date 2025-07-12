import { createRouteHandler } from "@/query/core/createRouteHandler";
import { logEventSchema } from "@/query/analytics/logEvent/schema";
import { logEvent } from "@/query/analytics/logEvent/handler";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { NextRequest } from "next/server";
import { waitUntil } from "@vercel/functions";

/**
 * This is the analytics route where we collect events. To avoid ad blockers,
 * it's named `api/session` to be neutral and not be targeted by specific keywords
 * on the URL.
 */

async function postHandler(req: NextRequest) {
  const body = await req.json();
  const parsed = logEventSchema.safeParse(body);

  if (!parsed.success) throw new BadRequestError("Invalid event data");

  waitUntil(logEvent(parsed.data));

  // `navigator.beacon` expects a 204 No Content
  return new Response(null, { status: 204 });
}

export const POST = createRouteHandler(postHandler);
