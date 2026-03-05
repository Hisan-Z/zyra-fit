import { create } from 'zustand'

export interface FoodItemInput {
    id?: string;
    foodName: string;
    edamamFoodId?: string;
    grams: number;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG?: number;
    recipeId?: string;
}

export interface MealSlotState {
    id: string;
    name: string;
    targetCalories?: number | null;
    items: FoodItemInput[];
}

export interface WeightLog {
    id: string;
    userId: string;
    weightKg: number;
    notes?: string;
    date: string;
}

export interface WorkoutSet {
    id?: string;
    exerciseId?: string;
    setNumber: number;
    reps: number;
    weightKg: number;
}

export interface WorkoutExercise {
    id?: string;
    sessionId?: string;
    exerciseName: string;
    wgerExId?: number;
    sets: WorkoutSet[];
}

export interface WorkoutSession {
    id?: string;
    userId?: string;
    name: string;
    notes?: string;
    date: string;
    durationMin?: number;
    caloriesBurned?: number;
    exercises: WorkoutExercise[];
}

export interface CardioLog {
    id: string;
    userId: string;
    date: string;
    type: string;
    speedKmh: number;
    inclinePct: number;
    durationMin: number;
    weightKg: number;
    metValue: number;
    vo2: number;
    caloriesBurned: number;
}

export interface RecipeIngredient {
    id?: string;
    recipeId?: string;
    foodName: string;
    edamamFoodId?: string;
    grams: number;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
}

export interface Recipe {
    id: string;
    userId: string;
    name: string;
    description?: string;
    servings: number;
    createdAt: string;
    RecipeIngredient: RecipeIngredient[];
}

export interface CustomFood {
    id: string;
    userId: string;
    name: string;
    brand?: string | null;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    fiberPer100g?: number | null;
    createdAt: string;
}

export interface HistoryData {
    chartData: Array<{
        date: string;
        weight: number | null;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        burned: number;
    }>;
    summary: {
        avgWeight: number | null;
        avgCalories: number;
        totalBurned: number;
    };
}

interface AppState {
    date: Date
    setDate: (date: Date) => void
    isSidebarOpen: boolean
    toggleSidebar: () => void
    mealSlots: MealSlotState[]
    isLoadingSlots: boolean
    fetchMealSlots: () => Promise<void>
    asyncAddFoodsToSlot: (slotId: string, foods: FoodItemInput[]) => Promise<void>
    removeFoodFromSlot: (slotId: string, foodIndex: number) => Promise<void>
    updateActiveWorkout: (data: Partial<WorkoutSession>) => void

    weightLogs: WeightLog[]
    fetchWeightLogs: () => Promise<void>
    asyncLogWeight: (weight: number, notes?: string) => Promise<void>

    recentWorkouts: WorkoutSession[]
    activeWorkout: WorkoutSession | null
    isLoadingWorkouts: boolean
    fetchRecentWorkouts: () => Promise<void>
    startWorkout: (name?: string) => void
    addExerciseToActiveWorkout: (exerciseName: string, wgerExId?: number) => void
    removeExerciseFromActiveWorkout: (index: number) => void
    addSetToExercise: (exerciseIndex: number) => void
    updateSetInExercise: (exerciseIndex: number, setIndex: number, data: Partial<WorkoutSet>) => void
    removeSetFromExercise: (exerciseIndex: number, setIndex: number) => void
    finishWorkout: () => Promise<void>
    cancelWorkout: () => void

    cardioLogs: CardioLog[]
    fetchCardioLogs: () => Promise<void>
    asyncLogCardio: (data: Partial<CardioLog>) => Promise<void>

    recipes: Recipe[]
    isLoadingRecipes: boolean
    fetchRecipes: () => Promise<void>
    asyncCreateRecipe: (recipe: Partial<Recipe>, ingredients: RecipeIngredient[]) => Promise<void>
    asyncUpdateRecipe: (id: string, recipe: Partial<Recipe>, ingredients: RecipeIngredient[]) => Promise<void>
    asyncDeleteRecipe: (id: string) => Promise<void>

    customFoods: CustomFood[]
    isLoadingCustomFoods: boolean
    fetchCustomFoods: (query?: string) => Promise<void>
    asyncCreateCustomFood: (food: Partial<CustomFood>) => Promise<void>
    asyncDeleteCustomFood: (id: string) => Promise<void>

    history: HistoryData | null
    isLoadingHistory: boolean
    fetchHistory: (days?: number) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
    date: new Date(),
    setDate: (date) => set({ date }),
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    mealSlots: [],
    isLoadingSlots: false,
    weightLogs: [],
    recentWorkouts: [],
    activeWorkout: null,
    isLoadingWorkouts: false,
    cardioLogs: [],
    recipes: [],
    isLoadingRecipes: false,
    customFoods: [],
    isLoadingCustomFoods: false,
    history: null,
    isLoadingHistory: false,

