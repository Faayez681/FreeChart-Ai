# Backend Database Schema and Models (Create Backend Schema)
## Project: FreeChart AI (v5.0 Pro)

---

### 1. Database Model Diagrams
FreeChart AI is modeled on a PostgreSQL relational database system to handle structured user history, system presets, and audit logs.

```
                  +-----------------------+
                  |       users           |
                  +-----------------------+
                  | id (UUID, PK)         |
                  | email (VARCHAR)       |
                  | registered_at (TS)    |
                  +-----------+-----------+
                              |
                              | 1:N
                              v
                  +-----------------------+
                  |      analysis         |
                  +-----------------------+
                  | id (UUID, PK)         |
                  | user_id (UUID, FK)    |
                  | asset (VARCHAR)       |
                  | trend (VARCHAR)       |
                  | confidence (INT)      |
                  | risk (VARCHAR)        |
                  | image_url (TEXT)      |
                  | analyzed_at (TS)      |
                  +-----------+-----------+
                              |
              +---------------+---------------+
              | 1:1                           | 1:N
              v                               v
  +-----------------------+       +-----------------------+
  |    backtest_runs      |       |    coach_conversations|
  +-----------------------+       +-----------------------+
  | id (UUID, PK)         |       | id (UUID, PK)         |
  | analysis_id (FK)      |       | analysis_id (FK)      |
  | scenario (VARCHAR)    |       | role (VARCHAR)        |
  | win_rate (DECIMAL)    |       | content (TEXT)        |
  | ratio (VARCHAR)       |       | sent_at (TS)          |
  +-----------------------+       +-----------------------+
```

---

### 2. Table Schemas & Column Configurations

#### Table 1: `users`
Represents registered trading accounts.
*   `id`: `UUID` | Primary Key, auto-generated.
*   `email`: `VARCHAR(255)` | Unique, user email.
*   `registered_at`: `TIMESTAMP` | Default now().

#### Table 2: `analysis`
Primary reports from visual processing outputs.
*   `id`: `UUID` | Primary Key.
*   `user_id`: `UUID` | Foreign Key references `users(id)`.
*   `asset`: `VARCHAR(100)` | E.g. "BTC-USD".
*   `trend`: `VARCHAR(20)` | E.g. "Bullish" / "Bearish" / "Neutral".
*   `confidence`: `INT` | Score from 0 to 100.
*   `risk`: `VARCHAR(20)` | E.g., "Low", "Medium", "High".
*   `entry_zone`: `VARCHAR(100)` | Entry suggestions bounds.
*   `stop_loss`: `VARCHAR(100)`
*   `image_url`: `TEXT` | Upload image pointer.
*   `analyzed_at`: `TIMESTAMP`

#### Table 3: `backtest_runs`
Results tracked under strategy simulators.
*   `id`: `UUID` | Primary Key.
*   `analysis_id`: `UUID` | Foreign Key references `analysis(id)`.
*   `scenario`: `VARCHAR(50)` | "Aggressive", "Default", "Defensive".
*   `win_rate`: `NUMERIC(5,2)` | Strategy profitability probability.
*   `risk_reward_ratio`: `VARCHAR(20)`
*   `consecutive_wins`: `INT`

#### Table 4: `coach_conversations`
Audit history of questions asked to the AI trade coach.
*   `id`: `UUID` | Primary key.
*   `analysis_id`: `UUID` | Foreign key references `analysis(id)`.
*   `role`: `VARCHAR(20)` | "user" or "assistant".
*   `content`: `TEXT` | Prompt or advice response content.
*   `sent_at`: `TIMESTAMP`
