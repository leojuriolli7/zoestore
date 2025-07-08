import { redirect } from "next/navigation";
import { DashboardProductList } from "./_components/DashboardProductList";
import { checkAdminKey } from "@/lib/checkAdminKey";

export default async function DashboardPage() {
  const { isAdmin } = await checkAdminKey();

  if (!isAdmin) {
    redirect("/dashboard/login");
  }

  return <DashboardProductList />;
}
