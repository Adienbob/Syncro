"use client"
import { ReactNode, createContext, useReducer, useContext, useEffect, useState } from 'react';
import { defaultState, demoState } from './initialState';
import { reducer } from './reducer';
import { Actions } from './actions';
import { useUser } from '@clerk/nextjs';

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
   const {isSignedIn} = useUser()

   useEffect(() => {
      async function loadData() {
         const [boardsRes, tasksRes] = await Promise.all([
            fetch("/api/boards"),
            fetch("/api/tasks"),
         ])
         const boards = await boardsRes.json() 
         const tasks = await tasksRes.json() 

         const normalizedBoards = boards.map((board: {user_id: string, created_at: string}) => ({
            ...board,
            userId: board.user_id,
            createdAt: board.created_at,
         }));

         const normalizedTasks = tasks.map((task: {board_id: string, created_at: string, due_date: string}) => ({
            ...task,
            boardId: task.board_id,
            createdAt: task.created_at,
            dueDate: task.due_date,
         }));

         
         dispatch({type: "SET_BOARDS", payload: {boards: normalizedBoards}})
         dispatch({type: "SET_TASKS", payload: {tasks: normalizedTasks}})
         setIsLoading(false)
         setIsHydrated(true)
      }



      if (!isSignedIn) {
         loadData()
      } {
         dispatch({type: "SET_BOARDS", payload: {boards: demoState.boards}})
         dispatch({type: "SET_TASKS", payload: {tasks: demoState.tasks}})
      }

   }, [isSignedIn])

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