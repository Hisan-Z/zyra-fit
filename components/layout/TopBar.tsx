"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion"
import { format } from "date-fns"

export function TopBar() {
    const today = new Date()

    return (
        <motion.header
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="sticky top-0 z-50 w-full bg-void/80 backdrop-blur-md border-b border-border-default pt-4 pb-3 px-4 md:px-8"
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/profile" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border-default flex items-center justify-center overflow-hidden group-hover:border-lime transition-colors">
                        <span className="text-lime font-bold">Z</span>
                        {/* TODO: Add User Avatar image here when auth is integrated */}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-text-secondary uppercase tracking-widest group-hover:text-lime/70 transition-colors">Good morning</span>
                        <span className="font-bold text-sm">Operator</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden md:flex items-center px-3 py-1 bg-surface rounded-full border border-border-default text-xs font-mono">
                        <span className="text-lime mr-2">SYS.DATE</span>
                        {format(today, "MMM dd, yyyy")}
                    </div>

                    <Link
                        href="/profile"
                        className="md:hidden w-10 h-10 rounded-full bg-surface border border-border-default flex items-center justify-center hover:bg-overlay transition-colors"
                    >
                        <Settings size={18} className="text-text-primary" />
                    </Link>

                    <button className="relative w-10 h-10 rounded-full bg-surface border border-border-default flex items-center justify-center hover:bg-overlay transition-colors">
                        <Bell size={18} className="text-text-primary" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-lime animate-neon-pulse" />
                    </button>
                </div>
            </div>

            {/* Mobile date strip */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none md:hidden snap-x">
                {/* Mocking a 7-day strip */}
                {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                    const date = new Date(today)
                    date.setDate(date.getDate() + offset)
                    const isToday = offset === 0

                    return (
                        <div
                            key={offset}
                            className={`flex flex-col items-center justify-center min-w-[50px] py-2 rounded-lg border snap-center ${isToday
                                ? "bg-lime/10 border-lime text-lime shadow-[0_0_12px_rgba(200,255,0,0.2)]"
                                : "bg-surface border-border-default text-text-muted"
                                }`}
                        >
                            <span className="text-[10px] uppercase font-bold">{format(date, "EEE")}</span>
                            <span className={`text-lg font-mono font-bold ${isToday ? "text-lime" : "text-text-primary"}`}>
                                {format(date, "d")}
                            </span>
                        </div>
                    )
                })}
            </div>
        </motion.header>
    )
}
