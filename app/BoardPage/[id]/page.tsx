"use client"
import { use, useEffect } from "react";
import { useAppContext } from "@/app/state/AppContext";
import { useRouter } from "next/navigation";
import AddTaskModal from "@/app/features/tasks/components/AddTaskModal";
import Columns from "@/app/features/tasks/components/Columns";
import { useBoards } from "@/app/features/boards/hooks/useBoards";

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = use(params);
   const { boards } = useBoards()
   const currentBoard = boards.find((b) => b.id === id)
   const {state} = useAppContext()
   const router = useRouter()
   useEffect(() => {
      if (!state.boards.find(b => b.id === id)) {
         router.push("/BoardsPage");
      }
   }, [state.boards, id, router]);

   return (
      <div className="p-6">
         <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
               <button className="" onClick={() => router.push("/BoardsPage")}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="#CCC3D8"/>
                  </svg>

               </button>
               <h1 className="text-primary-light text-[20px] leading-[28px] font-bold">{currentBoard?.title}</h1>
            </div>
            <AddTaskModal id={id} />
         </div>
         <Columns boardId={id} />
      </div>
   )
}