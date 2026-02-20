-- ============================================================
-- go-game · Seed Data
-- NeonDB (PostgreSQL)
-- Run this after 001_schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- platforms
-- BIGINT identity — IDs assigned automatically in order.
-- 1 = PlayStation 5 | 2 = Steam (PC) | 3 = Steam Deck
-- ------------------------------------------------------------
INSERT INTO platforms (name) VALUES
    ('PlayStation 5'),  -- id = 1
    ('Steam (PC)'),     -- id = 2
    ('Steam Deck');     -- id = 3

-- ------------------------------------------------------------
-- genres
-- BIGINT identity — IDs assigned automatically in order.
-- 1 = RPG | 2 = Action | 3 = Puzzle | 4 = Roguelike | 5 = Platformer
-- ------------------------------------------------------------
INSERT INTO genres (name, tags, mood, categories) VALUES
    ('RPG',        'open-world, story-rich, character-build', 'epic',    'RPG'),        -- id = 1
    ('Action',     'fast-paced, combat, boss-fights',         'intense', 'Action'),     -- id = 2
    ('Puzzle',     'problem-solving, relaxing, indie',        'chill',   'Puzzle'),     -- id = 3
    ('Roguelike',  'replayable, procedural, permadeath',      'focused', 'Strategy'),   -- id = 4
    ('Platformer', 'precision, movement, indie',              'focused', 'Platformer'); -- id = 5

-- ------------------------------------------------------------
-- games
-- BIGINT identity — IDs assigned automatically in order.
-- 1 = Elden Ring | 2 = Hollow Knight | 3 = Hades
-- 4 = Celeste    | 5 = Disco Elysium | 6 = God of War | 7 = Hades II
-- ------------------------------------------------------------
INSERT INTO games (title, description, is_completed) VALUES
    ('Elden Ring',     'Open-world action RPG from FromSoftware. Punishing but rewarding.',                 TRUE),   -- id = 1
    ('Hollow Knight',  'Challenging metroidvania set deep in an insect kingdom beneath a forgotten town.',  FALSE),  -- id = 2
    ('Hades',          'Roguelike dungeon crawler from Supergiant Games. Escape the Underworld.',           TRUE),   -- id = 3
    ('Celeste',        'Precision platformer about climbing a mountain and confronting your inner demons.', FALSE),  -- id = 4
    ('Disco Elysium',  'Detective RPG with deep narrative choices and a unique skill-check system.',        FALSE),  -- id = 5
    ('God of War',     'Kratos and Atreus journey through Norse mythology. PS5 exclusive in your library.', TRUE),   -- id = 6
    ('Hades II',       'Early access sequel to Hades. Play as Melinoe against the Titan of Time.',         FALSE);  -- id = 7

-- ------------------------------------------------------------
-- game_platforms
-- All foreign keys are plain integers — no UUIDs.
-- ------------------------------------------------------------
INSERT INTO game_platforms (game_id, platform_id, name, progress) VALUES
    -- Elden Ring (1): PS5 (1) + Steam PC (2)
    (1, 1, 'Elden Ring on PlayStation 5', 100.0),
    (1, 2, 'Elden Ring on Steam (PC)',     62.0),

    -- Hollow Knight (2): Steam Deck (3) only
    (2, 3, 'Hollow Knight on Steam Deck',  45.0),

    -- Hades (3): Steam PC (2) + Steam Deck (3)
    (3, 2, 'Hades on Steam (PC)',          100.0),
    (3, 3, 'Hades on Steam Deck',           78.0),

    -- Celeste (4): Steam PC (2) only
    (4, 2, 'Celeste on Steam (PC)',         30.0),

    -- Disco Elysium (5): Steam PC (2) only
    (5, 2, 'Disco Elysium on Steam (PC)',   15.0),

    -- God of War (6): PS5 (1) only
    (6, 1, 'God of War on PlayStation 5', 100.0),

    -- Hades II (7): Steam PC (2) only (early access)
    (7, 2, 'Hades II on Steam (PC)',        40.0);

-- ------------------------------------------------------------
-- game_genres
-- All foreign keys are plain integers — no UUIDs.
-- ------------------------------------------------------------
INSERT INTO game_genres (game_id, genre_id, name) VALUES
    -- Elden Ring (1): RPG (1) + Action (2)
    (1, 1, 'Elden Ring → RPG'),
    (1, 2, 'Elden Ring → Action'),

    -- Hollow Knight (2): Action (2) + Puzzle (3)
    (2, 2, 'Hollow Knight → Action'),
    (2, 3, 'Hollow Knight → Puzzle'),

    -- Hades (3): Roguelike (4) + Action (2)
    (3, 4, 'Hades → Roguelike'),
    (3, 2, 'Hades → Action'),

    -- Celeste (4): Platformer (5) + Puzzle (3)
    (4, 5, 'Celeste → Platformer'),
    (4, 3, 'Celeste → Puzzle'),

    -- Disco Elysium (5): RPG (1)
    (5, 1, 'Disco Elysium → RPG'),

    -- God of War (6): Action (2) + RPG (1)
    (6, 2, 'God of War → Action'),
    (6, 1, 'God of War → RPG'),

    -- Hades II (7): Roguelike (4) + Action (2)
    (7, 4, 'Hades II → Roguelike'),
    (7, 2, 'Hades II → Action');

-- ------------------------------------------------------------
-- achievement_progress
-- game_id is a plain integer — no UUIDs.
-- Steam PC and Steam Deck share one 'Steam' row per game.
-- PS5 trophies get their own 'PlayStation' row.
-- ------------------------------------------------------------
INSERT INTO achievement_progress (game_id, source, completion_percentage, is_achievement_hunting) VALUES
    -- Elden Ring (1): PS5 trophies + Steam achievements
    (1, 'PlayStation',  72.0, FALSE),
    (1, 'Steam',       100.0, FALSE),

    -- Hollow Knight (2): Steam only
    (2, 'Steam',  45.0, TRUE),

    -- Hades (3): Steam only (never owned on PS5)
    (3, 'Steam', 100.0, FALSE),

    -- Celeste (4): Steam only
    (4, 'Steam',  30.0, TRUE),

    -- Disco Elysium (5): Steam only
    (5, 'Steam',  15.0, FALSE),

    -- God of War (6): PlayStation trophies only
    (6, 'PlayStation', 100.0, FALSE),

    -- Hades II (7): Steam only (early access)
    (7, 'Steam',  40.0, FALSE);
