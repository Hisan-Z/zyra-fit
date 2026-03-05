"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { PageHeader } from "@/components/shared/PageHeader"
import { GlassCard } from "@/components/shared/GlassCard"
import { NeonButton } from "@/components/shared/NeonButton"
import { LogOut, Save, User, Activity, Loader2 } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MealSlotManager } from "./MealSlotManager"

interface ProfileProps {
    user: {
        name: string | null;
        email: string;
        dailyCalGoal: number;
        proteinPct: number;
        carbsPct: number;
        fatPct: number;
        heightCm: number | null;
    }
}

export function ProfileClient({ user }: ProfileProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSaved, setIsSaved] = React.useState(false)
    const [formData, setFormData] = React.useState({
        name: user.name || "",
        dailyCalGoal: user.dailyCalGoal,
        proteinPct: user.proteinPct,
        carbsPct: user.carbsPct,
        fatPct: user.fatPct,
        heightCm: user.heightCm || "",
    })

    React.useEffect(() => {
        if (!isLoading) {
            setFormData({
                name: user.name || "",
                dailyCalGoal: user.dailyCalGoal,
                proteinPct: user.proteinPct,
                carbsPct: user.carbsPct,
                fatPct: user.fatPct,
                heightCm: user.heightCm || "",
            })
        }
    }, [user, isLoading])

    const totalPct = Number(formData.proteinPct) + Number(formData.carbsPct) + Number(formData.fatPct)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (totalPct !== 100) return

        setIsLoading(true)
        setIsSaved(false)
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    dailyCalGoal: Number(formData.dailyCalGoal),
                    proteinPct: Number(formData.proteinPct),
                    carbsPct: Number(formData.carbsPct),
                    fatPct: Number(formData.fatPct),
                    heightCm: formData.heightCm ? Number(formData.heightCm) : null,
                })
            })
            if (res.ok) {
                setIsSaved(true)
                router.refresh()
                setTimeout(() => setIsSaved(false), 3000)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 pb-24"
        >
            <motion.div variants={fadeUp} className="flex justify-between items-center">
                <PageHeader
                    title="Operator Target"
                    subtitle={user.email}
                />
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="p-3 bg-nred/10 text-nred hover:bg-nred/20 rounded-xl transition-colors shrink-0 card-glow-red mt-2"
                >
                    <LogOut size={20} />
                </button>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <motion.div variants={fadeUp}>
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-lime/10 rounded-lg">
                                <User size={20} className="text-lime" />
                            </div>
                            <h3 className="font-display font-bold text-lg uppercase tracking-wide text-text-primary">Personal Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Callsign</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-elevated border border-border-default rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/50 transition-all text-text-primary"
                                    placeholder="e.g. Maverick"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Height (cm)</label>
                                <input
                                    type="number"
                                    value={formData.heightCm}
                                    onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                                    className="bg-elevated border border-border-default rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-lime/50 transition-all font-mono text-text-primary"
                                    placeholder="180"
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border-default flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-lime/10 text-lime rounded-lg text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-lime/20 transition-all card-glow-lime disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                Save Details
                            </button>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-ncyan/10 rounded-lg">
                                <Activity size={20} className="text-ncyan" />
                            </div>
                            <h3 className="font-display font-bold text-lg uppercase tracking-wide text-text-primary">Nutrition Directives</h3>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Daily Calorie Target</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.dailyCalGoal}
                                        onChange={(e) => setFormData({ ...formData, dailyCalGoal: Number(e.target.value) })}
                                        className="w-full bg-elevated border border-border-default rounded-lg px-4 py-3 text-xl font-display font-bold focus:outline-none focus:border-lime/50 transition-all text-text-primary"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">KCAL</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-mono text-text-muted uppercase tracking-wider">
                                    <label>Macro Split</label>
                                    <span className={totalPct === 100 ? "text-lime" : "text-nred"}>
                                        Total: {totalPct}%
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.proteinPct}
                                                onChange={(e) => setFormData({ ...formData, proteinPct: Number(e.target.value) })}
                                                className="w-full bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-lime/50 text-text-primary"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">%</span>
                                        </div>
                                        <span className="text-[10px] text-lime uppercase font-mono tracking-widest text-center">Protein</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.carbsPct}
                                                onChange={(e) => setFormData({ ...formData, carbsPct: Number(e.target.value) })}
                                                className="w-full bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-namber/50 text-text-primary"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">%</span>
                                        </div>
                                        <span className="text-[10px] text-namber uppercase font-mono tracking-widest text-center">Carbs</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.fatPct}
                                                onChange={(e) => setFormData({ ...formData, fatPct: Number(e.target.value) })}
                                                className="w-full bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-ncyan/50 text-text-primary"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">%</span>
                                        </div>
                                        <span className="text-[10px] text-ncyan uppercase font-mono tracking-widest text-center">Fat</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <NeonButton
                        type="submit"
                        className={`w-full py-4 uppercase tracking-[0.2em] font-bold text-xs transition-all ${isSaved ? '!bg-lime !text-void !shadow-[0_0_20px_rgba(200,255,0,0.4)]' : ''}`}
                        disabled={isLoading || totalPct !== 100}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2 justify-center"><Loader2 size={16} className="animate-spin" /> SYNCHRONIZING...</span>
                        ) : isSaved ? (
                            <span className="flex items-center gap-2 justify-center"><Save size={16} /> PARAMETERS SAVED</span>
                        ) : (
                            <span className="flex items-center gap-2 justify-center"><Save size={16} /> SAVE PARAMETERS</span>
                        )}
                    </NeonButton>
                </motion.div>
            </form>

            <MealSlotManager />
        </motion.div>
    )
}
