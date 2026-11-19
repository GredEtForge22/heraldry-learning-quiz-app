import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EcuPoints, HachuresTable, TinctureList } from "@/components/Hachures";
import { LESSON_BY_SLUG, LESSONS } from "@/lib/heraldry/lessons";
import { Shield } from "@/lib/heraldry/Shield";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = LESSON_BY_SLUG[slug];
  return lesson ? { title: lesson.title, description: lesson.subtitle } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = LESSON_BY_SLUG[slug];
  if (!lesson) notFound();
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  const prev = LESSONS[idx - 1];
  const nextL = LESSONS[idx + 1];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/apprendre" className="text-sm font-semibold text-wine hover:underline">
        ← Toutes les leçons
      </Link>
      <header className="mt-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">
          Leçon {idx + 1} sur {LESSONS.length} · {lesson.minutes} min de lecture
        </p>
        <h1 className="mt-1 text-4xl font-bold text-wine-dark sm:text-5xl">
          {lesson.icon} {lesson.title}
        </h1>
        <p className="mt-2 text-lg italic text-ink-soft">{lesson.subtitle}</p>
      </header>

      <p className="card mt-8 border-l-4 border-l-gold p-5 text-lg leading-relaxed">{lesson.intro}</p>

      <div className="mt-10 space-y-12">
        {lesson.sections.map((s, i) => (
          <section key={s.title}>
            <h2 className="mb-4 text-2xl font-bold text-wine-dark">
              <span className="mr-2 text-gold">{i + 1}.</span>
              {s.title}
            </h2>
            <div className="prose-lesson text-[17px]">
              {s.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
            {s.special === "tinctureList" && <TinctureList />}
            {s.special === "hachures" && <HachuresTable />}
            {s.special === "points" && <EcuPoints />}
            {s.examples && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {s.examples.map((e) => (
                  <figure key={e.label} className="card flex flex-col items-center p-3 text-center">
                    <Shield spec={e.spec} className="shield-shadow h-32 w-28" title={e.label} />
                    <figcaption className="mt-2">
                      <span className="block text-sm font-bold">{e.label}</span>
                      {e.blazon && <span className="mt-0.5 block text-xs italic text-ink-soft">{e.blazon}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <section className="card mt-12 bg-parch-2/50 p-6">
        <h2 className="text-xl font-bold text-wine-dark">À retenir</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[16px]">
          {lesson.takeaways.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/quiz?type=vocab" className="btn btn-primary">
            📖 Tester mon vocabulaire
          </Link>
          <Link href="/quiz" className="btn btn-ghost">
            ⚔️ Quiz sur les blasons
          </Link>
        </div>
      </section>

      <nav className="mt-10 flex justify-between gap-4">
        {prev ? (
          <Link href={`/apprendre/${prev.slug}`} className="btn btn-ghost">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {nextL && (
          <Link href={`/apprendre/${nextL.slug}`} className="btn btn-ghost">
            {nextL.title} →
          </Link>
        )}
      </nav>
    </div>
  );
}
