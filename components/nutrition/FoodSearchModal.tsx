"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Loader2, Plus, Info, Trash2 } from "lucide-react"
import type { EdamamNutritionResult } from "@/lib/edamam"
import { useAppStore, type FoodItemInput, type Recipe, type CustomFood } from "@/store/useAppStore"
import { NeonButton } from "@/components/shared/NeonButton"
import { CustomFoodForm } from "./CustomFoodForm"

interface FoodSearchModalProps {
    isOpen: boolean
    onClose: () => void
    slotId: string | null
}

function CustomFoodRow({ food, onStage }: { food: CustomFood, onStage: (item: EdamamNutritionResult) => void }) {
    const [grams, setGrams] = React.useState<number | string>(100);

    return (
        <div className="bg-surface border border-border-default rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between group gap-3">
            <div className="flex flex-col flex-1 min-w-0 pr-4">
                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-text-primary capitalize truncate group-hover:text-lime transition-colors">{food.name}</span>
                    {food.brand && <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{food.brand}</span>}
                </div>
                <div className="flex gap-3 text-xs font-mono text-text-secondary mt-1">
                    <span>{Math.round(food.caloriesPer100g)} kcal</span>
                    <span className="text-lime">{Math.round(food.proteinPer100g)}g P</span>
                    <span className="text-namber">{Math.round(food.carbsPer100g)}g C</span>
                    <span className="text-nred">{Math.round(food.fatPer100g)}g F</span>
                    <span className="text-text-muted bg-void px-1.5 rounded text-[10px]">per 100g</span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center bg-elevated border border-border-default rounded-lg px-2 h-9">
                    <input
                        type="number"
                        min="1"
                        value={grams}
                        onChange={(e) => setGrams(e.target.value)}
                        className="w-12 bg-transparent text-text-primary text-sm font-mono text-right focus:outline-none"
                    />
                    <span className="text-text-muted text-xs font-mono ml-1 mr-1">g</span>
                </div>
                <NeonButton
                    size="sm"
                    variant="primary"
                    className="h-9 px-4"
                    onClick={() => {
                        const g = Number(grams) || 100;
                        const multi = g / 100;
                        onStage({
                            foodId: `custom_${food.id}`,
                            label: food.name,
                            grams: g,
                            calories: food.caloriesPer100g * multi,
                            proteinG: food.proteinPer100g * multi,
                            carbsG: food.carbsPer100g * multi,
                            fatG: food.fatPer100g * multi,
                            fiberG: (food.fiberPer100g || 0) * multi
                        });
                    }}
                >
                    Stage
                </NeonButton>
            </div>
        </div>
    )
}

