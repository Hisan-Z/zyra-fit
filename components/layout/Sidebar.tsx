"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Utensils, Dumbbell, BookOpen, Activity, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Nutrition", href: "/nutrition", icon: Utensils },
    { name: "Fitness", href: "/fitness", icon: Dumbbell },
    { name: "Recipes", href: "/recipes", icon: BookOpen },
    { name: "History", href: "/history", icon: Activity },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen border-r border-border-default bg-surface sticky top-0 left-0 pt-6">
            <div className="px-6 mb-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-lime shadow-[0_0_12px_rgba(200,255,0,0.5)] flex items-center justify-center">
                    <span className="text-void font-bold text-xl">Z</span>
                </div>
                <span className="font-display font-bold text-2xl tracking-wide uppercase">
                    Zyra<span className="text-lime">fit</span>
                </span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                isActive
                                    ? "bg-lime/10 text-lime shadow-[0_0_0_1px_rgba(200,255,0,0.2)]"
                                    : "text-text-secondary hover:bg-overlay hover:text-text-primary"
                            )}
                        >
                            <item.icon size={20} className={isActive ? "text-lime drop-shadow-[0_0_8px_rgba(200,255,0,0.6)]" : ""} />
                            {item.name}

                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-lime animate-neon-pulse" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 mt-auto">
                <Link
                    href="/profile"
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                        pathname === "/profile"
                            ? "bg-lime/10 text-lime"
                            : "text-text-secondary hover:bg-overlay hover:text-text-primary"
                    )}
                >
                    <Settings size={20} />
                    Settings
                </Link>
            </div>
        </aside>
    )
}
