/**
 * Game data contracts.
 *
 * Every game-facing value that describes the portfolio is a *binding* to real
 * site data, never a copy of it. A room object stores `{ kind, slug }`; the
 * page resolves it against `projects.ts` or the blog collection at build time.
 * Copied prose drifts, and nobody plays their own portfolio often enough to
 * notice that it has.
 */

export interface Vec2 {
  x: number
  y: number
}

/** Copy that exists in both locales. Missing one is visible on sight. */
export interface LocalizedText {
  en: string
  id: string
}

/**
 * Tile codes as they appear in a room's `grid` rows. The full vocabulary, with
 * each code's art, layer and collision rule, lives in `utils/game/tiles.ts`;
 * these three are the ones the engine itself relies on.
 * `.` walkable floor · `#` solid · `+` door (walkable, triggers a room change)
 */
export type Tile = '.' | '#' | '+'

export type RoomId = 'valley' | 'workshop' | 'journal' | 'records'

/** What a room object points at. The object never carries the content itself. */
export interface ObjectBinding {
  kind: 'project' | 'post' | 'experience' | 'npc' | 'route'
  /**
   * Project slug, post slug, company name, NPC id, or a route path such as
   * `/about`. Resolved at build time.
   */
  slug: string
}

export interface RoomObject {
  id: string
  /** Tile coordinates, not pixels. */
  x: number
  y: number
  /** Sprite id; falls back to a drawn shape when no art exists. */
  sprite: string
  binding: ObjectBinding
}

/** A door tile and where it leads. */
export interface Door {
  x: number
  y: number
  to: RoomId
  /** Tile the player stands on after arriving — the paired entry point. */
  entry: Vec2
}

export interface Room {
  id: RoomId
  name: LocalizedText
  /** Row-major tile rows. Every row is the same length. */
  grid: string[]
  spawn: Vec2
  objects: RoomObject[]
  doors: Door[]
}

/**
 * An animated sprite sheet's frame contract.
 *
 * Only animated sheets are declared. A static sprite is registered by the
 * existence of its file alone — the convention `src/assets/sprites/README.md`
 * already documents and `skillIcon.ts` already implements.
 */
export interface SpriteSheet {
  id: string
  frameWidth: number
  frameHeight: number
  /** Declared image size, checked against the real file at build time. */
  width: number
  height: number
  /** Named animations → inclusive frame index range. */
  animations: Record<string, { from: number; to: number }>
  /** Milliseconds per frame. */
  frameDuration: number
}

export interface Sprite {
  id: string
  /** Resolved art URL, or undefined when only the drawn fallback exists. */
  url?: string
  sheet?: SpriteSheet
}

/** Where a character is for a span of hours: a spot in a room, or away. */
export type ScheduleStop =
  | { from: number; to: number; room: RoomId; x: number; y: number }
  | { from: number; to: number; away: LocalizedText }

/** An NPC's identity is derived from `collaborators.ts`, never duplicated. */
export interface Npc {
  id: string
  /** Must match a `Collaborator.name` exactly. */
  collaborator: string
  questIds: string[]
  /**
   * Hours are `[from, to)` on the visitor's clock and must cover 0 to 24 with
   * no gap, so every hour of the day places the character somewhere.
   */
  schedule: ScheduleStop[]
}

export type QuestState = 'locked' | 'available' | 'active' | 'complete'

export interface Quest {
  /** Stable across copy edits — saved progress resolves against it. */
  id: string
  npcId: string
  /** Quest that must be complete before this one leaves `locked`. */
  requires?: string
  title: LocalizedText
  /** Dialogue passages, shown one at a time. */
  passages: LocalizedText[]
  /** Scene events that must all fire for the quest to complete. */
  completedBy: string[]
  /** Optional canonical route this quest points at. */
  destination?: string
}

export interface Stat {
  name: string
  level: number
  /** Number of projects and experience entries listing this technology. */
  uses: number
  /** Years the technology appears across the experience timeline. */
  years: number
}

/** Opponents are abstract engineering obstacles — never a person or company. */
export interface Encounter {
  id: string
  opponent: LocalizedText
  hp: number
  maxTurns: number
}

export interface EncounterTurn {
  turn: number
  move: string
  damage: number
  opponentHp: number
}

export interface EncounterResult {
  outcome: 'won' | 'timeout' | 'skipped'
  turns: EncounterTurn[]
}

export interface GameSave {
  version: 1
  companionDismissed: boolean
  quests: Record<string, QuestState>
  /** Scene events already observed, e.g. `inspect:aira-reconciliation`. */
  events: string[]
}
