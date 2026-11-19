import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARMORIAL, ARMS_BY_ID, similarity } from "@/lib/heraldry/armorial";
import { Shield } from "@/lib/heraldry/Shield";
import { CATEGORY_LABELS } from "@/lib/heraldry/types";

export function generateStaticParams() {
  return ARMORIAL.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = ARMS_BY_ID[id];
  return a ? { title: a.name, description: `${a.name} : ${a.blazon}` } : {};
}

export default async function ArmDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const arm = ARMS_BY_ID[id];
  if (!arm) notFound();
  const idx = ARMORIAL.findIndex((a) => a.id === id);
  const prev = ARMORIAL[(idx - 1 + ARMORIAL.length) % ARMORIAL.length];
  const next = ARMORIAL[(idx + 1) % ARMORIAL.length];
  const similar = ARMORIAL.filter((a) => a.id !== id)
    .map((a) => ({ a, s: similarity(arm, a) }))
    .sort((x, y) => y.s - x.s)
    .slice(0, 4)
    .map((x) => x.a);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/armorial" className="text-sm font-semibold text-wine hover:underline">
        ← Armorial
      </Link>
      <div className="mt-5 grid gap-8 md:grid-cols-[280px_1fr]">
        <div className="flex justify-center md:justify-start">
          <Shield spec={arm.shield} className="shield-shadow h-80 w-64" title={arm.name} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">{CATEGORY_LABELS[arm.category]}</p>
          <h1 className="mt-1 text-4xl font-bold text-wine-dark">{arm.name}</h1>
          <p className="mt-1 italic text-ink-soft">{arm.subtitle}</p>
          <p className="mt-2 text-sm">
            Difficulté : <span className="text-gold">{"★".repeat(arm.difficulty)}</span>
            <span className="text-line">{"★".repeat(3 - arm.difficulty)}</span>
          </p>

          <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-ink-soft">Blasonnement</h2>
          <blockquote className="mt-1 rounded-xl border-l-4 border-gold bg-white/60 px-5 py-3 text-xl italic leading-relaxed">
            {arm.blazon}
          </blockquote>

          <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-ink-soft">Le saviez-vous ?</h2>
          <p className="mt-1 text-[17px] leading-relaxed">{arm.note}</p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-wine-dark">Ne pas confondre avec…</h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {similar.map((a) => (
            <li key={a.id}>
              <Link href={`/armorial/${a.id}`} className="card flex flex-col items-center p-3 text-center transition hover:-translate-y-1">
                <Shield spec={a.shield} className="shield-shadow h-28 w-24" title={a.name} />
                <span className="mt-2 text-sm font-bold leading-tight">{a.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <nav className="mt-10 flex justify-between gap-3">
        <Link href={`/armorial/${prev.id}`} className="btn btn-ghost">
          ← {prev.name}
        </Link>
        <Link href={`/armorial/${next.id}`} className="btn btn-ghost">
          {next.name} →
        </Link>
      </nav>
    </div>
  );
}
