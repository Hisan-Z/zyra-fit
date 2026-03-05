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

        const workouts = await prisma.workoutSession.findMany({
            where: { userId },
            include: {
                exercises: {
                    include: {
                        sets: true
                    }
                }
            },
            orderBy: { date: 'desc' },
            take: 10
        })

        return NextResponse.json(workouts)

    } catch (error) {
        console.error("Workouts GET error:", error)
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
        const { name, notes, date, exercises, durationMin, caloriesBurned } = body

        if (!exercises || !Array.isArray(exercises)) {
            return new NextResponse("Invalid workout data", { status: 400 })
        }

        const workout = await prisma.workoutSession.create({
            data: {
                userId: session.user.id,
                name: name || "Empty Workout",
                notes: notes || null,
                date: date || new Date().toISOString(),
                durationMin: durationMin || null,
                caloriesBurned: caloriesBurned || null,
                exercises: {
                    create: exercises.map((ex: any) => ({
                        exerciseName: ex.exerciseName,
                        wgerExId: ex.wgerExId || null,
                        sets: {
                            create: (ex.sets || []).map((set: any, idx: number) => ({
                                setNumber: idx + 1,
                                reps: set.reps || 0,
                                weightKg: set.weightKg || 0
                            }))
                        }
                    }))
                }
            },
            include: {
                exercises: {
                    include: {
                        sets: true
                    }
                }
            }
        })

        return NextResponse.json(workout)

    } catch (error) {
        console.error("Workouts POST error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
