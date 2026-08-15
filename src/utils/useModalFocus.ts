import { useEffect, type RefObject } from "react";

/**
 * Elements that can hold keyboard focus, in DOM order.
 * `:not([disabled])` matters because a disabled control
 * would otherwise become a dead stop in the tab cycle.
 */
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Makes a dialog behave like one.
 *
 * `role="dialog"` and `aria-modal` are announcements, not
 * behaviour — on their own, Tab still walks straight out
 * of the dialog into the page behind it, and closing
 * drops focus onto <body>. This adds the four things
 * that actually make a modal modal:
 *
 *   - focus moves into the dialog when it opens
 *   - Tab and Shift+Tab cycle within it
 *   - focus returns to whatever opened it on close
 *   - the page behind it stops scrolling
 */
export function useModalFocus(
  isOpen: boolean,
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = (): HTMLElement[] =>
      Array.from(
        container.querySelectorAll(FOCUSABLE) as NodeListOf<HTMLElement>,
      ).filter((element) => element.offsetParent !== null);

    /* Move focus in, preferring the first real control. */
    const initial = focusable()[0] ?? container;

    initial.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      const elements = focusable();

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement;

      /*
       * Wrap at both ends. The active element can also be
       * outside the container entirely — if focus escaped,
       * pull it back rather than leaving it loose.
       */
      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    /* Stop the page behind the overlay from scrolling. */
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;

      previouslyFocused?.focus();
    };
  }, [isOpen, containerRef]);
}
