import { createRouteHandler } from "@/query/core/createRouteHandler";
import { listTagPerformance } from "@/query/analytics/listTagPerformance/handler";
import { listTagPerformanceSchema } from "@/query/analytics/listTagPerformance/schema";
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
  const limit = searchParams.get("limit") || undefined;
  const cursor = searchParams.get("cursor") || undefined;

  const parsed = listTagPerformanceSchema.safeParse({
    startDate,
    endDate,
    limit,
    cursor,
  });
  if (!parsed.success) throw new BadRequestError("Invalid params");

  return await listTagPerformance(parsed.data);
}

export const GET = createRouteHandler(getHandler);
