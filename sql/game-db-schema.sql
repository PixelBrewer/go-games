-- ============================================================
-- go-game · Schema
-- NeonDB (PostgreSQL)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- platforms
-- Lookup table. One row per platform you own.
-- BIGINT identity PK — pass 1, 2, 3 directly in queries.
-- e.g. 1 = PlayStation 5 | 2 = Steam (PC) | 3 = Steam Deck
-- ------------------------------------------------------------
CREATE TABLE platforms (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT   NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- genres
-- Lookup table. Reusable genre definitions shared across games.
-- BIGINT identity PK — pass 1, 2, 3 directly in queries.
-- ------------------------------------------------------------
CREATE TABLE genres (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       TEXT   NOT NULL UNIQUE,
    tags       TEXT,
    mood       TEXT,
    categories TEXT
);

-- ------------------------------------------------------------
-- games
-- Core entity. Every other table relates back to this one.
-- BIGINT identity PK — pass 1, 2, 3 directly in queries.
-- ------------------------------------------------------------
CREATE TABLE games (
    id           BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title        TEXT        NOT NULL,
    description  TEXT,
    is_completed BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- game_platforms
-- Join table. One row per game per platform you own it on.
-- Tracks play progress per platform independently.
-- UUID PK — internal only, never typed by hand.
-- ------------------------------------------------------------
CREATE TABLE game_platforms (
    id          UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id     BIGINT NOT NULL REFERENCES games(id)     ON DELETE CASCADE,
    platform_id BIGINT NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    name        TEXT   NOT NULL,
    progress    FLOAT  NOT NULL DEFAULT 0.0,
    UNIQUE (game_id, platform_id)
);

-- ------------------------------------------------------------
-- game_genres
-- Join table. Links a game to one or more reusable genre rows.
-- UUID PK — internal only, never typed by hand.
-- ------------------------------------------------------------
CREATE TABLE game_genres (
    id       UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id  BIGINT NOT NULL REFERENCES games(id)  ON DELETE CASCADE,
    genre_id BIGINT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    name     TEXT   NOT NULL,
    UNIQUE (game_id, genre_id)
);

-- ------------------------------------------------------------
-- achievement_progress
-- One row per game per achievement source.
-- Steam (PC) and Steam Deck share source = 'Steam'.
-- PS5 trophies tracked separately under source = 'PlayStation'.
-- UUID PK — internal only, never typed by hand.
-- ------------------------------------------------------------
CREATE TABLE achievement_progress (
    id                     UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id                BIGINT  NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    source                 TEXT    NOT NULL,
    completion_percentage  FLOAT   NOT NULL DEFAULT 0.0,
    is_achievement_hunting BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (game_id, source)
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_game_platforms_game_id       ON game_platforms(game_id);
CREATE INDEX idx_game_platforms_platform_id   ON game_platforms(platform_id);
CREATE INDEX idx_game_genres_game_id          ON game_genres(game_id);
CREATE INDEX idx_game_genres_genre_id         ON game_genres(genre_id);
CREATE INDEX idx_achievement_progress_game_id ON achievement_progress(game_id);
