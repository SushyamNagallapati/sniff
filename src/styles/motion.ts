/**
 * The motion system.
 *
 * Two curves and four durations, shared between CSS and
 * Motion so the two never drift. The CSS side lives in
 * index.css as `ease-brand` / `ease-ambient` and
 * `duration-fast` / `-base` / `-slow` / `-cinematic`.
 *
 * Seconds here, because Motion takes seconds.
 */

/**
 * A hard ease-out: 90% of the movement lands in the
 * first third. Use it for anything that should feel
 * like a response — buttons, reveals, markers.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Movement spread across the whole duration. Only for
 * slow photographic motion, where an ease-out finishes
 * long before the duration does and the transition
 * reads as a pop. Pair with DURATION.cinematic.
 */
export const EASE_AMBIENT = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  /** Immediate feedback: colour, opacity, small nudges. */
  fast: 0.18,

  /** The default. Anything that moves or resizes. */
  base: 0.32,

  /** Entrances, reveals, mode changes. */
  slow: 0.64,

  /** Slow photographic hovers only. */
  cinematic: 0.9,
} as const;

/**
 * Motion honours prefers-reduced-motion by collapsing
 * duration to zero rather than by dropping the state
 * change, so the end state is always reached.
 */
export const timing = (
  duration: number,
  shouldReduceMotion: boolean | null,
  extra: Record<string, unknown> = {},
) => ({
  duration: shouldReduceMotion ? 0 : duration,
  ease: EASE,
  ...extra,
});
