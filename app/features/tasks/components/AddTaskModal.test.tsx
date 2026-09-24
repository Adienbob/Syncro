import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AddTaskModal from "./AddTaskModal";
import { addTask } from "@/app/tests/mocks/useTasks";

vi.mock("../hooks/useTasks", async () => {
   const mocks = await import("@/app/tests/mocks/useTasks");

   return {
      useTasks: mocks.useTasks,
   };
});

describe("Testing AddTaskModal", () => {
   it("opens the modal when Add Task is clicked", async () => {
      const user = userEvent.setup();

      render(<AddTaskModal id="board-1" />);

      expect(
         screen.getByRole("button", { name: "Add Task" })
      ).toBeInTheDocument();

      await user.click(
         screen.getByRole("button", { name: "Create Task" })
      );

      expect(screen.getByLabelText("Title *")).toBeInTheDocument();
   });

   it("does not add a task when the title is empty", async () => {
      const user = userEvent.setup();

      render(<AddTaskModal id="board-1" />);

      await user.click(
         screen.getByRole("button", { name: "Add Task" })
      );

      await user.click(
         screen.getByRole("button", { name: "Create Task" })
      );

      expect(addTask).not.toHaveBeenCalled();
   });

   it("creates a task with the entered data", async () => {
      const user = userEvent.setup();

      render(<AddTaskModal id="board-1" />);

      await user.click(
         screen.getByRole("button", { name: "Add Task" })
      );

      await user.type(
         screen.getByLabelText("Title *"),
         "Build login page"
      );

      expect(screen.getByLabelText("Title *")).toBeInTheDocument()
      expect(screen.getByLabelText("Description")).toBeInTheDocument()
      expect(screen.getByLabelText("Priority")).toBeInTheDocument()
      expect(screen.getByLabelText("Due Date")).toBeInTheDocument()
   });

   it("creates a task with the entered data", async () => {
      const user = userEvent.setup();

      render(<AddTaskModal id="board-1" />);

      await user.click(
         screen.getByRole("button", { name: "Add Task" })
      );

      await user.type(
         screen.getByLabelText("Title *"),
         "Build login page"
      );

      await user.type(
         screen.getByLabelText("Description"),
         "Create the login page UI"
      );

      await user.selectOptions(
         screen.getByLabelText("Priority"),
         "high"
      );

      await user.type(
         screen.getByLabelText("Due Date"),
         "2026-10-01"
      );

      await user.click(
         screen.getByRole("button", { name: "Create Task" })
      );

      expect(addTask).toHaveBeenCalledWith(
         "Build login page",
         "Create the login page UI",
         "high",
         "2026-10-01",
         "board-1",
         null
      );
   });

   it("closes the modal when Cancel is clicked", async () => {
      const user = userEvent.setup();

      render(<AddTaskModal id="board-1" />);

      await user.click(
         screen.getByRole("button", { name: "Add Task" })
      );

      await user.click(
         screen.getByRole("button", { name: "Cancel" })
      );

      expect(
         screen.getByTestId("add-task-modal")
      ).toHaveClass("hidden");

      expect(addTask).not.toHaveBeenCalled();
   });
});