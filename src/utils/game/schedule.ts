/** The shape both the authored schedule and its localized scene copy share. */
type Stop = { from: number; to: number } & (
  | { room: string; x: number; y: number }
  | { away: unknown }
)

/**
 * Where a character is at a given hour.
 *
 * A pure lookup over a declared table, not a simulation: no pathfinding, no
 * loop, no stored position. The same hour always gives the same answer, and a
 * page opened at any hour places every character without having "run" to get
 * there.
 */
export function whereIs<T extends Stop>(schedule: readonly T[], hour: number): T {
  const h = ((Math.floor(hour) % 24) + 24) % 24
  const stop = schedule.find((s) => h >= s.from && h < s.to)
  // A gap is a data error the schedule tests catch; at runtime the first stop
  // is a defined place rather than a character that silently vanishes.
  return stop ?? schedule[0]
}

/**
 * The spot a character is usually found at: the first placed stop.
 *
 * When they are away, this is where the note saying so appears, so a visitor
 * who comes looking finds an explanation instead of an empty space.
 */
export function usualSpot<T extends Stop>(schedule: readonly T[]) {
  return schedule.find((s): s is Extract<T, { room: string }> => 'room' in s)
}
