import { render, screen } from '@testing-library/react';
import BoardCard from './boardCard';
import { describe, expect, it, vi } from 'vitest';
import { mockState } from '@/app/tests/mocks/appContext';
import userEvent from "@testing-library/user-event";
import { renameBoard, deleteBoard } from '@/app/tests/mocks/useBoards';


vi.mock("@/app/state/AppContext", () => ({
   useAppContext: () => ({
      state: mockState
   }),
}));

vi.mock("../../notifications/hooks/useNotificationRealtime", () => ({
   useNotificationRealtime: vi.fn(),
}));

vi.mock("../hooks/useBoards", async () => {
   const mocks = await import("@/app/tests/mocks/useBoards");

   return {
      useBoards: mocks.useBoards,
   };
});

describe("BoardCard", () => {
   const demoBoardId = "56c34f91-e969-4b9b-9f83-003f49ad4ced";

   const board =  {
      id: demoBoardId,
      title: "Syncro - Development Workspace",
      createdAt: "2026-01-01",
   }

   it("renders the board title", () => {
      render(<BoardCard {...board} />);

      screen.debug()

      expect(
         screen.getByText("Syncro - Development Workspace")
      ).toBeInTheDocument()

   });
   
   it("renders the correct tasks count", () => {
      render(<BoardCard {...board} />);
      expect(
         screen.getByText(/1 Tasks/)
      ).toBeInTheDocument();

   })

   it("renders the correct member count", () => {
      render(<BoardCard {...board} />);
      expect(
         screen.getByText(/1 Members/)
      ).toBeInTheDocument();

   })

   it("", async () => {
      const user = userEvent.setup();
      render(<BoardCard {...board} />);

      screen.debug()
      await user.click(
         screen.getByRole("button", { name: "Rename board"})
         
      )
      expect(screen.getByRole("textbox")).toBeInTheDocument()

   })

   it("renames the board when the user saves a new title", async () => {
      const user = userEvent.setup();

      render(<BoardCard {...board} />);

      await user.click(
         screen.getByRole("button", { name: "Rename board" })
      );

      const textBox = screen.getByRole("textbox");

      await user.clear(textBox);
      await user.type(textBox, "new worldsss");

      await user.click(
         screen.getByRole("button", { name: "Save" })
      );

      expect(renameBoard).toHaveBeenCalledWith(
         board.id,
         "new worldsss"
      );
   });

   it("deletes the board when the user confirms deletion", async () => {
      const user = userEvent.setup();

      render(<BoardCard {...board} />);

      await user.click(
         screen.getByRole("button", { name: "Delete board" })
      );

      expect(
         screen.getByText("Delete board?")
      ).toBeInTheDocument();

      await user.click(
         screen.getByRole("button", { name: "Confirm" })
      );

      expect(deleteBoard).toHaveBeenCalledWith(board.id);
   });

   it("does not rename the board when the title is empty", async () => {
      const user = userEvent.setup();

      render(<BoardCard {...board} />);

      await user.click(
         screen.getByRole("button", { name: "Rename board" })
      );

      const textBox = screen.getByRole("textbox");

      await user.clear(textBox);

      await user.click(
         screen.getByRole("button", { name: "Save" })
      );

      expect(renameBoard).not.toHaveBeenCalled();
   });

   it("does not rename the board when the title is unchanged", async () => {
      const user = userEvent.setup();

      render(<BoardCard {...board} />);

      await user.click(
         screen.getByRole("button", { name: "Rename board" })
      );

      await user.click(
         screen.getByRole("button", { name: "Save" })
      );

      expect(renameBoard).not.toHaveBeenCalled();
   });
})
