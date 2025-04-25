
import { ReactNode } from 'react';

interface StatChipProps {
  label: string;
  value: string;
  delta?: { value: number; timeframe?: string };
}

export function StatChip({ label, value, delta }: StatChipProps) {
  return (
    <div className="flex flex-col items-center py-3 px-4">
      <span className="text-[13px] font-medium text-[#9CA3AF]">{label}</span>
      <div className="flex items-start gap-1">
        <span className="font-mono text-[28px] font-semibold text-white tabular-nums">
          {value}
        </span>
        {delta && (
          <span className={`text-[13px] font-mono mt-1.5 ${delta.value >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
            {delta.value >= 0 ? '↑' : '↓'}
          </span>
        )}
      </div>
    </div>
  );
}
