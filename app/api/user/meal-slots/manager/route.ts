import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const userId = session.user.id
        const payload = await req.json()
        const slots = payload.slots || []

        if (!Array.isArray(slots)) {
            return new NextResponse("Invalid payload. Expected array of slots.", { status: 400 })
        }

        const existingSlots = await prisma.mealSlot.findMany({ where: { userId } })

        const incomingIds = slots.map((s: any) => s.id).filter(Boolean)
        const toDeleteIds = existingSlots
            .filter(es => !incomingIds.includes(es.id))
            .map(es => es.id)

        // Run transaction to ensure all updates happen safely
        await prisma.$transaction(async (tx) => {
            // 1. Delete removed slots
            if (toDeleteIds.length > 0) {
                await tx.mealSlot.deleteMany({
                    where: { id: { in: toDeleteIds }, userId }
                })
            }

            // 2. Add or update provided slots
            for (let i = 0; i < slots.length; i++) {
                const slot = slots[i]
                const slotOrder = slot.order ?? i
                const targetCalories = typeof slot.targetCalories === 'number' ? slot.targetCalories : null

                if (slot.id && typeof slot.id === 'string' && !slot.id.startsWith('temp_')) {
                    // Update existing slot (can't change ID, can only update name/order/calories)
                    await tx.mealSlot.update({
                        where: { id: slot.id },
                        data: { name: slot.name, order: slotOrder, targetCalories }
                    })
                } else {
                    // Create new slot
                    await tx.mealSlot.create({
                        data: {
                            userId,
                            name: slot.name || 'New Slot',
                            order: slotOrder,
                            targetCalories
                        }
                    })
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error managing meal slots:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
