"use client"
import { useState } from "react";
import { Board } from "@/app/types/models";
import { useBoards } from "../hooks/useBoards";

type BoardRenameModal = {
   board: Board;
   isOpen: boolean;
   onClose: () => void;
};

export default function RenameBoardModal({ board, isOpen, onClose }: BoardRenameModal) {
   const { renameBoard } = useBoards()
   const [renameTitle, setRenameTitle] = useState("")

   return (
      <div className={isOpen ? "fixed inset-0 bg-black/50 flex items-center justify-center z-50" : "hidden"}>
         <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
               Rename Board
            </h2>

            <label className="block mb-4">
               <span className="text-sm text-text-secondary">Board Name</span>
               <input
               type="text"
               value={renameTitle}
               onChange={(e) => setRenameTitle(e.target.value)}
               className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary outline-none focus:border-primary"
               />
            </label>

            <div className="flex justify-end gap-3">
               <button
               onClick={() => onClose()}
               className="px-4 py-2 rounded-md border border-border text-text-secondary"
               >
               Cancel
               </button>

               <button
               onClick={() => {
                  renameBoard(board.id, renameTitle.trim());
                  onClose()
               }}
               disabled={!renameTitle.trim()}
               className="px-4 py-2 rounded-md bg-primary text-white disabled:opacity-50"
               >
               Save
               </button>
            </div>
         </div>
      </div>
   )
}