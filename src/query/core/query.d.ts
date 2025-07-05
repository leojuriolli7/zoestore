import "@tanstack/react-query";
import type { NextResponse } from "next/server";
import type { BaseError } from "../errors/BaseError";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: BaseError;
  }
}

export namespace API {
  type InfiniteListResult<T> = {
    results: T[];
    nextCursor: number | null;
  };

  type RequestSuccess<T> = NextResponse<T>;

  type RequestError = NextResponse<{
    error: BaseError;
  }>;

  type Response<T> = RequestSuccess<T> | RequestError;
}
