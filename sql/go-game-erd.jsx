import { useState } from "react";

const TABLE_WIDTH = 260;
const ROW_H = 24;
const HEADER_H = 44;

const tables = [
  {
    id: "platforms",
    label: "platforms",
    subtitle: "lookup table",
    color: "#10b981",
    x: 30,
    y: 30,
    columns: [
      {
        name: "id",
        type: "BIGINT",
        pk: true,
        note: "Auto-incrementing — 1, 2, 3 …",
      },
      {
        name: "name",
        type: "TEXT",
        note: "'PlayStation 5' | 'Steam (PC)' | 'Steam Deck'",
      },
    ],
  },
  {
    id: "games",
    label: "games",
    subtitle: "core entity",
    color: "#6366f1",
    x: 335,
    y: 30,
    columns: [
      {
        name: "id",
        type: "BIGINT",
        pk: true,
        note: "Auto-incrementing — 1, 2, 3 …",
      },
      { name: "title", type: "TEXT" },
      { name: "description", type: "TEXT" },
      { name: "is_completed", type: "BOOLEAN" },
      { name: "created_at", type: "TIMESTAMPTZ" },
      { name: "updated_at", type: "TIMESTAMPTZ" },
    ],
  },
  {
    id: "genres",
    label: "genres",
    subtitle: "lookup table — reusable across games",
    color: "#8b5cf6",
    x: 640,
    y: 30,
    columns: [
      {
        name: "id",
        type: "BIGINT",
        pk: true,
        note: "Auto-incrementing — 1, 2, 3 …",
      },
      { name: "name", type: "TEXT", note: "'RPG' | 'Action' | 'Puzzle' …" },
      { name: "tags", type: "TEXT", note: "e.g. 'open-world, story-rich'" },
      { name: "mood", type: "TEXT", note: "e.g. 'epic' | 'chill' | 'intense'" },
      { name: "categories", type: "TEXT", note: "e.g. 'RPG' | 'Action'" },
    ],
  },
  {
    id: "game_platforms",
    label: "game_platforms",
    subtitle: "join — ownership & play progress",
    color: "#f59e0b",
    x: 30,
    y: 370,
    columns: [
      {
        name: "id",
        type: "UUID",
        pk: true,
        note: "Internal only — never typed by hand",
      },
      { name: "game_id", type: "BIGINT", fk: "games", note: "→ games.id" },
      {
        name: "platform_id",
        type: "BIGINT",
        fk: "platforms",
        note: "→ platforms.id",
      },
      { name: "name", type: "TEXT", note: "e.g. 'Elden Ring on PS5'" },
      { name: "progress", type: "FLOAT", note: "0.0 – 100.0 play progress" },
    ],
  },
  {
    id: "game_genres",
    label: "game_genres",
    subtitle: "join — links a game to a genre",
    color: "#f59e0b",
    x: 640,
    y: 370,
    columns: [
      {
        name: "id",
        type: "UUID",
        pk: true,
        note: "Internal only — never typed by hand",
      },
      { name: "game_id", type: "BIGINT", fk: "games", note: "→ games.id" },
      { name: "genre_id", type: "BIGINT", fk: "genres", note: "→ genres.id" },
      { name: "name", type: "TEXT", note: "e.g. 'Elden Ring → RPG'" },
    ],
  },
  {
    id: "achievement_progress",
    label: "achievement_progress",
    subtitle: "per-source achievement tracking",
    color: "#ef4444",
    x: 335,
    y: 590,
    columns: [
      {
        name: "id",
        type: "UUID",
        pk: true,
        note: "Internal only — never typed by hand",
      },
      { name: "game_id", type: "BIGINT", fk: "games", note: "→ games.id" },
      { name: "source", type: "TEXT", note: "'Steam' | 'PlayStation'" },
      { name: "completion_percentage", type: "FLOAT", note: "0.0 – 100.0" },
      {
        name: "is_achievement_hunting",
        type: "BOOLEAN",
        note: "true = actively going for 100%",
      },
    ],
  },
];

function getTableHeight(t) {
  return HEADER_H + t.columns.length * ROW_H + 8;
}

function getAnchor(tableId, side) {
  const t = tables.find((t) => t.id === tableId);
  const h = getTableHeight(t);
  const cx = t.x + TABLE_WIDTH / 2;
  const cy = t.y + h / 2;
  if (side === "top") return { x: cx, y: t.y };
  if (side === "bottom") return { x: cx, y: t.y + h };
  if (side === "left") return { x: t.x, y: cy };
  if (side === "right") return { x: t.x + TABLE_WIDTH, y: cy };
  return { x: cx, y: cy };
}

const relationships = [
  {
    from: "games",
    fSide: "left",
    to: "game_platforms",
    tSide: "top",
    label: "1 → many",
  },
  {
    from: "platforms",
    fSide: "bottom",
    to: "game_platforms",
    tSide: "top",
    label: "1 → many",
  },
  {
    from: "games",
    fSide: "right",
    to: "game_genres",
    tSide: "top",
    label: "1 → many",
  },
  {
    from: "genres",
    fSide: "bottom",
    to: "game_genres",
    tSide: "top",
    label: "1 → many",
  },
  {
    from: "games",
    fSide: "bottom",
    to: "achievement_progress",
    tSide: "top",
    label: "1 → many",
  },
];

