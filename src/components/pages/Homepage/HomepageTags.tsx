"use client";

import { useQuery } from "@tanstack/react-query";
import { listHomepageTagsOptions } from "@/query/products/listHomepageTags/query";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { TagIcon } from "lucide-react";

function TagCard({
  name,
  imageUrl,
  tagName,
}: {
  name: string;
  imageUrl?: string;
  tagName?: string;
}) {
  return (
    <Link
      href={`/products${tagName ? `?tag=${tagName}` : ""}`}
      className="flex flex-col items-center gap-2"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden relative hover:scale-110 transition-transform">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="object-cover object-top"
            fill
          />
        ) : (
          <div className="w-full h-full bg-accent flex justify-center items-center">
            <TagIcon className="text-accent-foreground size-8" />
          </div>
        )}
      </div>

      <span className="text-neutral-foreground font-medium">{name}</span>
    </Link>
  );
}

export function HomepageTags() {
  const { data, isLoading } = useQuery(listHomepageTagsOptions());

  if (!data?.tags?.length && !isLoading) {
    return null;
  }

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl text-neutral-foreground text-center font-bold tracking-tight mb-2">
            Categorias
          </h2>
          <p className="text-neutral-foreground/80 text-center">
            Navegue por nossas categorias em destaque
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {isLoading
            ? [1, 2, 3, 4].map((val) => (
                <Skeleton className="w-24 h-24 rounded-full mb-8" key={val} />
              ))
            : data?.tags.map((tag) => (
                <TagCard
                  name={tag.name}
                  tagName={tag.name}
                  imageUrl={tag.product_image}
                  key={tag.name}
                />
              ))}

          {data?.tags?.length && <TagCard name="Ver todas" />}
        </div>
      </div>
    </section>
  );
}
