import { AppState } from "../types/models"


const defaultState: AppState = {
   boards: [],
   tasks: [],
}

function getInitialState(): AppState {
   if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("syncro-data")
      
      if (savedData) {
         try {
            return JSON.parse(savedData)
         } catch {
            return defaultState
         }
      }
   } return defaultState
} 
export { defaultState, getInitialState }