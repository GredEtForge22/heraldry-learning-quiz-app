import { sql } from "drizzle-orm";
import { db } from "./index";

let ready: Promise<void> | null = null;

/**
 * Crée la table si elle n'existe pas : le site fonctionne dès le premier
 * déploiement Vercel + Neon, sans étape de migration manuelle.
 * (Équivalent de `drizzle-kit push` pour ce schéma.)
 */
export function ensureTables(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS quiz_scores (
          id serial PRIMARY KEY,
          pseudo varchar(24) NOT NULL,
          mode varchar(64) NOT NULL,
          category varchar(24) NOT NULL,
          difficulty integer NOT NULL,
          score integer NOT NULL,
          correct integer NOT NULL,
          total integer NOT NULL,
          seconds integer NOT NULL,
          created_at timestamp NOT NULL DEFAULT now()
        )
      `);
      await db.execute(sql`CREATE INDEX IF NOT EXISTS quiz_scores_score_idx ON quiz_scores (score DESC)`);
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}
