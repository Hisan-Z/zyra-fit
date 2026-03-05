"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Utensils,
    Trash2,
    Plus,
    ChevronRight,
    Loader2,
    PlusCircle,
    Info,
    LayoutGrid
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { NeonButton } from "@/components/shared/NeonButton"
import { useAppStore, Recipe } from "@/store/useAppStore"
import { cn } from "@/lib/utils"
import { RecipeDetailsModal } from "@/components/recipes/RecipeDetailsModal"

interface RecipeLibraryProps {
    onSelectRecipe: (recipe: Recipe) => void
}

export function RecipeLibrary({ onSelectRecipe }: RecipeLibraryProps) {
    const { recipes, fetchRecipes, isLoadingRecipes, asyncDeleteRecipe } = useAppStore()
    const [selectedViewerRecipe, setSelectedViewerRecipe] = React.useState<Recipe | null>(null)

    React.useEffect(() => {
        fetchRecipes()
    }, [fetchRecipes])

    if (isLoadingRecipes) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="animate-spin text-lime" size={32} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Loading Library...</span>
            </div>
        )
    }

    if (recipes.length === 0) {
        return (
            <div className="p-8 border border-dashed border-border-default rounded-2xl text-center flex flex-col items-center gap-3">
                <LayoutGrid className="text-text-muted opacity-30" size={32} />
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest italic">Recipe Library Empty</p>
                <p className="text-[10px] text-text-muted max-w-[200px] mx-auto">Build your first custom meal to start building your arsenal.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe) => {
                // Calculate per-serving macros for the card
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
                    <GlassCard
                        key={recipe.id}
                        className="p-5 hover:border-lime/30 group transition-all relative overflow-hidden flex flex-col h-full bg-void/20 cursor-pointer"
                        onClick={() => setSelectedViewerRecipe(recipe)}
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-lime/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-lime/10 transition-colors" />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h4 className="font-display font-bold text-lg uppercase group-hover:text-lime transition-colors leading-tight mb-1">
                                    {recipe.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest flex items-center gap-1">
                                        <Utensils size={8} className="text-lime" /> {recipe.servings} Servings
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    asyncDeleteRecipe(recipe.id)
                                }}
                                className="p-2 hover:bg-nred/10 rounded-full text-text-muted hover:text-nred transition-all scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex gap-4 text-[10px] font-mono mb-6 flex-1">
                            <div className="flex flex-col">
                                <span className="opacity-40 uppercase tracking-tighter">Cal</span>
                                <span className="text-text-primary font-bold">{perServing.calories}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="opacity-40 uppercase tracking-tighter text-lime/70">Prot</span>
                                <span className="text-text-primary font-bold">{perServing.protein}g</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="opacity-40 uppercase tracking-tighter text-namber/70">Carb</span>
                                <span className="text-text-primary font-bold">{perServing.carbs}g</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="opacity-40 uppercase tracking-tighter text-ncyan/70">Fat</span>
                                <span className="text-text-primary font-bold">{perServing.fat}g</span>
                            </div>
                        </div>

                        <NeonButton
                            className="w-full relative z-10 py-3 text-xs"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectRecipe(recipe);
                            }}
                        >
                            <span className="flex items-center gap-2 tracking-[0.15em] uppercase font-bold">
                                <PlusCircle size={14} /> Log Recipe
                            </span>
                        </NeonButton>
                    </GlassCard>
                )
            })}

            <RecipeDetailsModal
                isOpen={selectedViewerRecipe !== null}
                onClose={() => setSelectedViewerRecipe(null)}
                recipe={selectedViewerRecipe}
                onLogRecipe={onSelectRecipe}
            />
        </div>
    )
}
