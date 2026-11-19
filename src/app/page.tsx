import Link from "next/link";
import { DailyArms, ProgressPanel } from "@/components/HomeWidgets";
import { ARMORIAL, ARMS_BY_ID } from "@/lib/heraldry/armorial";
import { LESSONS } from "@/lib/heraldry/lessons";
import { QUIZ_TYPES } from "@/lib/heraldry/quiz";
import { Shield } from "@/lib/heraldry/Shield";

const heroShields = ["france-moderne", "angleterre", "lorraine", "castille", "bretagne", "flandre"];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Héraldique · quiz · armorial</p>
            <h1 className="mt-3 text-5xl font-bold leading-[1.05] text-wine-dark sm:text-6xl">
              Quel blason
              <br />
              est de qui ?
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Apprenez à lire les armoiries comme un héraut du Moyen Âge : leçons illustrées, armorial de{" "}
              {ARMORIAL.length} blasons et quiz sans fin pour reconnaître d&apos;un coup d&apos;œil les armes des
              royaumes, des provinces, des villes et des grandes maisons.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quiz" className="btn btn-primary text-lg">
                ⚔️ Lancer un quiz
              </Link>
              <Link href="/apprendre" className="btn btn-ghost text-lg">
                📜 Commencer les leçons
              </Link>
            </div>
          </div>
          <div className="relative mx-auto grid max-w-sm grid-cols-3 gap-4">
            {heroShields.map((id, i) => (
              <div
                key={id}
                className="flex items-center justify-center"
                style={{ transform: `rotate(${[-6, 3, -3, 4, -4, 5][i]}deg) translateY(${i % 2 ? 14 : 0}px)` }}
              >
                <Shield spec={ARMS_BY_ID[id].shield} className="shield-shadow h-32 w-28" title={ARMS_BY_ID[id].name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="ornament mb-8 text-2xl font-bold">
          <span>Cinq façons de s&apos;exercer</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUIZ_TYPES.map((t) => (
            <Link
              key={t.id}
              href={`/quiz?type=${t.id}`}
              className="card group flex gap-4 p-5 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-4xl">{t.icon}</span>
              <span>
                <span className="block text-lg font-bold text-wine-dark group-hover:underline">{t.label}</span>
                <span className="mt-1 block text-sm text-ink-soft">{t.desc}</span>
              </span>
            </Link>
          ))}
          <Link
            href="/quiz"
            className="card flex items-center justify-center gap-3 border-2 border-dashed border-wine/40 bg-wine/5 p-5 text-lg font-bold text-wine-dark transition hover:-translate-y-1"
          >
            🎲 Quiz mixte, tous types
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <DailyArms />
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="ornament mb-8 text-2xl font-bold">
          <span>Le parcours d&apos;apprentissage</span>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LESSONS.map((l, i) => (
            <li key={l.slug}>
              <Link href={`/apprendre/${l.slug}`} className="card flex h-full flex-col p-5 transition hover:-translate-y-1 hover:shadow-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-gold">Leçon {i + 1}</span>
                <span className="mt-1 text-3xl">{l.icon}</span>
                <span className="mt-2 font-bold text-wine-dark">{l.title}</span>
                <span className="mt-1 text-sm text-ink-soft">{l.subtitle}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/atelier" className="card flex h-full flex-col p-5 transition hover:-translate-y-1 hover:shadow-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-gold">Pratique</span>
              <span className="mt-1 text-3xl">🖌️</span>
              <span className="mt-2 font-bold text-wine-dark">L&apos;atelier du héraut</span>
              <span className="mt-1 text-sm text-ink-soft">Composez votre blason et obtenez son blasonnement.</span>
            </Link>
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <ProgressPanel />
      </section>
    </div>
  );
}
