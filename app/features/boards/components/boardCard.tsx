"use client"

import { Board } from "@/app/types/models"
import Link from "next/link";
import BoardMenu from "./BoardMenu";

export default function BoardCard(board: Board) {

   return (
      <article className="p-4 bg-surface border border-border rounded-[8px] ">
         <div className="">
            <div className="flex justify-between items-center mb-1">
               <h2 className="font-semibold text-[20px] text-text-primary leading-7">{board.title}</h2>
               <div className="relative">
                  <BoardMenu board={board} />
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