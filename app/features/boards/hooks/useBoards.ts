import { useAppContext } from "@/app/state/AppContext";
import { Board } from "@/app/types/models";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"

interface UseBoardsReturn  {
   boards: Board[];
   addBoard: (title: string) => void
   renameBoard: (id:string, title: string) => void
   deleteBoard: (id: string) => void
}

export function useBoards(): UseBoardsReturn {
   const {state, dispatch} = useAppContext()
   const boards = state.boards
   // Auth | Protect Actions
   const router = useRouter()
   const { isSignedIn, user } = useUser()
   
   
   async function addBoard(title: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }
      const res = await fetch(`/api/boards`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ title, user_id: user.id }),
      });

      const newBoard: {id: string, user_id: string, created_at: string} = await res.json()

      dispatch({ type: "ADD_BOARD", payload: {id: newBoard.id, title, userId: newBoard.user_id, createdAt: newBoard.created_at } })
   }

   async function renameBoard(id:string, title: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      await fetch(`/api/boards/${id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ title }),
      });

      dispatch({ type: "RENAME_BOARD", payload: {id, title}})
   }

   async function deleteBoard(id: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      await fetch(`/api/boards/${id}`, {
         method: "DELETE",
      }) ;

      dispatch({ type: "DELETE_BOARD", payload: {id}})
   }

   return { boards, addBoard, renameBoard, deleteBoard}
}