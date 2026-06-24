"use client"
import { ReactNode, createContext, useReducer, useContext, useEffect, useState } from 'react';
import { defaultState } from './initialState';
import { reducer } from './reducer';
import { Actions } from './actions';

type ContextType = {
   state: typeof defaultState
   dispatch: React.Dispatch<Actions>;
}

export const AppContext = createContext<ContextType>({ state: defaultState, dispatch: () => null });

type Props = {
   children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
   const [state, dispatch] = useReducer(reducer, defaultState);
   const [isHydrated, setIsHydrated] = useState(false)
   const [isLoading, setIsLoading] = useState(true)
   useEffect(() => {
      async function loadBoards() {
         const res = await fetch("/api/boards");
         const boards = await res.json() 
         dispatch({type: "SET_BOARDS", payload: {boards}})
         setIsLoading(false)
         setIsHydrated(true)
      }

      loadBoards()
   }, [])

   if (!isHydrated || isLoading) {
      return <div>Loading....</div>
   }
   return (
      <AppContext.Provider value={{ state, dispatch }}>
         {children}
      </AppContext.Provider>
   )
}

export function useAppContext() {
   const context = useContext(AppContext)
   if (!context) throw new Error("useAppContext must be used within AppProvider")
   return context
}