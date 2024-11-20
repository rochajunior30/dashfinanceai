import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Tanotado AI",
  description: "Sua plataforma para registros financeiros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${mulish.className} dark antialiased flex h-full flex-col bg-gray-900 text-gray-100`}
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-full flex-col">{children}</div>
          </div>
        </ClerkProvider>

        <Toaster />
      </body>
    </html>
  );
}
