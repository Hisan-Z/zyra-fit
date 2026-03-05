import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const term = searchParams.get("term")

        if (!term) {
            return NextResponse.json({ results: [] })
        }

        // Wger Exercise Search API
        // Documentation suggests using /api/v2/exercise/search/ for term-based search
        const response = await fetch(`https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(term)}`, {
            headers: {
                "Authorization": `Token ${process.env.WGER_API_KEY}`,
                "Accept": "application/json"
            }
        })

        if (!response.ok) {
            console.error("Wger API error:", response.statusText)
            return new NextResponse("Failed to fetch from Wger", { status: response.status })
        }

        const data = await response.json()

        // Map Wger response to our expected format
        // Wger search results structure: { suggestions: [ { value: "Name", data: { id: 123, ... } }, ... ] }
        const mappedResults = data.suggestions?.map((item: any) => ({
            name: item.value,
            id: item.data.id,
            category: item.data.category
        })) || []

        return NextResponse.json({ results: mappedResults })

    } catch (error) {
        console.error("Exercise search error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
