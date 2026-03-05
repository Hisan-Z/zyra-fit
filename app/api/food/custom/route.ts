import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

        // Optional search param for filtering
        const { searchParams } = new URL(req.url)
        const query = searchParams.get('q')

        let foods;
        if (query) {
            foods = await prisma.customFood.findMany({
                where: {
                    userId: session.user.id,
                    name: { contains: query, mode: 'insensitive' }
                },
                orderBy: { createdAt: 'desc' }
            })
        } else {
            foods = await prisma.customFood.findMany({
                where: { userId: session.user.id },
                orderBy: { createdAt: 'desc' }
            })
        }

        return NextResponse.json(foods)
    } catch (error) {
        console.error("Error fetching custom foods:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

        const body = await req.json()
        const { name, brand, caloriesPer100g, proteinPer100g, carbsPer100g, fatPer100g, fiberPer100g } = body

        if (!name || typeof caloriesPer100g !== 'number') {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const newFood = await prisma.customFood.create({
            data: {
                userId: session.user.id,
                name,
                brand,
                caloriesPer100g,
                proteinPer100g,
                carbsPer100g,
                fatPer100g,
                fiberPer100g,
            }
        })

        return NextResponse.json(newFood, { status: 201 })
    } catch (error) {
        console.error("Error creating custom food:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
