import { formatDistanceToNow } from "date-fns";
import Image from "next/image"
import { useState } from "react";
import { useBoardMember } from "../../hooks/useBoardMembers";
import { BoardMember } from "@/app/types/models";

interface MemberRowProps {
   member: BoardMember;
}

export function MemberRow({ member }: MemberRowProps) {
   const { updateMemberRole, removeMember } = useBoardMember()
   const [roleOpen, setRoleOpen] = useState(false);
   const initials =
      member.displayName
         ?.split(" ")
         .map((n) => n[0])
         .slice(0, 2)
         .join("")
         .toUpperCase() ?? "?";

   const roleStyles = {
      owner: "bg-primary/15 text-primary-light",
      editor: "bg-warning/15 text-warning",
      viewer: "bg-secondary text-text-secondary",
   };


   return (
      <div className="flex items-center justify-between rounded-lg px-4 py-3 transition hover:bg-hover-bg">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
         {/* Avatar */}
         {member.imageUrl ? (
            <Image
            src={member.imageUrl}
            alt={member.displayName || ""}
            className="h-10 w-10 rounded-full object-cover border border-border"
            width={10}
            height={10}
            />
         ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary-light">
            {initials}
            </div>
         )}

         {/* Info */}
         <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
            {member.displayName}
            </p>

            <span className="mt-2 block text-[13px] text-text-muted">
               {formatDistanceToNow(new Date(member.joinedAt), {
                  addSuffix: true,
               })}
            </span>
         </div>
      </div>

      {/* Right */}
      {member.role && (
         <div className="relative">
            {member.role === "owner" ? (
               <span
                  className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${roleStyles[member.role]}`}
               >
                  {member.role}
               </span>
            ) : (
               <>
                  <button
                     type="button"
                     onClick={() => setRoleOpen((prev) => !prev)}
                     className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium capitalize transition hover:opacity-80 ${roleStyles[member.role]}`}
                  >
                     {member.role}

                     <span className="text-[10px]">▼</span>
                  </button>

                  {roleOpen && (
                     <div className="absolute right-0 top-full z-20 mt-2 w-32 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
                        <button
                           type="button"
                           onClick={() => {
                              updateMemberRole(
                                 member.id,
                                 member.boardId,
                                 "editor"
                              );
                              setRoleOpen(false);
                           }}
                           className="w-full px-3 py-2 text-left text-xs text-text-primary hover:bg-hover-bg"
                        >
                           Editor
                        </button>

                        <button
                           type="button"
                           onClick={() => {
                              updateMemberRole(
                                 member.id,
                                 member.boardId,
                                 "viewer"
                              );
                              setRoleOpen(false);
                           }}
                           className="w-full px-3 py-2 text-left text-xs text-text-primary hover:bg-hover-bg"
                        >
                           Viewer
                        </button>
                        
                     </div>
                  )}
                  
               </>
            )}
         </div>
         )}
         {member.role !== "owner" && (
            <button
               type="button"
               className="text-xs font-medium text-error transition hover:opacity-80"
               onClick={() => removeMember(member.id, member.boardId)}
            >
               Remove
            </button>
         )}
      </div>
   );
}