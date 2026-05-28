"use client"
import BoardsGrid from "../features/boards/components/BoardsGrid";
import CreateBoard from "../features/boards/components/CreateBoardModal";

export default function Boards() {

   return (
      <section className="p-6">
         <CreateBoard />
         <BoardsGrid />
      </section>
   )
}