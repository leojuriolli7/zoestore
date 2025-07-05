import { NextResponse } from "next/server";

export function parseSuccessResponse<T>(data: T): NextResponse<T> {
  return NextResponse.json(data);
}
