import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

export default function AddTaskModal({ id }: {id: string}) {
   const {addTask} = useTasks(id)
   const [addingTask, setAddingTask] = useState(false)
      const [title, setTittle] = useState("")
   return (
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
   )
}