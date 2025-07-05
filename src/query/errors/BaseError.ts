export class BaseError extends Error {
  public readonly status: number;
  constructor(name: string, message: string, status: number) {
    super(message);
    this.name = name;
    this.status = status;

    Object.defineProperty(this, "message", {
      value: message,
      enumerable: true,
      writable: true,
      configurable: true,
    });

    Error.captureStackTrace(this, this.constructor);
  }
}
