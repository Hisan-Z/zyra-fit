// lib/edamam.ts

const APP_ID = process.env.EDAMAM_APP_ID
const APP_KEY = process.env.EDAMAM_APP_KEY
const BASE = 'https://api.edamam.com'

export interface EdamamNutritionResult {
    foodId: string
    label: string
    grams: number
    calories: number
    proteinG: number
    carbsG: number
    fatG: number
    fiberG: number
}

/**
 * Uses the Edamam Nutrition Analysis API (/api/nutrition-data)
 * This parses short unstructured food text (e.g. "1 large apple" or "100g chicken breast")
 * and returns the exact nutritional data for that quantity.
 */
export async function analyzeNutritionText(query: string): Promise<EdamamNutritionResult | null> {
    if (!APP_ID || !APP_KEY) {
        throw new Error("Missing Edamam API credentials")
    }

    // Use nutrition-type=logging to allow for change of context (e.g. "rice" -> "cooked rice")
    const url = `${BASE}/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&nutrition-type=logging&ingr=${encodeURIComponent(query)}`

    try {
        const res = await fetch(url)

        if (!res.ok) {
            if (res.status === 404 || res.status === 422 || res.status === 555) {
                return null; // Could not parse or find the ingredient
            }
            throw new Error(`Edamam Nutrition API error: ${res.statusText}`)
        }

        const data = await res.json()

        if (!data.ingredients || data.ingredients.length === 0) {
            return null;
        }

        const ingredient = data.ingredients[0]
        const parsedFood = ingredient.parsed?.[0]

        return {
            foodId: parsedFood?.foodId || "unknown",
            label: parsedFood?.food || query,
            grams: data.totalWeight ?? 0,
            calories: data.calories ?? 0,
            proteinG: data.totalNutrients.PROCNT?.quantity ?? 0,
            carbsG: data.totalNutrients.CHOCDF?.quantity ?? 0,
            fatG: data.totalNutrients.FAT?.quantity ?? 0,
            fiberG: data.totalNutrients.FIBTG?.quantity ?? 0,
        }
    } catch (error) {
        console.error("Failed to analyze nutrition text:", error)
        return null
    }
}
