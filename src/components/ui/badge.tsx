
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-caption font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-orange-500 text-text-inverse",
        secondary:
          "border-transparent bg-[#2D2E32] text-text-primary",
        destructive:
          "border-transparent bg-state-error text-white",
        outline: "text-text-primary border-stroke-soft",
        success: "bg-emerald/20 text-emerald",
        warning: "bg-orion/20 text-orion", 
        error: "bg-red-500/20 text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
