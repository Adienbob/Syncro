"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { Board } from "@/app/types/models";
import { useAppContext } from "@/app/state/AppContext";
import { useBoards } from "../hooks/useBoards";
import ConfirmDialog from "@/app/shared/ui/ConfirmationDialog";

export default function BoardCard(board: Board) {
   const { state } = useAppContext();
   const { renameBoard, deleteBoard } = useBoards();

   const boardTasks = state.tasks.filter(
      (task) => task.boardId === board.id
   );

   const boardMembers = state.members.filter(
      (member) => member.boardId === board.id
   );

   const [renameOpen, setRenameOpen] = useState(false);
   const [renameValue, setRenameValue] = useState(board.title);
   const [deleteOpen, setDeleteOpen] = useState(false);

   function handleRename() {
      const title = renameValue.trim();

      if (!title || title === board.title) {
         setRenameOpen(false);
         setRenameValue(board.title);
         return;
      }

      renameBoard(board.id, title);
      setRenameOpen(false);
   }

   return (
      <>
         <Link
         href={`/BoardPage/${board.id}`}
         className="
            block
            cursor-pointer
            rounded-[8px]
            border
            border-border
            bg-surface
            p-4
            transition
            hover:border-primary
            focus:outline-none
            focus:ring-2
            focus:ring-primary
         "
         >
         {/* Header */}
         <div className="flex items-center justify-between">
            <h2 className="min-w-0 text-[20px] font-semibold leading-7 text-text-primary">
               {board.title}
            </h2>

            {/* Actions */}
            <div
               className="flex items-center gap-1"
               onClick={(e) => e.preventDefault()}
            >
               {/* Rename */}
               <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setRenameValue(board.title);
                  setRenameOpen(true);
               }}
               aria-label="Rename board"
               className="
                  rounded-md
                  p-2
                  text-text-muted
                  transition
                  hover:bg-hover-bg
                  hover:text-text-primary
               "
               >
               <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M4 20H8L19 9C20.1046 7.89543 20.1044 6.10443 19 5C17.8956 3.89557 16.1044 3.89557 15 5L4 16V20Z"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
                  <path
                     d="M13.5 6.5L17.5 10.5"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                  />
               </svg>
               </button>

               {/* Delete */}
               <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setDeleteOpen(true);
               }}
               aria-label="Delete board"
               className="
                  rounded-md
                  p-2
                  text-text-muted
                  transition
                  hover:bg-error/10
                  hover:text-error
               "
               >
               <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M4 7H20"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                  />
                  <path
                     d="M10 11V17"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                  />
                  <path
                     d="M14 11V17"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                  />
                  <path
                     d="M6 7L7 20H17L18 7"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
                  <path
                     d="M9 7V4H15V7"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  />
               </svg>
               </button>
            </div>
         </div>

         {/* Rename */}
         {renameOpen && (
            <div
               className="mt-3 flex items-center gap-2"
               onClick={(e) => e.preventDefault()}
            >
               <input
               autoFocus
               value={renameValue}
               onChange={(e) => setRenameValue(e.target.value)}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     handleRename();
                  }

                  if (e.key === "Escape") {
                     setRenameOpen(false);
                     setRenameValue(board.title);
                  }
               }}
               className="
                  w-10
                  md:w-12.5
                  flex-1
                  rounded-md
                  border
                  border-border
                  bg-background
                  px-3
                  py-2
                  text-sm
                  text-text-primary
                  outline-none
                  focus:border-primary
               "
               />

               <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRename();
               }}
               className="
                  rounded-md
                  bg-primary
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white
               "
               >
               Save
               </button>

               <button
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  setRenameOpen(false);
                  setRenameValue(board.title);
               }}
               className="
                  rounded-md
                  px-3
                  py-2
                  text-xs
                  text-text-muted
                  hover:bg-hover-bg
               "
               >
               Cancel
               </button>
            </div>
         )}

         {/* Meta */}
         <span className="mt-3 block text-xs text-text-muted">
            Created{" "}
            {formatDistanceToNow(new Date(board.createdAt), {
               addSuffix: true,
            })}
         </span>

         <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-text-muted">
               📝 {boardTasks.length} Tasks
            </span>

            <span className="text-xs text-text-muted">
               👥 {boardMembers.length} Members
            </span>
         </div>
         </Link>

         {/* Keep dialog OUTSIDE the Link */}
         <ConfirmDialog
         isOpen={deleteOpen}
         title="Delete board?"
         description={`"${board.title}" and all of its data will be permanently deleted.`}
         onCancel={() => setDeleteOpen(false)}
         onConfirm={() => {
            deleteBoard(board.id);
            setDeleteOpen(false);
         }}
         />
      </>
   );
}