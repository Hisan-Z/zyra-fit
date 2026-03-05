import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { slotId, foods } = body

        if (!slotId || !foods || !Array.isArray(foods)) {
            return new NextResponse("Invalid request body", { status: 400 })
        }

        const userId = session.user.id

        // Use a transaction with individual create calls to ensure cuid generation for each log
        console.log(`Attempting to log ${foods.length} items for user ${userId} to slot ${slotId}`);

        try {
            const createdLogs = await prisma.$transaction(
                foods.map((food: {
                    id?: string;
                    foodName: string;
                    edamamFoodId?: string;
                    grams: number;
                    calories: number;
                    proteinG: number;
                    carbsG: number;
                    fatG: number;
                    fiberG?: number;
                    recipeId?: string;
                }, idx: number) => {
                    return prisma.foodLog.create({
                        data: {
                            id: food.id || undefined,
                            userId: userId,
                            mealSlotId: slotId,
                            foodName: food.foodName,
                            edamamFoodId: food.edamamFoodId || null,
                            grams: food.grams,
                            calories: food.calories,
                            proteinG: food.proteinG,
                            carbsG: food.carbsG,
                            fatG: food.fatG,
                            fiberG: food.fiberG || null,
                            recipeId: food.recipeId || null
                        }
                    })
                })
            )

            return NextResponse.json(createdLogs)
        } catch (dbError: unknown) {
            console.error("Database error during FoodLog insertion:", dbError);
            throw dbError;
        }

    } catch (error: unknown) {
        console.error("Error logging food:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Internal Server Error: ${errorMessage}`, { status: 500 })
    }
}
