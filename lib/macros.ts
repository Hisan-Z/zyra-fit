// lib/macros.ts

export interface FoodPer100g {
    caloriesPer100g: number
    proteinPer100g: number
    carbsPer100g: number
    fatPer100g: number
    fiberPer100g?: number
}

export function scaleMacros(food: FoodPer100g, grams: number) {
    const factor = grams / 100
    return {
        calories: Math.round(food.caloriesPer100g * factor),
        protein: Math.round(food.proteinPer100g * factor * 10) / 10,
        carbs: Math.round(food.carbsPer100g * factor * 10) / 10,
        fat: Math.round(food.fatPer100g * factor * 10) / 10,
        fiber: Math.round((food.fiberPer100g ?? 0) * factor * 10) / 10,
    }
}
