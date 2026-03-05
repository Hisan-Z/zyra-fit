import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const recipes = await prisma.recipe.findMany({
            where: { userId: session.user.id },
            include: {
                ingredients: true
            },
            orderBy: { createdAt: 'desc' }
        })

        // Map Prisma ingredients to RecipeIngredient for frontend compatibility
        const mappedRecipes = recipes.map(recipe => ({
            ...recipe,
            RecipeIngredient: recipe.ingredients
        }))

        return NextResponse.json(mappedRecipes)
    } catch (error) {
        console.error("Recipes GET error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { name, description, servings, ingredients } = body

        if (!name || !ingredients || ingredients.length === 0) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const recipe = await prisma.recipe.create({
            data: {
                userId: session.user.id,
                name,
                description,
                servings: servings || 1,
                ingredients: {
                    create: ingredients.map((ing: any) => ({
                        foodName: ing.foodName,
                        edamamFoodId: ing.edamamFoodId || null,
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

        // Map Prisma ingredients to RecipeIngredient for frontend compatibility
        const mappedRecipe = {
            ...recipe,
            RecipeIngredient: recipe.ingredients
        }

        return NextResponse.json(mappedRecipe)
    } catch (error) {
        console.error("Recipes POST error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
