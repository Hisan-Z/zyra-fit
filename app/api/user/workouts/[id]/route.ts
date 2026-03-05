import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const workout = await prisma.workoutSession.findUnique({
            where: {
                id,
                userId: session.user.id
            },
            include: {
                exercises: {
                    include: {
                        sets: true
                    }
                }
            }
        })

        if (!workout) {
            return new NextResponse("Not Found", { status: 404 })
        }

        return NextResponse.json(workout)

    } catch (error) {
        console.error("Workout detail GET error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await prisma.workoutSession.delete({
            where: {
                id,
                userId: session.user.id
            }
        })

        return new NextResponse(null, { status: 204 })

    } catch (error) {
        console.error("Workout DELETE error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
