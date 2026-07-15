import BoardCard from "./boardCard";
import { Board } from "@/app/types/models";

export default function BoardsGrid({boards, sortBy, setSortBy}: {boards: Board[], sortBy: string, setSortBy: (value: "A-Z" | "Z-A" | "newest" | "oldest" | "default") => void}) {
   
   return (
      <div className="grid">
         <div className="flex mb-5 w-fit items-center px-3 py-[6px] rounded-full  bg-surface-high text-[14px] leading-5 text-on-background">
            <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M5.25 9V7.5H8.25V9H5.25V9M2.25 5.25V3.75H11.25V5.25H2.25V5.25M0 1.5V0H13.5V1.5H0V1.5" fill="#E5E1E4"/>
            </svg>

            <select
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
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {boards.length > 0 ? boards.map( b => (
               <BoardCard key={b.id} title={b.title} id={b.id} createdAt={b.createdAt} />
            ))
         : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-border bg-surface-low py-16 px-6 text-center">
               <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-high">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="text-text-muted"
               >
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M8 9h8M8 13h5" />
               </svg>
               </div>

               <h2 className="mb-2 text-xl font-semibold text-text-primary">
               No boards yet
               </h2>

               <p className="max-w-sm text-body-md text-text-muted">
               Create your first board to start organizing tasks, projects, and ideas.
               </p>
            </div>
         )}
         </div>
      </div>
   )
}