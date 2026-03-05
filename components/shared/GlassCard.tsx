"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends HTMLMotionProps<"div"> {
    glowColor?: "lime" | "red" | "cyan" | "none"
    children: React.ReactNode
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, glowColor = "none", children, ...props }, ref) => {

        let glowClass = ""
        if (glowColor === "lime") glowClass = "hover:card-glow-lime hover:-translate-y-1 transition-all"
        if (glowColor === "red") glowClass = "hover:card-glow-red hover:-translate-y-1 transition-all"
        if (glowColor === "cyan") glowClass = "hover:shadow-[0_0_0_1px_rgba(0,255,204,0.15),0_4px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all"

        return (
            <motion.div
                ref={ref}
                className={cn(
                    "rounded-xl bg-surface border border-[rgba(255,255,255,0.06)] p-6 shadow-lg backdrop-blur-sm",
                    glowClass,
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
GlassCard.displayName = "GlassCard"
