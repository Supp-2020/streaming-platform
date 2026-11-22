import type { Metadata } from "next";
import { Inter, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Schibsted_Grotesk({ variable: "--font-grotesk", subsets: ["latin"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: "Kinora",
  description: "Streaming platform demo built with Next.js and Video.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
