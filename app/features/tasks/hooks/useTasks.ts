import { useAppContext } from "@/app/state/AppContext";
import { Task } from "@/app/types/models";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 

interface UseTasksReturn {
   tasks: Task[];
   addTask: (title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, boardId: string) => void;
   deleteTask: (id: string) => void;
   editTask: (id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null) => void;
   moveTask: (id: string, newStatus: "todo" | "in-progress" | "done") => void;
}

export function useTasks(boardId: string): UseTasksReturn {
   const { state, dispatch } = useAppContext();
   const tasks = state.tasks.filter((t) => t.boardId === boardId);

   // Auth | Protect Actions
   const { isSignedIn } = useUser();
   const router = useRouter();

   async function addTask(
      title: string,
      description: string,
      priority: "low" | "medium" | "high",
      dueDate: string | null,
      boardId: string
   ) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      try {
         const res = await fetch(`/api/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, priority, dueDate, board_Id: boardId }),
         });

         if (!res.ok) {
            throw new Error("Failed to create task.")
         }

         const newTask: { id: string; created_at: string } = await res.json();

         dispatch({
            type: "ADD_TASK",
            payload: {
               id: newTask.id,
               title,
               createdAt: newTask.created_at,
               description,
               priority,
               dueDate,
               boardId,
            },
         });

         toast.success("Task created successfully!");
      } catch {
         toast.error("Failed to create task.");
      }
   }

   async function deleteTask(id: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      try {
         const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

         if (!res.ok) {
            throw new Error("Failed to delete task.")
         }

         dispatch({ type: "DELETE_TASK", payload: { id } });

         toast.success("Task deleted successfully!");
      } catch {
         toast.error("Failed to delete task.");
      }
   }

   async function editTask(
      id: string,
      title: string,
      description: string,
      priority: "low" | "medium" | "high",
      dueDate: string | null
   ) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      try {
         const res = await fetch(`/api/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, priority, due_date: dueDate }),
         });

         if (!res.ok) {
            throw new Error("Failed to update task.")
         }

         dispatch({
            type: "EDIT_TASK",
            payload: { id, title, description, priority, dueDate },
         });

         toast.success("Task updated successfully!");
      } catch {
         toast.error("Failed to update task.");
      }
   }

   async function moveTask(id: string, newStatus: "todo" | "in-progress" | "done") {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      try {
         const res = await fetch(`/api/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
         });

         if (!res.ok) {
            throw new Error("Failed to move task.")
         }

         dispatch({
            type: "MOVE_TASK",
            payload: { id, ...(newStatus && { newStatus }) },
         });

         toast.success("Task moved successfully!");
      } catch {
         toast.error("Failed to move task.");
      }
   }

   return { tasks, addTask, deleteTask, editTask, moveTask };
}