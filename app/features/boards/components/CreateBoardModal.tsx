import { useState } from "react";
import { useBoards } from "../hooks/useBoards";

export default function CreateBoard() {
   const {addBoard} = useBoards()   
   const [isOpen, setIsOpen] = useState(false)
   const [inputState, setInputState] = useState<string>("")
   
   return (
      <>
         <div className="mb-8 flex justify-between items-center">
            <h1 className="text-[32px] leading-10 -tracking-[0.32px] font-semibold text-text-primary">My Boards</h1>
            <button className="px-4 py-2 bg-primary rounded-[8px] text-text-primary" onClick={() => setIsOpen(true)}>
               Create Board
            </button>
         </div>
         <div className={isOpen ? "block" : "hidden"}>
            <div className="max-w-md rounded-md border border-border bg-surface p-6">
               <span className="block mb-4 text-text-secondary text-sm">
                  Please enter the title of your board
               </span>

               <input
                  type="text"
                  value={inputState}
                  onChange={(e) => setInputState(e.target.value)}
                  placeholder="Board title..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-primary"
               />

               <div className="mt-4 flex gap-2">
                  <button
                     onClick={() => {
                        setIsOpen(false);
                        addBoard(inputState);
                     }}
                     className="rounded-md bg-primary px-4 py-2 text-text-primary transition hover:bg-primary-dark"
                  >
                     Submit
                  </button>

                  <button
                     onClick={() => setIsOpen(false)}
                     className="rounded-md border border-border px-4 py-2 text-text-secondary transition hover:bg-surface-high"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      </>
   )
}