import BoardCard from "./boardCard";
import { Board } from "@/app/types/models";

export default function BoardsGrid({boards, sortBy, setSortBy}: {boards: Board[], sortBy: string, setSortBy: (value: "A-Z" | "Z-A" | "newest" | "oldest" | "default") => void}) {
   
   return (
      <div className="grid">
         <div>
            <select
               value={sortBy}
               onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as "A-Z" | "Z-A" | "newest" | "oldest" | "default")}
               className="px-3 py-2 rounded border border-border bg-surface text-text"
            >
               <option value="default">Default</option>
               <option value="A-Z">A-Z</option>
               <option value="Z-A">Z-A</option>
               <option value="newest">Newest</option>
               <option value="oldest">Oldest</option>
            </select>
         </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {boards.length > 0 ? boards.map( b => (
               <BoardCard key={b.id} title={b.title} id={b.id} createdAt={b.createdAt} />
            ))
         : "No boards yet, Create one!"}
         </div>
      </div>
   )
}