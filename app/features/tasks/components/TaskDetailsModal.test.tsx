import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import TaskCard from './TaskCard';
import { assignTask} from '@/app/tests/mocks/useTasks';
import { Task } from '@/app/types/models';
import TaskModal from './TaskDetailsModal';

const task: Task = {
   id: "task-1",
   title: "Design authentication flow",
   description: "Set up Clerk authentication.",
   priority: "high",
   status: "done",
   createdAt: "2026-06-20",
   dueDate: null,
   boardId: "56c34f91-e969-4b9b-9f83-003f49ad4ced",
   assigneeId: "demo-hussien",
};


vi.mock("../hooks/useTasks", async () => {
   const mocks = await import("@/app/tests/mocks/useTasks");

   return {
      useTasks: mocks.useTasks,
   };
});

vi.mock("@/app/state/AppContext", async () => {
   const mocks = await import("@/app/tests/mocks/appContext");

   return {
      useAppContext: () => ({
         state: mocks.mockState,
         dispatch: vi.fn(),
      }),
   };
});

describe("Testing task details modal", () => {
   
   it("renders task details", () => {
      render(
         <TaskModal
            task={task}
            onClose={vi.fn()}
         />
      );
   
      expect(screen.getByRole("heading", { name: "Task Details" }))
         .toBeInTheDocument();
   
      expect(screen.getByRole("heading", { level: 4, name: task.title }))
         .toBeInTheDocument();
   
      expect(screen.getByText(task.description))
         .toBeInTheDocument();
   
      expect(screen.getByText(task.priority))
         .toBeInTheDocument();
   
      expect(screen.getByText(task.status))
         .toBeInTheDocument();
   
      expect(screen.getByText("Due: No due date"))
         .toBeInTheDocument();
   });
   
   it("calls onClose when Close is clicked", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
         <TaskModal
            task={task}
            onClose={onClose}
         />
      );

      await user.click(
         screen.getByRole("button", { name: "Close" })
      );

      expect(onClose).toHaveBeenCalledTimes(1);
   });

   it("assigns the task to a selected member", async () => {
      const user = userEvent.setup();

      const taskToAssign = {
         ...task,
         assigneeId: null,
      };

      render(
         <TaskModal
            task={taskToAssign}
            onClose={vi.fn()}
         />
      );

      const assigneeSelect = screen.getByRole("combobox");

      await user.selectOptions(
         assigneeSelect,
         "demo-hussien"
      );

      await user.click(
         screen.getByRole("button", { name: "Assign" })
      );

      expect(assignTask).toHaveBeenCalledWith(
         taskToAssign.id,
         "demo-hussien"
      );
   });

   it("unassigns the task", async () => {
   const user = userEvent.setup();

   render(
      <TaskModal
         task={task}
         onClose={vi.fn()}
      />
   );

   const assigneeSelect = screen.getByRole("combobox");

      await user.selectOptions(assigneeSelect, "");

      await user.click(
         screen.getByRole("button", { name: "Unassign" })
      );

      expect(assignTask).toHaveBeenCalledWith(
         task.id,
         null
      );
   });

   it("disables the assign button when the assignee has not changed", () => {
      render(
         <TaskModal
            task={task}
            onClose={vi.fn()}
         />
      );

      const assignButton = screen.getByRole("button", {
         name: "Assign",
      });

      expect(assignButton).toBeDisabled();
   });

   it("enables the assign button when the assignee changes", async () => {
      const user = userEvent.setup();

      render(
         <TaskModal
            task={task}
            onClose={vi.fn()}
         />
      );

      const assigneeSelect = screen.getByRole("combobox");

      await user.selectOptions(
         assigneeSelect,
         ""
      );

      const unassignButton = screen.getByRole("button", {
         name: "Unassign",
      });

      expect(unassignButton).not.toBeDisabled();
   });
})
