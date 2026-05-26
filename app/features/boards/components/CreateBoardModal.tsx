import { useState } from "react";
import { useBoards } from "../hooks/useBoards";

export default function CreateBoard() {
   const {addBoard} = useBoards()   
   const [isOpen, setIsOpen] = useState(false)
   const [inputState, setInputState] = useState<string>("")
   
   return (
      <div>
         <button onClick={() => setIsOpen(true)}>
            Create Board
         </button>
         <div className={isOpen ? "block" : "hidden"}>
            <span>please enter the title of your board</span>
            <input type="text" onChange={(e) => setInputState(e.target.value)} />
            <button onClick={() => {
               setIsOpen(false)
               addBoard(inputState)
            }}>Submit</button>
         </div>
      </div>
   )
}