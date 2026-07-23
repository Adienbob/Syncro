"use client"

import { useState } from "react"

import { useBoards } from "../hooks/useBoards"
import { Board } from "@/app/types/models"
import RenameBoardModal from "./RenameBoard";
import Link from "next/link";
import ConfirmDialog from "@/app/shared/ui/ConfirmationDialog";
import InviteMemberModal from "./InviteMemberModal";

export default function BoardCard(board: Board) {
   const { deleteBoard } = useBoards()
   const [isRenameOpen, setIsRenameOpen] = useState(false)
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);


   return (
      <article className="p-4 bg-surface border border-border rounded-[8px] ">
         <div className="">
            <div className="flex justify-between items-center mb-1">
               <h2 className="font-semibold text-[20px] text-text-primary leading-7">{board.title}</h2>
               <div className="flex items-center gap-2.5">
                  <button aria-label="Edit board" className="text-on-surface-variant hover:text-amber-200 transition-colors" onClick={() => setIsRenameOpen(prev => !prev)}>
                     <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  >
                     <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                  </button>
                  {isRenameOpen && (<RenameBoardModal board={board} isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)} />)}

                  <button aria-label="Delete board" className="text-on-surface-variant hover:text-red-500 transition-colors" onClick={(e) => {
                     setIsDeleteOpen(true)
                     e.preventDefault()
                     e.stopPropagation()
                  }}>
                     <ConfirmDialog
                        isOpen={isDeleteOpen}
                        title="Delete board?"
                        description="This action cannot be undone."
                        onCancel={() => setIsDeleteOpen(false)}
                        onConfirm={() => {
                           deleteBoard(board.id);
                           setIsDeleteOpen(false);
                        }}
                     />
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        width="20"
                        height="20"
                        fill="currentColor"
                        
                     >
                        <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/>
                     </svg>
                  </button>
               </div>
            </div>
         </div>
         <Link href={`/BoardPage/${board.id}`}>
            <div className="grid">
               <span className="m-4 font-medium text-[12px] text-text-muted">created at: {board.createdAt}</span>
               <div className="flex justify-between items-center">
                  <span className="bg-primary-light/10 rounded-[4px] text-[11px] font-medium leading-[14px] tracking-[0.55px] px-2 py-0.5 text-primary-light">Status</span>
                  <span className="text-white">icon</span>
               </div>
            </div>
         </Link>
      </article>
   )
}