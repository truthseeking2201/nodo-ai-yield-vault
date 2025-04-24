
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { VaultData } from "@/types/vault";

export function useVaultDetail(vaultId: string) {
  const { 
    data: vault, 
    isLoading, 
    error 
  } = useQuery<VaultData | null>({
    queryKey: ['vault', vaultId],
    queryFn: () => vaultService.getVaultById(vaultId),
    enabled: !!vaultId,
  });

  const getVaultStyles = (id?: string) => {
    if (!id) return {
      gradientText: '',
      gradientBg: '',
      shadow: '',
      bgOpacity: ''
    };
    
    // Determine vault type based on ID
    let type: 'nova' | 'orion' | 'emerald' | undefined;
    
    if (id.includes('deep')) {
      type = 'nova';
    } else if (id.includes('cetus')) {
      type = 'orion';
    } else if (id.includes('sui-usdc')) {
      type = 'emerald';
    }
    
    if (!type) return {
      gradientText: '',
      gradientBg: '',
      shadow: '',
      bgOpacity: ''
    };
    
    switch (type) {
      case 'nova':
        return {
          gradientText: 'gradient-text-nova',
          gradientBg: 'gradient-bg-nova',
          shadow: 'hover:shadow-neon-nova',
          bgOpacity: 'bg-nova/20'
        };
      case 'orion':
        return {
          gradientText: 'gradient-text-orion',
          gradientBg: 'gradient-bg-orion',
          shadow: 'hover:shadow-neon-orion',
          bgOpacity: 'bg-orion/20'
        };
      case 'emerald':
        return {
          gradientText: 'gradient-text-emerald',
          gradientBg: 'gradient-bg-emerald',
          shadow: 'hover:shadow-neon-emerald',
          bgOpacity: 'bg-emerald/20'
        };
    }
  };

  return {
    vault,
    isLoading,
    error,
    getVaultStyles,
  };
}
