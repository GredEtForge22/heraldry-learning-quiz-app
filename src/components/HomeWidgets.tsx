"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ARMORIAL } from "@/lib/heraldry/armorial";
import { Shield } from "@/lib/heraldry/Shield";
import { isMastered, useStats } from "@/lib/storage";

const noopSub = () => () => {};
const today = () => Math.floor(Date.now() / 86_400_000);

export function DailyArms() {
  const day = useSyncExternalStore(noopSub, today, () => -1);
  if (day < 0) {
    return <div className="card h-72 animate-pulse" aria-hidden />;
  }
  const arm = ARMORIAL[(day * 7) % ARMORIAL.length];
  return (
    <div className="card flex flex-col items-center gap-5 p-6 sm:flex-row">
      <Shield spec={arm.shield} className="shield-shadow h-52 w-44 shrink-0" title={arm.name} />
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Blason du jour</p>
        <h3 className="mt-1 text-2xl font-bold text-wine-dark">{arm.name}</h3>
        <p className="text-sm italic text-ink-soft">{arm.subtitle}</p>
        <p className="mt-3 rounded-lg border-l-4 border-gold bg-white/60 px-3 py-2 italic">{arm.blazon}</p>
        <p className="mt-3 text-[15px] leading-relaxed">{arm.note}</p>
        <Link href={`/armorial/${arm.id}`} className="mt-3 inline-block font-semibold text-wine hover:underline">
          Voir la fiche →
        </Link>
      </div>
    </div>
  );
}

export function ProgressPanel() {
  const stats = useStats();
  const mastered = ARMORIAL.filter((a) => isMastered(stats.arms[a.id])).length;
  const seen = Object.keys(stats.arms).length;
  const pct = Math.round((mastered / ARMORIAL.length) * 100);
  const acc = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h3 className="text-xl font-bold text-wine-dark">Votre progression</h3>
        <span className="text-sm text-ink-soft">Enregistrée dans votre navigateur</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-line/60">
        <div className="h-full rounded-full bg-gradient-to-r from-gold to-wine transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-sm">
        <strong>{mastered}</strong> blason{mastered > 1 ? "s" : ""} maîtrisé{mastered > 1 ? "s" : ""} sur {ARMORIAL.length}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Parties jouées", stats.games],
          ["Meilleur score", stats.best],
          ["Réussite", stats.answered ? `${acc}%` : "–"],
          ["Blasons vus", seen],
        ].map(([l, v]) => (
          <div key={l as string} className="rounded-xl border border-line bg-white/60 p-3 text-center">
            <div className="text-2xl font-bold text-wine-dark">{v}</div>
            <div className="text-xs uppercase tracking-wider text-ink-soft">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
