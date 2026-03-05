import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const weightLogs = await prisma.weightLog.findMany({
            where: { userId: session.user.id },
            orderBy: { date: 'desc' }
        })

        return NextResponse.json(weightLogs)
    } catch (error) {
        console.error("Weight GET error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { weight, notes, date } = body

        if (!weight) {
            return new NextResponse("Weight is required", { status: 400 })
        }

        const weightLog = await prisma.weightLog.create({
            data: {
                userId: session.user.id,
                weightKg: weight,
                notes: notes || null,
                date: date || new Date().toISOString()
            }
        })

        return NextResponse.json(weightLog)
    } catch (error) {
        console.error("Weight POST error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
