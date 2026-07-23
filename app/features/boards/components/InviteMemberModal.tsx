import { useState } from "react";
import { useBoards } from "../hooks/useBoards";

export default function InviteMemberModal({ boardId }: { boardId: string }) {
   const { inviteMember } = useBoards()
   const [isOpen, setIsOpen] = useState(false);
   const [email, setEmail] = useState("");
   const [role, setRole] = useState<"editor" | "viewer">("editor");

   const handleInvite = () => {
      if (!email.trim()) return;

      // inviteMember(boardId, email, role);


      setEmail("");
      setRole("editor");
      setIsOpen(false);
      inviteMember(boardId, email, role)
   };

   return (
      <>
         <button
            className="bg-primary text-[#EDE0FF] px-4 py-2 rounded-[8px] text-[14px] font-semibold"
            onClick={() => setIsOpen(true)}
         >
            Invite Member
         </button>

         <div
            className={
               isOpen
                  ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96"
                  : "hidden"
            }
         >
            <div className="rounded-md border border-border bg-surface p-6">
               <h2 className="mb-4 text-lg font-semibold text-text-primary">
                  Invite Member
               </h2>

               {/* Email */}
               <label className="block text-sm text-text-secondary">
                  Email
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="example@email.com"
                     className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-primary"
                  />
               </label>

               {/* Role */}
               <label className="mt-4 block text-sm text-text-secondary">
                  Role
                  <select
                     value={role}
                     onChange={(e) =>
                        setRole(e.target.value as "editor" | "viewer")
                     }
                     className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary outline-none focus:border-primary"
                  >
                     <option value="editor">Editor</option>
                     <option value="viewer">Viewer</option>
                  </select>
               </label>

               {/* Actions */}
               <div className="mt-6 flex gap-2">
                  <button
                     className="bg-primary text-[#EDE0FF] px-4 py-2 rounded-[8px] text-sm font-semibold"
                     onClick={handleInvite}
                  >
                     Invite
                  </button>

                  <button
                     className="bg-transparent border border-border text-text-primary px-4 py-2 rounded-[8px] text-sm"
                     onClick={() => setIsOpen(false)}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      </>
   );
}