import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dr. Veenoo Agarwal | Consultant Medical Oncologist",
  description: "Dr. Veenoo Agarwal — MBBS, FRACP — Consultant Medical Oncologist with 20+ years of experience across India, UK, and Australia. Empowering lives in the fight against cancer.",
  keywords: "Dr Veenoo Agarwal, medical oncologist, cancer treatment, breast cancer, lung cancer, Gurugram, Delhi, SHALBY hospital, oncologist India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
