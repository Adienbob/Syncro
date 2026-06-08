"use client"

import { useState } from "react"

import { useBoards } from "../hooks/useBoards"
import { Board } from "@/app/types/models"
import RenameBoardModal from "./RenameBoard";
import Link from "next/link";

export default function BoardCard(board: Board) {
   const { deleteBoard } = useBoards()
   const [isRenameOpen, setIsRenameOpen] = useState(false)

   return (
      <article className="p-4 bg-surface border border-border rounded-[8px] ">
         <div className="">
            <div className="flex justify-between items-center mb-1">
               <h2 className="font-semibold text-[20px] text-text-primary leading-7">{board.title}</h2>
               <button onClick={() => setIsRenameOpen(prev => !prev)}>rename board</button>
               {isRenameOpen && (<RenameBoardModal board={board} isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)} />)}
               <button className="bg-red-700 text-[12px] text-text-primary px-2 py-1 rounded-[8px]" onClick={(e) => {
                  deleteBoard(board.id)
                  e.preventDefault()
                  e.stopPropagation()
               }}>Delete</button>
            </div>
         </div>
         <Link href={`/BoardPage/${board.id}`}>
            <div className="grid">
               <span className="font-medium text-[12px] text-text-muted">created at: {board.createdAt}</span>
               <div className="flex justify-between items-center">
                  <span className="bg-primary-light/10 rounded-[4px] text-[11px] font-medium leading-[14px] tracking-[0.55px] px-2 py-0.5 text-primary-light">Status</span>
                  <span className="text-white">icon</span>
               </div>
            </div>
         </Link>
      </article>
   )
}