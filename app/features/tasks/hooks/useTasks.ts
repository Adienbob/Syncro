import { useAppContext } from "@/app/state/AppContext";
import { Task } from "@/app/types/models";
interface UseTasksReturn  {
   tasks: Task[];
   addTask: (title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, boardId: string ) => void
   deleteTask: (id: string) => void
   editTask: (id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null ) => void
   moveTask: (id: string, newStatus?: "todo" | "done", newBoardId?: string) => void
}

export function useTasks(boardId: string): UseTasksReturn {
   const {state, dispatch} = useAppContext()
   const tasks = state.tasks.filter((t) => t.boardId === boardId)

   function addTask(title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, boardId: string) {
      dispatch({type: "ADD_TASK", payload: {title, description, priority, dueDate, boardId}})
   }

   function deleteTask(id: string) {
      dispatch({type: "DELETE_TASK", payload: {id}})
   }

   function editTask(id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null ) {
      dispatch({type: "EDIT_TASK", payload: {id, title, description, priority, dueDate }})
   }

   function moveTask(id: string, newStatus?: "todo" | "done", newBoardId?: string) {
      if (!newStatus && !newBoardId) {
         throw new Error("Choose at least one option")
      }

      dispatch({type: "MOVE_TASK", payload: {id, ...(newStatus && {newStatus}), ...(newBoardId && {newBoardId}) }})
   }

   return {tasks, addTask, deleteTask, editTask, moveTask}
}  