"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Plus,
    Search,
    Trash2,
    ChevronRight,
    Utensils,
    Save,
    Scale,
    Loader2,
    CheckCircle2
} from "lucide-react"
import { GlassCard } from "@/components/shared/GlassCard"
import { NeonButton } from "@/components/shared/NeonButton"
import { useAppStore, RecipeIngredient } from "@/store/useAppStore"
import { useFoodSearch } from "@/hooks/useFoodSearch"
import { scaleMacros } from "@/lib/macros"
import { cn } from "@/lib/utils"

interface RecipeBuilderProps {
    isOpen: boolean
    onClose: () => void
    editRecipeId?: string | null
}

export function RecipeBuilder({ isOpen, onClose, editRecipeId }: RecipeBuilderProps) {
    const { asyncCreateRecipe, asyncUpdateRecipe, recipes } = useAppStore()
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [servings, setServings] = React.useState(1)
    const [ingredients, setIngredients] = React.useState<RecipeIngredient[]>([])

    // Search state
    const [query, setQuery] = React.useState("")
    const { results, isLoading } = useFoodSearch(query)
    const [isSearching, setIsSearching] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [showSuccess, setShowSuccess] = React.useState(false)

    // Load edit recipe if provided
    React.useEffect(() => {
        if (editRecipeId && recipes.length > 0) {
            const recipeToEdit = recipes.find(r => r.id === editRecipeId)
            if (recipeToEdit) {
                setName(recipeToEdit.name)
                setDescription(recipeToEdit.description || "")
                setServings(recipeToEdit.servings || 1)

                // Map the ingredients back to the workable format
                if (recipeToEdit.RecipeIngredient) {
                    setIngredients(recipeToEdit.RecipeIngredient)
                }
            }
        }
    }, [editRecipeId, recipes])

    // Derived Macros
    const totals = ingredients.reduce((acc, ing) => ({
        calories: acc.calories + ing.calories,
        protein: acc.protein + ing.proteinG,
        carbs: acc.carbs + ing.carbsG,
        fat: acc.fat + ing.fatG
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

    const perServing = {
        calories: Math.round(totals.calories / servings),
        protein: Math.round((totals.protein / servings) * 10) / 10,
        carbs: Math.round((totals.carbs / servings) * 10) / 10,
        fat: Math.round((totals.fat / servings) * 10) / 10
    }

    const addIngredient = (food: any) => {
        const actualGrams = food.grams && food.grams > 0 ? food.grams : 100
        const factor = 100 / actualGrams

        const newIngredient: RecipeIngredient = {
            foodName: food.label,
            edamamFoodId: food.foodId,
            grams: actualGrams,
            calories: food.calories || 0,
            proteinG: food.proteinG || 0,
            carbsG: food.carbsG || 0,
            fatG: food.fatG || 0
        }

        setIngredients([...ingredients, newIngredient])
        setIsSearching(false)
        setQuery("")
    }

    const updateIngredientGrams = (index: number, grams: number) => {
        // Need to scale macros back and forth
        // For simplicity, we'd need the per 100g stored or recalculate.
        // Let's just track ingredients with their base macros in a more robust way if needed,
        // but for this MVP, let's assume we can update if we had the food source.
        // I'll skip complex scaling for now to keep it concise, or just update the gram/macro ratio.
        setIngredients(prev => prev.map((ing, i) => {
            if (i !== index) return ing
            const ratio = grams / ing.grams
            return {
                ...ing,
                grams,
                calories: ing.calories * ratio,
                proteinG: ing.proteinG * ratio,
                carbsG: ing.carbsG * ratio,
                fatG: ing.fatG * ratio
            }
        }))
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        if (!name || ingredients.length === 0) return
        setIsSubmitting(true)
        try {
            if (editRecipeId) {
                await asyncUpdateRecipe(editRecipeId, { name, description, servings }, ingredients)
            } else {
                await asyncCreateRecipe({ name, description, servings }, ingredients)
            }
            setShowSuccess(true)
            setTimeout(() => {
                setShowSuccess(false)
                onClose()
            }, 2000)
        } catch (error) {
            console.error("Save recipe error:", error)
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
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
                >
                    <GlassCard className="p-0 border-lime/30 h-full flex flex-col bg-surface shadow-[0_0_50px_rgba(200,255,0,0.1)]">
                        {/* Header */}
                        <div className="p-6 border-b border-border-default flex items-center justify-between bg-elevated/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center border border-lime/20">
                                    <Utensils className="text-lime" size={20} />
                                </div>
                                <div>
                                    <h2 className="font-display font-bold text-xl uppercase tracking-wider">RECIPE BUILDER</h2>
                                    <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">Engineer Custom Nutrition</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} className="text-text-muted" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left: Metadata & Ingredients */}
                            <div className="lg:col-span-7 space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Recipe Name</label>
                                        <input
                                            type="text" value={name} onChange={e => setName(e.target.value)}
                                            placeholder="ENTER DESIGNATION..."
                                            className="w-full bg-void/50 border border-border-default rounded-xl px-4 py-3 font-display text-lg focus:outline-none focus:border-lime/50 transition-colors"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Servings</label>
                                            <input
                                                type="number" value={servings} onChange={e => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-full bg-void/50 border border-border-default rounded-xl px-4 py-3 font-display text-lg focus:outline-none focus:border-lime/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                            <Scale size={14} className="text-lime" /> Ingredients
                                        </h3>
                                        <button
                                            onClick={() => setIsSearching(true)}
                                            className="text-xs font-mono uppercase tracking-widest text-lime flex items-center gap-1 hover:underline"
                                        >
                                            <Plus size={14} /> Add New
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {ingredients.length === 0 ? (
                                            <div className="p-8 border border-dashed border-border-default rounded-2xl text-center">
                                                <p className="text-xs font-mono text-text-muted uppercase tracking-widest">No components added</p>
                                            </div>
                                        ) : (
                                            ingredients.map((ing, idx) => (
                                                <div key={idx} className="bg-void/30 p-4 rounded-xl border border-border-subtle flex items-center justify-between group">
                                                    <div>
                                                        <p className="font-bold text-sm text-text-primary group-hover:text-lime transition-colors">{ing.foodName}</p>
                                                        <p className="text-[10px] font-mono text-text-muted uppercase">{ing.calories} kcal | {ing.proteinG.toFixed(1)}p {ing.carbsG.toFixed(1)}c {ing.fatG.toFixed(1)}f</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number" value={ing.grams}
                                                                onChange={e => updateIngredientGrams(idx, parseFloat(e.target.value) || 0)}
                                                                className="w-16 bg-transparent text-right font-mono text-xs focus:outline-none text-lime"
                                                            />
                                                            <span className="text-[10px] text-text-muted font-mono">G</span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeIngredient(idx)}
                                                            className="p-1 hover:bg-nred/10 rounded text-text-muted hover:text-nred transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Summary & Search (Overlaying) */}
                            <div className="lg:col-span-5 relative">
                                <GlassCard className="h-full border-border-default bg-void/20 flex flex-col p-6 sticky top-0">
                                    <div className="flex-1 space-y-8">
                                        <div>
                                            <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-4 italic">Total Payload</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-baseline font-display">
                                                    <span className="text-4xl font-black text-lime italic">{totals.calories.toFixed(0)}</span>
                                                    <span className="text-sm font-bold text-text-muted uppercase">Total Kcal</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 pt-4">
                                                    <div className="bg-lime/5 p-2 rounded border border-lime/10">
                                                        <p className="text-[8px] font-mono text-lime/50 uppercase">Protein</p>
                                                        <p className="text-sm font-bold font-display">{totals.protein.toFixed(1)}g</p>
                                                    </div>
                                                    <div className="bg-namber/5 p-2 rounded border border-namber/10">
                                                        <p className="text-[8px] font-mono text-namber/50 uppercase">Carbs</p>
                                                        <p className="text-sm font-bold font-display">{totals.carbs.toFixed(1)}g</p>
                                                    </div>
                                                    <div className="bg-ncyan/5 p-2 rounded border border-ncyan/10">
                                                        <p className="text-[8px] font-mono text-ncyan/50 uppercase">Fat</p>
                                                        <p className="text-sm font-bold font-display">{totals.fat.toFixed(1)}g</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-elevated/50 rounded-xl border border-border-default space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary uppercase tracking-wider">
                                                <Utensils size={12} className="text-lime" /> Per Serving ({servings})
                                            </div>
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-2xl font-display font-bold text-text-primary italic">{perServing.calories} kcal</span>
                                                <span className="text-[10px] font-mono text-text-muted uppercase">{perServing.protein}p / {perServing.carbs}c / {perServing.fat}f</span>
                                            </div>
                                        </div>
                                    </div>

                                    <NeonButton
                                        className="w-full mt-8"
                                        disabled={isSubmitting || showSuccess || !name || ingredients.length === 0}
                                        onClick={handleSave}
                                    >
                                        {isSubmitting ? "ENCRYPTING..." : showSuccess ? (
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 size={18} /> RECIPE SAVED
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Save size={18} /> SAVE TO LIBRARY
                                            </span>
                                        )}
                                    </NeonButton>
                                </GlassCard>

                                {/* Search Pop-over */}
                                <AnimatePresence>
                                    {isSearching && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="absolute inset-0 z-20 bg-base border border-lime/20 rounded-2xl overflow-hidden flex flex-col"
                                        >
                                            <div className="p-4 border-b border-border-default bg-elevated flex items-center gap-2">
                                                <Search size={16} className="text-lime" />
                                                <input
                                                    autoFocus
                                                    type="text" value={query} onChange={e => setQuery(e.target.value)}
                                                    placeholder="SEARCH COMPONENTS..."
                                                    className="bg-transparent flex-1 font-mono text-xs focus:outline-none uppercase tracking-widest text-lime"
                                                />
                                                <button onClick={() => setIsSearching(false)}>
                                                    <X size={16} className="text-text-muted" />
                                                </button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto">
                                                {isLoading ? (
                                                    <div className="p-8 flex justify-center">
                                                        <Loader2 className="animate-spin text-lime" size={24} />
                                                    </div>
                                                ) : results?.length > 0 ? (
                                                    <div className="divide-y divide-border-subtle">
                                                        {results.map((food: any) => (
                                                            <button
                                                                key={food.foodId}
                                                                onClick={() => addIngredient(food)}
                                                                className="w-full p-4 text-left hover:bg-lime/5 transition-colors group flex items-center justify-between"
                                                            >
                                                                <div>
                                                                    <p className="font-bold text-xs uppercase tracking-wide group-hover:text-lime transition-colors">{food.label}</p>
                                                                    <p className="text-[8px] font-mono text-text-muted">{Math.round(food.calories || 0)} kcal / {Math.round(food.grams || 100)}g</p>
                                                                </div>
                                                                <ChevronRight size={14} className="text-text-muted group-hover:text-lime group-hover:translate-x-1 transition-all" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : query.length > 2 && (
                                                    <div className="p-8 text-center text-text-muted text-[10px] font-mono uppercase tracking-[0.2em]">
                                                        No matches found
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
