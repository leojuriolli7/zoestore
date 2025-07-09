import { redirect } from "next/navigation";
import { DashboardProductList } from "./_components/DashboardProductList";
import { checkAdminKey } from "@/query/core/checkAdminKey";

export default async function DashboardPage() {
  const { isAdmin } = await checkAdminKey();

  if (!isAdmin) {
    redirect("/dashboard/login");
  }

  return <DashboardProductList />;
}
