import { DashboardAnalyticsPage } from "@/components/pages/DashboardAnalyticsPage";
import { checkAdminKey } from "@/query/core/checkAdminKey";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const { isAdmin } = await checkAdminKey();

  if (!isAdmin) redirect("/dashboard/login");

  return <DashboardAnalyticsPage />;
}
