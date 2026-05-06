"use client"

import { useState } from "react";
import Link from "next/link";
import { useBoards } from "../features/boards/hooks/useBoards";

export default function Boards() {
   const { boards, addBoard, deleteBoard } = useBoards()   
   const [isOpen, setIsOpen] = useState(false)
   const [inputState, setInputState] = useState<string>("")


   return (
      <div>
         <section>
            <h1>Boards</h1>
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
            {/* cards */}
            {boards.length > 0 ? boards.map( b => (
               <Link key={b.id} href={`/BoardPage/${b.id}`}>
                  <article>
                     <h2>{b.title}</h2>
                     <span>created at: {b.createdAt}</span>
                     <span>{b.id}</span>
                     <button onClick={(e) => {
                        deleteBoard(b.id)
                        e.preventDefault()
                        e.stopPropagation()
                     }}>Delete</button>
                  </article>
               </Link>
            ))
         : "No boards yet, Create one!"}
         </section>
      </div>
   )
}