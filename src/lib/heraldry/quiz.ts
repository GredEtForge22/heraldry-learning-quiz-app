import { ARMORIAL, ARMS_BY_ID, similarity } from "./armorial";
import { GLOSSARY } from "./glossary";
import type { ArmEntry, Category } from "./types";

export type QuizType = "name" | "shield" | "blazon" | "read" | "vocab";

export const QUIZ_TYPES: { id: QuizType; label: string; desc: string; icon: string }[] = [
  { id: "name", label: "À qui est ce blason ?", desc: "Un blason s'affiche : retrouvez son propriétaire.", icon: "🛡️" },
  { id: "shield", label: "Quel est son blason ?", desc: "Un nom s'affiche : choisissez le bon blason parmi quatre.", icon: "🏰" },
  { id: "blazon", label: "Du texte au dessin", desc: "Un blasonnement est donné : trouvez l'écu correspondant.", icon: "📜" },
  { id: "read", label: "Savoir blasonner", desc: "Un écu s'affiche : choisissez sa description exacte.", icon: "🔎" },
  { id: "vocab", label: "Vocabulaire", desc: "Dextre, sénestre, tranché, alérion… testez votre lexique.", icon: "📖" },
];

export type Difficulty = 1 | 2 | 3;

export interface QuizOption {
  text?: string;
  armId?: string;
}

export interface Question {
  key: string;
  type: QuizType;
  /** blason concerné (pour les statistiques) */
  subjectId?: string;
  prompt: string;
  showShield?: string;
  showText?: string;
  optionKind: "text" | "shield";
  options: QuizOption[];
  answer: number;
  explain: string;
}

export interface QuizConfig {
  types: QuizType[];
  category: Category | "all";
  difficulty: Difficulty;
  count: number;
  stats?: Record<string, { ok: number; ko: number }>;
  onlyWeak?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(subject: ArmEntry, level: Difficulty, kind: "name" | "blazon"): ArmEntry[] {
  const others = ARMORIAL.filter((a) => a.id !== subject.id && (kind === "name" ? a.name !== subject.name : true));
  const scored = others
    .map((a) => ({ a, s: similarity(subject, a) + Math.random() * 0.08 }))
    .sort((x, y) => y.s - x.s);
  if (level === 3) {
    const top = scored.slice(0, 6).map((x) => x.a);
    return shuffle(top).slice(0, 3);
  }
  if (level === 2) {
    const top = scored.slice(0, 7).map((x) => x.a);
    const close = shuffle(top).slice(0, 1);
    const rest = shuffle(scored.slice(7).map((x) => x.a)).slice(0, 2);
    return [...close, ...rest];
  }
  // débutant : surtout des blasons très différents
  const far = scored.slice(Math.floor(scored.length / 3)).map((x) => x.a);
  return shuffle(far).slice(0, 3);
}

function weightedOrder(pool: ArmEntry[], stats: QuizConfig["stats"], count: number): ArmEntry[] {
  const chosen: ArmEntry[] = [];
  let remaining = [...pool];
  while (chosen.length < count) {
    if (remaining.length === 0) remaining = [...pool].filter((p) => chosen[chosen.length - 1]?.id !== p.id);
    const weights = remaining.map((a) => {
      const s = stats?.[a.id];
      return s ? Math.max(0.3, 1 + 2 * s.ko - 0.4 * s.ok) : 1.2;
    });
    const total = weights.reduce((x, y) => x + y, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < weights.length - 1; idx++) {
      r -= weights[idx];
      if (r <= 0) break;
    }
    chosen.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  return chosen;
}

function armExplain(a: ArmEntry): string {
  return `${a.name} (${a.subtitle}). Blasonnement : « ${a.blazon} » ${a.note}`;
}

function armQuestion(type: Exclude<QuizType, "vocab">, subject: ArmEntry, level: Difficulty, idx: number): Question {
  const distractors = pickDistractors(subject, level, type === "name" ? "name" : "blazon");
  const all = shuffle([subject, ...distractors]);
  const answer = all.findIndex((a) => a.id === subject.id);
  const base = { key: `${type}-${subject.id}-${idx}`, type, subjectId: subject.id, answer, explain: armExplain(subject) };
  switch (type) {
    case "name":
      return {
        ...base,
        prompt: "À qui appartient ce blason ?",
        showShield: subject.id,
        optionKind: "text",
        options: all.map((a) => ({ text: a.name })),
      };
    case "shield":
      return {
        ...base,
        prompt: `Quel est le blason de « ${subject.name} » ?`,
        optionKind: "shield",
        options: all.map((a) => ({ armId: a.id })),
      };
    case "blazon":
      return {
        ...base,
        prompt: "Quel écu correspond à ce blasonnement ?",
        showText: subject.blazon,
        optionKind: "shield",
        options: all.map((a) => ({ armId: a.id })),
      };
    case "read":
      return {
        ...base,
        prompt: "Quelle est la description exacte de cet écu ?",
        showShield: subject.id,
        optionKind: "text",
        options: all.map((a) => ({ text: a.blazon })),
      };
  }
}

function vocabQuestion(idx: number): Question {
  const entry = GLOSSARY[Math.floor(Math.random() * GLOSSARY.length)];
  const sameGroup = shuffle(GLOSSARY.filter((g) => g.group === entry.group && g.term !== entry.term));
  const others = shuffle(GLOSSARY.filter((g) => g.group !== entry.group));
  const distractors = [...sameGroup, ...others].slice(0, 3);
  const all = shuffle([entry, ...distractors]);
  const answer = all.findIndex((g) => g.term === entry.term);
  const reverse = Math.random() < 0.4;
  const explain = `« ${entry.term} » : ${entry.def}`;
  if (reverse) {
    return {
      key: `vocab-${entry.term}-${idx}`,
      type: "vocab",
      prompt: `Quel terme désigne ceci : « ${entry.def} »`,
      optionKind: "text",
      options: all.map((g) => ({ text: g.term })),
      answer,
      explain,
    };
  }
  return {
    key: `vocab-${entry.term}-${idx}`,
    type: "vocab",
    prompt: `Que signifie « ${entry.term} » en héraldique ?`,
    optionKind: "text",
    options: all.map((g) => ({ text: g.def })),
    answer,
    explain,
  };
}

export function buildQuiz(cfg: QuizConfig): Question[] {
  const types = cfg.types.length ? cfg.types : (["name"] as QuizType[]);
  let pool = ARMORIAL.filter(
    (a) => (cfg.category === "all" || a.category === cfg.category) && a.difficulty <= cfg.difficulty,
  );
  if (cfg.onlyWeak && cfg.stats) {
    const weak = pool.filter((a) => (cfg.stats?.[a.id]?.ko ?? 0) > 0);
    if (weak.length >= 3) pool = weak;
  }
  if (pool.length < 4) {
    pool = ARMORIAL.filter((a) => cfg.category === "all" || a.category === cfg.category);
  }
  const subjects = weightedOrder(pool, cfg.stats, cfg.count);
  return subjects.map((subject, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    if (type === "vocab") return vocabQuestion(i);
    return armQuestion(type, subject, cfg.difficulty, i);
  });
}

export { ARMS_BY_ID };
