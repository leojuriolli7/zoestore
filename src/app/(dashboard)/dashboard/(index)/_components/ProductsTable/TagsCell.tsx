import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Products } from "@/query/products/types";
import { Row } from "@tanstack/react-table";
import Link from "next/link";

const badgeColorClasses = [
  "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  "bg-lime-100 text-lime-800 dark:bg-lime-800 dark:text-lime-100",
  "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100",
  "bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100",
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100",
  "bg-sky-100 text-sky-800 dark:bg-sky-800 dark:text-sky-100",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100",
  "bg-violet-100 text-violet-800 dark:bg-violet-800 dark:text-violet-100",
  "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-800 dark:text-fuchsia-100",
  "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
  "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  "bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-200",
  "bg-orange-200 text-orange-900 dark:bg-orange-900 dark:text-orange-200",
  "bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200",
  "bg-lime-200 text-lime-900 dark:bg-lime-900 dark:text-lime-200",
  "bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200",
  "bg-teal-200 text-teal-900 dark:bg-teal-900 dark:text-teal-200",
];

const getDeterministicColorClass = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash % badgeColorClasses.length);
  return badgeColorClasses[index];
};

export function TagsCell({ row }: { row: Row<Products.Product> }) {
  const tags = row.original.tags;

  if (!tags?.length) return <p>Nenhuma</p>;

  const chunkedTags = tags.reduce((acc, _, index) => {
    if (index % 3 === 0) {
      acc.push(tags.slice(index, index + 3));
    }
    return acc;
  }, [] as (typeof tags)[]);

  return (
    <div className="flex flex-col gap-2">
      {chunkedTags.map((chunk, chunkIndex) => (
        <div className="flex gap-2 items-center" key={chunkIndex}>
          {chunk.map((tag) => (
            <Link
              href={`/products?tag=${tag.name}`}
              target="_blank"
              rel="noopener noreferrer"
              key={tag.id}
            >
              <Badge
                className={cn(
                  getDeterministicColorClass(tag.name),
                  "shadow-xs"
                )}
              >
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
