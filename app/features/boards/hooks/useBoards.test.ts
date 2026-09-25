import { describe, expect, it, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

const mockDispatch = vi.fn();
const mockRouter = {
   push: vi.fn(),
};

const mockUseUser = vi.fn();
const mockUseAppContext = vi.fn();


vi.mock("@clerk/nextjs", () => ({
   useUser: () => mockUseUser(),
}));

vi.mock("next/navigation", () => ({
   useRouter: () => mockRouter,
}));

vi.mock("@/app/state/AppContext", () => ({
   useAppContext: () => mockUseAppContext(),
}));

vi.mock("@/app/shared/utils/requireAuth", () => ({
   requireAuth: vi.fn(),
}));

vi.mock("@/app/shared/utils/getRole", () => ({
   getRole: vi.fn(),
}));

vi.mock("sonner", () => ({
   toast: {
      success: vi.fn(),
      error: vi.fn(),
   },
}));

beforeEach(() => {
   mockFetch.mockReset();

   mockUseAppContext.mockReturnValue({
      state: {
         boards: [],
         members: [],
      },
      dispatch: mockDispatch,
   });

   mockUseUser.mockReturnValue({
      isSignedIn: false,
      user: null,
   });
});

describe("Testing useBoards", () => {
   it("does not add a board when the user is not authenticated", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      vi.mocked(requireAuth).mockReturnValue(false);

      const { useBoards } = await import("./useBoards");

      const { addBoard } = useBoards();

      await addBoard("New Board");

      expect(requireAuth).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
   });

   it("creates a board for an authenticated user", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      vi.mocked(requireAuth).mockReturnValue(true);

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         json: async () => ({
            board: {
               id: "board-1",
               user_id: "demo-hussien",
               created_at: "2026-09-25",
            },
            member: {
               id: "member-1",
               board_id: "board-1",
               user_id: "demo-hussien",
               display_name: "Hussien",
               image_url: "/avatar.png",
               email: "test@example.com",
               role: "owner",
               joined_at: "2026-09-25",
            },
         }),
      });

      const { useBoards } = await import("./useBoards");

      const { addBoard } = useBoards();

      await addBoard("My New Board");

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/boards",
         expect.objectContaining({
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title: "My New Board",
            }),
         })
      );

      expect(mockDispatch).toHaveBeenCalledWith({
         type: "ADD_BOARD",
         payload: {
            id: "board-1",
            title: "My New Board",
            userId: "demo-hussien",
            createdAt: "2026-09-25",
         },
      });
   });

   it("does not rename a board when the user is not the owner", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useBoards } = await import("./useBoards");

      const { renameBoard } = useBoards();

      await renameBoard("board-1", "New Board Name");

      expect(getRole).toHaveBeenCalledWith(
         [],
         "board-1",
         "demo-hussien"
      );

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("renames a board when the user is the owner", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("owner");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: true,
      });

      const { useBoards } = await import("./useBoards");

      const { renameBoard } = useBoards();

      await renameBoard("board-1", "Renamed Board");

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/boards/board-1",
         {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title: "Renamed Board",
            }),
         }
      );
   });

   it("shows an error when renaming a board fails", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("owner");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: false,
      });

      const { useBoards } = await import("./useBoards");

      const { renameBoard } = useBoards();

      await renameBoard("board-1", "Renamed Board");

      expect(toast.error).toHaveBeenCalledWith(
         "Failed to rename board."
      );
   });

   it("does not delete a board when the user is not the owner", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useBoards } = await import("./useBoards");

      const { deleteBoard } = useBoards();

      await deleteBoard("board-1");

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("deletes a board when the user is the owner", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("owner");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: true,
      });

      const { useBoards } = await import("./useBoards");

      const { deleteBoard } = useBoards();

      await deleteBoard("board-1");

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/boards/board-1",
         {
            method: "DELETE",
         }
      );
   });

   it("shows an error when deleting a board fails", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("owner");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockRejectedValue(
         new Error("Network error")
      );

      const { useBoards } = await import("./useBoards");

      const { deleteBoard } = useBoards();

      await deleteBoard("board-1");

      expect(toast.error).toHaveBeenCalledWith(
         "Failed to delete board."
      );
   });
})