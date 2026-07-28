import { useAppContext } from "@/app/state/AppContext";
import { Board } from "@/app/types/models";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner";
import { getRole } from "@/app/shared/utils/getRole";


interface UseBoardsReturn  {
   boards: Board[];
   addBoard: (title: string) => Promise<void>
   renameBoard: (id: string, title: string) => Promise<void>
   deleteBoard: (id: string) => Promise<void>
   inviteMember: (id: string, email: string, role: "editor" | "viewer") => Promise<void>
}

export function useBoards(): UseBoardsReturn {
   const {state, dispatch} = useAppContext()
   const boards = state.boards
   // Auth | Protect Actions
   const router = useRouter()
   const { isSignedIn, user } = useUser()
   const members = state.members

   
   async function addBoard(title: string) {
      // Check if the user Signed in 
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      try {
         const res = await fetch(`/api/boards`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
         });
         const {board, member} = await res.json()
   
         dispatch({ type: "ADD_BOARD", payload: {id: board.id, title, userId: board.user_id, createdAt: board.created_at } })

         dispatch({
            type: "ADD_MEMBER",
            payload: {
               member: {
                  id: member.id,
                  boardId: member.board_id,
                  userId: member.user_id,
                  role: member.role,
                  joinedAt: member.joined_at,
               },
            },
         });

         toast.success("Board created successfully!")
      } catch {
         
         toast.error("Failed to create board.")
      }
      
   }


   async function renameBoard(id: string, title: string) {
      // Check if the user Signed in 
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      // Check if the user is Owner
      const myRole = getRole(members, id, user.id )

      if (myRole !== "owner") {
         toast.error("You don't have permission");
         return;
      }

      try {
         const res = await fetch(`/api/boards/${id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
         });

         if (!res.ok) {
            throw new Error("Failed to rename board");
         }

         dispatch({
            type: "RENAME_BOARD",
            payload: { id, title },
         });

         toast.success("Board renamed successfully!");
      } catch (error) {
         console.error(error);
         toast.error("Failed to rename board.");
      }
   }

   async function deleteBoard(id: string) {
      // Check if the user Signed in 
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }


      // Check if the user is Owner
      const myRole = getRole(members, id, user.id )

      if (myRole !== "owner") {
         toast.error("You don't have permission");
         return;
      }

      try {
         await fetch(`/api/boards/${id}`, {
            method: "DELETE",
         });

         dispatch({ type: "DELETE_BOARD", payload: { id } });

         toast.success("Board deleted successfully!");
      } catch {
         toast.error("Failed to delete board.");
      }
   }

   async function inviteMember( id: string, email: string, role: "editor" | "viewer" ) {
      // Check if the user Signed in 
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      // Check if the user is Owner
      const myRole = getRole(members, id, user.id )

      if (myRole !== "owner") {
         toast.error("You don't have permission");
         return;
      }

      try {
         const res = await fetch(`/api/boards/${id}/members`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email,
               role,
            }),
         });

         const data = await res.json();

         if (!res.ok) {
            throw new Error(data.error || "Failed to invite member");
         }

         toast.success("Member invited successfully.");
      } catch (err) {
         if (err instanceof Error) {
            toast.error(err.message);
         } else {
            toast.error("Something went wrong.");
         }
      }
      
   }

   return { boards, addBoard, renameBoard, deleteBoard, inviteMember}
}