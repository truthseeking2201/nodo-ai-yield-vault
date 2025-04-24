
import { useState, useEffect, useRef } from "react";
import { VaultData } from "@/types/vault";
import { useWallet } from "@/hooks/useWallet";
import { vaultService } from "@/services/vaultService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface UseDepositDrawerProps {
  vault?: VaultData;
  onClose?: () => void;
}

export const useDepositDrawer = (props?: UseDepositDrawerProps) => {
  const navigate = useNavigate();
  const { balance } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [selectedLockup, setSelectedLockup] = useState<number>(30); // Default to 30 days
  const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');
  const [sliderValue, setSliderValue] = useState<number[]>([1000]);
  const [validationError, setValidationError] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [countUpValue, setCountUpValue] = useState(0);
  const [fadeRefresh, setFadeRefresh] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // If props include a vault with lockupPeriods, set the default selected lockup
  useEffect(() => {
    if (props?.vault?.lockupPeriods && props.vault.lockupPeriods.length > 0) {
      setSelectedLockup(props.vault.lockupPeriods[0].days);
    }
  }, [props?.vault]);

  useEffect(() => {
    if (!prefersReducedMotion) {
      audioRef.current = new Audio("/chime.mp3");
      audioRef.current.volume = 0.7;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    setAmount(sliderValue[0].toString());
  }, [sliderValue]);

  useEffect(() => {
    if (amount || selectedLockup) {
      setFadeRefresh(true);
      const timer = setTimeout(() => setFadeRefresh(false), 120);
      return () => clearTimeout(timer);
    }
  }, [amount, selectedLockup]);

  useEffect(() => {
    if (step === 'success' && amount) {
      const targetValue = parseFloat(amount);
      let startTime: number;
      let requestId: number;

      const easeOutExpo = (t: number): number => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      };

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 1000, 1);
        const easedProgress = easeOutExpo(progress);
        setCountUpValue(targetValue * easedProgress);
        
        if (progress < 1) {
          requestId = requestAnimationFrame(animate);
        }
      };

      requestId = requestAnimationFrame(animate);
      
      if (!prefersReducedMotion && audioRef.current) {
        audioRef.current.play().catch(err => console.warn("Audio playback failed:", err));
      }
      
      return () => {
        cancelAnimationFrame(requestId);
      };
    }
  }, [step, amount, prefersReducedMotion]);

  const depositMutation = useMutation({
    mutationFn: (params: { vaultId: string; amount: number; lockupPeriod: number }) => {
      return vaultService.deposit(params.vaultId, params.amount, params.lockupPeriod);
    },
    onSuccess: () => {
      setStep('success');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      if (props?.vault) {
        window.dispatchEvent(new CustomEvent('deposit-success', { 
          detail: { amount: parseFloat(amount), vaultId: props.vault.id } 
        }));
      }
    },
    onError: () => {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setAmount(value);
      if (value !== '') {
        const numVal = parseFloat(value);
        if (!isNaN(numVal)) {
          setSliderValue([Math.min(numVal, 10000)]);
        }
      } else {
        setSliderValue([0]);
      }
      validateAmount(value);
    }
  };

  const validateAmount = (value: string) => {
    if (!value) {
      setValidationError("");
      return;
    }
    
    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) {
      setValidationError("Min 1 USDC required");
    } else if (numVal > balance.usdc) {
      setValidationError("Exceeds wallet balance");
    } else {
      setValidationError("");
    }
  };

  const handleSliderChange = (values: number[]) => {
    setSliderValue(values);
    setAmount(values[0].toString());
    validateAmount(values[0].toString());
  };

  const handleMaxClick = () => {
    setAmount(String(balance.usdc));
    setSliderValue([balance.usdc]);
    validateAmount(String(balance.usdc));
  };

  const handleReviewClick = () => setStep('confirmation');
  
  const handleViewDashboard = () => {
    if (props?.onClose) props.onClose();
    navigate('/dashboard');
  };

  const handleDepositAgain = () => {
    setStep('details');
    setAmount("");
    setSliderValue([1000]);
    if (props?.vault?.lockupPeriods && props.vault.lockupPeriods.length > 0) {
      setSelectedLockup(props.vault.lockupPeriods[0].days);
    }
  };

  const handleConfirmDeposit = () => {
    if (!amount || !props?.vault) return;
    depositMutation.mutate({
      vaultId: props.vault.id,
      amount: parseFloat(amount),
      lockupPeriod: selectedLockup
    });
  };

  const calculateEstimatedReturns = () => {
    if (!amount || !props?.vault) return 0;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return 0;
    const boost = selectedLockup === 90 ? 0.025 : selectedLockup === 60 ? 0.012 : 0;
    const effectiveApr = (props.vault.apr + boost) / 100;
    return amountNum * effectiveApr * selectedLockup / 365;
  };

  // Function to open deposit drawer with a specific vault and optional initial amount
  const openDepositDrawer = (vault: VaultData, initialAmount?: number) => {
    if (initialAmount) {
      setAmount(initialAmount.toString());
      setSliderValue([initialAmount]);
      validateAmount(initialAmount.toString());
    }
    // This function would trigger drawer opening in the UI
    // The actual implementation would depend on how your drawer system works
    console.log(`Opening deposit drawer for vault ${vault.id} with amount ${initialAmount || 'default'}`);
    return { vault, initialAmount };
  };

  return {
    state: {
      amount,
      selectedLockup,
      step,
      sliderValue,
      validationError,
      showConfetti,
      countUpValue,
      fadeRefresh,
      depositMutation,
    },
    actions: {
      setSelectedLockup,
      handleAmountChange,
      handleSliderChange,
      handleMaxClick,
      handleReviewClick,
      handleConfirmDeposit,
      handleViewDashboard,
      handleDepositAgain,
      openDepositDrawer,
    },
    calculations: {
      calculateEstimatedReturns,
      getUnlockDate: () => {
        const date = new Date();
        date.setDate(date.getDate() + selectedLockup);
        return date;
      }
    }
  };
};
