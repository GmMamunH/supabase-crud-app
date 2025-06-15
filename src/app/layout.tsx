import type { Metadata } from "next";
import "./globals.css";
import { AppUtilsProvider } from "./context/AppUtils";
import Navbar from "@/components/shared/nav/Navbar";

export const metadata: Metadata = {
  title: "BD24Mart",
  description: "Supabase auth app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppUtilsProvider>
          <Navbar />
          {children}
        </AppUtilsProvider>
      </body>
    </html>
  );
}
