import { toast } from "sonner";
import { BaseError } from "../errors/BaseError";

export function toastError(error: unknown) {
  console.log(" error:", error);
  if (error instanceof BaseError) {
    toast.error(error.message);
  } else {
    toast.error(JSON.stringify(error));
  }
}
