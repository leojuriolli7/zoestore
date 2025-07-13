import { createRouteHandler } from "@/query/core/createRouteHandler";
import { getAnalyticsSummary } from "@/query/analytics/getAnalyticsSummary/handler";
import { getAnalyticsSummarySchema } from "@/query/analytics/getAnalyticsSummary/schema";
import { NextRequest } from "next/server";
import { checkAdminKey } from "@/query/core/checkAdminKey";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { BadRequestError } from "@/query/errors/BadRequestError";

async function getHandler(req: NextRequest) {
  const { isAdmin } = await checkAdminKey();
  if (!isAdmin) throw new UnauthorizedError();

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") || undefined;
  const endDate = searchParams.get("endDate") || undefined;

  const parsed = getAnalyticsSummarySchema.safeParse({ startDate, endDate });
  if (!parsed.success) throw new BadRequestError("Invalid params");

  return await getAnalyticsSummary(parsed.data);
}

export const GET = createRouteHandler(getHandler);
