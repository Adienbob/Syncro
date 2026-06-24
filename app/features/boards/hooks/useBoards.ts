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
   const { isSignedIn } = useUser()


   async function addBoard(title: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      await fetch(`/api/boards`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ title }),
      });

      dispatch({ type: "ADD_BOARD", payload: {title} })
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
      console.log(id)
      await fetch(`/api/boards/${`d79b3ec3-0e0e-4661-a973-4bf0424681a7`}`, {
         method: "DELETE",
      }) ;

      dispatch({ type: "DELETE_BOARD", payload: {id}})
   }

   return { boards, addBoard, renameBoard, deleteBoard}
}