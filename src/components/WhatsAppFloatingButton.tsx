"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { appConfig } from "@/config";

export function WhatsAppFloatingButton() {
  const onClickOpenWhatsapp = () => {
    window.open(
      `https://wa.me/${appConfig.contact.whatsappNumber}?text=Olá! Eu vim do site da Zoe Store e queria saber mais informações.`
    );
  };

  return (
    <div className="fixed bottom-4 right-4 shrink-0 z-50">
      <Button
        onClick={onClickOpenWhatsapp}
        variant="default"
        size="icon"
        className="rounded-full w-14 h-14"
      >
        <Image
          src="/whatsapp.png"
          width={48}
          height={48}
          className="shrink-0"
          alt="Clique para abrir o Whatsapp"
        />
      </Button>
    </div>
  );
}
