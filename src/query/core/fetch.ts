import { BaseError } from "../errors/BaseError";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: object;
}

export async function $fetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    body,
    headers = {},
    credentials = "include",
    ...restOptions
  } = options;

  const finalHeaders = {
    ...headers,
    ...(body && { "Content-Type": "application/json" }),
  };

  try {
    const res = await fetch(url, {
      credentials,
      ...restOptions,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    let response;

    try {
      response = await res.json();
    } catch (parseError) {
      console.error("parseError:", parseError);

      throw new BaseError(
        "Failed to parse response as JSON",
        "JSON_PARSE_ERROR",
        500
      );
    }

    if (!res.ok) {
      const error = response?.error;

      if (error?.message && error?.status && error?.name) {
        throw new BaseError(error.name, error.message, error.status);
      } else {
        throw new BaseError(
          "HTTP_ERROR",
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }
    }

    return response as T;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    // Handle network errors or other fetch failures
    throw new BaseError(
      error instanceof Error ? error.message : "Network error occurred",
      "NETWORK_ERROR",
      0
    );
  }
}
