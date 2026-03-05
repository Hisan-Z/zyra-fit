"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Utensils, Dumbbell, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Meals", href: "/nutrition", icon: Utensils },
    { name: "Workout", href: "/fitness", icon: Dumbbell },
    { name: "Stats", href: "/history", icon: Activity },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-border-default pb-safe">
            <div className="flex items-center justify-around px-2 py-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all relative",
                                isActive ? "text-lime" : "text-text-muted hover:text-text-secondary"
                            )}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-lime/10 rounded-2xl shadow-[inset_0_0_12px_rgba(200,255,0,0.1)]" />
                            )}
                            <item.icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={isActive ? "drop-shadow-[0_0_8px_rgba(200,255,0,0.4)] z-10" : "z-10"}
                            />
                            <span className={cn("text-[10px] mt-1 font-medium z-10", isActive ? "font-bold" : "")}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
