import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Board } from "@/app/types/models";
import { useRouter } from "next/navigation";
import { getRole } from "@/app/shared/utils/getRole";
import { useAppContext } from "@/app/state/AppContext";
import { requireAuth } from "@/app/shared/utils/requireAuth";


interface UseBoardsReturn  {
   boards: Board[];
   addBoard: (title: string) => Promise<void>
   renameBoard: (id: string, title: string) => Promise<void>
   deleteBoard: (id: string) => Promise<void>
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
         console.log(member)
   
         dispatch({ type: "ADD_BOARD", payload: {id: board.id, title, userId: board.user_id, createdAt: board.created_at } })

         dispatch({
            type: "ADD_MEMBER",
            payload: {
               member: {
                  id: member.id,
                  boardId: member.board_id,
                  userId: member.user_id,
                  displayName: member.display_name,
                  imageUrl: member.image_url,
                  email: member.email,
                  role: member.role,
                  joinedAt: member.joined_at,
               },
            },
         });
         
         toast.success("Board created successfully!")
      } catch (error) {
         console.log(error)
         toast.error("Failed to create board.")
      }
      
   }


   async function renameBoard(id: string, title: string) {
      // Check if the user Signed in 
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      // Check if the user is Owner
      const myRole = getRole(members, id, user?.id )

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
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }


      // Check if the user is Owner
      const myRole = getRole(members, id, user?.id )

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

   return { boards, addBoard, renameBoard, deleteBoard}
}