export function FoodSearchModal({ isOpen, onClose, slotId }: FoodSearchModalProps) {
    const [query, setQuery] = React.useState("")
    const [result, setResult] = React.useState<EdamamNutritionResult | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const [stagedFoods, setStagedFoods] = React.useState<EdamamNutritionResult[]>([])

    const asyncAddFoodsToSlot = useAppStore(state => state.asyncAddFoodsToSlot)
    const recipes = useAppStore(state => state.recipes)
    const fetchRecipes = useAppStore(state => state.fetchRecipes)
    const customFoods = useAppStore(state => state.customFoods)
    const fetchCustomFoods = useAppStore(state => state.fetchCustomFoods)

    const [activeTab, setActiveTab] = React.useState<'search' | 'recipes' | 'custom'>('search')
    const [isCreatingCustom, setIsCreatingCustom] = React.useState(false)

    React.useEffect(() => {
        if (recipes.length === 0) fetchRecipes()
        if (customFoods.length === 0) fetchCustomFoods()
    }, [fetchRecipes, recipes.length, fetchCustomFoods, customFoods.length])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError("")
        setResult(null)

        try {
            const res = await fetch(`/api/food/search?q=${encodeURIComponent(query)}`)
            if (res.ok) {
                const data = await res.json()
                if (data && data.length > 0) {
                    setResult(data[0])
                } else {
                    setError(`Could not analyze "${query}". Please be more specific.`)
                }
            } else {
                setError("Server error occurred during analysis.")
            }
        } catch (err) {
            console.error(err)
            setError("Failed to connect to nutrition database.")
        } finally {
            setLoading(false)
        }
    }

    const handleStageFood = () => {
        if (!result) return
        setStagedFoods([...stagedFoods, result])
        setResult(null)
        setQuery("")
    }

    const handleRemoveStaged = (index: number) => {
        setStagedFoods(stagedFoods.filter((_, i) => i !== index))
    }

    const handleLogAll = async () => {
        if (stagedFoods.length === 0 || !slotId) return
        setLoading(true)

        const newFoods: FoodItemInput[] = stagedFoods.map(food => ({
            foodName: food.label,
            edamamFoodId: food.foodId,
            grams: Math.round(food.grams),
            calories: Math.round(food.calories),
            proteinG: Math.round(food.proteinG),
            carbsG: Math.round(food.carbsG),
            fatG: Math.round(food.fatG),
        }))

        await asyncAddFoodsToSlot(slotId, newFoods)

        setLoading(false)
        handleClose()
    }

    const handleClose = () => {
        setQuery("")
        setResult(null)
        setError("")
        setStagedFoods([])
        onClose()
    }

    const totals = stagedFoods.reduce((acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.proteinG,
        carbs: acc.carbs + food.carbsG,
        fat: acc.fat + food.fatG
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

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

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-auto md:top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl md:h-[80vh] bg-surface border border-border-default rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border-default shrink-0">
                            <h3 className="font-display font-bold text-xl uppercase tracking-widest text-text-primary">
                                Natural Language Logging
                            </h3>
                            <button onClick={handleClose} className="p-2 rounded-full hover:bg-overlay text-text-secondary transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4 border-b border-border-default bg-elevated/50 shrink-0">
                            <form onSubmit={handleSearch} className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder='e.g., "100g chicken breast and 1 cup rice"'
                                    className="w-full h-12 bg-surface border border-border-default rounded-xl pl-10 pr-24 text-text-primary focus:outline-none focus:border-lime focus:shadow-[0_0_12px_rgba(200,255,0,0.15)] transition-all font-body"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-lime text-void font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : "Analyze"}
                                </button>
                            </form>
                            <div className="mt-3 flex items-start gap-2 text-xs text-text-secondary">
                                <Info size={14} className="text-lime shrink-0 mt-0.5" />
                                <p>Describe exactly what you ate. Add to list, then save them all.</p>
                            </div>
                        </div>

                        {/* Search Result Processing Area */}
                        {error && (
                            <div className="p-4 text-center text-text-muted border border-nred/30 bg-nred/10 m-4 rounded-xl shrink-0">
                                <p className="text-nred font-mono text-sm">{error}</p>
                            </div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="border-b border-border-default bg-elevated shrink-0 relative overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-lime to-nred opacity-20" />
                                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-bold font-display uppercase tracking-wider text-text-primary capitalize leading-tight">
                                            {result.label}
                                        </h2>
                                        <p className="text-text-muted font-mono text-sm mt-1">
                                            {Math.round(result.grams)}g • {Math.round(result.calories)} kcal
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-4 font-mono text-sm">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] text-lime uppercase tracking-widest">Pro</span>
                                                <span className="font-bold">{Math.round(result.proteinG)}g</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] text-namber uppercase tracking-widest">Carb</span>
                                                <span className="font-bold">{Math.round(result.carbsG)}g</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] text-nred uppercase tracking-widest">Fat</span>
                                                <span className="font-bold">{Math.round(result.fatG)}g</span>
                                            </div>
                                        </div>

                                        <NeonButton variant="primary" onClick={handleStageFood} className="py-2 px-4 whitespace-nowrap">
                                            <Plus size={16} className="mr-1" /> Add
                                        </NeonButton>
                                    </div>
                                </div>
                            </motion.div>
                        )}


                        {/* Staged Items / Recipes Switcher Area */}
                        <div className="flex-1 overflow-y-auto bg-void p-0 flex flex-col relative">
                            {/* Tabs */}
                            <div className="flex items-center border-b border-border-default sticky top-0 bg-surface z-10 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('search')}
                                    className={`flex-1 py-3 text-xs font-bold font-display uppercase tracking-wider transition-colors ${activeTab === 'search' ? 'text-lime border-b-2 border-lime bg-lime/5' : 'text-text-muted hover:bg-white/5 border-b-2 border-transparent'}`}
                                >
                                    STAGED INGREDIENTS ({stagedFoods.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('recipes')}
                                    className={`flex-1 py-3 text-xs font-bold font-display uppercase tracking-wider transition-colors ${activeTab === 'recipes' ? 'text-lime border-b-2 border-lime bg-lime/5' : 'text-text-muted hover:bg-white/5 border-b-2 border-transparent'}`}
                                >
                                    SAVED RECIPES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setActiveTab('custom'); setIsCreatingCustom(false); }}
                                    className={`flex-1 py-3 text-xs font-bold font-display uppercase tracking-wider transition-colors ${activeTab === 'custom' ? 'text-lime border-b-2 border-lime bg-lime/5' : 'text-text-muted hover:bg-white/5 border-b-2 border-transparent'}`}
                                >
                                    CUSTOM FOODS
                                </button>
                            </div>

                            <div className="flex-1 p-4 relative overflow-y-auto">
                                {activeTab === 'search' && (
                                    <>
                                        {stagedFoods.length === 0 && !result && !error && !loading && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted opacity-50 p-8 text-center h-full">
                                                <Search size={48} className="mb-4" />
                                                <p className="font-mono text-sm">Your staged ingredients will appear here.</p>
                                            </div>
                                        )}

                                        <AnimatePresence>
                                            {stagedFoods.map((food, idx) => {
                                                const totalMacros = food.proteinG + food.carbsG + food.fatG;
                                                const pPct = totalMacros > 0 ? (food.proteinG / totalMacros) * 100 : 0;
                                                const cPct = totalMacros > 0 ? (food.carbsG / totalMacros) * 100 : 0;
                                                const fPct = totalMacros > 0 ? (food.fatG / totalMacros) * 100 : 0;

                                                return (
                                                    <motion.div
                                                        key={`${food.foodId}-${idx}`}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className="bg-surface border border-border-default rounded-xl p-4 flex items-center justify-between group mb-3"
                                                    >
                                                        <div className="flex flex-col flex-1 min-w-0 pr-4">
                                                            <span className="font-bold text-text-primary capitalize truncate">{food.label}</span>

                                                            <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-overlay mt-2 mb-1">
                                                                <div className="bg-lime h-full" style={{ width: `${pPct}%` }} />
                                                                <div className="bg-namber h-full" style={{ width: `${cPct}%` }} />
                                                                <div className="bg-nred h-full" style={{ width: `${fPct}%` }} />
                                                            </div>

                                                            <div className="flex gap-3 text-xs font-mono text-text-secondary mt-1">
                                                                <span>{Math.round(food.calories)} kcal</span>
                                                                <span className="text-lime">{Math.round(food.proteinG)}g P</span>
                                                                <span className="text-namber">{Math.round(food.carbsG)}g C</span>
                                                                <span className="text-nred">{Math.round(food.fatG)}g F</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveStaged(idx)}
                                                            className="p-2 text-text-muted hover:text-nred hover:bg-nred/10 rounded-lg transition-colors shrink-0"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </>
                                )}

                                {activeTab === 'recipes' && (
                                    <div className="space-y-3">
                                        {recipes.length === 0 ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted opacity-50 p-8 text-center h-full">
                                                <Info size={48} className="mb-4" />
                                                <p className="font-mono text-sm">No recipes saved yet.</p>
                                            </div>
                                        ) : (
                                            recipes.map(recipe => {
                                                const scale = recipe.servings || 1;
                                                const rCals = (recipe.RecipeIngredient?.reduce((s, i) => s + (i.calories || 0), 0) || 0) / scale
                                                const rPro = (recipe.RecipeIngredient?.reduce((s, i) => s + (i.proteinG || 0), 0) || 0) / scale
                                                const rCarb = (recipe.RecipeIngredient?.reduce((s, i) => s + (i.carbsG || 0), 0) || 0) / scale
                                                const rFat = (recipe.RecipeIngredient?.reduce((s, i) => s + (i.fatG || 0), 0) || 0) / scale

                                                return (
                                                    <div key={recipe.id} className="bg-surface border border-border-default rounded-xl p-4 flex items-center justify-between group">
                                                        <div className="flex flex-col flex-1 min-w-0 pr-4">
                                                            <span className="font-bold text-text-primary capitalize truncate group-hover:text-lime transition-colors">{recipe.name}</span>
                                                            <div className="flex gap-3 text-xs font-mono text-text-secondary mt-1">
                                                                <span>{Math.round(rCals)} kcal</span>
                                                                <span className="text-lime">{Math.round(rPro)}g P</span>
                                                                <span className="text-namber">{Math.round(rCarb)}g C</span>
                                                                <span className="text-nred">{Math.round(rFat)}g F</span>
                                                            </div>
                                                        </div>
                                                        <NeonButton
                                                            size="sm"
                                                            variant="primary"
                                                            className="shrink-0 px-3 py-1.5"
                                                            onClick={() => {
                                                                const recipeAdd: EdamamNutritionResult = {
                                                                    foodId: recipe.id,
                                                                    label: `${recipe.name} (Recipe)`,
                                                                    grams: 100,
                                                                    calories: rCals,
                                                                    proteinG: rPro,
                                                                    carbsG: rCarb,
                                                                    fatG: rFat,
                                                                    fiberG: 0
                                                                }
                                                                setStagedFoods(prev => [...prev, recipeAdd])
                                                                setActiveTab('search')
                                                            }}
                                                        >
                                                            Stage
                                                        </NeonButton>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                )}

                                {activeTab === 'custom' && (
                                    <div className="space-y-4">
                                        {!isCreatingCustom ? (
                                            <>
                                                <NeonButton
                                                    onClick={() => setIsCreatingCustom(true)}
                                                    className="w-full mb-4 py-3"
                                                >
                                                    <Plus size={16} className="mr-2" /> ADD NEW CUSTOM FOOD
                                                </NeonButton>

                                                {customFoods.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center text-text-muted opacity-50 p-8 text-center pt-12">
                                                        <Info size={48} className="mb-4" />
                                                        <p className="font-mono text-sm">No custom foods created yet.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {customFoods.map(food => (
                                                            <CustomFoodRow
                                                                key={food.id}
                                                                food={food}
                                                                onStage={(item) => {
                                                                    setStagedFoods(prev => [...prev, item])
                                                                    setActiveTab('search')
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="space-y-4">
                                                <button
                                                    onClick={() => setIsCreatingCustom(false)}
                                                    className="text-xs font-mono text-text-muted hover:text-white transition-colors flex items-center gap-1"
                                                >
                                                    ← Back to Custom Foods
                                                </button>
                                                <CustomFoodForm onSuccess={() => {
                                                    setIsCreatingCustom(false)
                                                }} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Totals & Final Log Button */}
                        {stagedFoods.length > 0 && (
                            <div className="bg-elevated border-t border-border-default p-4 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-10">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <span className="font-display uppercase tracking-widest text-text-secondary text-sm">Total Staged</span>
                                    <span className="font-mono font-bold text-text-primary">{Math.round(totals.calories)} kcal</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="bg-surface rounded-lg p-2 flex flex-col items-center border border-border-default">
                                        <span className="text-[10px] font-mono text-lime uppercase">Protein</span>
                                        <span className="font-bold font-mono text-sm">{Math.round(totals.protein)}g</span>
                                    </div>
                                    <div className="bg-surface rounded-lg p-2 flex flex-col items-center border border-border-default">
                                        <span className="text-[10px] font-mono text-namber uppercase">Carbs</span>
                                        <span className="font-bold font-mono text-sm">{Math.round(totals.carbs)}g</span>
                                    </div>
                                    <div className="bg-surface rounded-lg p-2 flex flex-col items-center border border-border-default">
                                        <span className="text-[10px] font-mono text-nred uppercase">Fat</span>
                                        <span className="font-bold font-mono text-sm">{Math.round(totals.fat)}g</span>
                                    </div>
                                </div>

                                <NeonButton className="w-full" onClick={handleLogAll}>
                                    LOG {stagedFoods.length} ITEM{stagedFoods.length > 1 ? 'S' : ''} TO SLOT
                                </NeonButton>
                            </div>
                        )}

                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    )
}
