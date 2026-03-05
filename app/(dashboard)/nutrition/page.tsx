"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/motion"
import { PageHeader } from "@/components/shared/PageHeader"
import { GlassCard } from "@/components/shared/GlassCard"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { AnimatePresence } from "framer-motion"

import { useAppStore, Recipe } from "@/store/useAppStore"
import { FoodSearchModal } from "@/components/nutrition/FoodSearchModal"
import { RecipeBuilder } from "@/components/recipes/RecipeBuilder"
import { RecipeLibrary } from "@/components/nutrition/RecipeLibrary"
import { Book, PlusCircle, LayoutGrid, Database } from "lucide-react"
import { NeonButton } from "@/components/shared/NeonButton"
import Link from "next/link"

export default function NutritionPage() {
    const { mealSlots, removeFoodFromSlot, fetchMealSlots, isLoadingSlots, asyncAddFoodsToSlot } = useAppStore()

    const [activeSlotId, setActiveSlotId] = React.useState<string | null>(null)
    const [isRecipeBuilderOpen, setIsRecipeBuilderOpen] = React.useState(false)
    const [isLibraryOpen, setIsLibraryOpen] = React.useState(false)
    const [selectedRecipeForSlot, setSelectedRecipeForSlot] = React.useState<Recipe | null>(null)
    const [goals, setGoals] = React.useState({ dailyCalGoal: 2000, proteinPct: 30, carbsPct: 40, fatPct: 30 })
    const isSearchOpen = activeSlotId !== null

    React.useEffect(() => {
        fetchMealSlots()

        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.dailyCalGoal) setGoals(data)
            })
            .catch(console.error)
    }, [fetchMealSlots, mealSlots.length])

    const handleLogRecipe = (recipe: Recipe) => {
        setSelectedRecipeForSlot(recipe)
    }

    const confirmLogRecipe = async (slotId: string) => {
        if (!selectedRecipeForSlot) return;
        const recipe = selectedRecipeForSlot;
        const servings = Math.max(1, recipe.servings || 1)

        if (!recipe.RecipeIngredient || recipe.RecipeIngredient.length === 0) {
            setSelectedRecipeForSlot(null)
            setIsLibraryOpen(false)
            return;
        }

        const ingredientsToLog = recipe.RecipeIngredient.map(ing => ({
            foodName: `${ing.foodName} (${recipe.name})`,
            edamamFoodId: ing.edamamFoodId,
            grams: Math.round(ing.grams / servings),
            calories: ing.calories / servings,
            proteinG: ing.proteinG / servings,
            carbsG: ing.carbsG / servings,
            fatG: ing.fatG / servings,
            recipeId: recipe.id
        }))

        await asyncAddFoodsToSlot(slotId, ingredientsToLog)

        setSelectedRecipeForSlot(null)
        setIsLibraryOpen(false)
    }

    // Calculate Totals
    const totalConsumed = mealSlots.reduce((acc, slot) => {
        return acc + slot.items.reduce((slotAcc, item) => slotAcc + item.calories, 0)
    }, 0)

    const dailyGoal = goals.dailyCalGoal
    const remaining = dailyGoal - totalConsumed

    const totalProtein = mealSlots.reduce((acc, slot) => acc + slot.items.reduce((s, i) => s + i.proteinG, 0), 0)
    const totalCarbs = mealSlots.reduce((acc, slot) => acc + slot.items.reduce((s, i) => s + i.carbsG, 0), 0)
    const totalFat = mealSlots.reduce((acc, slot) => acc + slot.items.reduce((s, i) => s + i.fatG, 0), 0)

    return (
        <>
            <FoodSearchModal
                isOpen={isSearchOpen}
                onClose={() => setActiveSlotId(null)}
                slotId={activeSlotId}
            />

            <RecipeBuilder
                isOpen={isRecipeBuilderOpen}
                onClose={() => setIsRecipeBuilderOpen(false)}
            />

            {/* Slot Selection Dialog for Recipes */}
            <AnimatePresence>
                {selectedRecipeForSlot && (
                    <React.Fragment>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-void/80 backdrop-blur-sm z-[110]"
                            onClick={() => setSelectedRecipeForSlot(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-surface border border-border-default rounded-2xl p-6 z-[111] shadow-2xl"
                        >
                            <h3 className="text-xl font-display font-bold uppercase tracking-wider mb-2">Log Recipe</h3>
                            <p className="text-sm font-body text-text-secondary mb-6">
                                Which meal slot would you like to log <span className="text-lime font-bold">{selectedRecipeForSlot.name}</span> to?
                            </p>

                            <div className="space-y-3">
                                {mealSlots.map(slot => (
                                    <button
                                        key={slot.id}
                                        onClick={() => confirmLogRecipe(slot.id)}
                                        className="w-full text-left p-4 rounded-xl border border-border-default hover:border-lime hover:bg-lime/5 transition-all group flex items-center justify-between"
                                    >
                                        <span className="font-bold font-display uppercase tracking-widest text-text-primary group-hover:text-lime transition-colors">{slot.name}</span>
                                        <PlusCircle size={18} className="text-text-muted group-hover:text-lime transition-colors" />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setSelectedRecipeForSlot(null)}
                                className="w-full mt-4 p-3 text-sm font-bold text-text-muted hover:text-text-primary transition-colors text-center"
                            >
                                CANCEL
                            </button>
                        </motion.div>
                    </React.Fragment>
                )}
            </AnimatePresence>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                <PageHeader
                    title="Nutrition"
                    subtitle="Manage slots and keep your macros dialed in."
                />

                {/* Summary Bar */}
                <motion.div variants={fadeUp} className="sticky top-[72px] md:top-0 z-40 pb-4 bg-void/90 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 rounded-xl border border-lime shadow-[0_0_12px_rgba(200,255,0,0.1)] bg-lime/5">
                        <div className="flex items-center justify-between md:justify-start gap-8">
                            <div className="flex flex-col">
                                <span className="text-xs font-mono uppercase text-lime">Remaining</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-text-primary">{Math.max(0, remaining)}</span>
                                    <span className="text-sm font-bold text-text-muted">/ {dailyGoal} kcal</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end md:items-start gap-1">
                                <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase">Macros Logged</span>
                                <span className="text-xs font-bold font-mono text-text-primary">{Math.round(totalProtein)}P • {Math.round(totalCarbs)}C • {Math.round(totalFat)}F</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <NeonButton
                                size="sm"
                                variant="outline"
                                className="flex-1 md:flex-none py-2 text-[10px] border-border-default h-10"
                                onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                            >
                                <Book size={14} className="mr-2" /> {isLibraryOpen ? "CLOSE LIBRARY" : "RECIPE LIBRARY"}
                            </NeonButton>
                            <NeonButton
                                size="sm"
                                className="flex-1 md:flex-none py-2 text-[10px] h-10"
                                onClick={() => setIsRecipeBuilderOpen(true)}
                            >
                                <PlusCircle size={14} className="mr-2" /> BUILD RECIPE
                            </NeonButton>
                            <Link href="/nutrition/custom-foods">
                                <NeonButton
                                    size="sm"
                                    variant="outline"
                                    className="px-3 py-2 text-[10px] h-10 border-border-default"
                                >
                                    <Database size={14} className="mr-2" /> CUSTOM FOODS
                                </NeonButton>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Recipe Library Section */}
                <AnimatePresence>
                    {isLibraryOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 overflow-hidden"
                        >
                            <div className="flex items-center gap-2 px-2">
                                <LayoutGrid size={16} className="text-lime" />
                                <h3 className="font-display font-bold uppercase tracking-wider text-sm">Stored Formulas</h3>
                            </div>
                            <RecipeLibrary onSelectRecipe={handleLogRecipe} />
                            <div className="h-px bg-border-subtle my-8" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Meal Slots */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {isLoadingSlots && mealSlots.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12 gap-3"
                            >
                                <Loader2 className="w-8 h-8 text-lime animate-spin" />
                                <p className="text-text-muted font-mono text-xs uppercase tracking-widest">Initializing Slots...</p>
                            </motion.div>
                        ) : (
                            mealSlots.map((slot) => {
                                const slotCalories = slot.items.reduce((acc, item) => acc + item.calories, 0)

                                return (
                                    <motion.div
                                        key={slot.id}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        layout
                                    >
                                        <GlassCard className="p-0 overflow-hidden">
                                            <div className="p-4 md:p-5 flex items-center justify-between bg-elevated/50 border-b border-border-default">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-bold font-display uppercase tracking-wider">{slot.name}</h3>
                                                    <span className={`px-2 py-0.5 rounded-md bg-surface border border-border-default text-xs font-mono font-bold ${(slot.targetCalories ?? 0) > 0 && Math.round(slotCalories) > slot.targetCalories! ? 'text-nred' : 'text-lime'}`}>
                                                        {Math.round(slotCalories)}{slot.targetCalories ? ` / ${slot.targetCalories}` : ''} kcal
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => setActiveSlotId(slot.id)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-lime text-void hover:bg-lime/90 hover:shadow-[0_0_12px_rgba(200,255,0,0.5)] transition-all"
                                                >
                                                    <Plus size={18} strokeWidth={3} />
                                                </button>
                                            </div>

                                            <div className="p-2">
                                                {slot.items.length === 0 ? (
                                                    <div className="p-4 text-center text-text-muted text-sm italic">
                                                        No food logged yet.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {slot.items.map((item, idx) => {
                                                            const totalMacros = item.proteinG + item.carbsG + item.fatG;
                                                            const pPct = totalMacros > 0 ? (item.proteinG / totalMacros) * 100 : 0;
                                                            const cPct = totalMacros > 0 ? (item.carbsG / totalMacros) * 100 : 0;
                                                            const fPct = totalMacros > 0 ? (item.fatG / totalMacros) * 100 : 0;

                                                            return (
                                                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-overlay group transition-colors">
                                                                    <div className="flex flex-col flex-1 min-w-0 pr-4">
                                                                        <div className="flex items-baseline justify-between mb-1">
                                                                            <span className="font-bold text-sm tracking-wide capitalize truncate">{item.foodName}</span>
                                                                            <span className="text-xs text-text-muted ml-2">{item.grams}g</span>
                                                                        </div>

                                                                        <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-overlay mt-1 mb-1.5">
                                                                            <div className="bg-lime h-full transition-all" style={{ width: `${pPct}%` }} />
                                                                            <div className="bg-namber h-full transition-all" style={{ width: `${cPct}%` }} />
                                                                            <div className="bg-nred h-full transition-all" style={{ width: `${fPct}%` }} />
                                                                        </div>

                                                                        <div className="flex gap-3 text-xs font-mono text-text-secondary">
                                                                            <span>{Math.round(item.calories)} kcal</span>
                                                                            <span className="text-lime">{Math.round(item.proteinG)}g P</span>
                                                                            <span className="text-namber">{Math.round(item.carbsG)}g C</span>
                                                                            <span className="text-nred">{Math.round(item.fatG)}g F</span>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeFoodFromSlot(slot.id, idx)}
                                                                        className="text-text-muted hover:text-nred opacity-50 md:opacity-0 group-hover:opacity-100 transition-all p-2 shrink-0"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                )
                            })
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    )
}

function minWidth(val: number) {
    return val === 0 ? 8 : val;
}
