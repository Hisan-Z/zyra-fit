import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ProfileClient } from "./ProfileClient"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            dailyCalGoal: true,
            proteinPct: true,
            carbsPct: true,
            fatPct: true,
            heightCm: true,
        }
    })

    if (!user) {
        redirect("/login")
    }

    return <ProfileClient user={user} />
}
