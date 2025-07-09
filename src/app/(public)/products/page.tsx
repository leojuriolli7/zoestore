import { ProductListPage } from "@/components/pages/ProductListPage/ProductListPage";
import { ProductListPageSkeleton } from "@/components/pages/ProductListPage/ProductListPageSkeleton";
import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";

type Param = string | undefined;

type MetadataProps = {
  searchParams: Promise<{ tag: Param; search: Param }>;
};

export async function generateMetadata(
  { searchParams }: MetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const searchParamsObj = await searchParams;
  const search = searchParamsObj.search;
  const tagName = searchParamsObj.tag;

  const parentMetadata = await parent;

  const keywords = ["Produtos", "Listagem"];
  if (search) keywords.push(search);
  if (tagName) keywords.push(tagName);

  let title = `ZOE STORE`;

  if (tagName) {
    title += ` | ${tagName}`;
  }

  if (search) {
    title += ` | Busca por "${search}"`;
  }

  if (!tagName && !search) {
    title += ` | Todos os Produtos`;
  }

  return {
    title: title,
    keywords: [...(parentMetadata?.keywords || []), ...keywords],
  };
}

export default function Product() {
  return (
    <Suspense fallback={<ProductListPageSkeleton />}>
      <ProductListPage />
    </Suspense>
  );
}
