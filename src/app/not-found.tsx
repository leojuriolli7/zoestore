import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { listTags } from "@/query/products/listTags/handler";

export default async function NotFound() {
  const { tags } = await listTags();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="md:text-3xl lg:text-4xl text-2xl font-light text-neutral-foreground mb-4">
              Página não encontrada
            </h2>
            <p className="md:text-lg text-neutral-foreground/80 leading-relaxed max-w-md mx-auto">
              A página que você está procurando não existe ou foi movida. Que
              tal explorar nossa coleção exclusiva?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
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
              className=" px-8 p-3 font-medium bg-transparent"
            >
              <Link href="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Ver produtos
              </Link>
            </Button>
          </div>

          {tags?.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500 mb-6">
                Ou navegue por nossas categorias:
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {tags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/products?tag=${tag.name}`}
                    className="transition-colors text-muted-foreground hover:text-foreground hover:underline duration-200 text-sm font-medium capitalize"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
