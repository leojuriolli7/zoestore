import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message = "Não encontrado") {
    super("NotFoundError", message, 404);
  }
}
