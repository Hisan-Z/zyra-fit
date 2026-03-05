import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const cardioLogs = await prisma.cardioLog.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'desc' },
            take: 10
        })

        return NextResponse.json(cardioLogs)
    } catch (error) {
        console.error("Cardio GET error:", error)
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
        const {
            speedKmh,
            inclinePct,
            durationMin,
            weightKg,
            caloriesBurned,
            vo2,
            metValue,
            type = "treadmill"
        } = body

        if (!speedKmh || !durationMin || !weightKg) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const cardioLog = await prisma.cardioLog.create({
            data: {
                userId: session.user.id,
                date: new Date().toISOString(),
                type,
                speedKmh,
                inclinePct: inclinePct || 0,
                durationMin,
                weightKg,
                caloriesBurned,
                vo2,
                metValue
            }
        })

        return NextResponse.json(cardioLog)
    } catch (error) {
        console.error("Cardio POST error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
