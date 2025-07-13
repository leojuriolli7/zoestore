"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChartPieIcon, HomeIcon, LayoutListIcon } from "lucide-react";

export function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center pb-6 border-b">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-xl mt-0.5 mr-1">ZOE</h1>

        <div className="flex items-center gap-2">
          <Link className="underline" href="/">
            <Button className="sm:hidden flex" variant="outline" size="icon">
              <HomeIcon />
            </Button>

            <span className="sm:block hidden">Homepage</span>
          </Link>

          <Link className="underline" href="/dashboard">
            <Button className="sm:hidden flex" variant="outline" size="icon">
              <LayoutListIcon />
            </Button>

            <span className="sm:block hidden">Produtos</span>
          </Link>

          <Link className="underline" href="/dashboard/analytics">
            <Button className="sm:hidden flex" variant="outline" size="icon">
              <ChartPieIcon />
            </Button>

            <span className="sm:block hidden">Análises</span>
          </Link>
        </div>
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
