"use client";

import MemberRow from "./MemberRow";
import { useBoardMember } from "../../hooks/useBoardMembers";

type Props = {
   isOpen: boolean;
   onClose: () => void;
   boardId: string;
};

export default function MembersModal({
   isOpen,
   onClose,
   boardId
}: Props) {

   const { members } = useBoardMember();
   const boardMembers = members.filter(
      (member) => member.boardId === boardId
   );

   if (!isOpen) return null;
   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
         onClick={onClose}
      >
         <div
            className="w-full max-w-xl rounded-xl border border-border bg-surface shadow-modal"
            onClick={(e) => e.stopPropagation()}
         >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
               <h2 className="text-xl font-semibold text-text-primary">
                  Members
               </h2>

               <button
                  onClick={onClose}
                  className="text-text-muted transition hover:text-text-primary"
               >
                  ✕
               </button>
            </div>

            {/* Body */}
            <div className="max-h-[450px] overflow-y-auto">
               {members.length === 0 ? (
                  <div className="py-12 text-center text-text-muted">
                     No members found.
                  </div>
               ) : (
                  boardMembers.map((member) => (
                     <MemberRow
                        key={member.id}
                        member={member}
                     />
                  ))
               )}
            </div>
         </div>
      </div>
   );
}