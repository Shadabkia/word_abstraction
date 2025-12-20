import { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/ui/utils';

export type CelebrationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  onCelebrate?: () => void;
  icon?: React.ReactNode;
};

export function CelebrationDialog({
  open,
  onOpenChange,
  title,
  description,
  primaryLabel = 'Continue',
  secondaryLabel,
  onPrimary,
  onSecondary,
  onCelebrate,
  icon,
}: CelebrationDialogProps) {
  const celebratedForThisOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      celebratedForThisOpen.current = false;
      return;
    }
    if (celebratedForThisOpen.current) return;
    celebratedForThisOpen.current = true;
    onCelebrate?.();
  }, [open, onCelebrate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[420px] rounded-[2rem] border-white/60 bg-white/90 p-0 shadow-2xl backdrop-blur-xl',
          'overflow-hidden',
        )}
      >
        <div className="relative px-6 pt-8 pb-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-400/10 to-blue-500/10" />

          <DialogHeader className="relative">
            <div className="mb-4 flex items-center justify-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-white/70 shadow-sm ring-1 ring-white/60">
                <div className="text-3xl">{icon ?? '✨'}</div>
              </div>
            </div>
            <DialogTitle className="text-center text-xl text-slate-900">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-center text-slate-600">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <DialogFooter className="relative mt-6 flex-col gap-2 sm:flex-col sm:justify-center">
            <Button
              className="h-12 w-full rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 text-white shadow-md hover:opacity-95"
              onClick={onPrimary}
            >
              {primaryLabel}
            </Button>
            {secondaryLabel ? (
              <Button
                variant="ghost"
                className="h-12 w-full rounded-2xl text-slate-700 hover:bg-white/60"
                onClick={() => onSecondary?.()}
              >
                {secondaryLabel}
              </Button>
            ) : null}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}


