import { useTasks } from "../hooks/useTasks"
import TaskCard from "./TaskCard";

export default function Column({boardId}: {boardId: string}) {
   const { tasks } = useTasks(boardId)
   // Filters Todo and Done Tasks
   const todoTasks = tasks.filter(t => t.status === "todo")
   const doneTasks = tasks.filter(t => t.status === "done")
   
   return (
      <div>
         <section>
            <span>Todo</span>
            {todoTasks.map((t) => (
               <div key={t.id}>
                  <TaskCard title={t.id} id={t.id} status={t.status} boardId={t.boardId} />
               </div>
            ))}
         </section>
         <section>
            <span>Done</span>
            {doneTasks.map((t) => (
               <div key={t.id}>
                  <TaskCard title={t.id} id={t.id} status={t.status} boardId={t.boardId} />
               </div>
            ))}
         </section>
      </div>
   )
}