"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Edit2, PlusCircle, Scale, Utensils } from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { NeonButton } from "@/components/shared/NeonButton"
import { Recipe } from "@/store/useAppStore"
import Link from "next/link"

interface RecipeDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    recipe: Recipe | null
    onLogRecipe: (recipe: Recipe) => void
}

export function RecipeDetailsModal({ isOpen, onClose, recipe, onLogRecipe }: RecipeDetailsModalProps) {
    if (!isOpen || !recipe) return null

    const totalMacros = recipe.RecipeIngredient?.reduce((acc, ing) => ({
        calories: acc.calories + (ing.calories || 0),
        protein: acc.protein + (ing.proteinG || 0),
        carbs: acc.carbs + (ing.carbsG || 0),
        fat: acc.fat + (ing.fatG || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 }

    const servings = Math.max(1, recipe.servings)
    const perServing = {
        calories: Math.round(totalMacros.calories / servings),
        protein: Math.round(totalMacros.protein / servings),
        carbs: Math.round(totalMacros.carbs / servings),
        fat: Math.round(totalMacros.fat / servings)
    }

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
                    className="relative w-full max-w-xl max-h-[90vh] overflow-hidden"
                >
                    <GlassCard className="p-0 border-lime/30 h-full flex flex-col bg-surface shadow-[0_0_50px_rgba(200,255,0,0.1)]">
                        {/* Header */}
                        <div className="p-6 border-b border-border-default flex items-center justify-between bg-elevated/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-lime/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />

                            <div className="flex items-center gap-4 relative z-10 w-full">
                                <div className="w-12 h-12 rounded-full bg-lime/10 flex items-center justify-center border border-lime/20 shrink-0">
                                    <Utensils className="text-lime" size={24} />
                                </div>
                                <div className="flex-1 pr-4">
                                    <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-text-primary leading-tight">{recipe.name}</h2>
                                    <p className="font-mono text-xs text-text-muted uppercase tracking-[0.1em]">{recipe.servings} Servings</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors relative z-10">
                                <X size={20} className="text-text-muted" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Per Serving Macros */}
                            <div className="p-4 bg-elevated/50 rounded-xl border border-border-default space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                        <Utensils size={12} className="text-lime" /> Value Per Serving
                                    </span>
                                    <span className="font-display font-bold text-2xl text-lime italic">{perServing.calories} kcal</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-lime/5 p-2.5 rounded-lg border border-lime/10 text-center">
                                        <p className="text-[9px] font-mono text-lime/70 uppercase mb-1">Protein</p>
                                        <p className="text-sm font-bold text-text-primary">{perServing.protein}g</p>
                                    </div>
                                    <div className="bg-namber/5 p-2.5 rounded-lg border border-namber/10 text-center">
                                        <p className="text-[9px] font-mono text-namber/70 uppercase mb-1">Carbs</p>
                                        <p className="text-sm font-bold text-text-primary">{perServing.carbs}g</p>
                                    </div>
                                    <div className="bg-ncyan/5 p-2.5 rounded-lg border border-ncyan/10 text-center">
                                        <p className="text-[9px] font-mono text-ncyan/70 uppercase mb-1">Fat</p>
                                        <p className="text-sm font-bold text-text-primary">{perServing.fat}g</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ingredients List */}
                            <div className="space-y-4">
                                <h3 className="font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2 text-text-primary">
                                    <Scale size={16} className="text-lime" /> Components
                                </h3>

                                <div className="space-y-2">
                                    {recipe.RecipeIngredient?.map((ing, idx) => (
                                        <div key={idx} className="bg-void/40 p-3 rounded-xl border border-border-subtle flex items-center justify-between">
                                            <div className="flex-1 pr-4">
                                                <p className="font-bold text-sm text-text-primary">{ing.foodName}</p>
                                                <p className="text-[10px] font-mono text-text-muted mt-1 uppercase">
                                                    {Math.round(ing.calories)} kcal | {ing.proteinG.toFixed(1)}p {ing.carbsG.toFixed(1)}c {ing.fatG.toFixed(1)}f
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-xs font-mono text-lime font-bold">{ing.grams}g</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-border-default bg-elevated/30 grid grid-cols-2 gap-4 sticky bottom-0">
                            <Link
                                href={`/recipes/builder?editId=${recipe.id}`}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-surface border border-border-default hover:border-lime/50 text-text-primary font-bold text-xs uppercase tracking-widest transition-all"
                            >
                                <Edit2 size={16} /> Edit Recipe
                            </Link>

                            <NeonButton
                                className="w-full py-3 text-xs"
                                onClick={() => {
                                    onClose()
                                    onLogRecipe(recipe)
                                }}
                            >
                                <span className="flex items-center justify-center gap-2 tracking-[0.1em] uppercase font-bold">
                                    <PlusCircle size={16} /> Log Now
                                </span>
                            </NeonButton>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
