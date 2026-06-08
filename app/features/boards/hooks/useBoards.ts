import { useAppContext } from "@/app/state/AppContext";
import { Board } from "@/app/types/models";

interface UseBoardsReturn  {
   boards: Board[];
   addBoard: (title: string) => void
   renameBoard: (id:string, title: string) => void
   deleteBoard: (id: string) => void
}

export function useBoards(): UseBoardsReturn {
   const {state, dispatch} = useAppContext()
   const boards = state.boards

   function addBoard(title: string) {
      dispatch({ type: "ADD_BOARD", payload: {title} })
   }

   function renameBoard(id:string, title: string) {
      dispatch({ type: "RENAME_BOARD", payload: {id, title}})
   }

   function deleteBoard(id: string) {
      dispatch({ type: "DELETE_BOARD", payload: {id}})
   }

   return { boards, addBoard, renameBoard, deleteBoard}
}