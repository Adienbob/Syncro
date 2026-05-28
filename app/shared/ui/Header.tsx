"use client"

export default function Header() {

   return (
      <header className="text-white bg-background border-border border-b px-6 py-4.5 flex justify-between">
         <div className="flex gap-4 items-center">
            <span>logo</span>
            <span className="text-primary-light font-bold leading-7 text-[20px]">Syncro</span>
         </div>

         <div>
            <span>icon search</span>
            <span>icon alert</span>
            <span>icon profile</span>
         </div>
      </header>
   )
}