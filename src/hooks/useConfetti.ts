import canvasConfetti from 'canvas-confetti';
import { useCallback } from 'react';

export const useConfetti = () => {
  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#5D3F6A', '#FF8C42', '#F9C74F', '#FF6B6B'], // App palette
    };

    function fire(particleRatio: number, opts: canvasConfetti.Options) {
      canvasConfetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const triggerSmallPop = useCallback((x: number, y: number) => {
    canvasConfetti({
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ['#5D3F6A', '#FF8C42', '#F9C74F'],
      disableForReducedMotion: true,
      scalar: 0.8,
    });
  }, []);

  return { triggerConfetti, triggerSmallPop };
};




