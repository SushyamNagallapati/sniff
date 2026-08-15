import React from "react";

/**
 * The only button in SNIFF.
 *
 * Corners are square everywhere. The app is set as an
 * editorial field guide, and the pill shapes that used
 * to appear on the upload and camera surfaces read as a
 * different product. Radius is not a per-component
 * decision.
 */
type ButtonVariant = "primary" | "secondary" | "quiet";

type ButtonSurface = "light" | "dark";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;

  /** The surface behind the button, which sets the focus ring offset. */
  surface?: ButtonSurface;

  children: React.ReactNode;
}

const BASE =
  "group inline-flex min-h-11 items-center justify-center gap-3 " +
  "font-data text-[9px] font-semibold uppercase tracking-[0.17em] " +
  "transition-[background-color,color,border-color,transform] duration-base ease-brand " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

/*
 * Primary is ink on light grounds and forest on dark
 * ones: ink on a dark surface is the surface, and the
 * button stops reading as a button.
 */
const VARIANTS: Record<ButtonSurface, Record<ButtonVariant, string>> = {
  light: {
    /** The one action a screen most wants you to take. */
    primary:
      "bg-ink px-6 py-3 text-paper hover:-translate-y-px hover:bg-forest active:translate-y-0",

    /** Equal-weight alternative sitting next to a primary. */
    secondary:
      "border border-rule bg-paper px-5 py-3 text-ink hover:border-forest hover:bg-surface",

    /**
     * Text-only, for an action offered alongside a
     * primary rather than competing with it. The rule
     * retracts on hover, so the affordance is visible at
     * rest and gets out of the way on approach.
     */
    quiet:
      "relative px-1 py-3 font-medium text-ink-soft hover:text-forest " +
      "after:absolute after:bottom-2 after:left-1 after:h-px after:w-[calc(100%-0.5rem)] " +
      "after:origin-left after:bg-rule-strong after:transition-transform after:duration-slow " +
      "after:ease-brand after:content-[''] hover:after:scale-x-0",
  },

  dark: {
    primary:
      "bg-forest px-6 py-3 text-paper hover:-translate-y-px hover:bg-moss active:translate-y-0",

    secondary:
      "border border-dark-rule px-5 py-3 text-paper hover:border-dark-muted hover:bg-dark-rule",

    quiet: "px-1 py-3 font-medium text-dark-muted hover:text-paper",
  },
};

const SURFACES: Record<ButtonSurface, string> = {
  light:
    "focus-visible:ring-forest focus-visible:ring-offset-3 focus-visible:ring-offset-canvas",
  dark: "focus-visible:ring-paper focus-visible:ring-offset-3 focus-visible:ring-offset-ink",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  surface = "light",
  className = "",
  type = "button",
  children,
  ...rest
}) => (
  <button
    type={type}
    className={`${BASE} ${VARIANTS[surface][variant]} ${SURFACES[surface]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);
