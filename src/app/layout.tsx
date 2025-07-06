import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactQueryProvider } from "./ReactQueryProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZOE STORE",
  description: "Peças que vestem elegância, Enviamos para todo o Brasil.",
  openGraph: {
    title: "ZOE STORE",
    description: "Peças que vestem elegância, Enviamos para todo o Brasil.",
    url: "https://zoestore-alpha.vercel.app/",
    siteName: "ZOE STORE",
    images: [
      {
        url: "/zoe_store_logo.jpg",
        width: 800,
        height: 600,
        alt: "ZOE STORE Logo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZOE STORE",
    description: "Peças que vestem elegância, Enviamos para todo o Brasil.",
    images: ["/zoe_store_logo.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
