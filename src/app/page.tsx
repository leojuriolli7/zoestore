import { Homepage } from "@/components/pages/Homepage";
import { listProducts } from "@/query/products/listProducts/handler";

export const revalidate = 60;

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
