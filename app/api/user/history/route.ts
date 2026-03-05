import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { startOfDay, endOfDay, subDays, format } from "date-fns"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const userId = session.user.id
        const { searchParams } = new URL(req.url)
        const days = parseInt(searchParams.get('days') || '30')
        const startDate = subDays(new Date(), days)

        // 1. Fetch Weight History
        const weightLogs = await prisma.weightLog.findMany({
            where: {
                userId,
                date: { gte: startDate }
            },
            select: { date: true, weightKg: true },
            orderBy: { date: 'asc' }
        })

        // 2. Fetch Food Logs
        const foodLogs = await prisma.foodLog.findMany({
            where: {
                userId,
                date: { gte: startDate }
            },
            select: { date: true, calories: true, proteinG: true, carbsG: true, fatG: true },
            orderBy: { date: 'asc' }
        })

        // 3. Fetch Cardio Logs
        const cardioLogs = await prisma.cardioLog.findMany({
            where: {
                userId,
                date: { gte: startDate }
            },
            select: { date: true, caloriesBurned: true },
            orderBy: { date: 'asc' }
        })

        // 4. Fetch Workout Sessions
        const workoutLogs = await prisma.workoutSession.findMany({
            where: {
                userId,
                date: { gte: startDate }
            },
            select: { date: true, caloriesBurned: true },
            orderBy: { date: 'asc' }
        })

        // Aggregate by day
        interface DailyStats {
            date: string;
            weight: number | null;
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
            burned: number;
        }
        const dailyStats: Record<string, DailyStats> = {}

        // Initialize last X days
        for (let i = 0; i <= days; i++) {
            const d = format(subDays(new Date(), i), 'yyyy-MM-dd')
            dailyStats[d] = {
                date: d,
                weight: null,
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                burned: 0
            }
        }

        weightLogs.forEach(log => {
            const d = format(log.date, 'yyyy-MM-dd')
            if (dailyStats[d]) dailyStats[d].weight = log.weightKg
        })

        foodLogs.forEach(log => {
            const d = format(log.date, 'yyyy-MM-dd')
            if (dailyStats[d]) {
                dailyStats[d].calories += log.calories
                dailyStats[d].protein += log.proteinG
                dailyStats[d].carbs += log.carbsG
                dailyStats[d].fat += log.fatG
            }
        })

        cardioLogs.forEach(log => {
            const d = format(log.date, 'yyyy-MM-dd')
            if (dailyStats[d]) {
                dailyStats[d].burned += log.caloriesBurned
            }
        })

        workoutLogs.forEach(log => {
            const d = format(log.date, 'yyyy-MM-dd')
            if (dailyStats[d]) {
                dailyStats[d].burned += (log.caloriesBurned || 0)
            }
        })

        // Convert to array and sort
        const chartData = Object.values(dailyStats).sort((a: DailyStats, b: DailyStats) => a.date.localeCompare(b.date))

        return NextResponse.json({
            chartData,
            summary: {
                avgWeight: weightLogs.length ? weightLogs.reduce((a, b) => a + b.weightKg, 0) / weightLogs.length : null,
                avgCalories: foodLogs.length ? foodLogs.reduce((a, b) => a + b.calories, 0) / (days || 1) : 0,
                totalBurned: cardioLogs.reduce((a, b) => a + b.caloriesBurned, 0) +
                    workoutLogs.reduce((a, b) => a + (b.caloriesBurned || 0), 0)
            }
        })
    } catch (error) {
        console.error("History GET error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
