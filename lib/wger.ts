// lib/wger.ts

const BASE = 'https://wger.de/api/v2'

export async function searchExercises(query: string = '') {
    try {
        const url = `${BASE}/exercisesearch/?term=${encodeURIComponent(query)}`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch exercises')
        const data = await res.json()
        return data.suggestions || []
    } catch (error) {
        console.error("Wger search error:", error)
        return []
    }
}

export async function getMuscleGroups() {
    try {
        const url = `${BASE}/muscle/`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch muscle groups')
        const data = await res.json()
        return data.results || []
    } catch (error) {
        console.error("Wger muscle groups error:", error)
        return []
    }
}

export async function getExerciseDetails(id: number) {
    try {
        const url = `${BASE}/exerciseinfo/${id}/`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch exercise details')
        const data = await res.json()
        return data
    } catch (error) {
        console.error("Wger exercise details error:", error)
        return null
    }
}
