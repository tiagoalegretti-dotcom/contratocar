import { Footer, Header } from "@/components/chrome";
import { Source_Serif_4 } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContratoCar | Contrato de compra e venda de veículo",
  description:
    "Gere um contrato de compra e venda de carro, moto ou caminhão. Preencha os dados e baixe o documento.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }, { url: "/logo.png" }],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
