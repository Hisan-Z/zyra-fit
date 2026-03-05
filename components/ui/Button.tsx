import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-lime text-void shadow hover:bg-lime/90",
                destructive:
                    "bg-nred text-void shadow-sm hover:bg-nred/90",
                outline:
                    "border border-border-default bg-transparent hover:bg-surface hover:text-foreground",
                secondary:
                    "bg-elevated text-foreground shadow-sm hover:bg-elevated/80",
                ghost: "hover:bg-overlay hover:text-foreground",
                link: "text-lime underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2 rounded-full",
                sm: "h-9 rounded-full px-4 text-xs",
                lg: "h-14 rounded-full px-8 text-lg font-bold",
                icon: "h-11 w-11 rounded-full",
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
