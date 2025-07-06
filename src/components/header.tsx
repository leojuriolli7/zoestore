import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-22 items-center justify-center px-4">
        <Link href="/" prefetch={false}>
          <Image
            src="/zoe_store_logo.jpg"
            width={64}
            height={64}
            alt="ZOE STORE"
            className="rounded-full"
          />
        </Link>
      </div>
    </header>
  );
}
