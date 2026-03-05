"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/motion"
import { PageHeader } from "@/components/shared/PageHeader"
import { GlassCard } from "@/components/shared/GlassCard"
import { WeightLogModal } from "@/components/dashboard/WeightLogModal"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"

export default function DashboardPage() {
    const [isWeightModalOpen, setIsWeightModalOpen] = React.useState(false)
    const router = useRouter()

    const { mealSlots, fetchMealSlots, history, fetchHistory } = useAppStore()
    const [goals, setGoals] = React.useState({ dailyCalGoal: 2000, proteinPct: 30, carbsPct: 40, fatPct: 30 })

    React.useEffect(() => {
        if (mealSlots.length === 0) fetchMealSlots();
        fetchHistory(0);

        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.dailyCalGoal) setGoals(data)
            })
            .catch(console.error)
    }, [fetchMealSlots, fetchHistory, mealSlots.length])

    // Calculate actual eaten numbers
    const eatenCals = mealSlots.reduce((acc, slot) => acc + slot.items.reduce((s, i) => s + i.calories, 0), 0)
    const eatenPro = mealSlots.reduce((acc, slot) => acc + slot.items.reduce((s, i) => s + i.proteinG, 0), 0)
    const eatenCarb = mealSlots.reduce((acc, slot) => acc + slot.items.reduce((s, i) => s + i.carbsG, 0), 0)
    const eatenFat = mealSlots.reduce((acc, slot) => acc + slot.items.reduce((s, i) => s + i.fatG, 0), 0)

    // Today's burned calories from history
    const burnedCals = history?.summary.totalBurned || 0
    const netCals = eatenCals - burnedCals
    const calGoal = goals.dailyCalGoal
    const completionPct = Math.min(100, Math.round((netCals / calGoal) * 100)) || 0

    // Macro targets based on caloric goal
    const targetPro = Math.round((calGoal * (goals.proteinPct / 100)) / 4)
    const targetCarb = Math.round((calGoal * (goals.carbsPct / 100)) / 4)
    const targetFat = Math.round((calGoal * (goals.fatPct / 100)) / 9)

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6 md:space-y-8"
        >
            <PageHeader
                title="Dashboard"
                subtitle="Daily fitness metrics and caloric balance at a glance."
            />

            <motion.div variants={fadeUp} className="w-full">
                <GlassCard glowColor={netCals > calGoal ? "red" : "lime"} className="overflow-hidden relative">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                        {/* Left side: Numbers */}
                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <h2 className="text-text-secondary font-mono text-sm uppercase tracking-widest">
                                Net Calories
                            </h2>
                            <div className="flex items-baseline justify-center md:justify-start gap-2">
                                <span className={`text-display text-7xl font-bold font-display ${netCals > calGoal ? 'text-nred' : 'text-text-primary'} drop-shadow-[0_0_16px_rgba(255,255,255,0.15)]`}>
                                    {Math.round(netCals)}
                                </span>
                                <span className={`${netCals > calGoal ? 'text-nred' : 'text-lime'} font-mono text-sm font-bold uppercase`}>Kcal</span>
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted font-mono uppercase">Eaten</span>
                                    <span className="font-bold text-lg text-lime">{Math.round(eatenCals)}</span>
                                </div>
                                <div className="text-text-muted font-bold text-xl">-</div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-text-muted font-mono uppercase">Burned</span>
                                    <span className="font-bold text-lg text-text-muted">{burnedCals}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right side: Ring Chart */}
                        <div className="w-48 h-48 relative flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 top-0 left-0 absolute">
                                {/* Background Ring */}
                                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" className="stroke-surface" />
                                {/* Progress Ring */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    className={`${netCals > calGoal ? 'stroke-nred drop-shadow-[0_0_12px_rgba(255,59,59,0.4)]' : 'stroke-lime drop-shadow-[0_0_12px_rgba(200,255,0,0.4)]'} transition-all duration-1000 ease-out`}
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (completionPct / 100))}`}
                                />
                            </svg>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-display font-bold">{completionPct}%</span>
                                <span className="text-xs text-text-secondary font-mono tracking-wider">OF GOAL</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
                {/* Macros */}
                {[
                    { label: "Protein", color: "text-lime", bg: "bg-surface border-lime/30", current: Math.round(eatenPro), goal: targetPro },
                    { label: "Carbs", color: "text-namber", bg: "bg-surface border-namber/30", current: Math.round(eatenCarb), goal: targetCarb },
                    { label: "Fat", color: "text-ncyan", bg: "bg-surface border-ncyan/30", current: Math.round(eatenFat), goal: targetFat },
                ].map((macro) => (
                    <div key={macro.label} className={`rounded-xl border ${macro.bg} p-4 flex flex-col items-center justify-center text-center`}>
                        <span className={`text-xs font-mono uppercase font-bold tracking-widest ${macro.color} mb-1`}>{macro.label}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold">{macro.current}</span>
                            <span className="text-text-muted text-xs">/{macro.goal}g</span>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Quick Actions Placeholder */}
            <motion.div variants={fadeUp} className="grid grid-flow-col auto-cols-auto gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                <button
                    onClick={() => router.push('/nutrition')}
                    className="min-w-[120px] snap-center py-4 bg-surface rounded-xl border border-border-default text-center text-sm font-bold shadow-sm hover:border-lime/50 transition-colors"
                >
                    + Log Food
                </button>
                <div className="min-w-[120px] snap-center py-4 bg-surface rounded-xl border border-border-default text-center text-sm font-bold shadow-sm">
                    + Log Workout
                </div>
                <div className="min-w-[120px] snap-center py-4 bg-surface rounded-xl border border-border-default text-center text-sm font-bold shadow-sm">
                    + Log Cardio
                </div>
                <button
                    onClick={() => setIsWeightModalOpen(true)}
                    className="min-w-[120px] snap-center py-4 bg-surface rounded-xl border border-border-default text-center text-sm font-bold shadow-sm hover:border-lime/50 transition-colors"
                >
                    + Log Weight
                </button>
            </motion.div>

            <WeightLogModal
                isOpen={isWeightModalOpen}
                onClose={() => setIsWeightModalOpen(false)}
            />
        </motion.div>
    )
}
