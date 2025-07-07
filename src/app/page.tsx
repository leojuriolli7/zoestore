import { Homepage } from "@/components/pages/Homepage";
import { listProducts } from "@/query/products/listProducts/handler";

// Every 30 minutes, revalidate this page:
export const revalidate = 1800;

export default async function Index() {
  const result = await listProducts({
    limit: 20,
    cursor: null,
    search: null,
    tags: [],
  });

  const toInfiniteData = { pageParams: [], pages: [result] };

  return <Homepage products={toInfiniteData} />;
}
