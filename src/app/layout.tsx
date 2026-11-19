import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "Blasons — apprendre l'héraldique par le quiz",
    template: "%s · Blasons",
  },
  description:
    "Apprenez l'héraldique en jouant : leçons illustrées, armorial de plus de 50 blasons et quiz « à qui appartient ce blason ? ».",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <footer className="mt-20 border-t border-line bg-parch-2/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <p>
              <strong className="text-ink">Blasons</strong> — apprendre l&apos;héraldique par le jeu. Tous les écus sont
              dessinés en SVG à partir de leur blasonnement.
            </p>
            <nav className="flex gap-4">
              <Link href="/apprendre" className="hover:text-wine">
                Leçons
              </Link>
              <Link href="/quiz" className="hover:text-wine">
                Quiz
              </Link>
              <Link href="/armorial" className="hover:text-wine">
                Armorial
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
