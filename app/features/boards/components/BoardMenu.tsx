"use client";

import { useEffect, useRef, useState } from "react";
import { Board } from "@/app/types/models";
import RenameBoardModal from "./RenameBoard";
import ConfirmDialog from "@/app/shared/ui/ConfirmationDialog";
import { useBoards } from "../hooks/useBoards";
import MembersModal from "./members/MembersModal";

interface Props {
   board: Board;
}

export default function BoardMenu({ board }: Props) {
   const { deleteBoard } = useBoards();

   const [open, setOpen] = useState(false);
   const [renameOpen, setRenameOpen] = useState(false);
   const [deleteOpen, setDeleteOpen] = useState(false);
   const [membersOpen, setMembersOpen] = useState(false);

   const menuRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      function handleClick(e: MouseEvent) {
         if (
            menuRef.current &&
            !menuRef.current.contains(e.target as Node)
         ) {
            setOpen(false);
         }
      }

      document.addEventListener("mousedown", handleClick);

      return () =>
         document.removeEventListener("mousedown", handleClick);
   }, []);

   return (
      <div ref={menuRef} className="relative">
         <button
            aria-label="Board actions"
            onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               setOpen((prev) => !prev);
            }}
            className="rounded-md p-1 text-text-muted transition hover:bg-surface-hover hover:text-text-primary"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="18"
               height="18"
               viewBox="0 0 24 24"
               fill="currentColor"
            >
               <circle cx="12" cy="5" r="1.8" />
               <circle cx="12" cy="12" r="1.8" />
               <circle cx="12" cy="19" r="1.8" />
            </svg>
         </button>

         {open && (
            <div className="absolute right-0 top-10 z-50 w-52 overflow-hidden rounded-md border border-border bg-surface shadow-modal">
               <button onClick={() => {
                  setRenameOpen(true)
                  setOpen(false)
               }} className="flex w-full items-center gap-3 px-4 py-2.5 text-body-md text-text-secondary transition-colors hover:bg-hover-bg hover:text-text-primary">
                  Rename
               </button>

               <button onClick={() => {
                  setMembersOpen(true)
                  setOpen(false)
               }} className="flex w-full items-center gap-3 px-4 py-2.5 text-body-md text-text-secondary transition-colors hover:bg-hover-bg hover:text-text-primary">
                  Members
               </button>

               <div className="mx-2 border-t border-border" />

               <button onClick={() => {
                  setDeleteOpen(true)
                  setOpen(false)
               }} className="flex w-full items-center gap-3 px-4 py-2.5 text-body-md text-error transition-colors hover:bg-hover-bg">
                  Delete
               </button>
            </div>
         )}

         <RenameBoardModal
            board={board}
            isOpen={renameOpen}
            onClose={() => setRenameOpen(false)}
         />

         <ConfirmDialog
            isOpen={deleteOpen}
            title="Delete board?"
            description="This action cannot be undone."
            onCancel={() => setDeleteOpen(false)}
            onConfirm={() => {
               deleteBoard(board.id);
               setDeleteOpen(false);
            }}
         />

         <MembersModal 
            isOpen={membersOpen}
            boardId={board.id}
            onClose={() => setMembersOpen(false)}
         />
      </div>
   );
}