import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            dailyCalGoal: user.dailyCalGoal,
            proteinPct: user.proteinPct,
            carbsPct: user.carbsPct,
            fatPct: user.fatPct,
            heightCm: user.heightCm || 0
        })
    } catch (error) {
        console.error("Dashboard profile fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
