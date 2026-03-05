import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name } = body

        if (!email || !password || !name) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return new NextResponse("Email already registered", { status: 400 })
        }

        // Hash the password using bcryptjs
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(`[AUTH_DEBUG] Hashing password for: ${email}`)

        const user = await prisma.user.create({
            data: { email, name, passwordHash }
        })
        console.log(`[AUTH_DEBUG] User created successfully: ${user.id}`)

        return NextResponse.json(user)

    } catch (error) {
        console.error("Registration error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
