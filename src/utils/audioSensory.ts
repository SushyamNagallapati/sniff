/**
 * Minimal procedural interface audio for SNIFF.
 *
 * Sounds are generated locally with the Web Audio API.
 * No external audio assets are loaded.
 */

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

class SensoryAudioEngine {
  private context: AudioContext | null = null;

  public enabled = true;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") {
      return null;
    }

    if (!this.context) {
      const audioWindow = window as WebkitWindow;

      const AudioContextConstructor =
        window.AudioContext ?? audioWindow.webkitAudioContext;

      if (!AudioContextConstructor) {
        return null;
      }

      this.context = new AudioContextConstructor();
    }

    if (this.context.state === "suspended") {
      void this.context.resume();
    }

    return this.context;
  }

  private playTone({
    startFrequency,
    endFrequency,
    duration,
    gainValue,
    type = "sine",
    startAt = 0,
  }: {
    startFrequency: number;
    endFrequency: number;
    duration: number;
    gainValue: number;
    type?: OscillatorType;
    /** Seconds from now to begin this note. Lets a phrase schedule several notes in one call. */
    startAt?: number;
  }) {
    if (!this.enabled) {
      return;
    }

    try {
      const context = this.getContext();

      if (!context) {
        return;
      }

      const oscillator = context.createOscillator();

      const gain = context.createGain();

      const start = context.currentTime + Math.max(0, startAt);

      oscillator.type = type;

      oscillator.frequency.setValueAtTime(
        Math.max(1, startFrequency),
        start,
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(1, endFrequency),
        start + duration,
      );

      gain.gain.setValueAtTime(Math.max(0.0001, gainValue), start);

      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(start);
      oscillator.stop(start + duration);
    } catch {
      /**
       * Audio feedback is optional.
       * Interface interaction must never fail because audio failed.
       */
    }
  }

  /**
   * Subtle ping when selecting a discovery.
   */
  public playDiscoveryPing(score = 80) {
    const safeScore = Math.max(0, Math.min(100, score));

    const frequency = 440 + (safeScore / 100) * 320;

    this.playTone({
      startFrequency: frequency,
      endFrequency: frequency * 1.35,
      duration: 0.18,
      gainValue: 0.035,
      type: "sine",
    });
  }

  /**
   * Low tonal shift when switching between Original and Dog View.
   */
  public playModeSwitch(isDogMode: boolean) {
    this.playTone({
      startFrequency: isDogMode ? 220 : 180,

      endFrequency: isDogMode ? 140 : 280,

      duration: 0.15,
      gainValue: 0.028,
      type: "triangle",
    });
  }

  /**
   * Two-note rising chime for the moment a field report
   * finishes — the one point in the flow that was
   * previously silent despite being the payoff of the
   * whole wait. A fifth apart (D5 -> A5) so it reads as
   * "resolved" rather than another neutral blip.
   */
  public playReportReady() {
    this.playTone({
      startFrequency: 587,
      endFrequency: 622,
      duration: 0.16,
      gainValue: 0.03,
      type: "sine",
    });

    this.playTone({
      startFrequency: 880,
      endFrequency: 932,
      duration: 0.26,
      gainValue: 0.032,
      type: "sine",
      startAt: 0.1,
    });
  }

  /**
   * Small confirmation click for primary interface actions.
   */
  public playClick() {
    this.playTone({
      startFrequency: 800,
      endFrequency: 300,
      duration: 0.045,
      gainValue: 0.018,
      type: "sine",
    });
  }
}

export const sensoryAudio = new SensoryAudioEngine();
