"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const neonButtonVariants = cva(
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold transition-all disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-lime text-void btn-glow-active hover:shadow-[0_0_24px_rgba(200,255,0,0.6)]",
                danger: "bg-nred text-white hover:shadow-[0_0_24px_rgba(255,59,59,0.6)]",
                outline: "border-2 border-lime text-lime bg-transparent hover:bg-lime/10 hover:shadow-[0_0_16px_rgba(200,255,0,0.4)]",
                ghost: "text-text-secondary hover:text-lime hover:bg-overlay",
            },
            size: {
                default: "h-12 px-8 text-base",
                sm: "h-10 px-6 text-sm",
                lg: "h-16 px-10 text-lg uppercase tracking-wider",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
)

export interface NeonButtonProps
    extends Omit<HTMLMotionProps<"button">, "className" | "size">,
    VariantProps<typeof neonButtonVariants> {
    className?: string;
    children: React.ReactNode;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant, size, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.96 }}
                className={cn(neonButtonVariants({ variant, size, className }))}
                {...props}
            >
                {children}
            </motion.button>
        )
    }
)
NeonButton.displayName = "NeonButton"
