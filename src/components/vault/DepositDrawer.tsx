
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { VaultData } from "@/types/vault";
import { useDepositDrawer } from "@/hooks/useDepositDrawer";
import { DepositDrawerDetails } from "./DepositDrawerDetails";
import { DepositDrawerReview } from "./DepositDrawerReview";
import { DepositDrawerSuccess } from "./DepositDrawerSuccess";
import { useWallet } from "@/hooks/useWallet";

interface DepositDrawerProps {
  open: boolean;
  onClose: () => void;
  vault: VaultData;
}

export function DepositDrawer({ open, onClose, vault }: DepositDrawerProps) {
  const { balance } = useWallet();
  const {
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
    },
    calculations: {
      calculateEstimatedReturns,
    }
  } = useDepositDrawer({ vault, onClose });

  const returnAmount = calculateEstimatedReturns();
  const totalReturn = amount ? parseFloat(amount) + returnAmount : 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        className="sm:max-w-md overflow-y-auto glass-card border-white/20"
        style={{ transitionTimingFunction: "cubic-bezier(.22,1,.36,1)", transitionDuration: "240ms" }}
      >
        <SheetHeader>
          <SheetTitle className="text-2xl gradient-text-nova">
            Deposit to {vault.name}
          </SheetTitle>
          <SheetDescription>
            {step === 'details' && "Enter your deposit amount and select a lockup period"}
            {step === 'confirmation' && "Confirm your deposit details"}
            {step === 'success' && "Your deposit was successful!"}
          </SheetDescription>
        </SheetHeader>

        {step === 'details' && (
          <DepositDrawerDetails
            vault={vault}
            amount={amount}
            selectedLockup={selectedLockup}
            sliderValue={sliderValue}
            validationError={validationError}
            fadeRefresh={fadeRefresh}
            balance={balance}
            onAmountChange={handleAmountChange}
            onSliderChange={handleSliderChange}
            onMaxClick={handleMaxClick}
            onLockupChange={(value) => setSelectedLockup(parseInt(value))}
            onReviewClick={handleReviewClick}
            calculateEstimatedReturns={calculateEstimatedReturns}
          />
        )}

        {step === 'confirmation' && (
          <DepositDrawerReview
            vault={vault}
            amount={amount}
            selectedLockup={selectedLockup}
            returnAmount={returnAmount}
            totalReturn={totalReturn}
            isPending={depositMutation.isPending}
            onConfirm={handleConfirmDeposit}
            onBack={() => step !== 'success' && handleDepositAgain()}
          />
        )}

        {step === 'success' && (
          <DepositDrawerSuccess
            vault={vault}
            amount={amount}
            selectedLockup={selectedLockup}
            showConfetti={showConfetti}
            countUpValue={countUpValue}
            onViewDashboard={handleViewDashboard}
            onDepositAgain={handleDepositAgain}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
