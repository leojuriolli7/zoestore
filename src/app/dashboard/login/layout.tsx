import { ADMIN_KEY_COOKIE_NAME } from "@/lib/adminKey";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: React.PropsWithChildren) {
  const cookieStore = await cookies();

  if (cookieStore.get(ADMIN_KEY_COOKIE_NAME)?.value === process.env.ADMIN_KEY) {
    redirect("/dashboard");
  }

  return children;
}
