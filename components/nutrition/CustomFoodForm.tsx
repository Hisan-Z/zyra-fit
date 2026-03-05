"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion"
import { GlassCard } from "@/components/shared/GlassCard"
import { NeonButton } from "@/components/shared/NeonButton"
import { Loader2, Plus } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"

export function CustomFoodForm({ onSuccess }: { onSuccess: () => void }) {
    const { asyncCreateCustomFood } = useAppStore()
    const [isLoading, setIsLoading] = React.useState(false)

    const [formData, setFormData] = React.useState({
        name: "",
        brand: "",
        caloriesPer100g: "",
        proteinPer100g: "",
        carbsPer100g: "",
        fatPer100g: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.caloriesPer100g) return

        setIsLoading(true)
        await asyncCreateCustomFood({
            name: formData.name,
            brand: formData.brand,
            caloriesPer100g: Number(formData.caloriesPer100g),
            proteinPer100g: Number(formData.proteinPer100g || 0),
            carbsPer100g: Number(formData.carbsPer100g || 0),
            fatPer100g: Number(formData.fatPer100g || 0),
            fiberPer100g: 0
        })
        setIsLoading(false)
        onSuccess()
    }

    return (
        <motion.form variants={fadeUp} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-4">
            <GlassCard className="p-4 space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Food Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime/50 text-text-primary"
                        placeholder="e.g. My Custom Granola"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Brand (Optional)</label>
                    <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime/50 text-text-primary"
                        placeholder="e.g. Nature's Path"
                    />
                </div>

                <div className="pt-2 border-t border-border-default">
                    <h4 className="text-[10px] font-mono text-text-primary uppercase tracking-wider mb-3">Macros (Per 100g)</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Calories</label>
                            <input
                                type="number"
                                required
                                value={formData.caloriesPer100g}
                                onChange={(e) => setFormData({ ...formData, caloriesPer100g: e.target.value })}
                                className="bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime/50 text-text-primary"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-mono text-lime uppercase tracking-wider">Protein (g)</label>
                            <input
                                type="number"
                                required
                                value={formData.proteinPer100g}
                                onChange={(e) => setFormData({ ...formData, proteinPer100g: e.target.value })}
                                className="bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime/50 text-text-primary"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-mono text-namber uppercase tracking-wider">Carbs (g)</label>
                            <input
                                type="number"
                                required
                                value={formData.carbsPer100g}
                                onChange={(e) => setFormData({ ...formData, carbsPer100g: e.target.value })}
                                className="bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-namber/50 text-text-primary"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-mono text-nred uppercase tracking-wider">Fat (g)</label>
                            <input
                                type="number"
                                required
                                value={formData.fatPer100g}
                                onChange={(e) => setFormData({ ...formData, fatPer100g: e.target.value })}
                                className="bg-elevated border border-border-default rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-nred/50 text-text-primary"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </GlassCard>

            <NeonButton type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Plus size={16} className="mr-2" />}
                {isLoading ? "SAVING..." : "CREATE CUSTOM FOOD"}
            </NeonButton>
        </motion.form>
    )
}
