import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "CertiFix | Sistem Pakar Diagnosa Laptop",
  description: "Aplikasi pakar berbasis web untuk mendiagnosa kerusakan laptop menggunakan Decision Tree, Forward Chaining, dan Certainty Factor.",
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
