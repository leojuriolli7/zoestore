"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { UpsertProductDialog } from "./UpsertProductDialog/UpsertProductDialog";
import { UpsertTagsDialog } from "./UpsertTagsDialog";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center pb-6 border-b">
      <div className="flex items-center gap-2">
        <h1 className="sm:text-2xl text-xl hidden sm:block font-bold">
          Gerenciar Produtos
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <UpsertProductDialog />
        <UpsertTagsDialog />

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
