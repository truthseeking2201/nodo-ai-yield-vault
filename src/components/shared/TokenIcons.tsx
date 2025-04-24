
const TOKEN_ICONS = {
  USDC: "/lovable-uploads/77821401-b055-4857-ad36-bf928d64b288.png",
  SUI: "/lovable-uploads/e98fb767-5c17-48d9-8040-d6e980c817c6.png",
  CETUS: "/lovable-uploads/76692f5e-3066-420a-bf20-93440e752a83.png",
  DEEP: "/lovable-uploads/1dd1c568-1e9b-4a6c-986d-a7b7efbab014.png",
  NODOAIx: "/lovable-uploads/38504c38-f4d1-460e-8d33-330e31311a5d.png"
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

export function PairIcon({ tokens, size = 24 }: { tokens: [TokenIconProps["token"], TokenIconProps["token"]], size?: number }) {
  return (
    <div className="relative flex items-center">
      <TokenIcon token={tokens[0]} size={size} className="z-10" />
      <TokenIcon token={tokens[1]} size={size} className="-ml-3" />
    </div>
  );
}
