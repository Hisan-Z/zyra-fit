"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    ChevronLeft,
    Trash2,
    Calendar,
    Activity,
    Weight,
    Hash,
    Clock,
    AlertCircle,
    CheckCircle2
} from "lucide-react"
import { format } from "date-fns"
import { PageHeader } from "@/components/shared/PageHeader"
import { NeonButton } from "@/components/shared/NeonButton"
import { cn } from "@/lib/utils"

interface WorkoutSet {
    id: string
    setNumber: number
    reps: number
    weightKg: number
}

interface WorkoutExercise {
    id: string
    exerciseName: string
    sets: WorkoutSet[]
}

interface WorkoutSession {
    id: string
    name: string
    date: string
    notes: string | null
    exercises: WorkoutExercise[]
}

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const router = useRouter()
    const [session, setSession] = React.useState<WorkoutSession | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDeleting, setIsDeleting] = React.useState(false)

    React.useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch(`/api/user/workouts/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setSession(data)
                } else {
                    router.push("/fitness")
                }
            } catch (error) {
                console.error("Fetch session detail error:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSession()
    }, [id, router])

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this workout?")) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/user/workouts/${id}`, { method: "DELETE" })
            if (res.ok) {
                router.push("/fitness")
            }
        } catch (error) {
            console.error("Delete workout error:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-lime/20 border-t-lime rounded-full animate-spin" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">Loading Data...</span>
                </div>
            </div>
        )
    }

    if (!session) return null

    const totalWeight = session.exercises.reduce((acc, ex) => {
        return acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weightKg * s.reps), 0)
    }, 0)

    const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-void">
            <div className="p-6 space-y-8 max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-text-muted hover:text-lime transition-colors font-mono text-xs uppercase tracking-widest"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-text-muted hover:text-nred transition-colors"
                    >
                        <Trash2 size={20} className={cn(isDeleting && "animate-pulse")} />
                    </button>
                </div>

                <div className="space-y-2">
                    <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tighter text-text-primary italic leading-none">
                        {session.name}
                    </h1>
                    <div className="flex items-center gap-4 text-text-muted font-mono text-[10px] uppercase tracking-widest bg-elevated/50 w-fit px-3 py-1 rounded-full border border-border-default">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-lime" />
                            {format(new Date(session.date), "MMMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} className="text-lime" />
                            {format(new Date(session.date), "HH:mm")}
                        </span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total Volume", value: `${totalWeight.toLocaleString()}kg`, icon: Activity },
                        { label: "Exercises", value: session.exercises.length, icon: Weight },
                        { label: "Sets", value: totalSets, icon: Hash },
                        { label: "Status", value: "Completed", icon: CheckCircle2, color: "lime" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-surface border border-border-default rounded-2xl p-4 flex flex-col gap-1">
                            <stat.icon size={16} className={cn("text-text-muted", stat.color === "lime" && "text-lime")} />
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest mt-1">{stat.label}</span>
                            <span className="text-xl font-display font-bold text-text-primary leading-none">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {session.notes && (
                    <div className="bg-lime/5 border border-lime/20 rounded-2xl p-4 flex gap-3">
                        <AlertCircle size={20} className="text-lime shrink-0" />
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-lime/70 uppercase tracking-widest">Notes</span>
                            <p className="text-sm text-text-secondary leading-relaxed italic">"{session.notes}"</p>
                        </div>
                    </div>
                )}

                {/* Exercise List */}
                <div className="space-y-6">
                    <h3 className="font-display font-bold text-lg uppercase tracking-widest text-text-secondary flex items-center gap-3">
                        Exercises
                        <div className="h-[1px] flex-1 bg-border-default" />
                    </h3>

                    <div className="space-y-4">
                        {session.exercises.map((exercise, idx) => (
                            <motion.div
                                key={exercise.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-surface border border-border-default rounded-2xl overflow-hidden shadow-lg shadow-black/20"
                            >
                                <div className="p-4 bg-elevated/30 border-b border-border-default flex items-center justify-between">
                                    <h4 className="font-display font-bold text-xl text-lime uppercase tracking-wide italic">
                                        {exercise.exerciseName}
                                    </h4>
                                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">
                                        {exercise.sets.length} Sets
                                    </span>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-4 text-[10px] font-mono text-text-muted uppercase tracking-widest mb-3 px-2">
                                        <div className="text-center">Set</div>
                                        <div className="text-center">Weight</div>
                                        <div className="text-center">Reps</div>
                                        <div className="text-center">Volume</div>
                                    </div>
                                    <div className="space-y-2">
                                        {exercise.sets.map((set) => (
                                            <div key={set.id} className="grid grid-cols-4 items-center bg-overlay/50 rounded-xl p-3 border border-border-default/50 hover:border-lime/30 transition-colors">
                                                <div className="text-center font-mono text-xs font-bold text-lime">
                                                    {set.setNumber}
                                                </div>
                                                <div className="text-center font-display font-bold text-lg">
                                                    {set.weightKg}
                                                    <span className="text-[10px] text-text-muted ml-0.5">kg</span>
                                                </div>
                                                <div className="text-center font-display font-bold text-lg">
                                                    {set.reps}
                                                </div>
                                                <div className="text-center text-xs font-mono text-text-muted">
                                                    {(set.weightKg * set.reps).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
