import { AuthProvider } from "@/components/auth-provider";
import { Footer, Header } from "@/components/chrome";
import { siteUrl } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Contrato de compra e venda de veículo";
const description =
  "Gere o contrato de compra e venda de carro, moto ou caminhão. Preencha, assine pelo celular e baixe o documento.";

export const metadata: Metadata = {
  metadataBase: new URL(
    (() => {
      try {
        return siteUrl();
      } catch {
        return "https://contratocar.vercel.app";
      }
    })(),
  ),
  title: {
    default: `${title} | ContratoCar`,
    template: "%s | ContratoCar",
  },
  description,
  applicationName: "ContratoCar",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "ContratoCar",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: { url: "/logo.svg", type: "image/svg+xml" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#6D28D9",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
