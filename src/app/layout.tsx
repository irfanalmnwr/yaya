import type { Metadata } from "next";
import "./globals.css";
import GlobalShell from "@/components/ui/GlobalShell";

export const metadata: Metadata = {
  title: "Happy Birthday Sabrina Zahra Tudinia! 🎂🌌",
  description: "A Cinematic Birthday Experience for Sabrina Zahra Tudinia. Selamat Ulang Tahun Sayang!",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💖</text></svg>',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <main
          id="app-container"
          className="relative min-h-screen w-full overflow-x-hidden"
          style={{ background: "#0a0814" }}
        >
          {/* Global client-only widgets: StarCanvas, MusicPlayer, ambient orbs */}
          <GlobalShell />

          {children}
        </main>
      </body>
    </html>
  );
}
