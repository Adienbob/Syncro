"use client"
import { useTasks } from "../hooks/useTasks"
import { useState } from "react"
import { Task } from "@/app/types/models"
import { useDraggable } from "@dnd-kit/core"

export default function TaskCard({task, overlay}: {task: Task, overlay?: boolean}) {
   const { deleteTask, editTask, moveTask} = useTasks(task.boardId)
   const { setNodeRef, listeners, attributes } = useDraggable({id: task.id})


   // Editing task
   const [editForm, setEditForm] = useState({
      id: "",
      title: "",
      description: "",
      priority: "medium" as "low" | "medium" | "high",
      dueDate: "",
   });

   // Moving Task
   const [movingTaskId, setMovingTaskId] = useState<string | null>(null)
   const [newBoardId, setNewBoardId] = useState("")
   return (
      <article ref={setNodeRef} {...listeners} {...attributes} className={`${overlay ? "shadow-xl scale-105 opacity-90 rotate-1" : ""} bg-surface-low p-4 border border-border rounded-[8px] grid gap-2`}>
         <div className="flex justify-between items-center">
            <span className="px-2 py-0.5 rounded-[4px] text-primary-light bg-primary-light/10 leading-[14px] tracking-[0.55px] text-[11px] font-medium">{task.status.toLowerCase()}</span>
            <div className="flex gap-4 items-center">
               <button 
                  className="text-on-surface-variant hover:text-amber-200 transition-colors"
                  onClick={() => {
                     setEditForm({
                        id: task.id,
                        title: task.title ?? "",
                        description: task.description ?? "",
                        priority: task.priority,
                        dueDate: task.dueDate ?? "",
                     });
                  }}
               >
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
               <button className="text-on-surface-variant hover:text-red-500 transition-colors" onClick={() => deleteTask(task.id)}>
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
         <h3 className="text-inverse-surface leading-[24px] font-semibold">{task.title}</h3>
         <p className="text-sm leading-5 text-on-surface-variant">{task.description}</p>
         
         {/* Move to another board */}
         <div className="flex justify-between">
            <button onClick={() => setMovingTaskId(task.id)}>Move To Another Board</button>
            <div className={movingTaskId === task.id ? "block" : "hidden"}>
               <span>New Board Id</span>
               <span>{task.description}</span>
               <input type="text" onChange={(e) => setNewBoardId(e.target.value)} />
               <button onClick={() => {
                  moveTask(task.id, undefined, newBoardId)
                  setMovingTaskId(null)
               }}>Confirm</button>
            </div>

            {/* Move task */}
            <select
               value={task.status}
               onChange={(e) =>
                  moveTask(
                     task.id,
                     e.target.value as "todo" | "in-progress" | "done"
                  )
               }
            >
               <option value="todo">Todo</option>
               <option value="in-progress">In Progress</option>
               <option value="done">Done</option>
            </select>

            {/* Edit task modal */}
            <div
               className={
                  editForm.id === task.id
                     ? "block mt-3 rounded-md border border-border bg-surface-low p-4 space-y-3"
                     : "hidden"
               }
            >
               <span className="block text-text-secondary text-sm">
                  Edit task
               </span>

               {/* Title */}
               <input
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary outline-none focus:border-primary"
                  value={editForm.title}
                  onChange={(e) =>
                     setEditForm((prev) => ({
                     ...prev,
                     title: e.target.value,
                     }))
                  }
                  placeholder="Title"
               />

               {/* Description */}
               <input
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary outline-none focus:border-primary"
                  value={editForm.description}
                  onChange={(e) =>
                     setEditForm((prev) => ({
                     ...prev,
                     description: e.target.value,
                     }))
                  }
                  placeholder="Description"
               />

               {/* Priority */}
               <select
                  value={editForm.priority}
                  onChange={(e) =>
                     setEditForm((prev) => ({
                     ...prev,
                     priority: e.target.value as "low" | "medium" | "high",
                     }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary outline-none focus:border-primary"
               >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
               </select>

               {/* Due Date */}
               <input
                  type="date"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary outline-none focus:border-primary"
                  value={editForm.dueDate}
                  onChange={(e) =>
                     setEditForm((prev) => ({
                     ...prev,
                     dueDate: e.target.value,
                     }))
                  }
               />

               <div className="flex gap-2 pt-2">
                  <button
                     onClick={() =>
                     editTask(
                        task.id,
                        editForm.title,
                        editForm.description,
                        editForm.priority,
                        editForm.dueDate
                     )
                     }
                     className="px-3 py-2 rounded-md bg-primary text-text-primary text-sm hover:opacity-90 transition"
                  >
                     Confirm
                  </button>

                  <button
                     onClick={() =>
                     setEditForm({
                        ...editForm,
                        id: "",
                     })
                     }
                     className="px-3 py-2 rounded-md border border-border text-text-secondary text-sm hover:bg-hover-bg transition"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      </article>
   )
}