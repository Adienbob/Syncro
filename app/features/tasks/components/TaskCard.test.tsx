import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from "@testing-library/user-event";
import TaskCard from './TaskCard';
import { deleteTask, editTask } from '@/app/tests/mocks/useTasks';
import { Task } from '@/app/types/models';

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

vi.mock("@/app/features/notifications/hooks/useNotificationRealtime", () => ({
   useNotificationRealtime: vi.fn(),
}));

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

describe("Testing Task Card", () => {
   it("renders the task title", () => {
      render(<TaskCard task={task} />);

      expect(
         screen.getByText("Design authentication flow")
      ).toBeInTheDocument();
   });

   it("renders the task assignee", async () => {
      render(<TaskCard task={task} />);

      expect(screen.getByText("Hussien Walid")).toBeInTheDocument();
   });

   it("renders Unassigned when the task has no assignee", () => {
      const unassignedTask = {
         ...task,
         assigneeId: null,
      };

      render(<TaskCard task={unassignedTask} />);

      expect(screen.getByText("Unassigned")).toBeInTheDocument();
   });

   it("opens the edit form", async () => {
      const user = userEvent.setup();

      render(<TaskCard task={task} />);

      const editButton = screen.getByRole("button", {
         name: "Edit Task",
      });

      await user.click(editButton);

      expect(screen.getByText("Edit task")).toBeInTheDocument();
   });

   it("edits the task", async () => {
      const user = userEvent.setup();

      render(<TaskCard task={task} />);

      await user.click(
         screen.getByRole("button", { name: "Edit Task" })
      );

      const titleInput = screen.getByPlaceholderText("Title");
      const descriptionInput = screen.getByPlaceholderText("Description");
      const prioritySelect = screen.getByRole("combobox", {
         name: "priority",
      });
      const dueDateInput = screen.getByDisplayValue("");

      await user.clear(titleInput);
      await user.type(titleInput, "Updated authentication flow");

      await user.clear(descriptionInput);
      await user.type(descriptionInput, "Updated description");

      await user.selectOptions(prioritySelect, "low");

      await user.type(dueDateInput, "2026-07-15");

      await user.click(screen.getByRole("button", { name: "Confirm" }));

      expect(editTask).toHaveBeenCalledWith(
         task.id,
         "Updated authentication flow",
         "Updated description",
         "low",
         "2026-07-15"
      );
   });

   it("cancels editing the task", async () => {
      const user = userEvent.setup();

      render(<TaskCard task={task} />);

      await user.click(
         screen.getByRole("button", { name: "Edit Task" })
      );

      expect(screen.getByText("Edit task")).toBeInTheDocument();

      await user.click(
         screen.getByRole("button", { name: "Cancel" })
      );

      const editForm = screen.getByText("Edit task").parentElement;

      expect(editForm).toHaveClass("hidden");
      expect(editTask).not.toHaveBeenCalled();
   });

   it("opens the delete confirmation", async () => {
      const user = userEvent.setup();

      render(<TaskCard task={task} />);

      await user.click(
         screen.getByLabelText("Delete Task")
      );

      expect(screen.getByText("Delete Task?")).toBeInTheDocument();
      expect(
         screen.getByText("This action cannot be undone.")
      ).toBeInTheDocument();
   });

   it("deletes the task when confirmed", async () => {
      const user = userEvent.setup();

      render(<TaskCard task={task} />);

      await user.click(screen.getByLabelText("Delete Task"));

      await user.click(screen.getByRole("button", { name: "Dialog Confirm" }));

      expect(deleteTask).toHaveBeenCalledWith(task.id);
   });

   it("opens the task details modal", async () => {
      const user = userEvent.setup();

      render(<TaskCard task={task} />);

      await user.click(screen.getByRole("button", { name: "View" }));

      expect(screen.getByRole("heading", {
         level: 4,
         name: task.title,
      }));
   });

   it("closes the task details modal", async () => {
      const user = userEvent.setup();

      render(<TaskCard task={task} />);

      await user.click(screen.getByRole("button", { name: "View" }));

      expect(
         screen.getByRole("heading", {
            level: 4,
            name: task.title,
         })
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Close" }));

      expect(
         screen.queryByRole("heading", {
            level: 4,
            name: task.title,
         })
      ).not.toBeInTheDocument();
   });
})
