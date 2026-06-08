import { Task } from "@/app/types/models";

type TaskModalProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskModal({
  task,
  isOpen,
  onClose,
}: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-surface p-6 rounded-[8px] border border-border">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-text-primary text-lg font-semibold">
            Task Details
          </h2>

          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-3">
          <h3 className="text-text-primary text-xl font-semibold">
            {task.title}
          </h3>

          <p className="text-text-secondary">
            {task.description}
          </p>

          <div className="flex gap-2 text-sm">
            <span className="px-2 py-1 rounded bg-primary/10 text-primary">
              {task.priority}
            </span>

            <span className="px-2 py-1 rounded bg-surface-high text-text-secondary">
              {task.status}
            </span>
          </div>

          <p className="text-text-muted text-sm">
            Due: {task.dueDate || "No due date"}
          </p>
        </div>

        {/* Future actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface-high text-text-primary"
          >
            Close
          </button>

          <button className="px-4 py-2 rounded bg-primary text-white">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}