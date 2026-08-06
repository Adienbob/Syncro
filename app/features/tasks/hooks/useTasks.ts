import { toast } from "sonner"; 
import { useUser } from "@clerk/nextjs";
import { Task } from "@/app/types/models";
import { useRouter } from "next/navigation";
import { getRole } from "@/app/shared/utils/getRole";
import { useAppContext } from "@/app/state/AppContext";
import { requireAuth } from "@/app/shared/utils/requireAuth";

interface UseTasksReturn {
   tasks: Task[];
   addTask: (title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, boardId: string, assigneeId: string | null) => void;
   deleteTask: (id: string) => void;
   editTask: (id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null) => void;
   moveTask: (id: string, newStatus: "todo" | "in-progress" | "done") => void;
   assignTask: (id: string, assignedId: string | null) => void;
}

export function useTasks(boardId: string): UseTasksReturn {
   const { state } = useAppContext();
   const tasks = state.tasks.filter((t) => t.boardId === boardId);
   const members = state.members
   const { user } = useUser();
   const myRole = getRole(members, boardId, user?.id)


   // Auth | Protect Actions
   const { isSignedIn } = useUser();
   const router = useRouter();

   async function addTask(
      title: string,
      description: string,
      priority: "low" | "medium" | "high",
      dueDate: string | null,
      boardId: string,
      assignedId: string | null
   ) {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      if (myRole === "viewer" || myRole === undefined) {
         toast.error("You don't have permission");
         return;
      }

      try {
         const res = await fetch(`/api/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, priority, dueDate, boardId, assignedId }),
         });

         if (!res.ok) {
            throw new Error("Failed to create task.")
         }

         toast.success("Task created successfully!");
      } catch {
         toast.error("Failed to create task.");
      }
   }

   async function deleteTask(id: string) {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      if (myRole === "viewer" || myRole === undefined) {
         toast.error("You don't have permission");
         return;
      }

      try {
         const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

         if (!res.ok) {
            throw new Error("Failed to delete task.")
         }

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
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      if (myRole === "viewer" || myRole === undefined) {
         toast.error("You don't have permission");
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

         toast.success("Task updated successfully!");
      } catch {
         toast.error("Failed to update task.");
      }
   }

   async function moveTask(id: string, newStatus: "todo" | "in-progress" | "done") {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      if (myRole === "viewer" || myRole === undefined) {
         toast.error("You don't have permission");
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

         toast.success("Task moved successfully!");
      } catch {
         toast.error("Failed to move task.");
      }
   }

   async function assignTask(id: string, assigneeId: string | null) {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      if (myRole === "viewer" || myRole === undefined) {
         toast.error("You don't have permission");
         return;
      }

      try {
         const res = await fetch(`/api/tasks/${id}/assignee`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assigneeId }),
         });

         if (!res.ok) {
            console.log(res.json())
            throw new Error("Failed to assign task.")
         }

         toast.success(
            assigneeId
               ? "Task assigned successfully!"
               : "Task unassigned successfully!"
         );

      } catch (error) {
         toast.error(assigneeId
         ? "Failed to assign task."
         : "Failed to unassign task.");
      }
   }

   return { tasks, addTask, deleteTask, editTask, moveTask, assignTask };
}