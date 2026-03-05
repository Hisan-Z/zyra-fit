"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/motion"
import { PageHeader } from "@/components/shared/PageHeader"
import { GlassCard } from "@/components/shared/GlassCard"
import { NeonButton } from "@/components/shared/NeonButton"
import { Play, Loader2, Calendar, Trophy, ChevronRight, Zap, Clock } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { ActiveWorkoutModal } from "@/components/fitness/ActiveWorkoutModal"
import { TreadmillCalculator } from "@/components/fitness/TreadmillCalculator"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export default function FitnessPage() {
    const {
        recentWorkouts,
        fetchRecentWorkouts,
        isLoadingWorkouts,
        startWorkout,
        activeWorkout
    } = useAppStore()

    const [isTreadmillOpen, setIsTreadmillOpen] = React.useState(false)

    React.useEffect(() => {
        fetchRecentWorkouts()
    }, [fetchRecentWorkouts])

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <PageHeader
                title="Training"
                subtitle="Log workouts, measure progress."
            />

            <motion.div variants={fadeUp}>
                <GlassCard glowColor="lime" className="p-8 text-center flex flex-col items-center justify-center min-h-[300px] border-lime/30 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-lime/20 to-transparent" />

                    <div className="w-16 h-16 rounded-full bg-lime/10 flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(200,255,0,0.2)] border border-lime/20">
                        <Play size={32} className="text-lime translate-x-0.5" fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold font-display uppercase tracking-widest mb-2">
                        Initialize Session
                    </h2>
                    <p className="text-text-secondary mb-8 max-w-sm">
                        Begin a new training session or continue from a template to track your progress.
                    </p>
                    <NeonButton size="lg" className="w-full md:w-auto" onClick={() => startWorkout()}>
                        START EMPTY WORKOUT
                    </NeonButton>
                </GlassCard>
            </motion.div>

            <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => setIsTreadmillOpen(true)} className="text-left">
                        <GlassCard className="p-6 hover:border-lime/30 transition-all flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center border border-lime/20 group-hover:scale-110 transition-transform">
                                <Zap className="text-lime" size={24} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-lg uppercase tracking-wide">Cardio Labs</h3>
                                <p className="text-xs text-text-muted font-mono uppercase tracking-widest">ACSM Treadmill Calculator</p>
                            </div>
                        </GlassCard>
                    </button>

                    <GlassCard className="p-6 opacity-40 grayscale flex items-center gap-4 cursor-not-allowed">
                        <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center border border-border-default">
                            <Clock className="text-text-muted" size={24} />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-lg uppercase tracking-wide">VO2 Max Beta</h3>
                            <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Locked: Level 5 required</p>
                        </div>
                    </GlassCard>
                </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-default pb-2">
                    <h3 className="font-display text-xl font-bold uppercase tracking-wider">
                        Recent Activity
                    </h3>
                    <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                        Last 10 Sessions
                    </div>
                </div>

                {isLoadingWorkouts ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-4">
                        <Loader2 className="animate-spin text-lime" size={32} />
                        <span className="font-mono text-xs uppercase tracking-widest">Syncing Data...</span>
                    </div>
                ) : recentWorkouts.length === 0 ? (
                    <div className="p-12 rounded-2xl border border-dashed border-border-default text-center bg-surface/30">
                        <Calendar className="mx-auto text-text-muted mb-4 opacity-50" size={40} />
                        <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">No Recent Activity Found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentWorkouts.map((workout) => {
                            const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
                            const totalVolume = workout.exercises.reduce((sum, ex) =>
                                sum + ex.sets.reduce((sSum, set) => sSum + (set.weightKg * set.reps), 0), 0
                            )

                            return (
                                <Link
                                    key={workout.id}
                                    href={`/fitness/${workout.id}`}
                                    className="block"
                                >
                                    <GlassCard
                                        className="p-5 hover:border-lime/30 transition-all cursor-pointer group h-full"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-text-primary group-hover:text-lime transition-colors">
                                                    {workout.name}
                                                </h4>
                                                <span className="text-xs text-text-secondary font-mono">
                                                    {formatDistanceToNow(new Date(workout.date))} ago
                                                </span>
                                            </div>
                                            <Trophy size={18} className="text-namber opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex gap-4 text-xs font-mono tracking-wide text-text-muted">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] opacity-70">EXERCISES</span>
                                                <span className="text-text-primary font-bold">{workout.exercises.length}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] opacity-70">SETS</span>
                                                <span className="text-text-primary font-bold">{totalSets}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] opacity-70">VOLUME</span>
                                                <span className="text-lime font-bold">{Math.round(totalVolume).toLocaleString()} kg</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-border-default flex items-center justify-between text-xs font-mono text-text-muted group-hover:text-text-secondary transition-colors">
                                            <span>View Details</span>
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </GlassCard>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            <ActiveWorkoutModal isOpen={!!activeWorkout} />
            <TreadmillCalculator isOpen={isTreadmillOpen} onClose={() => setIsTreadmillOpen(false)} />
        </motion.div>
    )
}
