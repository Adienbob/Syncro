"use client"
import { use, useEffect, useState } from "react";
import { useAppContext } from "@/app/state/AppContext";
import { useRouter } from "next/navigation";
import AddTaskModal from "@/app/features/tasks/components/AddTaskModal";
import Columns from "@/app/features/tasks/components/Columns";
import { useBoards } from "@/app/features/boards/hooks/useBoards";
import Header from "@/app/shared/ui/Header";
import { useTasks } from "@/app/features/tasks/hooks/useTasks";
import InviteMemberModal from "@/app/features/boards/components/members/InviteMemberModal";
import ActivityList from "@/app/features/activity/components/ActivityList";

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = use(params);
   const { boards } = useBoards()
   const currentBoard = boards.find((b) => b.id === id)
   const {state} = useAppContext()
   const router = useRouter()
   useEffect(() => {
      if (!state.boards.find(b => b.id === id)) {
         router.push("/BoardsPage");
      }
   }, [state.boards, id, router]);
   
   // Search 
   const [searchTerm, setSearchTerm] = useState("");
   const { tasks } = useTasks(id);
   // Sort
   const [sortBy, setSortBy] = useState<"A-Z" | "Z-A" | "newest" | "oldest" | "default">("default");
   const [priorityFilter, setPriorityFilter] =useState<"all" | "high" | "medium" | "low">("all");
   
   const filteredTasks = [...tasks]
   .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
)

.filter((task) => {
   if (priorityFilter === "all") return true;
   return task.priority === priorityFilter;
})

.sort((a, b) => {
   switch (sortBy) {
      case "A-Z":
         return a.title.localeCompare(b.title)
         
         case "Z-A":
            return b.title.localeCompare(a.title)
            
            case "newest":
               return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
               
               case "oldest":
                  return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  
                  default:
                     return 0;
      }
   })

   return (
      <div className="">
         <Header 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
         />
         <div className="p-6 grid">
            <div className="flex justify-between items-center mb-4">
               <div className="flex gap-4">
                  <button className="" onClick={() => router.push("/BoardsPage")}>
                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="#CCC3D8"/>
                     </svg>

                  </button>
                  <h1 className="text-primary-light text-[20px] leading-[28px] font-bold">{currentBoard?.title}</h1>
               </div>
               <div className="flex gap-10 items-center">
                  <AddTaskModal id={id} />
                  <InviteMemberModal boardId={id} />
               </div>
            </div>
            <div className="flex gap-5 mb-4">
               <div className="flex items-center px-3 py-[6px] rounded-full  bg-surface-high text-[14px] leading-5 text-on-background">
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M5.25 9V7.5H8.25V9H5.25V9M2.25 5.25V3.75H11.25V5.25H2.25V5.25M0 1.5V0H13.5V1.5H0V1.5" fill="#E5E1E4"/>
                  </svg>

                  <label htmlFor="sort-tasks" className="sr-only">
                     Sort tasks
                  </label>

                  <select
                     id="sort-tasks"
                     value={sortBy}
                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as "A-Z" | "Z-A" | "newest" | "oldest" | "default")}
                     className="appearance-none text-center px-2.5 outline-none"
                  >
                     <option value="default">Default</option>
                     <option value="A-Z">A-Z</option>
                     <option value="Z-A">Z-A</option>
                     <option value="newest">Newest</option>
                     <option value="oldest">Oldest</option>
                     
                  </select>
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M4.50006 5.55L6.10352e-05 1.05L1.05006 0L4.50006 3.45L7.95006 0L9.00006 1.05L4.50006 5.55V5.55" fill="#E5E1E4"/>
                  </svg>
               </div>

               <div className="flex items-center px-3 py-[6px] rounded-full  bg-surface-high text-[14px] leading-5 text-on-background">
                  <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.10352e-05 9V7.5H4.50006V9H6.10352e-05V9M6.10352e-05 5.25V3.75H9.00006V5.25H6.10352e-05V5.25M6.10352e-05 1.5V0H13.5001V1.5H6.10352e-05V1.5" fill="#E5E1E4"/>
                  </svg>

                  <select
                     value={priorityFilter}
                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriorityFilter(e.target.value as "all" | "high" | "medium" | "low")}
                     className="appearance-none text-center px-2.5 outline-none"
                  >
                     <option value="all">All</option>
                     <option value="high">High</option>
                     <option value="medium">Medium</option>
                     <option value="low">Low</option>
                  </select>
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M4.50006 5.55L6.10352e-05 1.05L1.05006 0L4.50006 3.45L7.95006 0L9.00006 1.05L4.50006 5.55V5.55" fill="#E5E1E4"/>
                  </svg>
               </div>
               
            </div>
            <div className="grid gap-5">
               <Columns filteredTasks={filteredTasks} boardId={id} />
               <ActivityList boardId={id} />
            </div>
         </div>
      </div>
   )
}