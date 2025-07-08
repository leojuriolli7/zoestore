import { ProductListPage } from "@/components/pages/ProductListPage/ProductListPage";
import { ProductListPageSkeleton } from "@/components/pages/ProductListPage/ProductListPageSkeleton";
import { Suspense } from "react";

export default function Product() {
  return (
    <Suspense fallback={<ProductListPageSkeleton />}>
      <ProductListPage />
    </Suspense>
  );
}
