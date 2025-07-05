import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message = "Não Autorizado") {
    super("UnauthorizedError", message, 401);
  }
}
