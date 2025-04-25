
import React, { useCallback, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { VaultData } from "@/types/vault";
import { useDepositDrawer } from "@/hooks/useDepositDrawer";
import { DepositDrawerDetails } from "./DepositDrawerDetails";
import { DepositDrawerReview } from "./DepositDrawerReview";
import { DepositDrawerSuccess } from "./DepositDrawerSuccess";
import { useWallet } from "@/hooks/useWallet";
import { X } from "lucide-react";

interface DepositDrawerProps {
  open: boolean;
  onClose: () => void;
  vault: VaultData;
}

export function DepositDrawer({ open, onClose, vault }: DepositDrawerProps) {
  const { balance } = useWallet();
  
  // Properly initialize the deposit drawer hook with vault and onClose
  const depositDrawer = useDepositDrawer({ 
    vault, 
    onClose 
  });
  
  // Destructure all needed properties and methods from the hook
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
      getUnlockDate
    }
  } = depositDrawer;

  // Calculate return amount and total return using the calculation function
  const returnAmount = calculateEstimatedReturns();
  const totalReturn = amount ? parseFloat(amount) + returnAmount : 0;

  // Handle Escape key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Add event listener for Escape key
  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, handleKeyDown]);

  // Handle close button click
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  // If the drawer is not open, don't render anything
  if (!open) return null;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DrawerContent 
        className="sm:max-w-[420px] p-0 overflow-hidden"
      >
        <div className="pt-8 pb-6 px-7">
          <div className="flex justify-between items-center mb-6">
            <DrawerHeader className="p-0">
              <DrawerTitle className="text-xl font-bold text-white">
                Deposit to {vault.name}
              </DrawerTitle>
              <DrawerDescription className="text-sm text-white/60">
                {step === 'details' && "Enter your deposit amount and select a lockup period"}
                {step === 'confirmation' && "Confirm your deposit details"}
                {step === 'success' && "Your deposit was successful!"}
              </DrawerDescription>
            </DrawerHeader>
            <button 
              onClick={handleCloseClick}
              className="rounded-full h-8 w-8 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

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
              onBack={handleDepositAgain}
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

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

