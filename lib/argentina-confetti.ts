import type { Options as ConfettiOptions } from "canvas-confetti";
import confetti from "canvas-confetti";

const CELESTE = "#75AADB";
const BLANCO = "#F8FAFC";
const DORADO = "#F4C430";
const CELESTE_OSCURO = "#2B4C7E";

export function isArgentinaCountry(country: string | null | undefined): boolean {
  if (country == null) return false;
  return country.trim().toLowerCase() === "argentina";
}

/**
 * Ráfaga de “papelitos” con tonos celeste, blanco y oro (bandera argentina).
 */
export function fireArgentinaConfetti(): void {
  if (typeof window === "undefined") return;

  const base: ConfettiOptions = {
    origin: { y: 0.75 },
    colors: [CELESTE, BLANCO, DORADO, CELESTE_OSCURO],
    disableForReducedMotion: true,
  };

  const count = 220;

  function burst(particleRatio: number, opts: ConfettiOptions) {
    void confetti({
      ...base,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  burst(0.25, { spread: 26, startVelocity: 55 });
  burst(0.2, { spread: 60 });
  burst(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  burst(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  burst(0.1, { spread: 120, startVelocity: 45 });
}
