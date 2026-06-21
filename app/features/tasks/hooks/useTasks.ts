import { useAppContext } from "@/app/state/AppContext";
import { Task } from "@/app/types/models";
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";

interface UseTasksReturn  {
   tasks: Task[];
   addTask: (title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, boardId: string ) => void
   deleteTask: (id: string) => void
   editTask: (id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null ) => void
   moveTask: (id: string, newStatus?: "todo" | "in-progress" | "done", newBoardId?: string) => void
}

export function useTasks(boardId: string): UseTasksReturn {
   const {state, dispatch} = useAppContext()
   const tasks = state.tasks.filter((t) => t.boardId === boardId)
   
   // Auth | Protect Actions
   const { isSignedIn } = useUser()
   const router = useRouter()

   function addTask(title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, boardId: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }
      dispatch({type: "ADD_TASK", payload: {title, description, priority, dueDate, boardId}})
   }

   function deleteTask(id: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }
      dispatch({type: "DELETE_TASK", payload: {id}})
   }

   function editTask(id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null ) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }
      dispatch({type: "EDIT_TASK", payload: {id, title, description, priority, dueDate }})
   }

   function moveTask(id: string, newStatus?: "todo" | "in-progress" | "done", newBoardId?: string) {
      if (!newStatus && !newBoardId) {
         throw new Error("Choose at least one option")
      }

      dispatch({type: "MOVE_TASK", payload: {id, ...(newStatus && {newStatus}), ...(newBoardId && {newBoardId}) }})
   }

   return {tasks, addTask, deleteTask, editTask, moveTask}
}  