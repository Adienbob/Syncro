type TaskAssigneeProps = {
   assigneeId: string | null;
};

export default function TaskAssignee({
   assigneeId,
}: TaskAssigneeProps) {
   return (
      <div className="text-xs text-text-secondary">
         {assigneeId ? "Assigned" : "Unassigned"}
      </div>
   );
}