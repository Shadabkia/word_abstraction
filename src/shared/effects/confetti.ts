type ConfettiPreset = 'soft' | 'win';

type ConfettiOptions = {
  preset?: ConfettiPreset;
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export async function burstConfetti(options: ConfettiOptions = {}): Promise<void> {
  if (typeof window === 'undefined') return;
  if (prefersReducedMotion()) return;

  const { default: confetti } = await import('canvas-confetti');
  const preset = options.preset ?? 'soft';

  if (preset === 'soft') {
    confetti({
      particleCount: 40,
      spread: 55,
      origin: { y: 0.65 },
      colors: ['#A8D8EA', '#AA96DA', '#FCBAD3', '#FFFFD2'],
      disableForReducedMotion: true,
    });
    return;
  }

  // 'win'
  confetti({
    particleCount: 120,
    spread: 75,
    origin: { y: 0.7 },
    colors: ['#6C5DD3', '#FFA2C0', '#4ADE80', '#60A5FA', '#FBBF24'],
    disableForReducedMotion: true,
  });
  confetti({
    particleCount: 70,
    spread: 120,
    origin: { y: 0.25 },
    scalar: 0.9,
    colors: ['#6C5DD3', '#FFA2C0'],
    disableForReducedMotion: true,
  });
}


