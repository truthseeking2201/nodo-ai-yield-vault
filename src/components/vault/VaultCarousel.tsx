
import React from "react";
import { VaultCard } from "./VaultCard";
import { VaultData } from "@/types/vault";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface VaultCarouselProps {
  vaults: VaultData[];
  isConnected: boolean;
  balance: { usdc: number };
  activeVaultId: string | null;
  onVaultHover: (id: string) => void;
  carouselApi: any;
  setCarouselApi: (api: any) => void;
}

export function VaultCarousel({ 
  vaults, 
  isConnected, 
  balance,
  activeVaultId,
  onVaultHover,
  carouselApi,
  setCarouselApi
}: VaultCarouselProps) {
  return (
    <div className="md:hidden w-full px-4">
      <Carousel
        setApi={setCarouselApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {vaults.map((vault: VaultData) => (
            <CarouselItem key={vault.id} className="basis-[90%] pl-4">
              <VaultCard 
                vault={vault} 
                isConnected={isConnected} 
                hasBalance={balance.usdc > 0}
                isActive={activeVaultId === vault.id}
                onHover={() => onVaultHover(vault.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          {vaults.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeVaultId === vaults[index]?.id 
                  ? "bg-white" 
                  : "bg-white/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
