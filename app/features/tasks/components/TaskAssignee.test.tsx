import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TaskAssignee from "./TaskAssignee";

describe("Testing TaskAssignee", () => {
   it("renders the assignee", () => {
      const assignee = {
         id: "member-1",
         boardId: "board-1",
         userId: "user-1",
         displayName: "Hussien Walid",
         imageUrl: "",
         email: "hussien@example.com",
         role: "owner" as const,
         joinedAt: "2026-01-01",
      };

      render(<TaskAssignee assignee={assignee} />);

      expect(
         screen.getByText("Hussien Walid")
      ).toBeInTheDocument();
   });

   it("renders Unassigned when there is no assignee", () => {
      render(<TaskAssignee assignee={null} />);

      expect(screen.getByText("Unassigned")).toBeInTheDocument();
   });
});