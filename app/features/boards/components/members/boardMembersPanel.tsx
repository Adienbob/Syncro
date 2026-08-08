"use client";

import { useState } from "react";
import { useBoardMember } from "../../hooks/useBoardMembers";
import { MemberRow } from "./MemberRow";

type Props = {
  boardId: string;
}

export default function MembersModal({ boardId }: Props) {
  const [isOpen, setIsOpen] = useState(false) 

    const { members } = useBoardMember();
    const boardMembers = members.filter(
        (member) => member.boardId === boardId
    );

    return (
      <div>
        <button
          className="bg-primary text-[#EDE0FF] px-4 py-2 rounded-[8px] text-[14px] font-semibold"
          onClick={() => setIsOpen(true)}
        >
          Manage Members
        </button>
        {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <aside
            className="
              absolute
              right-1/2
              top-1/2
              translate-x-1/2
              -translate-y-1/2
              flex
              h-[calc(100vh-225px)]
              w-[380px]
              flex-col
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-surface
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Manage Members
              </h2>

              <p className="mt-1 text-xs text-text-muted">
                {boardMembers.length} members
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                rounded-md
                px-2
                py-1
                text-text-muted
                transition
                hover:bg-hover-bg
                hover:text-text-primary
              "
            >
              ✕
            </button>
          </div>

          {/* Members */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {boardMembers.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-text-muted">
                No members found.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {boardMembers.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    )}
    </div>
  );
}