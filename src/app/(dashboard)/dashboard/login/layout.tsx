import { checkAdminKey } from "@/query/core/checkAdminKey";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: React.PropsWithChildren) {
  const { isAdmin } = await checkAdminKey();

  if (isAdmin) {
    redirect("/dashboard");
  }

  return children;
}
