import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const userId = session.user.id

        // Fetch Meal Slots and their associated Food Logs for today
        const today = new Date()
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

        const slots = await prisma.mealSlot.findMany({
            where: { userId },
            orderBy: { order: 'asc' },
            include: {
                foodLogs: {
                    where: {
                        date: {
                            gte: startOfDay,
                            lt: endOfDay
                        }
                    }
                }
            }
        })

        // If the user has no meal slots, create defaults for them
        if (!slots || slots.length === 0) {
            const defaultSlots = [
                { name: "Breakfast", order: 1, userId },
                { name: "Lunch", order: 2, userId },
                { name: "Dinner", order: 3, userId },
                { name: "Snacks", order: 4, userId },
            ]

            await prisma.mealSlot.createMany({
                data: defaultSlots
            })

            const newSlots = await prisma.mealSlot.findMany({
                where: { userId },
                orderBy: { order: 'asc' },
                include: { foodLogs: true }
            })

            // Return empty slots mapping to the client schema
            const mappedNewSlots = newSlots.map((s) => ({
                id: s.id,
                name: s.name,
                targetCalories: s.targetCalories,
                items: []
            }))

            return NextResponse.json(mappedNewSlots)
        }

        const mappedSlots = slots.map((slot) => {
            return {
                id: slot.id,
                name: slot.name,
                targetCalories: slot.targetCalories,
                items: slot.foodLogs.map((log) => ({
                    id: log.id,
                    foodName: log.foodName,
                    edamamFoodId: log.edamamFoodId,
                    grams: log.grams,
                    calories: log.calories,
                    proteinG: log.proteinG,
                    carbsG: log.carbsG,
                    fatG: log.fatG,
                }))
            }
        })

        return NextResponse.json(mappedSlots)

    } catch (error) {
        console.error("Error fetching meal slots:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
