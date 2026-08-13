import { BoardMember } from "@/app/types/models";
import Image from "next/image"

type TaskAssigneeProps = {
   assignee: BoardMember | null;
};

export default function TaskAssignee({
   assignee,
}: TaskAssigneeProps) {
   if (!assignee) {
      return (
         <span className="text-xs text-text-secondary">
         Unassigned
         </span>
      );
   }

   return (
      <div className="flex items-center gap-2">
         <Image
            src={assignee.imageUrl}
            alt={assignee.displayName}
            className="rounded-full"
            width={24}
            height={24}
         />

         <span className="text-xs text-text-secondary">
            {assignee.displayName}
         </span>
      </div>
   );
}