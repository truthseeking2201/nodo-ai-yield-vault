
interface LockupProgressProps {
  daysLeft: number;
  totalDays: number;
  isWithdrawable?: boolean;
}

export function LockupProgress({ daysLeft, totalDays, isWithdrawable = false }: LockupProgressProps) {
  const progress = Math.max(0, Math.min(100, ((totalDays - daysLeft) / totalDays) * 100));
  
  const getProgressColor = () => {
    if (isWithdrawable) return 'bg-emerald';
    if (progress < 33) return 'bg-red-500';
    if (progress < 66) return 'bg-orion';
    return 'bg-yellow-400';
  };
  
  return (
    <div className="w-full mt-1">
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
