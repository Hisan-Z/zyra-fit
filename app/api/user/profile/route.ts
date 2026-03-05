import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PUT(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                dailyCalGoal: body.dailyCalGoal,
                proteinPct: body.proteinPct,
                carbsPct: body.carbsPct,
                fatPct: body.fatPct,
                heightCm: body.heightCm,
                name: body.name
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("Failed to update profile", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
