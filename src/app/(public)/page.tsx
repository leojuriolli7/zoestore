import { Homepage } from "@/components/pages/Homepage";
import { listHomepageTags } from "@/query/products/listHomepageTags/handler";
import { listProducts } from "@/query/products/listProducts/handler";

export const revalidate = 86400;

export default async function Index() {
  const [homepageTags, products] = await Promise.all([
    // If the homepage tags query fails, we still render the homepage.
    listHomepageTags().catch(() => {
      return { tags: [] };
    }),
    listProducts({
      limit: 20,
      cursor: null,
      search: null,
      tags: [],
    }),
  ]);

  const toInfiniteData = { pageParams: [], pages: [products] };

  return <Homepage products={toInfiniteData} tags={homepageTags} />;
}
