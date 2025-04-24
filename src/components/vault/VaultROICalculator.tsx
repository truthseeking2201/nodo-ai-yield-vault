
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { VaultData } from "@/types/vault";

interface VaultROICalculatorProps {
  vault: VaultData;
}

export function VaultROICalculator({ vault }: VaultROICalculatorProps) {
  const [amount, setAmount] = useState("1000");
  const [sliderValue, setSliderValue] = useState<number[]>([1000]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    setSliderValue([parseInt(value) || 0]);
  };

  const handleSliderChange = (values: number[]) => {
    setSliderValue(values);
    setAmount(values[0].toString());
  };

  const calculateMonthlyReturn = (): string => {
    const principal = parseFloat(amount) || 0;
    const monthlyReturn = (principal * (vault.apr / 100)) / 12;
    return monthlyReturn.toFixed(2);
  };

  const calculateAnnualReturn = (): string => {
    const principal = parseFloat(amount) || 0;
    const annualReturn = principal * (vault.apr / 100);
    return annualReturn.toFixed(2);
  };

  return (
    <div className="rounded-lg bg-white/5 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">ROI Calculator</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">USDC</span>
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-24 h-7 text-sm bg-white/10 border-white/20"
          />
        </div>
      </div>
      
      <Slider
        value={sliderValue}
        min={100}
        max={10000}
        step={100}
        className="[&_.relative]:h-[3px] [&_.absolute]:bg-[#6F3BFF] [&_button]:h-4 [&_button]:w-4"
        onValueChange={handleSliderChange}
      />
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-white/60 mb-1">Monthly</p>
          <p className="font-mono text-emerald">~${calculateMonthlyReturn()}</p>
        </div>
        <div>
          <p className="text-xs text-white/60 mb-1">Annual</p>
          <p className="font-mono text-emerald">~${calculateAnnualReturn()}</p>
        </div>
      </div>
    </div>
  );
}
