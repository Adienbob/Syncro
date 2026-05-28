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
            <span>please enter the title of your board</span>
            <input type="text" onChange={(e) => setInputState(e.target.value)} />
            <button onClick={() => {
               setIsOpen(false)
               addBoard(inputState)
            }}>Submit</button>
         </div>
      </>
   )
}