"use client"
import { useTasks } from "@/app/features/tasks/hooks/useTasks";
import { useState, use, useEffect } from "react";
import { useAppContext } from "@/app/state/AppContext";
import { useRouter } from "next/navigation";

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = use(params);
   const {tasks, addTask, deleteTask, editTask, moveTask} = useTasks(id)

   // Adding task
   const [addingTask, setAddingTask] = useState(false)
   const [title, setTittle] = useState("")
   // Editing task
   const [editingTittle, setEditingTittle] = useState("")
   const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
   // Moving Task
   const [movingTaskId, setMovingTaskId] = useState<string | null>(null)
   const [newBoardId, setNewBoardId] = useState("")
   // Filters Todo and Done Tasks
   const todoTasks = tasks.filter(t => t.status === "todo")
   const doneTasks = tasks.filter(t => t.status === "done")

   const {state} = useAppContext()
   const router = useRouter()
   useEffect(() => {
      if (!state.boards.find(b => b.id === id)) {
         router.push("/BoardsPage");
      }
   }, [state.boards, id]);

   return (
      <div>
         <h1>Tasks</h1>
         <div>
            <button onClick={() => setAddingTask(true)}>Add Task</button>
            <div className={addingTask ? "block" : "hidden"}>
               <label htmlFor="">
                  title
                  <input type="text" onChange={(e) => setTittle(e.target.value)} />
               </label>
               <button onClick={() => addTask(title, id)}>Add Task</button>
            </div>
         </div>
         <section>
            <h2>TODO</h2>
            <div>
               {todoTasks.map(t => (
                  <div key={t.id}>
                     <span>{t.title}</span>
                     <span>{t.status}</span>
                     <button onClick={() => deleteTask(t.id)}>Delete Task</button>
                     <button onClick={() => moveTask(t.id, "done")}>Move To Done</button>
                     <button onClick={() => setMovingTaskId(t.id)}>Move To Another Board</button>
                     <div className={movingTaskId === t.id ? "block" : "hidden"}>
                        <span>New Board Id</span>
                        <input type="text" onChange={(e) => setNewBoardId(e.target.value)} />
                        <button onClick={() => {
                           moveTask(t.id, undefined, newBoardId)
                           setMovingTaskId(null)
                        }}>Confirm</button>
                     </div>
                     <button onClick={() => {
                        setEditingTaskId(t.id)
                        setEditingTittle(t.title)
                     }}>Edit Task</button>
                     <div className={editingTaskId === t.id ? "block" : "hidden"}>
                        <span>Edit task</span>
                        <input type="text" value={editingTittle} onChange={(e) => setEditingTittle(e.target.value)} />
                        <button onClick={() => {
                           editTask(t.id, editingTittle)
                           setEditingTaskId(null)
                        }}>Confirm</button>
                     </div>
                  </div>
               ))}
            </div>
         </section>
         <section>
            <h2>DONE</h2>
            <div>
               {doneTasks.map(t => (
                  <div key={t.id}>
                     <span>{t.title}</span>
                     <span>{t.status}</span>
                     <button onClick={() => deleteTask(t.id)}>Delete Task</button>
                     <button onClick={() => moveTask(t.id, "todo")}>Move To Todo</button>
                     <button onClick={() => setMovingTaskId(t.id)}>Move To Another Board</button>
                     <div className={movingTaskId === t.id ? "block" : "hidden"}>
                        <span>New Board Id</span>
                        <input type="text" onChange={(e) => setNewBoardId(e.target.value)} />
                        <button onClick={() => {
                           moveTask(t.id, undefined, newBoardId)
                           setMovingTaskId(null)
                        }}>Confirm</button>
                     </div>
                     <button onClick={() => {
                        setEditingTaskId(t.id)
                        setEditingTittle(t.title)
                     }}>Edit Task</button>
                     <div className={editingTaskId === t.id ? "block" : "hidden"}>
                        <span>Edit task</span>
                        <input type="text" value={editingTittle} onChange={(e) => setEditingTittle(e.target.value)} />
                        <button onClick={() => {
                           editTask(t.id, editingTittle)
                           setEditingTaskId(null)
                        }}>Confirm</button>
                     </div>
                  </div>
               ))}
            </div>
         </section>
      </div>
   )
}