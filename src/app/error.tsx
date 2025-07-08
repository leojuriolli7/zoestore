"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";

export default function ServerError() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="md:text-3xl lg:text-4xl text-2xl font-light text-neutral-foreground mb-4">
              Algo deu errado
            </h2>
            <p className="md:text-lg text-neutral-foreground/80 lg:leading-relaxed max-w-md mx-auto">
              Ocorreu um erro interno no servidor. Nossa equipe foi notificada e
              está trabalhando para resolver o problema.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center mb-12">
            <Button asChild size="lg" className="px-8 py-3 font-medium">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao início
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 font-medium bg-transparent"
            >
              <Link href="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Ver produtos
              </Link>
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="lg"
              className="px-8 py-3 font-medium bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
