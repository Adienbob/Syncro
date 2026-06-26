import { useAppContext } from "@/app/state/AppContext";
import { Task } from "@/app/types/models";
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";

interface UseTasksReturn  {
   tasks: Task[];
   addTask: (title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, boardId: string ) => void
   deleteTask: (id: string) => void
   editTask: (id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null ) => void
   moveTask: (id: string, newStatus: "todo" | "in-progress" | "done") => void
}

export function useTasks(boardId: string): UseTasksReturn {
   const {state, dispatch} = useAppContext()
   const tasks = state.tasks.filter((t) => t.boardId === boardId)
   
   // Auth | Protect Actions
   const { isSignedIn } = useUser()
   const router = useRouter()
   async function addTask(title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, boardId: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      const res = await fetch(`/api/tasks`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ title, description, priority, dueDate, board_Id: boardId }),
      });
      console.log()
      const newTask: {id: string, created_at: string} = await res.json()
      console.log(newTask.id)
      dispatch({type: "ADD_TASK", payload: {id: newTask.id, title, createdAt: newTask.created_at, description, priority, dueDate, boardId}})
   }

   async function deleteTask(id: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      await fetch(`/api/tasks/${id}`, {
         method: "DELETE",
      }) ;
      dispatch({type: "DELETE_TASK", payload: {id}})
   }
   
   async function editTask(id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null ) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      await fetch(`/api/tasks/${id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ title, description, priority, due_date: dueDate }),
      });

      dispatch({type: "EDIT_TASK", payload: {id, title, description, priority, dueDate }})
   }

   async function moveTask(id: string, newStatus: "todo" | "in-progress" | "done") {
      await fetch(`/api/tasks/${id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ status: newStatus }),
      });

      dispatch({type: "MOVE_TASK", payload: {id, ...(newStatus && {newStatus}) }})
   }

   return {tasks, addTask, deleteTask, editTask, moveTask}
}  