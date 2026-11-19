import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureTables } from "@/db/ensure";
import { quizScores } from "@/db/schema";

export const dynamic = "force-dynamic";

const CATEGORIES = ["all", "etats", "provinces", "villes", "maisons"];

export async function GET(req: Request) {
  try {
    await ensureTables();
    const url = new URL(req.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 100);
    const category = url.searchParams.get("category");
    const q = db.select().from(quizScores);
    const rows = await (category && CATEGORIES.includes(category)
      ? q.where(eq(quizScores.category, category))
      : q
    )
      .orderBy(desc(quizScores.score), desc(quizScores.createdAt))
      .limit(limit);
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(quizScores);
    return Response.json({ scores: rows, total: count });
  } catch {
    return Response.json({ scores: [], total: 0, error: "db" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON invalide" }, { status: 400 });
  }
  const pseudo = String(body.pseudo ?? "").trim().replace(/\s+/g, " ").slice(0, 24);
  const mode = String(body.mode ?? "").slice(0, 64);
  const category = String(body.category ?? "all");
  const num = (v: unknown, min: number, max: number) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : NaN;
  };
  const difficulty = num(body.difficulty, 1, 3);
  const total = num(body.total, 1, 100);
  const correct = num(body.correct, 0, 100);
  const seconds = num(body.seconds, 0, 86400);
  const score = num(body.score, 0, 100000);
  if (
    pseudo.length < 2 ||
    !mode ||
    !CATEGORIES.includes(category) ||
    [difficulty, total, correct, seconds, score].some(Number.isNaN) ||
    correct > total ||
    score > total * 200
  ) {
    return Response.json({ error: "Données invalides" }, { status: 400 });
  }
  try {
    await ensureTables();
    const [row] = await db
      .insert(quizScores)
      .values({ pseudo, mode, category, difficulty, total, correct, seconds, score })
      .returning();
    const [{ rank }] = await db
      .select({ rank: sql<number>`(count(*) + 1)::int` })
      .from(quizScores)
      .where(sql`${quizScores.score} > ${score}`);
    return Response.json({ ok: true, id: row.id, rank });
  } catch {
    return Response.json({ error: "Base de données indisponible" }, { status: 500 });
  }
}
