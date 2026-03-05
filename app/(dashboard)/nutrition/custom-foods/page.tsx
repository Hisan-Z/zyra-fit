"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { PageHeader } from "@/components/shared/PageHeader"
import { GlassCard } from "@/components/shared/GlassCard"
import { useAppStore } from "@/store/useAppStore"
import { Trash2, Search, Plus, Utensils, Info, ArrowLeft } from "lucide-react"
import { NeonButton } from "@/components/shared/NeonButton"
import { CustomFoodForm } from "@/components/nutrition/CustomFoodForm"
import Link from "next/link"

export default function CustomFoodsPage() {
    const { customFoods, fetchCustomFoods, asyncDeleteCustomFood, isLoadingCustomFoods } = useAppStore()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isAdding, setIsAdding] = React.useState(false)

    React.useEffect(() => {
        fetchCustomFoods()
    }, [fetchCustomFoods])

    const filteredFoods = customFoods.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 pb-24"
        >
            <motion.div variants={fadeUp} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/nutrition">
                        <button className="p-2 hover:bg-surface rounded-full transition-colors border border-border-subtle">
                            <ArrowLeft size={18} className="text-text-muted" />
                        </button>
                    </Link>
                    <PageHeader
                        title="Custom Foods"
                        subtitle="Manage your personal database"
                    />
                </div>
                <NeonButton
                    size="sm"
                    onClick={() => setIsAdding(!isAdding)}
                    variant={isAdding ? "outline" : "primary"}
                >
                    {isAdding ? "CLOSE" : "ADD NEW"}
                </NeonButton>
            </motion.div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-surface/50 border border-lime/20 rounded-2xl p-6 mb-6">
                            <h3 className="text-sm font-display font-bold uppercase tracking-widest text-lime mb-4 flex items-center gap-2">
                                <Plus size={16} /> Create Designation
                            </h3>
                            <CustomFoodForm onSuccess={() => setIsAdding(false)} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div variants={fadeUp} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                    type="text"
                    placeholder="Search custom database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-border-default rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-lime/50 transition-all font-body text-text-primary"
                />
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoadingCustomFoods ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Utensils size={32} className="text-lime/50" />
                        </motion.div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted animate-pulse">Scanning Archive...</span>
                    </div>
                ) : filteredFoods.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-4 bg-surface/30 rounded-2xl border border-dashed border-border-default">
                        <Info size={32} className="text-text-muted opacity-30" />
                        <div className="space-y-1">
                            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">No Ingredients Found</p>
                            <p className="text-[10px] text-text-muted max-w-[240px]">Create your first custom food entry to start building your personal nutrition library.</p>
                        </div>
                    </div>
                ) : (
                    filteredFoods.map((food) => (
                        <GlassCard key={food.id} className="p-5 flex flex-col justify-between group hover:border-lime/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h4 className="font-display font-bold text-lg uppercase group-hover:text-lime transition-colors leading-tight">
                                        {food.name}
                                    </h4>
                                    {food.brand && (
                                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-tighter">
                                            {food.brand}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => asyncDeleteCustomFood(food.id)}
                                    className="p-2 text-text-muted hover:text-nred hover:bg-nred/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border-subtle">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-text-muted uppercase">Kcal</span>
                                    <span className="text-sm font-bold font-mono text-text-primary">{Math.round(food.caloriesPer100g)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-lime/70 uppercase">Prot</span>
                                    <span className="text-sm font-bold font-mono text-text-primary">{Math.round(food.proteinPer100g)}g</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-namber/70 uppercase">Carb</span>
                                    <span className="text-sm font-bold font-mono text-text-primary">{Math.round(food.carbsPer100g)}g</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-nred/70 uppercase">Fat</span>
                                    <span className="text-sm font-bold font-mono text-text-primary">{Math.round(food.fatPer100g)}g</span>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                )}
            </motion.div>
        </motion.div>
    )
}
