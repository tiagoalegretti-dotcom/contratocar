import { Footer, Header } from "@/components/chrome";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContratoCar | Contrato de compra e venda de veículo",
  description:
    "Gere um contrato de compra e venda de carro, moto ou caminhão. Preencha os dados e baixe o documento.",
  icons: {
    icon: { url: "/logo.svg", type: "image/svg+xml" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6D28D9",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
