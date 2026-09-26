export default function StepProgressBar({ 
  currentStep, 
  totalSteps,
  stepName
}: { 
  currentStep: number; 
  totalSteps: number;
  stepName?: string;
}) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#c5a059]">
          Progress {stepName ? `• ${stepName}` : ''}
        </span>
        <span className="text-xs text-gray-400 font-light">{percentage}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#c5a059] transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}
