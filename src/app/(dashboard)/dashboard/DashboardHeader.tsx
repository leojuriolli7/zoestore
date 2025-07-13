"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center pb-6 border-b">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-xl mt-0.5 mr-1">ZOE</h1>

        <Link className="underline" href="/">
          Homepage
        </Link>

        <Link className="underline" href="/dashboard">
          Produtos
        </Link>

        <Link className="underline" href="/dashboard/analytics">
          Análises
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button
          variant="outline"
          onClick={async () => {
            await logout();
            router.replace("/dashboard/login");
          }}
        >
          Sair
        </Button>
      </div>
    </header>
  );
}
