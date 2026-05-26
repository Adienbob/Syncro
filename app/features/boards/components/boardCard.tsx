import { useBoards } from "../hooks/useBoards"
import { Board } from "@/app/types/models"

export default function BoardCard(board: Board) {
   const { deleteBoard } = useBoards()   

   return (
      <article>
         <h2>{board.title}</h2>
         <span>created at: {board.createdAt}</span>
         <span>{board.id}</span>
         <button onClick={(e) => {
            deleteBoard(board.id)
            e.preventDefault()
            e.stopPropagation()
         }}>Delete</button>
      </article>
   )
}