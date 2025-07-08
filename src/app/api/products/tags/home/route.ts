import { createRouteHandler } from "@/query/core/createRouteHandler";
import { listHomepageTags } from "@/query/products/listHomepageTags/handler";

async function getHandler() {
  return await listHomepageTags();
}

export const GET = createRouteHandler(getHandler);
