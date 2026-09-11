import type { Metadata } from "next";

export const noIndex: Metadata = {
  robots: { index: false, follow: false },
};

export const metadata = noIndex;

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
