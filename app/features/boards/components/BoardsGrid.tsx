import BoardCard from "./boardCard";
import { Board } from "@/app/types/models";

export default function BoardsGrid({boards}: {boards: Board[]}) {
   
   return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         {boards.length > 0 ? boards.map( b => (
            <BoardCard key={b.id} title={b.title} id={b.id} createdAt={b.createdAt} />
         ))
      : "No boards yet, Create one!"}
      </div>
   )
}