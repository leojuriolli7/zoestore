"use client";

import { Header } from "@/components/header";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProductByIdOptions } from "@/query/products/getProductById/query";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { appConfig } from "@/config";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { data: product, isLoading } = useQuery(getProductByIdOptions(id));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden shadow-md md:max-w-[400px] md:mx-auto">
          {isLoading ? (
            <Skeleton className="w-full h-full absolute top-0 left-0" />
          ) : product?.image_url ? (
            <Image
              src={product.image_url}
              alt={product?.name || "Produto"}
              fill
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              Imagem não disponível
            </div>
          )}
        </div>

        <div className="flex flex-col md:justify-start justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isLoading ? <Skeleton className="h-10 w-2/3" /> : product?.name}
          </h1>

          {isLoading ? (
            <Skeleton className="h-6 w-full mb-4" />
          ) : (
            product?.description && (
              <p className="text-muted-foreground whitespace-break-spaces mb-4">
                {product.description}
              </p>
            )
          )}

          {isLoading ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          ) : (
            product?.tags &&
            product.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-secondary text-xs px-2 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )
          )}

          <div className="flex items-center mb-6">
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <span className="text-2xl">
                R$ {Number(product?.price).toFixed(2)}
              </span>
            )}
          </div>

          {isLoading ? (
            <Skeleton className="h-12 w-full md:w-48" />
          ) : product ? (
            <Link
              href={`https://wa.me/${
                appConfig.contact.whatsappNumber
              }?text=Olá! Tenho interesse no produto: ${encodeURIComponent(
                product?.name || ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="w-full md:w-auto bg-green-600 dark:bg-green-700 hover:bg-green-800"
              >
                Contatar via WhatsApp
              </Button>
            </Link>
          ) : (
            <span className="text-destructive">Produto não encontrado.</span>
          )}
        </div>
      </div>

      <WhatsAppFloatingButton />
    </div>
  );
}
