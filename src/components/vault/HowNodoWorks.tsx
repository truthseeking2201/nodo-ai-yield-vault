
import { Brain, RotateCw, Shield } from "lucide-react";

export function HowNodoWorks() {
  return (
    <div className="py-10 animate-fade-in">
      <h3 className="text-xl font-medium text-center mb-8">
        How our AI maximises your yield
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 p-4 glass-card">
          <div className="rounded-full bg-white/10 p-2">
            <Brain size={24} className="text-nova" />
          </div>
          <div>
            <h4 className="font-medium mb-1">Analyse</h4>
            <p className="text-sm text-white/70">
              Our AI continuously monitors market conditions, liquidity depths, and trading patterns to identify optimal yield opportunities.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-4 glass-card">
          <div className="rounded-full bg-white/10 p-2">
            <RotateCw size={24} className="text-orion" />
          </div>
          <div>
            <h4 className="font-medium mb-1">Rebalance</h4>
            <p className="text-sm text-white/70">
              AI automatically adjusts position ranges to capture more fees and minimize impermanent loss through predictive modeling.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-4 glass-card">
          <div className="rounded-full bg-white/10 p-2">
            <Shield size={24} className="text-emerald" />
          </div>
          <div>
            <h4 className="font-medium mb-1">Protect</h4>
            <p className="text-sm text-white/70">
              Multi-layered security monitors for MEV attacks and market manipulations while smart contracts undergo regular audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
