"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { appClientConfig } from "@/config/client";

export function WhatsAppFloatingButton() {
  return (
    <div className="fixed bottom-4 right-4 shrink-0 z-50">
      <a
        href={`https://wa.me/${appClientConfig.contact.whatsappNumber}?text=Olá! Vi a loja e me interessei pelas peças. Gostaria de saber mais informações, novidades e formas de pagamento.`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center"
      >
        <div className="absolute right-full mr-2 w-max whitespace-nowrap rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-md transition-all duration-300 ease-in-out opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 sm:pointer-events-auto pointer-events-none">
          Clique para nos contatar no WhatsApp
        </div>
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full transition-transform group-hover:scale-110"
        >
          <Image
            priority
            src="/whatsapp.png"
            width={48}
            height={48}
            className="shrink-0"
            alt="Clique para abrir o Whatsapp"
          />
        </Button>
      </a>
    </div>
  );
}
