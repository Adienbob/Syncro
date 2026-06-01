"use client"
import Column from "./Col"
import { useTasks } from "../hooks/useTasks"
import { DndContext, DragOverlay } from "@dnd-kit/core"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { useState } from "react"
import TaskCard from "./TaskCard"


export default function Columns({boardId}: {boardId: string}) {
   const { tasks, moveTask } = useTasks(boardId)
   // Filters Todo, in-progress and Done Tasks
   const todoTasks = tasks.filter(t => t.status === "todo")
   const inProgressTasks = tasks.filter(t => t.status === "in-progress")
   const doneTasks = tasks.filter(t => t.status === "done")

   const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

   function handleDragStart(event: DragStartEvent) {
      setActiveTaskId(String(event.active.id));
   }

   const activeTask = tasks.find(t => t.id === activeTaskId);

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event
      if (!over) return;

      moveTask(String(active.id), over.id as "todo" | "in-progress" | "done")
   }
   return (
      <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-5 [&_.emptyColumn>span]:text-[20px] [&_.emptyColumn>span]:leading-[28px] [&_.emptyColumn]:text-on-surface-variant [&_.emptyColumn>span]:font-semibold [&_.emptyColumn>p]:text-sm [&_.emptyColumn>p]:leading-[20px]   [&_section]:bg-surface [&_section]:border [&_section]:border-border [&_section]:rounded-[12px] [&_section>div:first-child]:flex [&_section>div:first-child]:justify-between [&_section>div:first-child]:py-4 [&_section>div:first-child]:border-b [&_section>div:first-child]:border-border [&_section>div:first-child]:px-4 [&_section>div:first-child>div]:flex [&_section>div:first-child>div]:gap-2 [&_section>div:first-child>div]:items-center [&_section>div:first-child_h2]:text-[20px] [&_section>div:first-child_h2]:font-semibold [&_section>div:first-child_h2]:leading-[28px] [&_section>div:first-child_h2]:text-inverse-surface [&_section>div:first-child_span]:h-fit [&_section>div:first-child_span]:px-2 [&_section>div:first-child_span]:py-0.5 [&_section>div:first-child_span]:text-[12px] [&_section>div:first-child_span]:rounded-[4px] ">
         <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Column tasks={todoTasks} name="TODO" />
            <Column tasks={inProgressTasks} name="IN-PROGRESS" />
            <Column tasks={doneTasks} name="DONE" />

            <DragOverlay>
               {activeTask ? <TaskCard task={activeTask} overlay /> : null}
            </DragOverlay>
         </DndContext>
      </div>
   )
}