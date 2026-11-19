"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ARMORIAL } from "@/lib/heraldry/armorial";
import { Shield } from "@/lib/heraldry/Shield";
import { CATEGORY_LABELS, type Category } from "@/lib/heraldry/types";
import { isMastered, useStats } from "@/lib/storage";

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function ArmorialBrowser() {
  const stats = useStats();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [hide, setHide] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const list = useMemo(() => {
    const nq = norm(q.trim());
    return ARMORIAL.filter(
      (a) =>
        (cat === "all" || a.category === cat) &&
        (!nq || norm(`${a.name} ${a.subtitle} ${a.blazon}`).includes(nq)),
    );
  }, [q, cat]);

  const masteredCount = ARMORIAL.filter((a) => isMastered(stats.arms[a.id])).length;

  return (
    <div>
      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un nom, un émail, une figure…"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-4 py-2.5 outline-none focus:border-wine"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} className="h-4 w-4 accent-[#7b1e2b]" />
          Mode auto-test (noms cachés)
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="chip" data-on={cat === "all"} onClick={() => setCat("all")}>
          Tous ({ARMORIAL.length})
        </button>
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
          <button key={c} className="chip" data-on={cat === c} onClick={() => setCat(c)}>
            {CATEGORY_LABELS[c]} ({ARMORIAL.filter((a) => a.category === c).length})
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        {list.length} blason{list.length > 1 ? "s" : ""} · {masteredCount} maîtrisé{masteredCount > 1 ? "s" : ""} grâce aux quiz
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((a) => {
          const st = stats.arms[a.id];
          const mastered = isMastered(st);
          const weak = !!st && st.ko > st.ok;
          const hidden = hide && !revealed.has(a.id);
          const body = (
            <>
              <div className="relative">
                <Shield spec={a.shield} className="shield-shadow h-36 w-32" title={hidden ? "Blason" : a.name} />
                {mastered && <span className="absolute -right-2 -top-1 text-lg" title="Maîtrisé">✅</span>}
                {weak && <span className="absolute -right-2 -top-1 text-lg" title="À revoir">⚠️</span>}
              </div>
              <div className="mt-3 min-h-[3.2rem] text-center">
                {hidden ? (
                  <span className="text-sm italic text-ink-soft">Cliquez pour révéler</span>
                ) : (
                  <>
                    <span className="block font-bold leading-tight text-wine-dark">{a.name}</span>
                    <span className="mt-0.5 block text-xs text-ink-soft">{a.subtitle}</span>
                  </>
                )}
              </div>
            </>
          );
          const cls = "card flex h-full w-full flex-col items-center p-4 transition hover:-translate-y-1 hover:shadow-xl";
          return (
            <li key={a.id}>
              {hide ? (
                <div
                  role="button"
                  tabIndex={0}
                  className={`${cls} cursor-pointer`}
                  onClick={() => setRevealed((r) => new Set(r).add(a.id))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setRevealed((r) => new Set(r).add(a.id));
                  }}
                >
                  {body}
                  {!hidden && (
                    <Link href={`/armorial/${a.id}`} className="mt-2 text-xs font-semibold text-wine underline">
                      Voir la fiche
                    </Link>
                  )}
                </div>
              ) : (
                <Link href={`/armorial/${a.id}`} className={cls}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="mt-10 text-center text-ink-soft">Aucun blason ne correspond à cette recherche.</p>}
    </div>
  );
}
