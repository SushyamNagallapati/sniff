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
  }: {
    startFrequency: number;
    endFrequency: number;
    duration: number;
    gainValue: number;
    type?: OscillatorType;
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

      const now = context.currentTime;

      oscillator.type = type;

      oscillator.frequency.setValueAtTime(Math.max(1, startFrequency), now);

      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(1, endFrequency),
        now + duration,
      );

      gain.gain.setValueAtTime(Math.max(0.0001, gainValue), now);

      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(now);
      oscillator.stop(now + duration);
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
