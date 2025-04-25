const TOKEN_ICONS = {
  USDC: "/lovable-uploads/77821401-b055-4857-ad36-bf928d64b288.png",
  SUI: "/lovable-uploads/e98fb767-5c17-48d9-8040-d6e980c817c6.png",
  CETUS: "/lovable-uploads/76692f5e-3066-420a-bf20-93440e752a83.png",
  DEEP: "/lovable-uploads/1dd1c568-1e9b-4a6c-986d-a7b7efbab014.png"
};

export interface TokenIconProps {
  token: keyof typeof TOKEN_ICONS;
  size?: number;
  className?: string;
}

export function TokenIcon({ token, size = 24, className }: TokenIconProps) {
  return (
    <img
      src={TOKEN_ICONS[token]}
      alt={`${token} icon`}
      width={size}
      height={size}
      className={className}
    />
  );
}

const mapVaultIdToTokens = (id: string): [TokenIconProps["token"], TokenIconProps["token"]] => {
  const parts = id.split('-');
  
  const tokens = parts.map(part => {
    const upperPart = part.toUpperCase();
    
    if (upperPart in TOKEN_ICONS) {
      return upperPart as TokenIconProps["token"];
    }
    
    return "SUI" as TokenIconProps["token"];
  });
  
  return [tokens[0], tokens[1]] as [TokenIconProps["token"], TokenIconProps["token"]];
};

export function PairIcon({ tokens, size = 24 }: { tokens: [TokenIconProps["token"], TokenIconProps["token"]] | string, size?: number }) {
  const tokenPair = typeof tokens === 'string' ? mapVaultIdToTokens(tokens) : tokens;
  
  return (
    <div className="relative flex items-center">
      <TokenIcon token={tokenPair[0]} size={size} className="z-10" />
      <TokenIcon token={tokenPair[1]} size={size} className="-ml-3" />
    </div>
  );
}
