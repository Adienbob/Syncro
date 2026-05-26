"use client"
import { ReactNode, createContext, useReducer, useContext, useEffect, useState } from 'react';
import { defaultState, getInitialState } from './initialState';
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
   const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
   const [isHydrated, setIsHydrated] = useState(false)
   
   useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsHydrated(true)
      localStorage.setItem("syncro-data", JSON.stringify(state))
   }, [state])



   if (!isHydrated) return null

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