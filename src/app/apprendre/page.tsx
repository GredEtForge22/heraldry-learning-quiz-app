import type { Metadata } from "next";
import Link from "next/link";
import { LESSONS } from "@/lib/heraldry/lessons";
import { Shield } from "@/lib/heraldry/Shield";

export const metadata: Metadata = {
  title: "Apprendre l'héraldique",
  description: "Sept leçons illustrées pour comprendre les émaux, les partitions, les pièces et le blasonnement.",
};

export default function LearnIndex() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-4xl font-bold text-wine-dark">Apprendre l&apos;héraldique</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Un parcours en {LESSONS.length} étapes, du vocabulaire de base jusqu&apos;à la lecture d&apos;un blasonnement
        complet. Chaque leçon se termine par un quiz.
      </p>
      <ol className="mt-8 grid gap-5 sm:grid-cols-2">
        {LESSONS.map((l, i) => {
          const ex = l.sections.flatMap((s) => s.examples ?? [])[0];
          return (
            <li key={l.slug}>
              <Link
                href={`/apprendre/${l.slug}`}
                className="card group flex h-full gap-4 p-5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex w-20 shrink-0 flex-col items-center justify-center">
                  {ex ? (
                    <Shield spec={ex.spec} className="shield-shadow h-24 w-20" />
                  ) : (
                    <span className="text-5xl">{l.icon}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">
                    Leçon {i + 1} · {l.minutes} min
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-wine-dark group-hover:underline">
                    {l.icon} {l.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft">{l.subtitle}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
      <div className="card mt-10 flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-lg font-semibold">Prêt à vous tester ?</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/quiz?type=vocab" className="btn btn-ghost">
            📖 Quiz de vocabulaire
          </Link>
          <Link href="/quiz" className="btn btn-primary">
            ⚔️ Quiz sur les blasons
          </Link>
        </div>
      </div>
    </div>
  );
}
