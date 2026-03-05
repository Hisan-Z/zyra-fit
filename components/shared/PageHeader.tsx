"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { fadeUp } from "@/lib/motion"
import { cn } from "@/lib/utils"

export interface PageHeaderProps extends HTMLMotionProps<"div"> {
    title: string
    subtitle?: string
}

export function PageHeader({ title, subtitle, className, ...props }: PageHeaderProps) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={cn("mb-6 md:mb-8", className)}
            {...props}
        >
            <h1 className="text-h1 font-display tracking-tight text-foreground uppercase">
                {title}
                <span className="text-lime">.</span>
            </h1>
            {subtitle && (
                <p className="text-text-secondary mt-1 text-sm md:text-base">
                    {subtitle}
                </p>
            )}
        </motion.div>
    )
}
