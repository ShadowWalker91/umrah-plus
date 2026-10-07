'use client';

import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface BottomBarProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  submitting?: boolean;
  /** Price chip docked inside the primary button, e.g. "EST. TOTAL  AED 800". */
  priceChip?: string | null;
  /** 'submit' renders the green submit gradient from the design. */
  variant?: 'default' | 'submit';
  /** Optional middle action, e.g. the "Skip Transport" button. */
  middleAction?: ReactNode;
}

/**
 * Bottom action row shared by every checkout & summary screen: outlined
 * GO BACK on the left, gradient CONTINUE with the price chip on the right.
 * Wraps to stacked full-width rows whenever the row would get cramped so the
 * label and price chip never overlap.
 */
export default function BottomBar({
  onBack,
  onNext,
  nextLabel = 'Continue',
  backLabel = 'Go Back',
  submitting = false,
  priceChip,
  variant = 'default',
  middleAction,
}: BottomBarProps) {
  return (
    <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3 sm:gap-3 lg:gap-4">
      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="w-full sm:w-44 lg:w-52 shrink-0 rounded-xl border border-[#c5a059]/70 bg-[#0c0d10] text-[#f3d38a] hover:bg-[#c5a059] hover:text-black uppercase tracking-[0.18em] font-bold text-xs sm:text-sm py-4 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        {backLabel}
      </button>

      {middleAction}

      <button
        type="button"
        onClick={onNext}
        disabled={submitting}
        className={`w-full sm:w-auto min-w-[240px] flex-1 rounded-xl uppercase tracking-[0.18em] font-bold text-xs sm:text-sm py-4 px-4 flex items-center justify-center gap-3 transition-all disabled:opacity-75 cursor-pointer shadow-lg ${
          variant === 'submit'
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:brightness-110'
            : 'bg-gradient-to-r from-[#c5a059] via-[#dbb96f] to-[#e9cf8f] text-black hover:brightness-110'
        }`}
      >
        <span className="flex-1 min-w-0 flex items-center justify-center gap-2">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
              <span className="truncate">Submitting Request...</span>
            </>
          ) : (
            <>
              <span className="truncate">{nextLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </>
          )}
        </span>

        {priceChip && !submitting && (
          <span className="shrink-0 bg-black/85 text-[#f9e8a2] text-[10px] sm:text-[11px] font-bold tracking-wider px-2.5 sm:px-3 py-2 rounded-md border border-[#c5a059]/30 whitespace-nowrap">
            {priceChip}
          </span>
        )}
      </button>
    </div>
  );
}