    asyncCreateCustomFood: async (food) => {
        try {
            const res = await fetch('/api/food/custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(food)
            })
            if (res.ok) {
                const newFood = await res.json()
                set((state) => ({
                    customFoods: [newFood, ...state.customFoods]
                }))
            }
        } catch (error) {
            console.error("Error creating custom food:", error)
        }
    },

    asyncDeleteCustomFood: async (id) => {
        try {
            const res = await fetch(`/api/food/custom/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                set((state) => ({
                    customFoods: state.customFoods.filter(f => f.id !== id)
                }))
            }
        } catch (error) {
            console.error("Error deleting custom food:", error)
        }
    },

    fetchMealSlots: async () => {
        set({ isLoadingSlots: true })
        try {
            const res = await fetch('/api/user/meal-slots')
            if (res.ok) {
                const slots = await res.json()
                set({ mealSlots: slots })
            } else {
                console.error("Failed to fetch slots")
            }
        } catch (error) {
            console.error("Error fetching slots:", error)
        } finally {
            set({ isLoadingSlots: false })
        }
    },

    asyncAddFoodsToSlot: async (slotId, foods) => {
        // Optimistic update
        set((state) => ({
            mealSlots: state.mealSlots.map(slot =>
                slot.id === slotId
                    ? { ...slot, items: [...slot.items, ...foods] }
                    : slot
            )
        }))

        try {
            const res = await fetch('/api/food/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slotId, foods })
            })

            if (!res.ok) {
                // Revert optimistic update (simplified: just refetch)
                get().fetchMealSlots()
            }
        } catch (error) {
            console.error("Error adding foods:", error)
            get().fetchMealSlots()
        }
    },

    removeFoodFromSlot: async (slotId, foodIndex) => {
        const state = get()
        const slot = state.mealSlots.find(s => s.id === slotId)
        if (!slot) return;

        const itemToDelete = slot.items[foodIndex]
        if (!itemToDelete) return;

        // Optimistic UI update
        set((prevState) => ({
            mealSlots: prevState.mealSlots.map(s =>
                s.id === slotId
                    ? { ...s, items: s.items.filter((_, idx) => idx !== foodIndex) }
                    : s
            )
        }))

        // Backend delete if item has an ID
        if (itemToDelete.id) {
            try {
                const res = await fetch(`/api/food/log/${itemToDelete.id}`, { method: 'DELETE' })
                if (!res.ok) {
                    // Revert if failed
                    get().fetchMealSlots()
                }
            } catch (error) {
                console.error("Failed to delete food item:", error)
                get().fetchMealSlots()
            }
        }
    },

    fetchWeightLogs: async () => {
        try {
            const res = await fetch('/api/user/weight')
            if (res.ok) {
                const logs = await res.json()
                set({ weightLogs: logs })
            }
        } catch (error) {
            console.error("Error fetching weight logs:", error)
        }
    },

    asyncLogWeight: async (weight, notes) => {
        // Optimistic update
        const tempId = Math.random().toString(36).substring(7)
        const newLog: WeightLog = {
            id: tempId,
            userId: 'temp',
            weightKg: weight,
            notes,
            date: new Date().toISOString()
        }

        set((state) => ({
            weightLogs: [newLog, ...state.weightLogs]
        }))

        try {
            const res = await fetch('/api/user/weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weight, notes })
            })

            if (!res.ok) {
                get().fetchWeightLogs()
            } else {
                const savedLog = await res.json()
                // Update the temp entry with real ID
                set((state) => ({
                    weightLogs: state.weightLogs.map(l => l.id === tempId ? savedLog : l)
                }))
            }
        } catch (error) {
            console.error("Error logging weight:", error)
            get().fetchWeightLogs()
        }
    },

    fetchRecentWorkouts: async () => {
        set({ isLoadingWorkouts: true })
        try {
            const res = await fetch('/api/user/workouts')
            if (res.ok) {
                const data = await res.json()
                set({ recentWorkouts: data })
            }
        } catch (error) {
            console.error("Error fetching workouts:", error)
        } finally {
            set({ isLoadingWorkouts: false })
        }
    },

    startWorkout: (name) => {
        set({
            activeWorkout: {
                name: name || "New Workout",
                date: new Date().toISOString(),
                exercises: []
            }
        })
    },

    addExerciseToActiveWorkout: (exerciseName, wgerExId) => {
        set((state) => {
            if (!state.activeWorkout) return state
            const newExercise: WorkoutExercise = {
                exerciseName,
                wgerExId,
                sets: [{ setNumber: 1, reps: 0, weightKg: 0 }]
            }
            return {
                activeWorkout: {
                    ...state.activeWorkout,
                    exercises: [...state.activeWorkout.exercises, newExercise]
                }
            }
        })
    },

    removeExerciseFromActiveWorkout: (index) => {
        set((state) => {
            if (!state.activeWorkout) return state
            return {
                activeWorkout: {
                    ...state.activeWorkout,
                    exercises: state.activeWorkout.exercises.filter((_, i) => i !== index)
                }
            }
        })
    },

    addSetToExercise: (exerciseIndex) => {
        set((state) => {
            if (!state.activeWorkout) return state
            const exercises = [...state.activeWorkout.exercises]
            const exercise = exercises[exerciseIndex]
            if (!exercise) return state

            const nextSetNumber = exercise.sets.length + 1
            const lastSet = exercise.sets[exercise.sets.length - 1]

            exercise.sets.push({
                setNumber: nextSetNumber,
                reps: lastSet?.reps || 0,
                weightKg: lastSet?.weightKg || 0
            })

            return { activeWorkout: { ...state.activeWorkout, exercises } }
        })
    },

    updateSetInExercise: (exerciseIndex, setIndex, data) => {
        set((state) => {
            if (!state.activeWorkout) return state
            const exercises = [...state.activeWorkout.exercises]
            const exercise = exercises[exerciseIndex]
            if (!exercise || !exercise.sets[setIndex]) return state

            exercise.sets[setIndex] = { ...exercise.sets[setIndex], ...data }
            return { activeWorkout: { ...state.activeWorkout, exercises } }
        })
    },

    removeSetFromExercise: (exerciseIndex, setIndex) => {
        set((state) => {
            if (!state.activeWorkout) return state
            const exercises = [...state.activeWorkout.exercises]
            const exercise = exercises[exerciseIndex]
            if (!exercise) return state

            exercise.sets = exercise.sets.filter((_, i) => i !== setIndex)
            // Re-normalize set numbers
            exercise.sets = exercise.sets.map((s, i) => ({ ...s, setNumber: i + 1 }))

            return { activeWorkout: { ...state.activeWorkout, exercises } }
        })
    },

    finishWorkout: async () => {
        const { activeWorkout } = get()
        if (!activeWorkout) return

        try {
            const res = await fetch('/api/user/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activeWorkout)
            })

            if (res.ok) {
                set({ activeWorkout: null })
                get().fetchRecentWorkouts()
            }
        } catch (error) {
            console.error("Error finishing workout:", error)
        }
    },

    updateActiveWorkout: (data) => {
        set((state) => {
            if (!state.activeWorkout) return state
            return {
                activeWorkout: { ...state.activeWorkout, ...data }
            }
        })
    },

    cancelWorkout: () => {
        set({ activeWorkout: null })
    },

    fetchCardioLogs: async () => {
        try {
            const res = await fetch('/api/user/cardio')
            if (res.ok) {
                const logs = await res.json()
                set({ cardioLogs: logs })
            }
        } catch (error) {
            console.error("Error fetching cardio logs:", error)
        }
    },

    asyncLogCardio: async (data) => {
        try {
            const res = await fetch('/api/user/cardio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                const savedLog = await res.json()
                set((state) => ({
                    cardioLogs: [savedLog, ...state.cardioLogs]
                }))
            }
        } catch (error) {
            console.error("Error logging cardio:", error)
        }
    },

    fetchRecipes: async () => {
        set({ isLoadingRecipes: true })
        try {
            const res = await fetch('/api/user/recipes')
            if (res.ok) {
                const data = await res.json()
                set({ recipes: data })
            }
        } catch (error) {
            console.error("Error fetching recipes:", error)
        } finally {
            set({ isLoadingRecipes: false })
        }
    },

    asyncCreateRecipe: async (recipe, ingredients) => {
        try {
            const res = await fetch('/api/user/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...recipe, ingredients })
            })

            if (res.ok) {
                const savedRecipe = await res.json()
                set((state) => ({
                    recipes: [savedRecipe, ...state.recipes]
                }))
            }
        } catch (error) {
            console.error("Error creating recipe:", error)
        }
    },

    asyncUpdateRecipe: async (id, recipe, ingredients) => {
        try {
            const res = await fetch(`/api/user/recipes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...recipe, ingredients })
            })

            if (res.ok) {
                const updatedRecipe = await res.json()
                set((state) => ({
                    recipes: state.recipes.map(r => r.id === id ? updatedRecipe : r)
                }))
            }
        } catch (error) {
            console.error("Error updating recipe:", error)
        }
    },

    asyncDeleteRecipe: async (id) => {
        try {
            const res = await fetch(`/api/user/recipes/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                set((state) => ({
                    recipes: state.recipes.filter(r => r.id !== id)
                }))
            }
        } catch (error) {
            console.error("Error deleting recipe:", error)
        }
    },

    fetchHistory: async (days = 30) => {
        set({ isLoadingHistory: true })
        try {
            const res = await fetch(`/api/user/history?days=${days}`)
            if (res.ok) {
                const data = await res.json()
                set({ history: data })
            }
        } catch (error) {
            console.error("Error fetching history:", error)
        } finally {
            set({ isLoadingHistory: false })
        }
    },

    fetchCustomFoods: async (query?: string) => {
        set({ isLoadingCustomFoods: true })
        try {
            const url = query ? `/api/food/custom?q=${encodeURIComponent(query)}` : '/api/food/custom'
            const res = await fetch(url)
            if (res.ok) {
                const data = await res.json()
                set({ customFoods: data })
            }
        } catch (error) {
            console.error("Error fetching custom foods:", error)
        } finally {
            set({ isLoadingCustomFoods: false })
        }
    }
}))
