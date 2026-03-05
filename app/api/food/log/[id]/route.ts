import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const foodLogId = id
        if (!foodLogId) {
            return new NextResponse("Log ID missing", { status: 400 })
        }

        // Verify ownership and delete it
        await prisma.foodLog.delete({
            where: {
                id: foodLogId,
                userId: session.user.id
            }
        })

        return new NextResponse("Deleted", { status: 200 })
    } catch (error) {
        console.error("Error deleting food log:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
