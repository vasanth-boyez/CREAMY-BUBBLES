import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-emboss hover:scale-105 active:scale-95",
        destructive:
          "rounded-3xl bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-emboss hover:scale-105 active:scale-95",
        outline:
          "rounded-3xl border-2 border-primary bg-card hover:bg-primary/10 shadow-soft hover:shadow-card hover:scale-105 active:scale-95",
        secondary:
          "rounded-3xl bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-emboss hover:scale-105 active:scale-95",
        ghost: "rounded-3xl bg-white/40 backdrop-blur-sm border-2 border-candy-purple/30 hover:bg-candy-purple/20 hover:border-candy-purple hover:shadow-soft hover:scale-105 active:scale-95 transition-all",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
        ice: "rounded-3xl bg-gradient-candy text-white font-extrabold shadow-glow hover:shadow-ambient hover:brightness-110 hover:scale-105 active:scale-95 transition-all",
        cart: "rounded-3xl bg-gradient-to-r from-candy-pink to-candy-purple text-white font-bold shadow-glow hover:shadow-ambient hover:brightness-110 hover:scale-105 active:scale-95 transition-all",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2",
        lg: "h-14 px-10 py-4",
        icon: "h-12 w-12",
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
