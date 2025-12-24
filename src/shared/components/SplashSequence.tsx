import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type SplashClip = {
  /** Friendly label for debugging / readability */
  name: string;
  /** Optimized primary source (recommended) */
  webmSrc: string;
  /** Fallback for platforms without WebM support */
  mp4Src: string;
};

export function SplashSequence({
  clips,
  onDone,
  onClipStart,
}: {
  clips: SplashClip[];
  onDone: () => void;
  onClipStart?: (clip: SplashClip, index: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const active = clips[index];
  const isLast = index >= clips.length - 1;

  const fallbackTimeoutMs = useMemo(() => {
    // Slightly above the clip duration so we don't get stuck if "ended" never fires.
    return 12_000;
  }, []);

  const advance = () => {
    if (isLast) onDone();
    else setIndex((i) => i + 1);
  };

  useEffect(() => {
    if (!active) return;
    onClipStart?.(active, index);
  }, [active, index, onClipStart]);

  // Best-effort autoplay kick. If blocked, we show a "Tap to continue" affordance.
  useEffect(() => {
    setAutoplayBlocked(false);
    const el = videoRef.current;
    if (!el) return;

    const play = async () => {
      try {
        await el.play();
      } catch {
        setAutoplayBlocked(true);
      }
    };

    // Queue on next tick so sources are applied.
    const t = window.setTimeout(play, 0);
    return () => window.clearTimeout(t);
  }, [index]);

  // Safety: if the video never ends (platform quirk), move on anyway.
  useEffect(() => {
    const t = window.setTimeout(advance, fallbackTimeoutMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, fallbackTimeoutMs]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black">
      <button
        type="button"
        onClick={onDone}
        className="absolute right-3 top-3 z-[110] rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md hover:bg-white/15 active:scale-95 transition"
        aria-label="Skip splash"
      >
        Skip
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <button
            type="button"
            className="w-full h-full"
            onClick={() => {
              // If autoplay was blocked, a tap should start playback.
              // Otherwise, a tap is treated as "skip ahead" for fast iteration.
              const el = videoRef.current;
              if (autoplayBlocked && el) {
                el.play().catch(() => {
                  // If still blocked, user can tap "Skip".
                });
                return;
              }
              advance();
            }}
            aria-label={autoplayBlocked ? 'Tap to play splash' : 'Tap to continue'}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              muted
              playsInline
              preload="auto"
              autoPlay
              onEnded={advance}
              onError={advance}
            >
              <source src={active.webmSrc} type="video/webm" />
              <source src={active.mp4Src} type="video/mp4" />
            </video>

            {autoplayBlocked && (
              <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center">
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                  Tap to play
                </div>
              </div>
            )}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


