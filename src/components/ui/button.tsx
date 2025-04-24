import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-[--t-fast] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A00] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-38 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "gradient-bg-brand text-[#0E0F11] shadow-[0_2px_6px_rgba(255,138,0,0.45)] hover:scale-[1.04] hover:shadow-[0_4px_14px_rgba(255,138,0,0.55)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[hsla(var(--c-stroke)/0.08)] bg-transparent text-[hsl(var(--c-text-primary))] hover:bg-[hsla(var(--c-glass)/0.05)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "border border-[hsla(var(--c-stroke)/0.08)] text-[hsl(var(--c-text-primary))] hover:bg-[hsla(var(--c-glass)/0.05)]",
        link: "text-[#FF8A00] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
