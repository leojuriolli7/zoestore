import { redirect } from "next/navigation";
import { DashboardIndexPage } from "@/components/pages/DashboardIndexPage";
import { checkAdminKey } from "@/query/core/checkAdminKey";

export default async function DashboardPage() {
  const { isAdmin } = await checkAdminKey();

  if (!isAdmin) {
    redirect("/dashboard/login");
  }

  return <DashboardIndexPage />;
}
