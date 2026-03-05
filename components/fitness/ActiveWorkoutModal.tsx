"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Trash2, Check, Clock, ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react"
import { useAppStore, type WorkoutSession, type WorkoutExercise, type WorkoutSet } from "@/store/useAppStore"
import { NeonButton } from "@/components/shared/NeonButton"
import { GlassCard } from "@/components/shared/GlassCard"
import { cn } from "@/lib/utils"

interface ActiveWorkoutModalProps {
    isOpen: boolean
}

export function ActiveWorkoutModal({ isOpen }: ActiveWorkoutModalProps) {
    const activeWorkout = useAppStore(state => state.activeWorkout)
    const addExercise = useAppStore(state => state.addExerciseToActiveWorkout)
    const removeExercise = useAppStore(state => state.removeExerciseFromActiveWorkout)
    const addSet = useAppStore(state => state.addSetToExercise)
    const updateSet = useAppStore(state => state.updateSetInExercise)
    const removeSet = useAppStore(state => state.removeSetFromExercise)
    const finishWorkout = useAppStore(state => state.finishWorkout)
    const cancelWorkout = useAppStore(state => state.cancelWorkout)

    const [isSearching, setIsSearching] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [searchResults, setSearchResults] = React.useState<{ name: string; id: number }[]>([])
    const [isFetching, setIsFetching] = React.useState(false)
    const [duration, setDuration] = React.useState(0)
    const [isFinishing, setIsFinishing] = React.useState(false)
    const [intensity, setIntensity] = React.useState<'Light' | 'Moderate' | 'Vigorous'>('Moderate')

    const weightLogs = useAppStore(state => state.weightLogs)
    const latestWeight = weightLogs.length > 0 ? weightLogs[0].weightKg : 70 // Fallback to 70kg

    const metValues = {
        'Light': 3.0,
        'Moderate': 4.5,
        'Vigorous': 6.0
    }

    const estimatedCalories = Math.round(
        metValues[intensity] * latestWeight * (duration / 3600)
    )

    // Timer logic
    React.useEffect(() => {
        let timer: NodeJS.Timeout
        if (isOpen && activeWorkout) {
            timer = setInterval(() => {
                setDuration(prev => prev + 1)
            }, 1000)
        } else {
            setDuration(0)
        }
        return () => clearInterval(timer)
    }, [isOpen, activeWorkout])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // Debounced search logic
    React.useEffect(() => {
        const fetchExercises = async () => {
            if (searchTerm.length < 2) {
                setSearchResults([])
                return
            }

            setIsFetching(true)
            try {
                const res = await fetch(`/api/fitness/exercises/search?term=${encodeURIComponent(searchTerm)}`)
                if (res.ok) {
                    const data = await res.json()
                    setSearchResults(data.results || [])
                }
            } catch (error) {
                console.error("Search fetch error:", error)
            } finally {
                setIsFetching(false)
            }
        }

        const timer = setTimeout(fetchExercises, 400)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const commonExercises = [
        "Bench Press (Barbell)",
        "Squat (Barbell)",
        "Deadlift (Barbell)",
        "Overhead Press (Barbell)",
        "Pull Up",
        "Barbell Row",
        "Dumbbell Bicep Curl",
        "Tricep Pushdown",
        "Lateral Raise",
        "Leg Press"
    ]

    if (!activeWorkout) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex flex-col bg-void">
                    {/* Header */}
                    <div className="safe-top bg-surface border-b border-border-default px-6 py-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={cancelWorkout}
                                className="p-2 -ml-2 text-text-secondary hover:text-nred transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <div>
                                <h2 className="font-display font-bold text-xl uppercase tracking-widest text-text-primary">
                                    {activeWorkout.name}
                                </h2>
                                <div className="flex items-center gap-2 text-xs font-mono text-lime">
                                    <Clock size={12} />
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>
                        <NeonButton
                            variant="primary"
                            size="sm"
                            onClick={() => setIsFinishing(true)}
                            disabled={activeWorkout.exercises.length === 0}
                        >
                            FINISH
                        </NeonButton>
                    </div>

                    {/* Completion Screen Overlay */}
                    <AnimatePresence>
                        {isFinishing && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 z-[160] bg-void flex flex-col p-6 items-center justify-center text-center space-y-8"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-display font-bold uppercase tracking-tighter text-lime">Workout Complete</h3>
                                    <p className="text-text-secondary font-body">Review your effort and finalize your log.</p>
                                </div>

                                <div className="w-full max-w-sm space-y-6">
                                    <GlassCard className="p-6 grid grid-cols-2 gap-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Duration</span>
                                            <span className="text-2xl font-display font-bold text-text-primary">{formatTime(duration)}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-mono text-lime uppercase tracking-widest">Est. Burn</span>
                                            <span className="text-2xl font-display font-bold text-lime">{estimatedCalories} kcal</span>
                                        </div>
                                    </GlassCard>

                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-1">Perceived Intensity</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(['Light', 'Moderate', 'Vigorous'] as const).map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setIntensity(level)}
                                                    className={cn(
                                                        "py-3 rounded-xl border text-xs font-mono transition-all",
                                                        intensity === level
                                                            ? "bg-lime border-lime text-void font-bold shadow-[0_0_15px_rgba(200,255,0,0.3)]"
                                                            : "bg-surface border-border-default text-text-muted hover:border-lime/50"
                                                    )}
                                                >
                                                    {level.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full max-w-sm flex flex-col gap-3">
                                    <NeonButton
                                        className="w-full py-4 text-sm"
                                        onClick={async () => {
                                            useAppStore.getState().updateActiveWorkout({
                                                durationMin: Math.floor(duration / 60),
                                                caloriesBurned: estimatedCalories
                                            })
                                            await finishWorkout()
                                            setIsFinishing(false)
                                        }}
                                    >
                                        SAVE WORKOUT RECORD
                                    </NeonButton>
                                    <button
                                        onClick={() => setIsFinishing(false)}
                                        className="py-3 text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] hover:text-text-primary transition-colors"
                                    >
                                        Back to Edit
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
                        {activeWorkout.exercises.map((exercise, exIdx) => (
                            <motion.div
                                key={exIdx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-surface border border-border-default rounded-2xl overflow-hidden"
                            >
                                <div className="p-4 border-b border-border-default flex items-center justify-between bg-elevated/30">
                                    <h3 className="font-bold text-lg text-lime tracking-tight">
                                        {exercise.exerciseName}
                                    </h3>
                                    <button
                                        onClick={() => removeExercise(exIdx)}
                                        className="p-2 text-text-muted hover:text-nred transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-12 gap-2 text-[10px] font-mono uppercase tracking-widest text-text-muted mb-3 px-2">
                                        <div className="col-span-2 text-center">Set</div>
                                        <div className="col-span-4 text-center">Previous</div>
                                        <div className="col-span-3 text-center">kg</div>
                                        <div className="col-span-3 text-center">Reps</div>
                                    </div>

                                    <div className="space-y-3">
                                        {exercise.sets.map((set, setIdx) => (
                                            <div key={setIdx} className="grid grid-cols-12 gap-2 items-center">
                                                <div className="col-span-2 flex justify-center">
                                                    <div className="w-8 h-8 rounded-full bg-overlay flex items-center justify-center font-mono text-sm font-bold">
                                                        {set.setNumber}
                                                    </div>
                                                </div>
                                                <div className="col-span-4 text-center text-xs text-text-muted font-mono">
                                                    ー
                                                </div>
                                                <div className="col-span-3">
                                                    <input
                                                        type="number"
                                                        value={set.weightKg || ""}
                                                        onChange={(e) => updateSet(exIdx, setIdx, { weightKg: parseFloat(e.target.value) || 0 })}
                                                        placeholder="0"
                                                        className="w-full h-10 bg-elevated border border-border-default rounded-lg text-center font-mono text-sm focus:border-lime focus:outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="col-span-3">
                                                    <input
                                                        type="number"
                                                        value={set.reps || ""}
                                                        onChange={(e) => updateSet(exIdx, setIdx, { reps: parseInt(e.target.value) || 0 })}
                                                        placeholder="0"
                                                        className="w-full h-10 bg-elevated border border-border-default rounded-lg text-center font-mono text-sm focus:border-lime focus:outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => addSet(exIdx)}
                                        className="w-full mt-4 py-2 border border-dashed border-border-default rounded-xl text-xs font-mono uppercase tracking-widest text-text-secondary hover:bg-overlay hover:border-lime/50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={14} /> Add Set
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {/* Add Exercise Trigger */}
                        <div className="relative">
                            {!isSearching ? (
                                <button
                                    onClick={() => setIsSearching(true)}
                                    className="w-full py-4 bg-lime/10 border-2 border-dashed border-lime/30 rounded-2xl flex flex-col items-center gap-2 text-lime hover:bg-lime/20 transition-all"
                                >
                                    <Plus size={24} />
                                    <span className="font-display font-bold uppercase tracking-widest">Add Exercise</span>
                                </button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-surface border border-border-default rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    <div className="p-4 bg-elevated border-b border-border-default flex items-center gap-3">
                                        <Search size={20} className={cn("text-text-muted", isFetching && "animate-pulse text-lime")} />
                                        <input
                                            placeholder="Search exercises..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1 bg-transparent border-none focus:outline-none font-body text-text-primary"
                                            autoFocus
                                        />
                                        <button onClick={() => {
                                            setIsSearching(false)
                                            setSearchTerm("")
                                        }}>
                                            <X size={20} className="text-text-muted" />
                                        </button>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {searchTerm.length < 2 ? (
                                            <div className="p-2">
                                                <div className="px-4 py-2 text-[10px] font-mono text-text-muted uppercase tracking-widest">
                                                    Common Exercises
                                                </div>
                                                {commonExercises.map((ex) => (
                                                    <button
                                                        key={ex}
                                                        onClick={() => {
                                                            addExercise(ex)
                                                            setIsSearching(false)
                                                            setSearchTerm("")
                                                        }}
                                                        className="w-full text-left px-4 py-3 border-b border-border-default last:border-none hover:bg-lime/10 hover:text-lime transition-colors font-bold text-sm"
                                                    >
                                                        {ex}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : isFetching ? (
                                            <div className="p-8 flex flex-col items-center justify-center text-text-muted gap-2">
                                                <Loader2 size={24} className="animate-spin text-lime" />
                                                <span className="text-[10px] font-mono uppercase tracking-widest">Searching Wger...</span>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map((ex) => (
                                                <button
                                                    key={ex.id}
                                                    onClick={() => {
                                                        addExercise(ex.name, ex.id)
                                                        setIsSearching(false)
                                                        setSearchTerm("")
                                                    }}
                                                    className="w-full text-left px-4 py-3 border-b border-border-default last:border-none hover:bg-lime/10 hover:text-lime transition-colors font-bold text-sm"
                                                >
                                                    {ex.name}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-text-muted text-xs font-mono uppercase tracking-widest">
                                                No results found.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    )
}
