import * as React from "react"

export function useFoodSearch(query: string) {
    const [results, setResults] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (!query || query.length < 2) {
            setResults([])
            return
        }

        const debounce = setTimeout(async () => {
            setIsLoading(true)
            setError(null)
            try {
                const res = await fetch(`/api/food/search?q=${encodeURIComponent(query)}`)
                if (res.ok) {
                    const data = await res.json()
                    setResults(data || [])
                }
            } catch (err) {
                console.error("Search error:", err)
                setError("Failed to fetch results")
            } finally {
                setIsLoading(false)
            }
        }, 500)

        return () => clearTimeout(debounce)
    }, [query])

    return { results, isLoading, error }
}
