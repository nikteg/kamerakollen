import fetchJsonp from "fetch-jsonp"
import { useEffect, useState } from "react"

interface UseFetchOptions {
  pollingInterval?: number
}

export function useFetchJsonp<T>(
  url: string,
  transform: (a: T) => T,
  options: UseFetchOptions = { pollingInterval: 10000 }
): [boolean, T | null] {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<T | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const data = await fetchJsonp(url).then((r) => r.json<T>())
    setLoading(false)
    setData(transform(data))
  }

  useEffect(
    () => {
      let intervalId: number | null = null

      if (!data) {
        fetchData().then(() => {
          intervalId = setInterval(fetchData, options.pollingInterval)
        })
      } else {
        intervalId = setInterval(fetchData, options.pollingInterval)
      }

      return () => {
        if (intervalId) {
          clearInterval(intervalId)
        }
      }
    },
    [url, options.pollingInterval]
  )

  return [isLoading, data]
}
