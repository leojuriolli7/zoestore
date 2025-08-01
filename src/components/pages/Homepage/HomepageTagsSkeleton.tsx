import { Skeleton } from "@/components/ui/skeleton";

export default function HomepageTagsSkeleton() {
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
          {[1, 2, 3, 4].map((val) => (
            <Skeleton className="w-24 h-24 rounded-full mb-8" key={val} />
          ))}
        </div>
      </div>
    </section>
  );
}
