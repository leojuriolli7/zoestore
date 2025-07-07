import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full">
      <div className="w-full flex h-20 items-center justify-center px-4">
        <Link href="/" prefetch={false}>
          <Image
            priority
            src="/zoe_store_logo.jpg"
            width={56}
            height={56}
            alt="ZOE STORE"
            className="rounded-full"
          />
        </Link>
      </div>
    </header>
  );
}
