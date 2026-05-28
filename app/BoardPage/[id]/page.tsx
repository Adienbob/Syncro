"use client"
import { use, useEffect } from "react";
import { useAppContext } from "@/app/state/AppContext";
import { useRouter } from "next/navigation";
import AddTaskModal from "@/app/features/tasks/components/AddTaskModal";
import Column from "@/app/features/tasks/components/Columns";
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
               <button>icon back</button>
               <h1 className="text-primary-light text-[20px] leading-[28px] font-bold">{currentBoard?.title}</h1>
            </div>
            <AddTaskModal id={id} />
         </div>
         <Column boardId={id} />
      </div>
   )
}