import { NextRequest, NextResponse } from "next/server"
import { analyzeNutritionText } from "@/lib/edamam"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query) {
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    try {
        const result = await analyzeNutritionText(query)

        // The Nutrition API returns a single analyzed result for the text
        if (!result) {
            return NextResponse.json([])
        }

        return NextResponse.json([result])
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to analyze food text" }, { status: 500 })
    }
}
