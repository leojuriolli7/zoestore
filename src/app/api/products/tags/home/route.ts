import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { listHomepageTags } from "@/query/products/listHomepageTags/handler";
import type { Products } from "@/query/products/types";

export async function GET(): Promise<API.Response<Products.ListHomepageTags>> {
  try {
    const result = await listHomepageTags();

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
