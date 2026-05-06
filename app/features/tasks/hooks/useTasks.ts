import { useAppContext } from "@/app/state/AppContext";
import { Task } from "@/app/types/models";
interface UseTasksReturn  {
   tasks: Task[];
   addTask: (title: string, boardId: string) => void
   deleteTask: (id: string) => void
   editTask: (id: string, title: string) => void
   moveTask: (id: string, newStatus?: "todo" | "done", newBoardId?: string) => void
}

export function useTasks(boardId: string): UseTasksReturn {
   const {state, dispatch} = useAppContext()
   const tasks = state.tasks.filter((t) => t.boardId === boardId)

   function addTask(title: string, boardId: string) {
      dispatch({type: "ADD_TASK", payload: {title, boardId}})
   }

   function deleteTask(id: string) {
      dispatch({type: "DELETE_TASK", payload: {id}})
   }

   function editTask(id: string, title: string) {
      dispatch({type: "EDIT_TASK", payload: {id, title}})
   }

   function moveTask(id: string, newStatus?: "todo" | "done", newBoardId?: string) {
      if (!newStatus && !newBoardId) {
         throw new Error("Choose at least one option")
      }

      dispatch({type: "MOVE_TASK", payload: {id, ...(newStatus && {newStatus}), ...(newBoardId && {newBoardId}) }})
   }

   return {tasks, addTask, deleteTask, editTask, moveTask}
}  