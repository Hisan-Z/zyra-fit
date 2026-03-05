"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { RecipeBuilder } from "@/components/recipes/RecipeBuilder"

function BuilderContent() {
    const searchParams = useSearchParams()
    const editId = searchParams.get('editId')
    const router = useRouter()

    return (
        <RecipeBuilder
            isOpen={true}
            onClose={() => router.push('/recipes')}
            editRecipeId={editId}
        />
    )
}

export default function RecipeBuilderPage() {
    return (
        <Suspense fallback={<div className="p-8 text-lime animate-pulse">Initializing Builder...</div>}>
            <BuilderContent />
        </Suspense>
    )
}
