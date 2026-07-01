import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "CertiFix | Sistem Pakar Diagnosa Laptop",
  description: "Aplikasi sistem pakar cerdas untuk mendiagnosa kerusakan perangkat keras laptop Anda dengan cepat dan akurat menggunakan algoritma Decision Tree dan Certainty Factor.",
  keywords: "sistem pakar, diagnosa laptop, certainty factor, forward chaining, decision tree, servis laptop, expert system",
  authors: [{ name: "CertiFix Team" }],
  openGraph: {
    title: "CertiFix | Sistem Pakar Diagnosa Laptop",
    description: "Deteksi kerusakan perangkat keras laptop Anda secara instan layaknya teknisi profesional.",
    url: "https://certifix-laptop-expert-system.vercel.app",
    siteName: "CertiFix",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CertiFix | Laptop Expert System",
    description: "Diagnosa kerusakan laptop Anda dengan cepat dan akurat.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://certifix-laptop-expert-system.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-900 text-slate-100 min-h-screen`} suppressHydrationWarning>
        <ThemeRegistry>
          <Toaster position="top-center" richColors />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
