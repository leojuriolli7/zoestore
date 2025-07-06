import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Products } from "@/query/products/types";
import { TableFilters } from "./TableFilters";

export function ProductsTable({ data }: { data: Products.Product[] }) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} renderFilters={TableFilters} />
    </div>
  );
}
