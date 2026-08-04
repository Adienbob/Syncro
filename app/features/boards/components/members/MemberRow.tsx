"use client";

import { useState } from "react";
import { BoardMember } from "@/app/types/models";
import { useBoardMember } from "../../hooks/useBoardMembers";

type Props = {
   member: BoardMember;
   boardId: string;
};

export default function MemberRow({ member, boardId }: Props) {
   const { removeMember, updateMemberRole } = useBoardMember()
   const [isRoleOpen, setIsRoleOpen] = useState(false);
   const [menuOpen, setMenuOpen] = useState(false);

   const roleColor = {
      owner: "bg-primary/15 text-primary-light",
      editor: "bg-warning/15 text-warning",
      viewer: "bg-secondary text-text-secondary",
   };

   return (
      <div className="relative flex items-center justify-between border-b border-border px-6 py-4 last:border-none">
         <div>
            <p className="font-medium text-text-primary">
               {member.userId}
            </p>

            <p className="mt-1 text-sm text-text-muted">
               Joined {member.joinedAt}
            </p>
         </div>

         <div className="flex items-center gap-4">
            <span
               className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${roleColor[member.role]}`}
            >
               {member.role}
            </span>

            {member.role !== "owner" && (
               <div className="relative">
                  <button
                     onClick={() => setMenuOpen((p) => !p)}
                     className="rounded-md p-2 text-text-muted transition hover:bg-hover-bg hover:text-text-primary"
                  >
                     ⋮
                  </button>

                  {menuOpen && (
                     <div className="absolute right-[50%] top-[50%] w-44 overflow-hidden rounded-lg border border-border bg-surface-high shadow-lg">
                        <div className="relative h-15">
                        <button
                           onClick={() => setIsRoleOpen((prev) => !prev)}
                           className="rounded-md border border-border bg-surface-high px-3 py-1 text-sm"
                        >
                           {member.role}
                        </button>

                        {isRoleOpen && (
                           <div className="absolute right-0 top-0 mt-2 w-36 rounded-lg border border-border bg-surface shadow-lg">
                              <button
                                 onClick={() => updateMemberRole(member.id, boardId, "editor")}
                                 className="w-full px-3 py-2 text-left hover:bg-hover-bg"
                              >
                                 Editor
                              </button>

                              <button
                                 onClick={() => updateMemberRole(member.id, boardId, "viewer")}
                                 className="w-full px-3 py-2 text-left hover:bg-hover-bg"
                              >
                                 Viewer
                              </button>
                           </div>
                        )}
                     </div>

                        <button onClick={() => {
                           removeMember(member.id, boardId)
                           setIsRoleOpen(false)
                        }} className="block w-full px-4 py-3 text-left text-sm text-error transition hover:bg-hover-bg">
                           Remove Member
                        </button>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}