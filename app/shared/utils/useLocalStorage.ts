import { useState, useEffect } from "react"


export function useLocalStorage<T>(key: string, fallbackValue: T): [T, (value: T) => void] {
   function getFromLocalStorage(key: string) {
      const savedData = localStorage.getItem(key)
      
      if (!savedData) return fallbackValue

      try {
         return JSON.parse(savedData)
      } catch {
         return fallbackValue
      }
   }
   
   const [value, setValue] = useState(() => getFromLocalStorage(key))

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value))
   }, [value, key])

   return [value, setValue]
}