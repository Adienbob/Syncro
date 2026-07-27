"use client"
import { ReactNode, createContext, useReducer, useContext, useEffect, useState } from 'react';
import { defaultState, demoState } from './initialState';
import LoadingSpinner from '../shared/ui/LoadingSpinner';
import { useUser } from '@clerk/nextjs';
import { reducer } from './reducer';
import { Actions } from './actions';
import { Toaster } from "sonner";
import { Board, BoardMember, Task } from '../types/models';

type ContextType = {
   state: typeof defaultState
   dispatch: React.Dispatch<Actions>;
}

export const AppContext = createContext<ContextType>({ state: defaultState, dispatch: () => null });

type Props = {
   children: ReactNode
}

type DBBoard = {
   id: string;
   title: string;
   created_at: string;
}

type DBTask = {
   id: string;
   title: string;
   description: string;
   priority: "low" | "medium" | "high";
   due_date: string | null;
   status: "todo" | "in-progress" | "done";
   board_id: string;
   created_at: string;
};

type DBBoardMember = {
   id: string;
   board_id: string;
   user_id: string;
   role: "owner" | "editor" | "viewer";
   joined_at: string;
};


export const AppProvider = ({ children }: Props) => {
   const [state, dispatch] = useReducer(reducer, defaultState);
   const [isLoading, setIsLoading] = useState(true)
   const {isSignedIn, isLoaded} = useUser()

   useEffect(() => {
      if (!isLoaded) return;
      async function loadData() {
         const [boardMembersRes, boardsRes, tasksRes] = await Promise.all([
            fetch("/api/board-members"),
            fetch("/api/boards"),
            fetch("/api/tasks"),
         ])
         const jsonBoards: DBBoard[] = await boardsRes.json()

         const members: DBBoardMember[] = await boardMembersRes.json()

         // Normalize and dispatch members
         const normalizedMembers = members.map((member: DBBoardMember) => ({
            id: member.id,
            boardId: member.board_id,
            userId: member.user_id,
            role: member.role,
            joinedAt: member.joined_at,
         }));
         // console.log(normalizedMembers)
         dispatch({
            type: "SET_MEMBERS",
            payload: { members: normalizedMembers },
         });

         // Normalize and dispatch boards
         const normalizedBoards = jsonBoards.map((board: DBBoard) => ({
            id: board.id,
            title: board.title,
            createdAt: board.created_at,
         }));
         
         console.log(normalizedBoards)
         console.log(jsonBoards)
         dispatch({
            type: "SET_BOARDS",
            payload: { boards: normalizedBoards },
         });
         
         // Normalize and dispatch Tasks
         const tasks: DBTask[] = await tasksRes.json() 
         
         const normalizedTasks = tasks.map((task: DBTask) => ({
            ...task,
            boardId: task.board_id,
            createdAt: task.created_at,
            dueDate: task.due_date,
         }));
         
         // console.log(normalizedTasks)
         dispatch({type: "SET_TASKS", payload: {tasks: normalizedTasks}})

         setIsLoading(false)
      }

      function loadDemo() {
         dispatch({type: "SET_BOARDS", payload: {boards: demoState.boards}})
         dispatch({type: "SET_TASKS", payload: {tasks: demoState.tasks}})
         setIsLoading(false)
      }
      

      if (isSignedIn) {
         loadData()
      } else {
         loadDemo()
      }

   }, [isSignedIn, isLoaded])

   if (isLoading) {
      return <LoadingSpinner />
   }
   return (
      <AppContext.Provider value={{ state, dispatch }}>
         {children}
         <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            closeButton
            duration={3000}
         />
      </AppContext.Provider>
   )
}

export function useAppContext() {
   const context = useContext(AppContext)
   if (!context) throw new Error("useAppContext must be used within AppProvider")
   return context
}