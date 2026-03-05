"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "@/lib/motion"
import { PageHeader } from "@/components/shared/PageHeader"
import { RecipeLibrary } from "@/components/nutrition/RecipeLibrary"
import { NeonButton } from "@/components/shared/NeonButton"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RecipesPage() {
    const router = useRouter()

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 pb-24"
        >
            <motion.div variants={fadeUp}>
                <PageHeader
                    title="Recipe Arsenal"
                    subtitle="Custom meals & food combinations"
                />
            </motion.div>

            <motion.div variants={fadeUp} className="flex justify-between items-center bg-surface p-5 rounded-2xl border border-border-default card-glow-lime">
                <div>
                    <h3 className="text-sm font-display font-bold uppercase tracking-widest text-text-primary">Create New</h3>
                    <p className="text-xs text-text-muted mt-1 font-mono">Build a custom recipe with precise macros</p>
                </div>
                <Link href="/recipes/builder">
                    <NeonButton size="sm" className="gap-2 px-4">
                        <Plus size={16} /> Builder
                    </NeonButton>
                </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-2">
                <RecipeLibrary
                    onSelectRecipe={(recipe) => {
                        router.push(`/nutrition/log?recipeId=${recipe.id}`)
                    }}
                />
            </motion.div>
        </motion.div>
    )
}
