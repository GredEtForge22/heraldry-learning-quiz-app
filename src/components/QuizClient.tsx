"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ARMS_BY_ID } from "@/lib/heraldry/armorial";
import { Shield } from "@/lib/heraldry/Shield";
import { buildQuiz, QUIZ_TYPES, type Difficulty, type Question, type QuizType } from "@/lib/heraldry/quiz";
import { CATEGORY_LABELS, type Category } from "@/lib/heraldry/types";
import { recordAnswer, recordGame, savePseudo, useStats } from "@/lib/storage";

type Phase = "setup" | "play" | "done";

const LEVELS: { id: Difficulty; label: string; desc: string }[] = [
  { id: 1, label: "Découverte", desc: "Blasons célèbres, choix très différents" },
  { id: 2, label: "Initié", desc: "Plus de blasons, pièges plus subtils" },
  { id: 3, label: "Maître héraut", desc: "Tous les blasons, faux amis garantis" },
];

const COUNTS = [10, 20, 30];

interface AnswerLog {
  q: Question;
  picked: number;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-white/60 px-4 py-2 text-center">
      <div className="text-xl font-bold text-wine-dark">{value}</div>
      <div className="text-xs uppercase tracking-wider text-ink-soft">{label}</div>
    </div>
  );
}

export function QuizClient({ initialType }: { initialType?: QuizType }) {
  const stats = useStats();
  const [phase, setPhase] = useState<Phase>("setup");
  const [types, setTypes] = useState<QuizType[]>(
    initialType ? [initialType] : ["name", "shield", "blazon", "read"],
  );
  const [category, setCategory] = useState<Category | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty>(2);
  const [count, setCount] = useState(10);
  const [survival, setSurvival] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [lives, setLives] = useState(3);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [gain, setGain] = useState(0);
  const startedAt = useRef(0);
  const qStart = useRef(0);
  const [elapsed, setElapsed] = useState(0);

  const [pseudo, setPseudo] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [rank, setRank] = useState<number | null>(null);

  const weakCount = useMemo(() => Object.values(stats.arms).filter((a) => a.ko > 0).length, [stats.arms]);

  const toggleType = (t: QuizType) =>
    setTypes((cur) => (cur.includes(t) ? (cur.length > 1 ? cur.filter((x) => x !== t) : cur) : [...cur, t]));

  const start = (onlyWeak = false) => {
    const total = survival ? 40 : count;
    const qs = buildQuiz({ types, category, difficulty, count: total, stats: stats.arms, onlyWeak });
    setQuestions(qs);
    setIndex(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrect(0);
    setLives(3);
    setLog([]);
    setGain(0);
    setSendState("idle");
    setRank(null);
    startedAt.current = Date.now();
    qStart.current = Date.now();
    setPhase("play");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const q = questions[index];

  const choose = useCallback(
    (i: number) => {
      if (!q || picked !== null) return;
      const ok = i === q.answer;
      const secs = (Date.now() - qStart.current) / 1000;
      setPicked(i);
      setLog((l) => [...l, { q, picked: i }]);
      recordAnswer(q.subjectId, ok);
      if (ok) {
        const pts = 100 + Math.max(0, 40 - Math.round(secs * 4)) + Math.min(streak, 5) * 10;
        setScore((s) => s + pts);
        setGain(pts);
        setCorrect((c) => c + 1);
        setStreak((s) => {
          const n = s + 1;
          setBestStreak((b) => Math.max(b, n));
          return n;
        });
      } else {
        setGain(0);
        setStreak(0);
        if (survival) setLives((l) => l - 1);
      }
    },
    [q, picked, streak, survival],
  );

  const finish = useCallback(() => {
    setElapsed(Math.round((Date.now() - startedAt.current) / 1000));
    recordGame(score);
    setPseudo(stats.pseudo);
    setPhase("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [score, stats.pseudo]);

  const next = useCallback(() => {
    if (picked === null) return;
    const over = index + 1 >= questions.length || (survival && lives <= 0);
    if (over) {
      finish();
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
      qStart.current = Date.now();
    }
  }, [picked, index, questions.length, survival, lives, finish]);

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (picked === null && ["1", "2", "3", "4"].includes(e.key)) choose(Number(e.key) - 1);
      else if (picked !== null && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, picked, choose, next]);

  const submitScore = async () => {
    const name = pseudo.trim();
    if (name.length < 2) return;
    setSendState("sending");
    savePseudo(name);
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudo: name,
          mode: survival ? "Mort subite" : types.length === 1 ? types[0] : "Mixte",
          category,
          difficulty,
          score,
          correct,
          total: log.length,
          seconds: elapsed,
        }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { rank: number };
      setRank(data.rank);
      setSendState("sent");
    } catch {
      setSendState("error");
    }
  };

  /* ───────────── Réglages ───────────── */
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="text-4xl font-bold text-wine-dark">Quiz d&apos;héraldique</h1>
        <p className="mt-2 text-ink-soft">Choisissez vos épreuves, votre niveau, et lancez la joute.</p>

        <div className="card mt-8 space-y-8 p-6 sm:p-8">
          <section>
            <h2 className="mb-3 text-lg font-bold">1. Types de questions</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {QUIZ_TYPES.map((t) => {
                const on = types.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleType(t.id)}
                    className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                      on ? "border-wine bg-wine/10" : "border-line bg-white/50 hover:border-wine/50"
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span>
                      <span className="block font-bold">{t.label}</span>
                      <span className="block text-sm text-ink-soft">{t.desc}</span>
                    </span>
                    <span className="ml-auto text-lg">{on ? "☑" : "☐"}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">2. Thème</h2>
            <div className="flex flex-wrap gap-2">
              <button className="chip" data-on={category === "all"} onClick={() => setCategory("all")}>
                Tout l&apos;armorial
              </button>
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
                <button key={c} className="chip" data-on={category === c} onClick={() => setCategory(c)}>
                  {CATEGORY_LABELS[c]}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">3. Niveau</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setDifficulty(l.id)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    difficulty === l.id ? "border-wine bg-wine/10" : "border-line bg-white/50 hover:border-wine/50"
                  }`}
                >
                  <span className="block font-bold">{"★".repeat(l.id)}{"☆".repeat(3 - l.id)} {l.label}</span>
                  <span className="block text-sm text-ink-soft">{l.desc}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">4. Durée</h2>
            <div className="flex flex-wrap items-center gap-2">
              {COUNTS.map((c) => (
                <button
                  key={c}
                  className="chip"
                  data-on={!survival && count === c}
                  onClick={() => {
                    setSurvival(false);
                    setCount(c);
                  }}
                >
                  {c} questions
                </button>
              ))}
              <button className="chip" data-on={survival} onClick={() => setSurvival(true)}>
                ❤️ Mort subite (3 vies)
              </button>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button className="btn btn-primary text-lg" onClick={() => start(false)}>
              ⚔️ Commencer le quiz
            </button>
            {weakCount >= 3 && (
              <button className="btn btn-ghost" onClick={() => start(true)}>
                🔁 Revoir mes erreurs ({weakCount})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ───────────── Résultats ───────────── */
  if (phase === "done") {
    const total = log.length || 1;
    const pct = Math.round((correct / total) * 100);
    const title =
      pct >= 90 ? "Maître héraut" : pct >= 70 ? "Chevalier banneret" : pct >= 50 ? "Écuyer" : "Page de cour";
    const mistakes = log.filter((l) => l.picked !== l.q.answer);
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="card pop p-6 text-center sm:p-10">
          <p className="text-sm uppercase tracking-[0.25em] text-gold">Résultat</p>
          <h1 className="mt-2 text-4xl font-bold text-wine-dark">{title}</h1>
          <p className="mt-2 text-ink-soft">
            {correct} bonne{correct > 1 ? "s" : ""} réponse{correct > 1 ? "s" : ""} sur {log.length}
            {survival && lives <= 0 ? " — vous avez perdu vos trois vies" : ""}
          </p>
          <div className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Points" value={score} />
            <Stat label="Réussite" value={`${pct}%`} />
            <Stat label="Meilleure série" value={bestStreak} />
            <Stat label="Temps" value={`${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`} />
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-xl border border-line bg-white/60 p-4">
            {sendState === "sent" ? (
              <p className="font-semibold text-ok">
                Score enregistré ! Vous êtes n°{rank} au classement.{" "}
                <Link href="/classement" className="underline">
                  Voir le classement
                </Link>
              </p>
            ) : (
              <>
                <p className="mb-2 font-semibold">Inscrire ce score au classement</p>
                <div className="flex gap-2">
                  <input
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    maxLength={24}
                    placeholder="Votre pseudo"
                    className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-wine"
                    onKeyDown={(e) => e.key === "Enter" && submitScore()}
                  />
                  <button
                    className="btn btn-primary !py-2"
                    disabled={pseudo.trim().length < 2 || sendState === "sending"}
                    onClick={submitScore}
                  >
                    {sendState === "sending" ? "…" : "Envoyer"}
                  </button>
                </div>
                {sendState === "error" && (
                  <p className="mt-2 text-sm text-ko">Impossible d&apos;enregistrer le score pour le moment.</p>
                )}
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button className="btn btn-primary" onClick={() => start(false)}>
              Rejouer
            </button>
            <button className="btn btn-ghost" onClick={() => setPhase("setup")}>
              Changer les réglages
            </button>
          </div>
        </div>

        {mistakes.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-wine-dark">À retenir ({mistakes.length})</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {mistakes.map(({ q: mq }) => {
                const arm = mq.subjectId ? ARMS_BY_ID[mq.subjectId] : undefined;
                return (
                  <div key={mq.key} className="card flex gap-4 p-4">
                    {arm && <Shield spec={arm.shield} className="shield-shadow h-28 w-24 shrink-0" title={arm.name} />}
                    <div className="text-sm">
                      <p className="font-bold">{arm ? arm.name : mq.prompt}</p>
                      <p className="mt-1 text-ink-soft">{mq.explain}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  /* ───────────── Partie ───────────── */
  const subject = q.subjectId ? ARMS_BY_ID[q.subjectId] : undefined;
  const isOk = picked === q.answer;
  const progress = ((index + (picked !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm font-semibold">
        <span className="rounded-full bg-wine px-3 py-1 text-[#fdf3d7]">
          {survival ? `Question ${index + 1}` : `Question ${index + 1} / ${questions.length}`}
        </span>
        <span>🏆 {score} pts</span>
        {streak >= 2 && <span className="text-gold">🔥 série de {streak}</span>}
        {survival && <span>{"❤️".repeat(Math.max(lives, 0)) || "💀"}</span>}
        <button className="ml-auto text-ink-soft underline-offset-2 hover:underline" onClick={() => setPhase("setup")}>
          Abandonner
        </button>
      </div>
      {!survival && (
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-line/60">
          <div className="h-full bg-wine transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div key={q.key} className="card pop p-5 sm:p-8">
        <h2 className="text-center text-2xl font-bold text-wine-dark sm:text-3xl">{q.prompt}</h2>

        {q.showShield && ARMS_BY_ID[q.showShield] && (
          <div className="mt-6 flex justify-center">
            <Shield spec={ARMS_BY_ID[q.showShield].shield} className="shield-shadow h-56 w-48 sm:h-64 sm:w-56" />
          </div>
        )}
        {q.showText && (
          <blockquote className="mx-auto mt-6 max-w-2xl rounded-xl border-l-4 border-gold bg-white/60 px-5 py-4 text-center text-xl italic leading-relaxed">
            « {q.showText} »
          </blockquote>
        )}

        <div
          className={`mt-7 grid gap-3 ${
            q.optionKind === "shield" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {q.options.map((o, i) => {
            const state =
              picked === null ? "idle" : i === q.answer ? "right" : i === picked ? "wrong" : "faded";
            const cls =
              state === "right"
                ? "border-ok bg-ok/15"
                : state === "wrong"
                  ? "border-ko bg-ko/10 shake"
                  : state === "faded"
                    ? "border-line opacity-55"
                    : "border-line bg-white/70 hover:-translate-y-0.5 hover:border-wine hover:shadow-md";
            const arm = o.armId ? ARMS_BY_ID[o.armId] : undefined;
            return (
              <button
                key={i}
                type="button"
                disabled={picked !== null}
                onClick={() => choose(i)}
                className={`relative rounded-xl border-2 p-3 text-left transition ${cls} ${
                  q.optionKind === "shield" ? "flex flex-col items-center" : ""
                }`}
              >
                <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-parch-2 text-xs font-bold text-ink-soft">
                  {i + 1}
                </span>
                {arm ? (
                  <>
                    <Shield spec={arm.shield} className="shield-shadow h-32 w-28 sm:h-36 sm:w-32" />
                    {picked !== null && (
                      <span className="mt-2 text-center text-xs font-semibold leading-tight">{arm.name}</span>
                    )}
                  </>
                ) : (
                  <span className={`block ${q.type === "read" || q.type === "vocab" ? "pl-7 text-[15px]" : "pl-7 font-semibold"}`}>
                    {o.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div
            className={`pop mt-6 rounded-xl border-2 p-4 sm:p-5 ${
              isOk ? "border-ok/50 bg-ok/10" : "border-ko/40 bg-ko/5"
            }`}
          >
            <p className={`text-lg font-bold ${isOk ? "text-ok" : "text-ko"}`}>
              {isOk ? `✔ Bonne réponse ! +${gain} pts` : "✘ Pas tout à fait…"}
            </p>
            <div className="mt-2 flex items-start gap-4">
              {subject && q.optionKind === "shield" && (
                <Shield spec={subject.shield} className="shield-shadow hidden h-24 w-20 shrink-0 sm:block" />
              )}
              <p className="text-[15px] leading-relaxed text-ink">{q.explain}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="hidden text-xs text-ink-soft sm:block">Astuce : touche Entrée pour continuer</span>
              <button className="btn btn-primary ml-auto" onClick={next}>
                {index + 1 >= questions.length || (survival && lives <= 0) ? "Voir le résultat" : "Question suivante →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
