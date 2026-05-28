import { useTasks } from "../hooks/useTasks"
import TaskCard from "./TaskCard";

export default function Column({boardId}: {boardId: string}) {
   const { tasks } = useTasks(boardId)
   // Filters Todo and Done Tasks
   const todoTasks = tasks.filter(t => t.status === "todo")
   const doneTasks = tasks.filter(t => t.status === "done")
   
   return (
      <div className="grid gap-5 [&_section]:bg-surface [&_section]:border [&_section]:border-border [&_section]:rounded-[12px] [&_section>div:first-child]:flex [&_section>div:first-child]:justify-between [&_section>div:first-child]:py-4 [&_section>div:first-child]:border-b [&_section>div:first-child]:border-border [&_section>div:first-child]:px-4 [&_section>div:first-child>div]:flex [&_section>div:first-child>div]:gap-2 [&_section>div:first-child>div]:items-center [&_section>div:first-child_h2]:text-[20px] [&_section>div:first-child_h2]:font-semibold [&_section>div:first-child_h2]:leading-[28px] [&_section>div:first-child_h2]:text-inverse-surface [&_section>div:first-child_span]:h-fit [&_section>div:first-child_span]:bg-surface-highest [&_section>div:first-child_span]:px-2 [&_section>div:first-child_span]:py-0.5 [&_section>div:first-child_span]:text-[12px] [&_section>div:first-child_span]:rounded-[4px] [&_section>div:first-child_span]:text-on-surface-variant">
         <section>
            <div>
               <div>
                  <h2>TODO</h2>
                  <span>{tasks.length}</span>
               </div>
               <button>more</button>
            </div>
            <div className="p-4 grid gap-4">
               {todoTasks.map((t) => (
                  <div key={t.id}>
                     <TaskCard title={t.title} id={t.id} status={t.status} boardId={t.boardId} />
                  </div>
               ))}
            </div>
         </section>
         <section>
            <div>
               <div>
                  <h2>DONE</h2>
                  <span>numbers</span>
               </div>
               <button>more</button>
            </div>
            <div className="p-4 grid gap-4">
               {doneTasks.map((t) => (
                  <div key={t.id}>
                     <TaskCard title={t.title} id={t.id} status={t.status} boardId={t.boardId} />
                  </div>
               ))}
            </div>
         </section>
      </div>
   )
}