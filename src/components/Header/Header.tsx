import Image from "next/image";
import Link from "next/link";
import { ShoppingBagSheet } from "./ShoppingBag";

export function Header() {
  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-md bg-muted/85">
      <div className="w-full flex h-20 items-center justify-center px-4 relative">
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

        <ShoppingBagSheet />
      </div>
    </header>
  );
}
