"use client"
import { useState } from "react";
import BoardsGrid from "../features/boards/components/BoardsGrid";
import CreateBoard from "../features/boards/components/CreateBoardModal";
import { useBoards } from "../features/boards/hooks/useBoards";
import Header from "../shared/ui/Header";

export default function Boards() {
   const { boards } = useBoards()
   const [searchTerm, setSearchTerm] = useState("");

   const filteredBoards = boards.filter((board) =>
      board.title.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <section>
         <Header 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
         />
         <div className="p-6">
            <CreateBoard />
            <BoardsGrid boards={filteredBoards} />
         </div>
      </section>
   )
}