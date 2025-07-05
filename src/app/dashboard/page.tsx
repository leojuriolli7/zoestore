import { ADMIN_KEY_COOKIE_NAME } from "@/lib/adminKey";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookiesStore = await cookies();

  /** Authorization is based on the `admin_key` cookie. */
  if (
    cookiesStore.get(ADMIN_KEY_COOKIE_NAME)?.value !== process.env.ADMIN_KEY
  ) {
    redirect("/dashboard/login");
  }

  return <h1>Dashboard</h1>;
}
