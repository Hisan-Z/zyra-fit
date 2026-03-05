"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Zap,
    Activity,
    Timer,
    ChevronUp,
    Weight,
    CheckCircle2,
    Info
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { NeonButton } from "@/components/shared/NeonButton"
import { calculateTreadmill } from "@/lib/acsm"
import { useAppStore } from "@/store/useAppStore"
import { cn } from "@/lib/utils"

interface TreadmillCalculatorProps {
    isOpen: boolean
    onClose: () => void
}

export function TreadmillCalculator({ isOpen, onClose }: TreadmillCalculatorProps) {
    const { weightLogs, asyncLogCardio, fetchWeightLogs } = useAppStore()

    // Inputs
    const [speed, setSpeed] = React.useState(8.0)
    const [incline, setIncline] = React.useState(0)
    const [duration, setDuration] = React.useState(30)
    const [userWeight, setUserWeight] = React.useState(75)

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)

    // Sync latest weight log
    React.useEffect(() => {
        if (isOpen) {
            fetchWeightLogs()
        }
    }, [isOpen, fetchWeightLogs])

    React.useEffect(() => {
        if (weightLogs.length > 0) {
            setUserWeight(weightLogs[0].weightKg)
        }
    }, [weightLogs])

    const results = calculateTreadmill({
        speedKmh: speed,
        inclinePct: incline,
        durationMin: duration,
        weightKg: userWeight
    })

    const handleLog = async () => {
        setIsSubmitting(true)
        try {
            await asyncLogCardio({
                type: "treadmill",
                speedKmh: speed,
                inclinePct: incline,
                durationMin: duration,
                weightKg: userWeight,
                caloriesBurned: results.caloriesBurned,
                vo2: results.vo2,
                metValue: results.mets
            })
            setShowSuccess(true)
            setTimeout(() => {
                setShowSuccess(false)
                onClose()
            }, 2000)
        } catch (error) {
            console.error("Log cardio error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-void/80 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl"
                >
                    <GlassCard className="p-0 border-lime/30 overflow-hidden shadow-[0_0_50px_rgba(200,255,0,0.1)]">
                        {/* Header */}
                        <div className="p-6 border-b border-border-default flex items-center justify-between bg-elevated/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center border border-lime/20">
                                    <Activity className="text-lime" size={20} />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-xl uppercase tracking-wider">ACSM CALCULATOR</h2>
                                    <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">Metabolic Precision Tracking</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} className="text-text-muted" />
                            </button>
                        </div>

                        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Inputs */}
                            <div className="space-y-6">
                                {/* Speed */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <Zap size={12} className="text-lime" /> Speed (km/h)
                                        </label>
                                        <span className="font-display font-bold text-2xl text-lime italic">{speed.toFixed(1)}</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="25" step="0.1"
                                        value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-elevated rounded-lg appearance-none cursor-pointer accent-lime"
                                    />
                                    <div className="flex justify-between text-[8px] font-mono text-text-muted opacity-50 uppercase tracking-tighter">
                                        <span>Walk</span>
                                        <span>Jog</span>
                                        <span>Sprint</span>
                                    </div>
                                </div>

                                {/* Incline */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <ChevronUp size={12} className="text-lime" /> Incline (%)
                                        </label>
                                        <span className="font-display font-bold text-2xl text-lime italic">{incline}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="15" step="0.5"
                                        value={incline} onChange={(e) => setIncline(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-elevated rounded-lg appearance-none cursor-pointer accent-lime"
                                    />
                                </div>

                                {/* Duration */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <Timer size={12} className="text-lime" /> Duration (min)
                                        </label>
                                        <input
                                            type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                                            className="bg-transparent text-right font-display font-bold text-2xl text-lime italic focus:outline-none w-20"
                                        />
                                    </div>
                                    <input
                                        type="range" min="1" max="120" step="1"
                                        value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-elevated rounded-lg appearance-none cursor-pointer accent-lime"
                                    />
                                </div>

                                {/* Weight */}
                                <div className="space-y-3 p-4 bg-lime/5 border border-lime/10 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-lime/70 flex items-center gap-2">
                                            <Weight size={12} /> Body Weight
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number" value={userWeight} onChange={(e) => setUserWeight(parseFloat(e.target.value) || 0)}
                                                className="bg-transparent text-right font-display font-bold text-lg text-lime focus:outline-none w-16"
                                            />
                                            <span className="font-mono text-[10px] text-lime/50">KG</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Output Visualization */}
                            <div className="bg-void/40 rounded-2xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Activity size={80} className="text-lime" strokeWidth={1} />
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Estimated Burn</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-display font-black text-lime italic tabular-nums leading-none">
                                                {results.caloriesBurned}
                                            </span>
                                            <span className="text-xl font-display font-bold text-text-muted uppercase italic">Kcal</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest">Intensity Level</span>
                                            <div className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-center border",
                                                results.intensity === "Light" && "bg-ncyan/10 text-ncyan border-ncyan/20",
                                                results.intensity === "Moderate" && "bg-lime/10 text-lime border-lime/20",
                                                results.intensity === "Vigorous" && "bg-namber/10 text-namber border-namber/20",
                                                results.intensity === "High" && "bg-nred/10 text-nred border-nred/20",
                                            )}>
                                                {results.intensity}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest">MET Value</span>
                                            <div className="text-lg font-display font-bold text-text-primary px-1">
                                                {results.mets.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-elevated/50 rounded-xl border border-border-default space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary uppercase tracking-wider">
                                            <Info size={12} className="text-lime" /> Oxygen Consumption
                                        </div>
                                        <div className="text-xl font-display font-bold text-text-primary">
                                            {results.vo2} <span className="text-[10px] text-text-muted font-mono uppercase ml-1">VO2 ml/kg/min</span>
                                        </div>
                                    </div>
                                </div>

                                <NeonButton
                                    className="w-full mt-8"
                                    disabled={isSubmitting || showSuccess}
                                    onClick={handleLog}
                                >
                                    {isSubmitting ? "SYNCING..." : showSuccess ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle2 size={18} /> SESSION LOGGED
                                        </span>
                                    ) : "LOG CARDIO SESSION"}
                                </NeonButton>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
