"use client"
import { useState } from "react";
import BoardsGrid from "../features/boards/components/BoardsGrid";
import CreateBoard from "../features/boards/components/CreateBoardModal";
import { useBoards } from "../features/boards/hooks/useBoards";
import Header from "../shared/ui/Header";

export default function Boards() {
   const { boards } = useBoards()
   const [searchTerm, setSearchTerm] = useState("");
   const [sortBy, setSortBy] = useState<"A-Z" | "Z-A" | "newest" | "oldest" | "default">("default");

   const filteredBoards = [...boards]
   .filter((board) =>
      board.title.toLowerCase().includes(searchTerm.toLowerCase())
   ).sort((a, b) => {
      switch (sortBy) {
         case "A-Z":
               return a.title.localeCompare(b.title)

         case "Z-A":
               return b.title.localeCompare(a.title)

         case "newest":
            return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            
         case "oldest":
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

         default:
            return 0;
      }
   })

   return (
      <section>
         <Header 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
         />
         <div className="p-6">
            <CreateBoard />
            <BoardsGrid boards={filteredBoards} sortBy={sortBy} setSortBy={setSortBy} />
         </div>
      </section>
   )
}