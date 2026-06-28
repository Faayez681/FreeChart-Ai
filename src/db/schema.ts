import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, numeric } from 'drizzle-orm/pg-core';

// Represents registered trading accounts linked to Firebase UID
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase Auth UID
  email: text('email').notNull(),
  registeredAt: timestamp('registered_at').defaultNow(),
});

// Primary reports from visual processing outputs
export const analysis = pgTable('analysis', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  asset: text('asset').notNull(),
  trend: text('trend').notNull(), // E.g. "Bullish" / "Bearish" / "Neutral"
  confidence: integer('confidence').notNull(),
  risk: text('risk').notNull(), // E.g., "Low", "Medium", "High"
  entryZone: text('entry_zone'),
  stopLoss: text('stop_loss'),
  imageUrl: text('image_url'),
  analyzedAt: timestamp('analyzed_at').defaultNow(),
});

// Results tracked under strategy simulators
export const backtestRuns = pgTable('backtest_runs', {
  id: text('id').primaryKey(),
  analysisId: text('analysis_id')
    .references(() => analysis.id)
    .notNull(),
  scenario: text('scenario').notNull(), // "Aggressive", "Default", "Defensive"
  winRate: numeric('win_rate', { precision: 5, scale: 2 }).notNull(),
  riskRewardRatio: text('risk_reward_ratio').notNull(),
  consecutiveWins: integer('consecutive_wins'),
});

// Audit history of questions asked to the AI trade coach
export const coachConversations = pgTable('coach_conversations', {
  id: text('id').primaryKey(),
  analysisId: text('analysis_id')
    .references(() => analysis.id)
    .notNull(),
  role: text('role').notNull(), // "user" or "assistant"
  content: text('content').notNull(),
  sentAt: timestamp('sent_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  analyses: many(analysis),
}));

export const analysisRelations = relations(analysis, ({ one, many }) => ({
  user: one(users, {
    fields: [analysis.userId],
    references: [users.id],
  }),
  backtestRuns: many(backtestRuns),
  coachConversations: many(coachConversations),
}));

export const backtestRunsRelations = relations(backtestRuns, ({ one }) => ({
  analysis: one(analysis, {
    fields: [backtestRuns.analysisId],
    references: [analysis.id],
  }),
}));

export const coachConversationsRelations = relations(coachConversations, ({ one }) => ({
  analysis: one(analysis, {
    fields: [coachConversations.analysisId],
    references: [analysis.id],
  }),
}));
