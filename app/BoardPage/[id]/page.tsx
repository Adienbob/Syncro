"use client"
import { useTasks } from "@/app/features/tasks/hooks/useTasks";
import { useState, use, useEffect } from "react";
import { useAppContext } from "@/app/state/AppContext";
import { useRouter } from "next/navigation";
import AddTaskModal from "@/app/features/tasks/components/AddTaskModal";
import Column from "@/app/features/tasks/components/Columns";

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = use(params);

   const {state} = useAppContext()
   const router = useRouter()
   useEffect(() => {
      if (!state.boards.find(b => b.id === id)) {
         router.push("/BoardsPage");
      }
   }, [state.boards, id, router]);

   return (
      <div>
         <h1>Tasks</h1>
         <AddTaskModal id={id} />
         <Column boardId={id} />
      </div>
   )
}