"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp, staggerContainer, scaleIn } from "@/lib/motion"
import { GlassCard } from "@/components/shared/GlassCard"
import { NeonButton } from "@/components/shared/NeonButton"
import { ListPlus, Trash2, Edit2, Check, X, GripVertical, Loader2, Save } from "lucide-react"

interface MealSlot {
    id: string;
    name: string;
    order: number;
    targetCalories: number | null;
}

export function MealSlotManager() {
    const [slots, setSlots] = React.useState<MealSlot[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [isSaved, setIsSaved] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [editForm, setEditForm] = React.useState<{ name: string; targetCalories: string }>({ name: "", targetCalories: "" })

    React.useEffect(() => {
        fetchSlots()
    }, [])

    const fetchSlots = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("/api/user/meal-slots")
            if (res.ok) {
                const data = await res.json()
                setSlots(data.sort((a: MealSlot, b: MealSlot) => a.order - b.order))
            }
        } catch (error) {
            console.error("Failed to fetch slots", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddSlot = () => {
        const newSlot: MealSlot = {
            id: `temp-${Date.now()}`,
            name: "New Meal",
            order: slots.length,
            targetCalories: null
        }
        setSlots([...slots, newSlot])
        setEditingId(newSlot.id)
        setEditForm({ name: newSlot.name, targetCalories: "" })
    }

    const handleDeleteSlot = (id: string) => {
        setSlots(slots.filter(s => s.id !== id))
    }

    const startEditing = (slot: MealSlot) => {
        setEditingId(slot.id)
        setEditForm({
            name: slot.name,
            targetCalories: slot.targetCalories ? slot.targetCalories.toString() : ""
        })
    }

    const saveEdit = () => {
        if (!editingId) return
        setSlots(slots.map(s => {
            if (s.id === editingId) {
                return {
                    ...s,
                    name: editForm.name || "Unnamed Meal",
                    targetCalories: editForm.targetCalories ? parseInt(editForm.targetCalories) : null
                }
            }
            return s
        }))
        setEditingId(null)
    }

    const handleSaveAll = async () => {
        setIsSaving(true)
        setIsSaved(false)
        try {
            // we will send the ordered lists
            const slotsToSave = slots.map((s, index) => ({
                id: s.id.startsWith("temp-") ? undefined : s.id,
                name: s.name,
                order: index,
                targetCalories: s.targetCalories
            }))

            const res = await fetch("/api/user/meal-slots/manager", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slots: slotsToSave })
            })

            if (res.ok) {
                setIsSaved(true)
                fetchSlots() // Refresh with real IDs
                setTimeout(() => setIsSaved(false), 3000)
            }
        } catch (error) {
            console.error("Failed to save slots", error)
        } finally {
            setIsSaving(false)
        }
    }

    const moveSlot = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === slots.length - 1) return

        const newSlots = [...slots]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
            ;[newSlots[index], newSlots[targetIndex]] = [newSlots[targetIndex], newSlots[index]]
        setSlots(newSlots)
    }

    if (isLoading) {
        return (
            <GlassCard className="p-6 flex justify-center items-center">
                <Loader2 className="animate-spin text-lime" />
            </GlassCard>
        )
    }

    const totalTargetCalories = slots.reduce((sum, slot) => sum + (slot.targetCalories || 0), 0)

    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
        >
            <GlassCard className="p-6">
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-lime/10 rounded-lg">
                            <ListPlus size={20} className="text-lime" />
                        </div>
                        <h3 className="font-display font-bold text-lg uppercase tracking-wide text-text-primary">Meal Slots Target</h3>
                    </div>
                    <button
                        onClick={handleAddSlot}
                        className="text-xs font-mono text-lime hover:text-white transition-colors uppercase tracking-wider"
                    >
                        + Add Slot
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <AnimatePresence>
                        {slots.map((slot, index) => (
                            <motion.div
                                key={slot.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-elevated border border-border-default rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                            >
                                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                                    <div className="flex flex-col gap-1 text-text-muted hover:text-text-primary transition-colors">
                                        <button onClick={() => moveSlot(index, 'up')} disabled={index === 0} className="disabled:opacity-30">▲</button>
                                        <button onClick={() => moveSlot(index, 'down')} disabled={index === slots.length - 1} className="disabled:opacity-30">▼</button>
                                    </div>
                                    <div className="h-full w-px bg-border-default mx-1" />
                                </div>

                                {editingId === slot.id ? (
                                    <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <label className="text-[10px] font-mono text-text-muted uppercase">Slot Name</label>
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                className="bg-base border border-border-default rounded-md px-3 py-1.5 text-sm text-text-primary focus:border-lime/50 focus:outline-none"
                                                placeholder="e.g. Breakfast"
                                            />
                                        </div>
                                        <div className="flex-1 sm:max-w-[150px] flex flex-col gap-1">
                                            <label className="text-[10px] font-mono text-text-muted uppercase">Target (KCAL)</label>
                                            <input
                                                type="number"
                                                value={editForm.targetCalories}
                                                onChange={e => setEditForm({ ...editForm, targetCalories: e.target.value })}
                                                className="bg-base border border-border-default rounded-md px-3 py-1.5 text-sm text-text-primary font-mono focus:border-lime/50 focus:outline-none"
                                                placeholder="Optional"
                                            />
                                        </div>
                                        <div className="flex gap-2 items-end pb-1 pt-2 sm:pt-0">
                                            <button onClick={saveEdit} className="p-1.5 bg-lime/20 text-lime rounded hover:bg-lime/30 transition-colors">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 bg-nred/20 text-nred rounded hover:bg-nred/30 transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-between w-full">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-text-primary">{slot.name}</span>
                                            {slot.targetCalories ?
                                                <span className="text-xs font-mono text-lime">{slot.targetCalories} KCAL Target</span> :
                                                <span className="text-xs font-mono text-text-muted">No specific target</span>
                                            }
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => startEditing(slot)} className="p-2 text-text-muted hover:text-lime transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteSlot(slot.id)} className="p-2 text-text-muted hover:text-nred transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {slots.length === 0 && (
                        <div className="text-center py-6 text-text-muted text-sm border border-dashed border-border-default rounded-lg">
                            No custom meal slots defined.
                        </div>
                    )}
                </div>

                {slots.length > 0 && totalTargetCalories > 0 && (
                    <div className="mt-4 pt-4 border-t border-border-default flex justify-between items-center">
                        <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Total Slot Target sum</span>
                        <span className="text-sm font-mono font-bold text-text-primary">{totalTargetCalories} KCAL</span>
                    </div>
                )}
            </GlassCard>

            <motion.div variants={fadeUp}>
                <NeonButton
                    onClick={handleSaveAll}
                    disabled={isSaving || editingId !== null}
                    className={`w-full py-4 uppercase tracking-[0.2em] font-bold text-xs transition-all ${isSaved ? '!bg-lime !text-void !shadow-[0_0_20px_rgba(200,255,0,0.4)]' : ''}`}
                >
                    {isSaving ? (
                        <span className="flex items-center gap-2 justify-center"><Loader2 size={16} className="animate-spin" /> SYNCHRONIZING SLOTS...</span>
                    ) : isSaved ? (
                        <span className="flex items-center gap-2 justify-center"><Save size={16} /> SLOTS SAVED</span>
                    ) : (
                        <span className="flex items-center gap-2 justify-center"><Save size={16} /> SAVE MEAL SLOTS</span>
                    )}
                </NeonButton>
            </motion.div>
        </motion.div>
    )
}
