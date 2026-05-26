import { useBoards } from "../hooks/useBoards"
import Link from "next/link"
import BoardCard from "./boardCard";
export default function BoardsGrid() {
   const { boards } = useBoards()   
   
   return (
      <div>
         {boards.length > 0 ? boards.map( b => (
            <Link key={b.id} href={`/BoardPage/${b.id}`}>
               <BoardCard title={b.title} id={b.id} createdAt={b.createdAt} />
            </Link>
         ))
      : "No boards yet, Create one!"}
      </div>
   )
}