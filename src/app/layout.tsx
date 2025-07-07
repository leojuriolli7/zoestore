import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "./ReactQueryProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
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
          <ReactQueryProvider>
            <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
              <Header />
              {children}
            </div>
          </ReactQueryProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
