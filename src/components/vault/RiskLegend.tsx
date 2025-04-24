
export function RiskLegend() {
  return (
    <div className="flex items-center justify-start gap-3 text-[11px] text-[#9CA3AF] mb-2 animate-fade-in">
      <span className="flex items-center">
        <span className="inline-block w-2 h-2 bg-emerald rounded-full mr-1"></span>
        Stable
      </span>
      <span className="flex items-center">
        <span className="inline-block w-2 h-2 bg-orion rounded-full mr-1"></span>
        Balanced
      </span>
      <span className="flex items-center">
        <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
        High
      </span>
    </div>
  );
}
