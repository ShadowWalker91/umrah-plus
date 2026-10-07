'use client';

interface StepHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepName?: string;
  /** Center label prefix, e.g. "Checkout". */
  labelPrefix?: string;
}

/** Step chip + percentage + gold progress line used across the checkout steps. */
export default function StepHeader({
  currentStep,
  totalSteps,
  stepName,
  labelPrefix = 'Checkout',
}: StepHeaderProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  const centerLabel = stepName
    ? `${labelPrefix} • ${stepName}`
    : labelPrefix;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#c5a059]">
          Step {currentStep} of {totalSteps}{stepName ? ` • ${stepName}` : ''}
        </span>
        <span className="hidden md:block text-[11px] uppercase font-bold tracking-[0.2em] text-[#c5a059]/90">
          {centerLabel}
        </span>
        <span className="text-xs text-gray-400 font-light whitespace-nowrap">
          {percentage}% Completed
        </span>
      </div>
      <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#c5a059] to-[#f3d38a] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/** Breadcrumb shown on the summary hand-off screens (S2 / S3 design). */
export function PhaseBreadcrumb({ active }: { active: 1 | 2 | 3 }) {
  const steps: { n: 1 | 2 | 3; label: string }[] = [
    { n: 1, label: 'Choose Package' },
    { n: 2, label: 'Customize Itinerary' },
    { n: 3, label: 'Checkout' },
  ];

  return (
    <nav className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-7 text-[11px] sm:text-xs uppercase tracking-[0.15em] font-semibold">
      {steps.map((s, idx) => {
        const isActive = s.n === active;
        const isDone = s.n < active;
        return (
          <span key={s.n} className="flex items-center gap-2 sm:gap-3">
            {idx > 0 && (
              <span className="text-[#c5a059]">→</span>
            )}
            <span
              className={
                isActive
                  ? 'text-[#f3d38a] border-b-2 border-[#c5a059] pb-0.5'
                  : isDone
                    ? 'text-white/80 hover:text-[#f3d38a] cursor-default'
                    : 'text-gray-500'
              }
            >
              {s.n}. {s.label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
