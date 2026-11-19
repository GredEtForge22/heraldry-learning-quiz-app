import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureTables } from "@/db/ensure";
import { quizScores, type QuizScore } from "@/db/schema";
import { CATEGORY_LABELS, type Category } from "@/lib/heraldry/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Classement",
  description: "Les meilleurs hérauts : classement des scores du quiz d'héraldique.",
};

const MODE_LABELS: Record<string, string> = {
  name: "À qui est ce blason ?",
  shield: "Quel est son blason ?",
  blazon: "Du texte au dessin",
  read: "Savoir blasonner",
  vocab: "Vocabulaire",
};

async function load(category?: string): Promise<{ rows: QuizScore[]; error: boolean }> {
  try {
    await ensureTables();
    const q = db.select().from(quizScores);
    const rows = await (category && category !== "all" ? q.where(eq(quizScores.category, category)) : q)
      .orderBy(desc(quizScores.score), desc(quizScores.createdAt))
      .limit(50);
    return { rows, error: false };
  } catch {
    return { rows: [], error: true };
  }
}

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const { rows, error } = await load(cat);
  const cats: [string, string][] = [["all", "Tous"], ...(Object.entries(CATEGORY_LABELS) as [Category, string][])];
  const medal = ["🥇", "🥈", "🥉"];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-4xl font-bold text-wine-dark">Le classement des hérauts</h1>
      <p className="mt-2 text-ink-soft">Les 50 meilleurs scores. Terminez un quiz pour inscrire le vôtre.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {cats.map(([id, label]) => (
          <Link
            key={id}
            href={id === "all" ? "/classement" : `/classement?cat=${id}`}
            className="chip"
            data-on={(cat ?? "all") === id}
          >
            {label}
          </Link>
        ))}
      </div>

      {error ? (
        <div className="card mt-8 p-6 text-center text-ink-soft">
          Le classement est momentanément indisponible. Vérifiez la variable <code>DATABASE_URL</code>.
        </div>
      ) : rows.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-lg">Personne n&apos;a encore inscrit son nom. Soyez le premier !</p>
          <Link href="/quiz" className="btn btn-primary mt-5">
            ⚔️ Lancer un quiz
          </Link>
        </div>
      ) : (
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Héraut</th>
                <th className="px-4 py-3">Épreuve</th>
                <th className="px-4 py-3 text-right">Réussite</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b border-line/60 last:border-0 odd:bg-white/40">
                  <td className="px-4 py-3 font-bold">{medal[i] ?? i + 1}</td>
                  <td className="px-4 py-3 font-semibold">{r.pseudo}</td>
                  <td className="px-4 py-3 text-sm text-ink-soft">
                    {MODE_LABELS[r.mode] ?? r.mode}
                    <span className="block text-xs">
                      {r.category === "all" ? "Tout l'armorial" : (CATEGORY_LABELS[r.category as Category] ?? r.category)} ·{" "}
                      {"★".repeat(r.difficulty)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {r.correct}/{r.total}
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-wine-dark">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
