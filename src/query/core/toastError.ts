import { toast } from "sonner";
import { BaseError } from "../errors/BaseError";

export function toastError(error: unknown) {
  if (error instanceof BaseError) {
    toast.error(error.message);
  } else {
    toast.error(JSON.stringify(error));
  }
}
