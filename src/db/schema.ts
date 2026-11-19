import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const quizScores = pgTable("quiz_scores", {
  id: serial("id").primaryKey(),
  pseudo: varchar("pseudo", { length: 24 }).notNull(),
  mode: varchar("mode", { length: 64 }).notNull(),
  category: varchar("category", { length: 24 }).notNull(),
  difficulty: integer("difficulty").notNull(),
  score: integer("score").notNull(),
  correct: integer("correct").notNull(),
  total: integer("total").notNull(),
  seconds: integer("seconds").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuizScore = typeof quizScores.$inferSelect;
