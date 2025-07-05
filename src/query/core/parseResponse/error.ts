import { BaseError } from "@/query/errors/BaseError";
import { InternalServerError } from "@/query/errors/InternalServerError";
import { NextResponse } from "next/server";
import { API } from "../query";

export function parseErrorResponse(error: unknown): API.RequestError {
  if (error instanceof BaseError) {
    console.log(" error:", JSON.stringify(error));
    return NextResponse.json(
      {
        error: {
          message: error.message,
          name: error.name,
          status: error.status,
        },
      },
      { status: error.status }
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: new InternalServerError() },
    { status: 500 }
  );
}
