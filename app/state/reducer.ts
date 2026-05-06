import { AppState } from "../types/models"

import { Actions } from "./actions"

export function reducer(state: AppState, action: Actions) {
   switch (action.type) {
      case "ADD_BOARD":
         return {
            ...state,
            boards: [...state.boards, {id: crypto.randomUUID(), title: action.payload.title, createdAt: new Date().toISOString()}]
         }
      case "DELETE_BOARD":
         return {
            ...state,
            boards: state.boards.filter( b => b.id !== action.payload.id ),
            tasks: state.tasks.filter(t => t.boardId !== action.payload.id )
         }
      case "ADD_TASK": 
         return {
            ...state,
            tasks: [...state.tasks, {
               id: crypto.randomUUID(),
               title: action.payload.title,
               status: action.payload.status ?? "todo",
               boardId: action.payload.boardId
            }]
         }
      case "DELETE_TASK":
         return {
            ...state,
            tasks: [...state.tasks.filter(t => t.id !== action.payload.id)]
         }
      case "MOVE_TASK":
         return {
            ...state,
            tasks: state.tasks.map((t) => {
               if (t.id === action.payload.id) {
                  let updatedTask = t
                  
                  if (action.payload.newBoardId) {
                     updatedTask = {...updatedTask, boardId: action.payload.newBoardId}
                  }
   
                  if (action.payload.newStatus) {
                     updatedTask = {...updatedTask, status: action.payload.newStatus}
                  }
   
                  return updatedTask
               } else return t
            })
         }
      case "EDIT_TASK": 
         return {
            ...state,
               tasks: state.tasks.map((t) => (
                  t.id === action.payload.id
                  ? {...t, title: action.payload.title}
                  : t
               ))
         }
   }
}