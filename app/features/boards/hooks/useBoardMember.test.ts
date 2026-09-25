import { describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();
const mockUseUser = vi.fn();
const mockRouter = {
   push: vi.fn(),
};

vi.stubGlobal("fetch", mockFetch);

vi.mock("@clerk/nextjs", () => ({
   useUser: () => mockUseUser(),
}));

vi.mock("next/navigation", () => ({
   useRouter: () => mockRouter,
}));

vi.mock("sonner", () => ({
   toast: {
      error: vi.fn(),
      success: vi.fn(),
   },
}));

vi.mock("@/app/shared/utils/requireAuth", () => ({
   requireAuth: vi.fn(),
}));

vi.mock("@/app/shared/utils/getRole", () => ({
   getRole: vi.fn(),
}));

vi.mock("@/app/state/AppContext", async () => {
   const mocks = await import("@/app/tests/mocks/appContext");

   return {
      useAppContext: () => ({
         state: mocks.mockState,
         dispatch: vi.fn(),
      }),
   };
});

const { requireAuth } = await import(
   "@/app/shared/utils/requireAuth"
);

const { getRole } = await import(
   "@/app/shared/utils/getRole"
);

vi.mocked(requireAuth).mockReturnValue(true);
vi.mocked(getRole).mockReturnValue("editor");

describe("Test useBoardMember", () => {
   it("does not remove a member when the user is not the owner", async () => {
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

      const { useBoardMember } = await import("./useBoardMembers");

      const { removeMember } = useBoardMember();

      await removeMember("member-1", "board-1");

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("removes a member when the user is the owner", async () => {
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
         json: async () => ({}),
      });

      const { useBoardMember } = await import("./useBoardMembers");

      const { removeMember } = useBoardMember();

      await removeMember("member-1", "board-1");

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/board-members/member-1",
         {
            method: "DELETE",
         }
      );
   });

   it("shows an error when removing a member fails", async () => {
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
         json: async () => ({
            error: "Failed to remove member",
         }),
      });

      const { useBoardMember } = await import("./useBoardMembers");

      const { removeMember } = useBoardMember();

      await removeMember("member-1", "board-1");

      expect(toast.error).toHaveBeenCalledWith(
         "Failed to remove member."
      );
   });

   it("does not update a member role when the user is not the owner", async () => {
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

      const { useBoardMember } = await import("./useBoardMembers");

      const { updateMemberRole } = useBoardMember();

      await updateMemberRole(
         "member-1",
         "board-1",
         "viewer"
      );

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("updates a member role when the user is the owner", async () => {
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
         json: async () => ({}),
      });

      const { useBoardMember } = await import("./useBoardMembers");

      const { updateMemberRole } = useBoardMember();

      await updateMemberRole(
         "member-1",
         "board-1",
         "viewer"
      );

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/board-members/member-1",
         {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               role: "viewer",
            }),
         }
      );
   });

   it("shows the API error when updating a member role fails", async () => {
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
         json: async () => ({
            error: "Member role cannot be changed",
         }),
      });

      const { useBoardMember } = await import("./useBoardMembers");

      const { updateMemberRole } = useBoardMember();

      await updateMemberRole(
         "member-1",
         "board-1",
         "viewer"
      );

      expect(toast.error).toHaveBeenCalledWith(
         "Member role cannot be changed"
      );
   });

   it("does not invite a member when the user is not the owner", async () => {
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

      const { useBoardMember } = await import("./useBoardMembers");

      const { inviteMember } = useBoardMember();

      await inviteMember(
         "board-1",
         "member@example.com",
         "viewer"
      );

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("invites a member when the user is the owner", async () => {
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
         json: async () => ({
            id: "member-2",
            board_id: "board-1",
            user_id: "user-2",
            role: "viewer",
            joined_at: "2026-09-23",
            display_name: "Ahmed",
            image_url: "https://example.com/avatar.png",
            email: "member@example.com",
         }),
      });

      const { useBoardMember } = await import("./useBoardMembers");

      const { inviteMember } = useBoardMember();

      await inviteMember(
         "board-1",
         "member@example.com",
         "viewer"
      );

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/boards/board-1/members",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email: "member@example.com",
               role: "viewer",
            }),
         }
      );
   });

   it("shows the API error when inviting a member fails", async () => {
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
         json: async () => ({
            error: "User is already a member",
         }),
      });

      const { useBoardMember } = await import("./useBoardMembers");

      const { inviteMember } = useBoardMember();

      await inviteMember(
         "board-1",
         "member@example.com",
         "viewer"
      );

      expect(toast.error).toHaveBeenCalledWith(
         "User is already a member"
      );
   });
}) 