import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        // Ensure user owns this custom food
        const existing = await prisma.customFood.findUnique({ where: { id } })
        if (!existing || existing.userId !== session.user.id) {
            return new NextResponse("Unauthorized or Not Found", { status: 403 })
        }

        await prisma.customFood.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("Custom food DELETE error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
