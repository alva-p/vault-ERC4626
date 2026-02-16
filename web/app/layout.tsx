import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Web3Provider from "@/components/providers/Web3Provider";
import { SonnerToaster } from "@/components/ui/sonner";
import "./globals.css";

const displayFont = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ERC-4626 Vault",
  description: "Modern ERC-4626 vault dashboard with wallet integration and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        <ThemeProvider>
          <Web3Provider>
            {children}
            <footer className="site-footer">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                Built by <a className="underline decoration-[color:var(--accent)] underline-offset-4" href="https://github.com/alva-p" target="_blank" rel="noreferrer">Alva</a>
              </span>
            </footer>
            <SonnerToaster />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
