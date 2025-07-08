import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import type { API } from "@/query/core/query";
import type { NextRequest } from "next/server";

export function createRouteHandler<T>(
  handler: (req: NextRequest) => Promise<T>
): (req: NextRequest) => Promise<API.Response<T>>;

export function createRouteHandler<T, P>(
  handler: (req: NextRequest, params: P) => Promise<T>
): (
  req: NextRequest,
  context: { params: Promise<P> }
) => Promise<API.Response<T>>;

export function createRouteHandler<T, P>(
  handler:
    | ((req: NextRequest) => Promise<T>)
    | ((req: NextRequest, params: P) => Promise<T>)
) {
  return async (
    req: NextRequest,
    context?: { params: Promise<P> }
  ): Promise<API.Response<T>> => {
    try {
      let resolvedParams: P | undefined = undefined;

      if (context?.params) resolvedParams = await context.params;

      const result = await handler(req, resolvedParams as P);

      return parseSuccessResponse(result);
    } catch (error) {
      return parseErrorResponse(error);
    }
  };
}
