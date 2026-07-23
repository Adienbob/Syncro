import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

export default function AddTaskModal({ id }: { id: string }) {
   const { addTask } = useTasks(id);

   const [addingTask, setAddingTask] = useState(false);
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
   const [dueDate, setDueDate] = useState<string | null>(null);
   const handleAddTask = () => {
      if (!title.trim()) return;

      addTask(title, description, priority, dueDate, id);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(null);
      setAddingTask(false);
   };

   return (
      <div>
         <button
         className="bg-primary text-[#EDE0FF] px-4 py-2 rounded-[8px] text-[14px] font-semibold"
         onClick={() => setAddingTask(true)}
         >
         Add Task
         </button>

         <div
            className={
               addingTask
                  ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                  : "hidden"
            }
         >
            <div className="w-full max-w-md rounded-md border border-[#2E2E38] bg-[#1E1E24] p-6">
               {/* Title */}
               <label className="block text-sm text-white">
                  Title *
                  <input
                     className="w-full mt-1 p-2 rounded bg-[#1E1E24] border border-[#2E2E38] text-white"
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                  />
               </label>

               {/* Description */}
               <label className="block mt-4 text-sm text-white">
                  Description
                  <textarea
                     className="w-full mt-1 p-2 rounded bg-[#1E1E24] border border-[#2E2E38] text-white"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                  />
               </label>

               {/* Priority */}
               <label className="block mt-4 text-sm text-white">
                  Priority
                  <select
                     className="w-full mt-1 p-2 rounded bg-[#1E1E24] border border-[#2E2E38] text-white"
                     value={priority}
                     onChange={(e) =>
                        setPriority(e.target.value as "low" | "medium" | "high")
                     }
                  >
                     <option value="low">Low</option>
                     <option value="medium">Medium</option>
                     <option value="high">High</option>
                  </select>
               </label>

               {/* Due Date */}
               <label className="block mt-4 text-sm text-white">
                  Due Date
                  <input
                     className="w-full mt-1 p-2 rounded bg-[#1E1E24] border border-[#2E2E38] text-white"
                     type="date"
                     onChange={(e) => setDueDate(e.target.value || null)}
                  />
               </label>

               {/* Actions */}
               <div className="mt-6 flex gap-2">
                  <button
                     className="bg-primary text-[#EDE0FF] px-4 py-2 rounded-[8px] text-sm font-semibold"
                     onClick={handleAddTask}
                  >
                     Add Task
                  </button>

                  <button
                     className="bg-transparent border border-[#2E2E38] text-white px-4 py-2 rounded-[8px] text-sm"
                     onClick={() => setAddingTask(false)}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}