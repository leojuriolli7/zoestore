"use client";

import { Header } from "@/components/header";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlugOptions } from "@/query/products/getProductBySlug/query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { appClientConfig } from "@/config/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Products } from "@/query/products/types";
import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";

export default function ProductPage({
  product: initialProduct,
}: {
  product: Products.Product | null;
}) {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: product, isLoading } = useQuery({
    ...getProductBySlugOptions(slug),
    enabled: !initialProduct,
    ...(initialProduct && { initialData: initialProduct }),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden shadow-md md:max-w-[400px] md:mx-auto">
          {isLoading ? (
            <Skeleton className="w-full h-full absolute top-0 left-0" />
          ) : product?.image_url ? (
            <ViewTransition name={`product-image-${product?.id}`}>
              <Image
                src={product.image_url}
                alt={product?.name || "Produto"}
                fill
                className="object-cover w-full h-full"
              />
            </ViewTransition>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              Imagem não disponível
            </div>
          )}
        </div>

        <div className="flex flex-col md:justify-start justify-center">
          {isLoading ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          ) : (
            product?.tags &&
            product.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link href={`/products?tag=${tag.name}`} key={tag.id}>
                    <span className="bg-secondary text-xs px-2 py-1 rounded-full hover:bg-secondary/80 cursor-pointer">
                      {tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            )
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-neutral-foreground/90">
            {isLoading ? <Skeleton className="h-10 w-2/3" /> : product?.name}
          </h1>

          <div className="flex items-center mb-4">
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <span className="text-2xl">
                R$ {Number(product?.price).toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-4">
            {isLoading ? (
              <Skeleton className="h-12 w-full md:w-48" />
            ) : product ? (
              <a
                href={`https://wa.me/${
                  appClientConfig.contact.whatsappNumber
                }?text=Olá! Tenho interesse no produto: ${encodeURIComponent(
                  product?.name || ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full md:w-auto text-white bg-whatsapp hover:bg-whatsapp/90"
                >
                  Contatar via WhatsApp
                </Button>
              </a>
            ) : (
              <span className="text-destructive">Produto não encontrado.</span>
            )}
          </div>

          {isLoading ? (
            <Skeleton className="h-6 w-full mb-2" />
          ) : (
            product?.description && (
              <p className="text-neutral-foreground/80 whitespace-break-spaces">
                {product.description}
              </p>
            )
          )}
        </div>
      </div>

      <WhatsAppFloatingButton />
    </div>
  );
}
