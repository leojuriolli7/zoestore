import { BaseError } from "./BaseError";

export class InternalServerError extends BaseError {
  constructor(message = "Erro Interno do Servidor") {
    super("InternalServerError", message, 500);
  }
}
