/**
 * ACSM Treadmill Metabolic Equation
 * 
 * Formulas:
 * 1. VO2 (mL/kg/min) = (Speed * 0.1) + (Speed * Incline * 1.8) + 3.5
 *    - Speed must be in meters per minute (m/min)
 *    - Incline must be as a decimal (e.g., 5% = 0.05)
 * 
 * 2. METs = VO2 / 3.5
 * 
 * 3. Calories = METs * weightKg * durationHr
 */

export interface TreadmillInput {
    speedKmh: number    // km/h
    inclinePct: number  // % (e.g. 5 for 5%)
    durationMin: number // minutes
    weightKg: number    // body weight
}

export interface TreadmillResult {
    vo2: number
    mets: number
    caloriesBurned: number
    intensity: "Light" | "Moderate" | "Vigorous" | "High"
}

export function calculateTreadmill(input: TreadmillInput): TreadmillResult {
    const { speedKmh, inclinePct, durationMin, weightKg } = input

    // Conversion: 1 km/h = 16.6667 m/min
    const speedMMin = speedKmh * (1000 / 60)
    const inclineDecimal = inclinePct / 100

    // ACSM Formula
    // VO2 = (Horizontal) + (Vertical) + (Resting)
    const horizontal = speedMMin * 0.1
    const vertical = speedMMin * inclineDecimal * 1.8
    const resting = 3.5

    const vo2 = horizontal + vertical + resting
    const mets = vo2 / 3.5

    const durationHr = durationMin / 60
    const caloriesBurned = mets * weightKg * durationHr

    // Intensity mapping based on METs
    let intensity: TreadmillResult["intensity"] = "Light"
    if (mets >= 9) intensity = "High"
    else if (mets >= 6) intensity = "Vigorous"
    else if (mets >= 3) intensity = "Moderate"

    return {
        vo2: Math.round(vo2 * 10) / 10,
        mets: Math.round(mets * 10) / 10,
        caloriesBurned: Math.round(caloriesBurned),
        intensity
    }
}
