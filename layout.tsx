import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOOTBALL IQ — Global Football Intelligence",
  description: "Football data, match centre, team analytics and tactical intelligence."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}