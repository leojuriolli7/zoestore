"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { UpsertProductDialog } from "./UpsertProductDialog/UpsertProductDialog";
import { UpsertTagsDialog } from "./UpsertTagsDialog";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export function DashboardHeader() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center pb-6 border-b">
      <div className="flex items-center gap-2">
        <Link href="/" prefetch={false}>
          <Image
            src="/zoe_store_logo.jpg"
            width={48}
            height={48}
            className="rounded-full"
            alt="ZOE STORE"
          />
        </Link>

        <h1 className="text-2xl hidden md:block font-bold">
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
