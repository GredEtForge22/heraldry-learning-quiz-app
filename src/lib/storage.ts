"use client";

import { useMemo, useSyncExternalStore } from "react";

const KEY = "heraldique-progress-v1";

export interface Stats {
  arms: Record<string, { ok: number; ko: number }>;
  games: number;
  best: number;
  answered: number;
  correct: number;
  pseudo: string;
}

const EMPTY: Stats = { arms: {}, games: 0, best: 0, answered: 0, correct: 0, pseudo: "" };

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseStats(raw: string): Stats {
  if (!raw) return EMPTY;
  try {
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Stats>) };
  } catch {
    return EMPTY;
  }
}

function write(update: (s: Stats) => Stats) {
  const next = update(parseStats(readRaw()));
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* stockage indisponible : on ignore */
  }
  listeners.forEach((l) => l());
}

export function useStats(): Stats {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  return useMemo(() => parseStats(raw), [raw]);
}

export function recordAnswer(armId: string | undefined, ok: boolean) {
  write((s) => {
    const arms = { ...s.arms };
    if (armId) {
      const cur = arms[armId] ?? { ok: 0, ko: 0 };
      arms[armId] = ok ? { ok: cur.ok + 1, ko: cur.ko } : { ok: cur.ok, ko: cur.ko + 1 };
    }
    return { ...s, arms, answered: s.answered + 1, correct: s.correct + (ok ? 1 : 0) };
  });
}

export function recordGame(score: number) {
  write((s) => ({ ...s, games: s.games + 1, best: Math.max(s.best, score) }));
}

export function savePseudo(pseudo: string) {
  write((s) => ({ ...s, pseudo }));
}

export function resetStats() {
  write(() => EMPTY);
}

/** « maîtrisé » : au moins 2 bonnes réponses de plus que d'erreurs */
export function isMastered(a?: { ok: number; ko: number }) {
  return !!a && a.ok - a.ko >= 2;
}
