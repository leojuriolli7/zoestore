import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  /** Without this, we get annoying warnings on the console during development. */
  ...(process.env.NODE_ENV === "development" && {
    metadataBase: new URL("https://localhost"),
  }),
  title: "ZOE STORE",
  description: "Peças que vestem elegância, Enviamos para todo o Brasil.",
  openGraph: {
    title: "ZOE STORE",
    description: "Peças que vestem elegância, Enviamos para todo o Brasil.",
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
    description: "Peças que vestem elegância, Enviamos para todo o Brasil.",
    images: ["/model.jpg"],
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
