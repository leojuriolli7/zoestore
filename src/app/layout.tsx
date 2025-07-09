import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { keywords } from "./keywords";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const META_DESCRIPTION =
  "Descubra na Zoe Multistore coleções exclusivas de moda feminina. Peças que vestem elegância e empoderam a mulher moderna. Encontre o look perfeito para todas as ocasiões. Enviamos para todo o Brasil com segurança.";

export const metadata: Metadata = {
  /** Without this, we get annoying warnings on the console during development. */
  ...(process.env.NODE_ENV === "development" && {
    metadataBase: new URL("https://localhost"),
  }),
  title: "ZOE STORE - Peças que vestem elegância, Enviamos para todo o Brasil",
  description: META_DESCRIPTION,
  keywords,
  openGraph: {
    title: "ZOE STORE",
    description: META_DESCRIPTION,
    url: "https://zoestore-alpha.vercel.app/",
    siteName: "ZOE STORE",
    images: [
      {
        url: "/model.jpg",
        width: 1200,
        height: 630,
        alt: "ZOE STORE",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZOE STORE",
    description: META_DESCRIPTION,
    images: ["/model.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
