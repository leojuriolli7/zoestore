import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import type { API } from "@/query/core/query";
import type { NextRequest } from "next/server";

export function createRouteHandler<TResult, TParams>(
  handler:
    | ((req: NextRequest) => Promise<TResult>)
    | ((req: NextRequest, params: TParams) => Promise<TResult>)
) {
  return async (
    req: NextRequest,
    context?: { params: Promise<TParams> }
  ): Promise<API.Response<TResult>> => {
    try {
      let resolvedParams: TParams | undefined = undefined;

      if (context?.params) resolvedParams = await context.params;

      const result = await handler(req, resolvedParams as TParams);

      return parseSuccessResponse(result);
    } catch (error) {
      return parseErrorResponse(error);
    }
  };
}
