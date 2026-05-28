import { useTasks } from "../hooks/useTasks"
import { useState } from "react"
import { Task } from "@/app/types/models"

export default function TaskCard(task: Task) {
   const { deleteTask, editTask, moveTask} = useTasks(task.boardId)

   // Editing task
   const [editingTittle, setEditingTittle] = useState("")
   const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
   // Moving Task
   const [movingTaskId, setMovingTaskId] = useState<string | null>(null)
   const [newBoardId, setNewBoardId] = useState("")
   return (
      <article className="bg-surface-low p-4 border border-border rounded-[8px]">
         <h3 className="text-inverse-surface leading-[24px] font-semibold">{task.title}</h3>
         <span>{task.status}</span>
         <button onClick={() => deleteTask(task.id)}>Delete Task</button>
         {
            task.status === "todo" ? 
            <button onClick={() => moveTask(task.id, "done")}>Move To Done</button>
            :
            <button onClick={() => moveTask(task.id, "todo")}>Move To Todo</button>
         }
         <button onClick={() => setMovingTaskId(task.id)}>Move To Another Board</button>
         <div className={movingTaskId === task.id ? "block" : "hidden"}>
            <span>New Board Id</span>
            <input type="text" onChange={(e) => setNewBoardId(e.target.value)} />
            <button onClick={() => {
               moveTask(task.id, undefined, newBoardId)
               setMovingTaskId(null)
            }}>Confirm</button>
         </div>
         <button onClick={() => {
            setEditingTaskId(task.id)
            setEditingTittle(task.title)
         }}>Edit Task</button>
         <div className={editingTaskId === task.id ? "block" : "hidden"}>
            <span>Edit task</span>
            <input type="text" value={editingTittle} onChange={(e) => setEditingTittle(e.target.value)} />
            <button onClick={() => {
               editTask(task.id, editingTittle)
               setEditingTaskId(null)
            }}>Confirm</button>
         </div>
      </article>
   )
}