function Arrow({ from, fSide, to, tSide, label }) {
  const a = getAnchor(from, fSide);
  const b = getAnchor(to, tSide);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let c1, c2;
  if (fSide === "bottom" && tSide === "top") {
    c1 = { x: a.x, y: a.y + dy * 0.5 };
    c2 = { x: b.x, y: b.y - dy * 0.5 };
  } else if (fSide === "left" && tSide === "top") {
    c1 = { x: a.x - 50, y: a.y };
    c2 = { x: b.x, y: b.y - 80 };
  } else if (fSide === "right" && tSide === "top") {
    c1 = { x: a.x + 50, y: a.y };
    c2 = { x: b.x, y: b.y - 80 };
  } else {
    c1 = { x: a.x + dx * 0.5, y: a.y };
    c2 = { x: b.x - dx * 0.5, y: b.y };
  }
  const d = `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
  const lx = (a.x + b.x) / 2;
  const ly = (a.y + b.y) / 2 - 10;
  return (
    <g>
      <path
        d={d}
        stroke="#334155"
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="6,3"
        markerEnd="url(#arrowhead)"
      />
      <rect
        x={lx - 28}
        y={ly - 12}
        width={56}
        height={15}
        rx={3}
        fill="#0f172a"
        opacity={0.85}
      />
      <text
        x={lx}
        y={ly}
        fill="#64748b"
        fontSize={9}
        textAnchor="middle"
        fontFamily="monospace"
      >
        {label}
      </text>
    </g>
  );
}

function Table({ table, active, onHover }) {
  const h = getTableHeight(table);
  return (
    <g
      transform={`translate(${table.x}, ${table.y})`}
      onMouseEnter={() => onHover(table.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "default" }}
    >
      <rect
        x={3}
        y={3}
        width={TABLE_WIDTH}
        height={h}
        rx={8}
        fill="black"
        opacity={0.2}
      />
      <rect
        width={TABLE_WIDTH}
        height={h}
        rx={8}
        fill="#1e293b"
        stroke={active ? table.color : "#334155"}
        strokeWidth={active ? 2 : 1}
      />
      <rect
        width={TABLE_WIDTH}
        height={HEADER_H}
        rx={8}
        fill={table.color}
        opacity={active ? 1 : 0.85}
      />
      <rect
        y={HEADER_H - 10}
        width={TABLE_WIDTH}
        height={10}
        fill={table.color}
        opacity={active ? 1 : 0.85}
      />
      <text
        x={TABLE_WIDTH / 2}
        y={17}
        fill="white"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="monospace"
      >
        {table.label}
      </text>
      <text
        x={TABLE_WIDTH / 2}
        y={32}
        fill="rgba(255,255,255,0.6)"
        fontSize={9}
        textAnchor="middle"
        fontFamily="monospace"
      >
        {table.subtitle}
      </text>
      {table.columns.map((col, i) => (
        <g key={col.name} transform={`translate(0, ${HEADER_H + i * ROW_H})`}>
          <rect
            width={TABLE_WIDTH}
            height={ROW_H}
            fill={i % 2 === 0 ? "#1e293b" : "#1c2a3e"}
          />
          {col.pk && (
            <text
              x={7}
              y={16}
              fontSize={8}
              fill="#fbbf24"
              fontFamily="monospace"
              fontWeight="bold"
            >
              PK
            </text>
          )}
          {col.fk && (
            <text
              x={7}
              y={16}
              fontSize={8}
              fill="#60a5fa"
              fontFamily="monospace"
              fontWeight="bold"
            >
              FK
            </text>
          )}
          <text
            x={col.pk || col.fk ? 26 : 10}
            y={16}
            fontSize={11}
            fill="#e2e8f0"
            fontFamily="monospace"
          >
            {col.name}
          </text>
          <text
            x={TABLE_WIDTH - 8}
            y={16}
            fontSize={10}
            fill="#475569"
            textAnchor="end"
            fontFamily="monospace"
          >
            {col.type}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function App() {
  const [active, setActive] = useState(null);
  const activeTable = tables.find((t) => t.id === active);

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        padding: 20,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          color: "#f1f5f9",
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 2,
        }}
      >
        go-game · Database Schema
      </div>
      <div style={{ color: "#475569", fontSize: 11, marginBottom: 18 }}>
        Hover any table to inspect its columns
      </div>

      <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
        <svg
          width={930}
          height={820}
          style={{
            background: "#0f172a",
            borderRadius: 10,
            border: "1px solid #1e293b",
            flexShrink: 0,
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L0,7 L7,3.5 z" fill="#334155" />
            </marker>
          </defs>
          {relationships.map((r, i) => (
            <Arrow key={i} {...r} />
          ))}
          {tables.map((t) => (
            <Table
              key={t.id}
              table={t}
              active={active === t.id}
              onHover={setActive}
            />
          ))}
        </svg>

        <div
          style={{
            width: 265,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ background: "#1e293b", borderRadius: 8, padding: 14 }}>
            <div
              style={{
                color: "#64748b",
                fontSize: 10,
                fontWeight: "bold",
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              TABLE ROLES
            </div>
            {[
              {
                color: "#6366f1",
                label: "games",
                desc: "Core entity — everything links here",
              },
              {
                color: "#10b981",
                label: "platforms",
                desc: "Lookup — BIGINT PK, type by hand",
              },
              {
                color: "#8b5cf6",
                label: "genres",
                desc: "Lookup — BIGINT PK, type by hand",
              },
              {
                color: "#f59e0b",
                label: "game_platforms / game_genres",
                desc: "Join tables — UUID PK, internal only",
              },
              {
                color: "#ef4444",
                label: "achievement_progress",
                desc: "Tracking — UUID PK, internal only",
              },
            ].map((l) => (
              <div
                key={l.label}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: l.color,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  <div style={{ color: "#cbd5e1", fontSize: 11 }}>
                    {l.label}
                  </div>
                  <div
                    style={{ color: "#475569", fontSize: 10, lineHeight: 1.4 }}
                  >
                    {l.desc}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px solid #334155",
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: 10,
                  marginBottom: 6,
                  fontWeight: "bold",
                }}
              >
                ID TYPES
              </div>
              <div style={{ color: "#94a3b8", fontSize: 10, marginBottom: 4 }}>
                <span style={{ color: "#fbbf24" }}>BIGINT</span> — human-facing,
                type in queries
              </div>
              <div style={{ color: "#94a3b8", fontSize: 10, marginBottom: 8 }}>
                <span style={{ color: "#64748b" }}>UUID</span> — internal only,
                never typed
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <span style={{ color: "#fbbf24", fontSize: 9 }}>PK</span>
                  <span style={{ color: "#64748b", fontSize: 10 }}>
                    Primary Key
                  </span>
                </div>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <span style={{ color: "#60a5fa", fontSize: 9 }}>FK</span>
                  <span style={{ color: "#64748b", fontSize: 10 }}>
                    Foreign Key
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#1e293b",
              borderRadius: 8,
              padding: 14,
              minHeight: 140,
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontSize: 10,
                fontWeight: "bold",
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              COLUMN NOTES
            </div>
            {!activeTable ? (
              <div style={{ color: "#334155", fontSize: 11 }}>
                Hover a table to see details.
              </div>
            ) : (
              <>
                <div
                  style={{
                    color: activeTable.color,
                    fontSize: 12,
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  {activeTable.label}
                </div>
                {activeTable.columns.map((col) => (
                  <div key={col.name} style={{ marginBottom: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 5,
                        alignItems: "baseline",
                      }}
                    >
                      {col.pk && (
                        <span style={{ color: "#fbbf24", fontSize: 8 }}>
                          PK
                        </span>
                      )}
                      {col.fk && (
                        <span style={{ color: "#60a5fa", fontSize: 8 }}>
                          FK
                        </span>
                      )}
                      <span style={{ color: "#e2e8f0", fontSize: 11 }}>
                        {col.name}
                      </span>
                      <span style={{ color: "#334155", fontSize: 9 }}>
                        {col.type}
                      </span>
                    </div>
                    {col.note && (
                      <div
                        style={{
                          color: "#64748b",
                          fontSize: 10,
                          paddingLeft: 4,
                          lineHeight: 1.4,
                        }}
                      >
                        {col.note}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <div style={{ background: "#1e293b", borderRadius: 8, padding: 14 }}>
            <div
              style={{
                color: "#64748b",
                fontSize: 10,
                fontWeight: "bold",
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              EXAMPLE QUERIES
            </div>
            {[
              {
                q: "Games I own on Steam",
                hint: "game_platforms JOIN platforms\nWHERE platforms.id = 2",
              },
              {
                q: "Games on multiple platforms",
                hint: "GROUP BY game_id\nHAVING COUNT(platform_id) > 1",
              },
              {
                q: "All RPG games",
                hint: "games JOIN game_genres\nWHERE genre_id = 1",
              },
              {
                q: "Steam achievement %",
                hint: "achievement_progress\nWHERE game_id = 1\nAND source = 'Steam'",
              },
              {
                q: "PS5 trophy progress",
                hint: "achievement_progress\nWHERE source = 'PlayStation'",
              },
            ].map((item) => (
              <div key={item.q} style={{ marginBottom: 10 }}>
                <div style={{ color: "#cbd5e1", fontSize: 11 }}>{item.q}</div>
                <pre
                  style={{
                    color: "#475569",
                    fontSize: 9,
                    margin: "3px 0 0 0",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.5,
                  }}
                >
                  {item.hint}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
