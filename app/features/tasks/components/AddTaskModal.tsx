import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

export default function AddTaskModal({ id }: {id: string}) {
   const {addTask} = useTasks(id)
   const [addingTask, setAddingTask] = useState(false)
   const [title, setTittle] = useState("")
   
   return (
      <div>
         <button className="bg-primary text-[#EDE0FF] px-4 py-2 rounded-[8px] text-[14px] leading-[20px] font-semibold text-" onClick={() => setAddingTask(true)}>Add Task</button>
         <div className={addingTask ? "block" : "hidden"}>
            <label htmlFor="">
               title
               <input type="text" onChange={(e) => setTittle(e.target.value)} />
            </label>
            <button onClick={() => {
               addTask(title, id)
               setAddingTask(false)
            }}>Add Task</button>
         </div>
      </div>
   )
}