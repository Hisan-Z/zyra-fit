import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import prisma from "@/lib/prisma"

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const { name, description, servings, ingredients } = body

        if (!name || !ingredients || !ingredients.length) {
            return new NextResponse("Invalid recipe data", { status: 400 })
        }

        // Verify ownership
        const existing = await prisma.recipe.findUnique({ where: { id } })
        if (!existing || existing.userId !== session.user.id) {
            return new NextResponse("Unauthorized or Not Found", { status: 403 })
        }

        const updatedRecipe = await prisma.recipe.update({
            where: { id },
            data: {
                name,
                description,
                servings,
                ingredients: {
                    deleteMany: {}, // Delete all existing
                    create: ingredients.map((ing: any) => ({
                        foodName: ing.foodName,
                        edamamFoodId: ing.edamamFoodId,
                        grams: ing.grams,
                        calories: ing.calories,
                        proteinG: ing.proteinG,
                        carbsG: ing.carbsG,
                        fatG: ing.fatG
                    }))
                }
            },
            include: {
                ingredients: true
            }
        })

        // Map Prisma output relation (ingredients) back to expected client property (RecipeIngredient)
        const mappedRecipe = {
            ...updatedRecipe,
            RecipeIngredient: updatedRecipe.ingredients
        }
        delete (mappedRecipe as any).ingredients

        return NextResponse.json(mappedRecipe)
    } catch (error) {
        console.error("Recipe PUT error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        await prisma.recipe.delete({
            where: {
                id,
                userId: session.user.id
            }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("Recipe DELETE error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
