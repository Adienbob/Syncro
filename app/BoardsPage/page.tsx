"use client"
import BoardsGrid from "../features/boards/components/BoardsGrid";
import CreateBoard from "../features/boards/components/CreateBoardModal";

export default function Boards() {

   return (
      <section>
         <div>
            <h1>My Boards</h1>
            <CreateBoard />
         </div>
         <BoardsGrid />
      </section>
   )
}