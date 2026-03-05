"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Scale, Loader2, Check } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { NeonButton } from "@/components/shared/NeonButton"

interface WeightLogModalProps {
    isOpen: boolean
    onClose: () => void
}

export function WeightLogModal({ isOpen, onClose }: WeightLogModalProps) {
    const [weight, setWeight] = React.useState<string>("")
    const [notes, setNotes] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isSuccess, setIsSuccess] = React.useState(false)
    const asyncLogWeight = useAppStore(state => state.asyncLogWeight)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const numWeight = parseFloat(weight)
        if (isNaN(numWeight)) return

        setIsSubmitting(true)
        await asyncLogWeight(numWeight, notes)
        setIsSubmitting(false)
        setIsSuccess(true)

        setTimeout(() => {
            handleClose()
        }, 1500)
    }

    const handleClose = () => {
        setWeight("")
        setNotes("")
        setIsSuccess(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-void/80 backdrop-blur-md z-[100]"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-4 top-[20%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-surface border border-border-default rounded-2xl shadow-2xl z-[101] overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-lime/10 rounded-lg">
                                        <Scale className="text-lime" size={24} />
                                    </div>
                                    <h3 className="font-display font-bold text-xl uppercase tracking-widest text-text-primary">
                                        Log Weight
                                    </h3>
                                </div>
                                <button onClick={handleClose} className="p-2 rounded-full hover:bg-overlay text-text-secondary transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-text-secondary mb-2">
                                        Body Weight (kg)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            placeholder="00.0"
                                            className="w-full h-16 bg-elevated border border-border-default rounded-xl px-4 text-3xl font-display font-bold text-text-primary focus:outline-none focus:border-lime focus:shadow-[0_0_15px_rgba(200,255,0,0.1)] transition-all"
                                            autoFocus
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-text-muted font-bold">KG</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-text-secondary mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="e.g., Morning weight, fasted"
                                        className="w-full h-24 bg-elevated border border-border-default rounded-xl p-4 text-text-primary focus:outline-none focus:border-lime transition-all resize-none"
                                    />
                                </div>

                                <NeonButton
                                    type="submit"
                                    className="w-full h-14"
                                    disabled={isSubmitting || isSuccess || !weight}
                                    variant="primary"
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={24} className="animate-spin" />
                                    ) : isSuccess ? (
                                        <div className="flex items-center gap-2">
                                            <Check size={24} />
                                            <span>LOGGED</span>
                                        </div>
                                    ) : (
                                        "SAVE LOG"
                                    )}
                                </NeonButton>
                            </form>
                        </div>
                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    )
}
