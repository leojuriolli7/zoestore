import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message = "Requisição inválida") {
    super("BadRequestError", message, 400);
  }
}
