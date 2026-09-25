import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   clerkClient: vi.fn(),
   createSupabaseServerClient: vi.fn(),

   createActivity: vi.fn(),
   createNotification: vi.fn(),

   getUser: vi.fn(),

   from: vi.fn(),
   select: vi.fn(),
   eq: vi.fn(),
   single: vi.fn(),
   delete: vi.fn(),
   update: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
   currentUser: mocks.currentUser,
   clerkClient: mocks.clerkClient,
}));

vi.mock("@/app/shared/services/supabase", () => ({
   createSupabaseServerClient:
      mocks.createSupabaseServerClient,
}));

vi.mock("@/app/features/activity/utils/createActivity", () => ({
   createActivity: mocks.createActivity,
}));

vi.mock("@/app/features/notifications/utils/createNotification", () => ({
   createNotification: mocks.createNotification,
}));

vi.mock("@/app/features/activity/constants", () => ({
   ActivityActions: {
      MEMBER_REMOVED: "member.removed",
      MEMBER_ROLE_CHANGED: "member.role_changed",
   },
}));

vi.mock("@/app/features/notifications/constants", () => ({
   NotificationTypes: {
      MEMBER_ROLE_CHANGED: "member.role_changed",
   },
}));

describe("API /api/board-members/[memberId]", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.clerkClient.mockResolvedValue({
         users: {
            getUser: mocks.getUser,
         },
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
         delete: mocks.delete,
         update: mocks.update,
      });

      mocks.select.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.delete.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.update.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.eq.mockReturnValue({
         single: mocks.single,
         select: mocks.select,
      });
   });

   it("returns 401 when the user is not authenticated", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue(null);

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               role: "editor",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            memberId: "member-1",
         }),
      });

      expect(response.status).toBe(401);

      expect(await response.json()).toEqual({
         error: "Unauthorized",
      });

      expect(mocks.from).not.toHaveBeenCalled();
   });

   it("returns 400 when the role is invalid", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "owner-1",
      });

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               role: "owner",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            memberId: "member-1",
         }),
      });

      expect(response.status).toBe(400);

      expect(await response.json()).toEqual({
         error: "Invalid role.",
      });

      expect(mocks.from).not.toHaveBeenCalled();
   });

   it("updates the member role successfully", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "owner-1",
         fullName: "Hussien",
         username: "hussien",
      });

      mocks.single
         .mockResolvedValueOnce({
            data: {
               id: "member-1",
               board_id: "board-1",
               user_id: "user-2",
               role: "editor",
            },
            error: null,
         })
         .mockResolvedValueOnce({
            data: {
               title: "My Board",
            },
            error: null,
         });

      mocks.getUser.mockResolvedValue({
         id: "user-2",
         fullName: "Ahmed Ali",
         username: "ahmed",
         primaryEmailAddress: {
            emailAddress: "ahmed@example.com",
         },
      });

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               role: "viewer",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            memberId: "member-1",
         }),
      });

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         success: true,
      });

      expect(mocks.from).toHaveBeenCalledWith("board_members");

      expect(mocks.update).toHaveBeenCalledWith({
         role: "viewer",
      });

      expect(mocks.createActivity).toHaveBeenCalled();
      expect(mocks.createNotification).toHaveBeenCalled();
   });

   it("returns 500 when updating the member role fails", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "owner-1",
      });

      mocks.single.mockResolvedValue({
         data: null,
         error: {
            message: "Failed to update member role",
         },
      });

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               role: "viewer",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            memberId: "member-1",
         }),
      });

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Failed to update member role",
      });

      expect(mocks.createActivity).not.toHaveBeenCalled();
      expect(mocks.createNotification).not.toHaveBeenCalled();
   });

   it("throws when loading the board fails", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "owner-1",
      });

      mocks.single
         .mockResolvedValueOnce({
            data: {
               id: "member-1",
               board_id: "board-1",
               user_id: "user-2",
               role: "viewer",
            },
            error: null,
         })
         .mockResolvedValueOnce({
            data: null,
            error: {
               message: "Failed to load board",
            },
         });

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               role: "editor",
            }),
         }
      );

      await expect(
         PATCH(req, {
            params: Promise.resolve({
               memberId: "member-1",
            }),
         })
      ).rejects.toThrow("Failed to load board");

      expect(mocks.createActivity).not.toHaveBeenCalled();
      expect(mocks.createNotification).not.toHaveBeenCalled();
   });

   it("returns 500 when removing the member fails", async () => {
      const { DELETE } = await import("./route");

      mocks.single.mockResolvedValue({
         data: {
            id: "member-1",
            board_id: "board-1",
            user_id: "user-2",
         },
         error: null,
      });

      mocks.eq
         .mockReturnValueOnce({
            single: mocks.single,
         })
         .mockResolvedValueOnce({
            error: {
               message: "Failed to remove member",
            },
         });

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "DELETE",
         }
      );

      const response = await DELETE(req, {
         params: Promise.resolve({
            memberId: "member-1",
         }),
      });

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Failed to remove member",
      });
   });

   it("returns 401 when the user is not authenticated", async () => {
      const { DELETE } = await import("./route");

      mocks.single.mockResolvedValue({
         data: {
            id: "member-1",
            board_id: "board-1",
            user_id: "user-2",
         },
         error: null,
      });

      mocks.eq
         .mockReturnValueOnce({
            single: mocks.single,
         })
         .mockResolvedValueOnce({
            error: null,
         });

      mocks.currentUser.mockResolvedValue(null);

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "DELETE",
         }
      );

      const response = await DELETE(req, {
         params: Promise.resolve({
            memberId: "member-1",
         }),
      });

      expect(response.status).toBe(401);

      expect(await response.json()).toEqual({
         error: "Unauthorized",
      });
   });

   it("removes the member successfully", async () => {
      const { DELETE } = await import("./route");

      mocks.single.mockResolvedValue({
         data: {
            id: "member-1",
            board_id: "board-1",
            user_id: "user-2",
         },
         error: null,
      });

      mocks.eq
         .mockReturnValueOnce({
            single: mocks.single,
         })
         .mockResolvedValueOnce({
            error: null,
         });

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
      });

      mocks.getUser.mockResolvedValue({
         id: "user-2",
         fullName: "Ahmed",
         username: "ahmed",
         primaryEmailAddress: {
            emailAddress: "ahmed@example.com",
         },
      });

      mocks.createActivity.mockResolvedValue(undefined);

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "DELETE",
         }
      );

      const response = await DELETE(req, {
         params: Promise.resolve({
            memberId: "member-1",
         }),
      });

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         success: true,
      });

      expect(mocks.delete).toHaveBeenCalled();
      expect(mocks.currentUser).toHaveBeenCalled();
      expect(mocks.getUser).toHaveBeenCalledWith("user-2");
      expect(mocks.createActivity).toHaveBeenCalled();
   });

   it("returns 200 when activity logging fails", async () => {
      const { DELETE } = await import("./route");

      mocks.single.mockResolvedValue({
         data: {
            id: "member-1",
            board_id: "board-1",
            user_id: "user-2",
         },
         error: null,
      });

      mocks.eq
         .mockReturnValueOnce({
            single: mocks.single,
         })
         .mockResolvedValueOnce({
            error: null,
         });

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
      });

      mocks.getUser.mockResolvedValue({
         id: "user-2",
         fullName: "Ahmed",
         username: "ahmed",
      });

      mocks.createActivity.mockRejectedValue(
         new Error("Failed to create activity")
      );

      const req = new Request(
         "http://localhost/api/board-members/member-1",
         {
            method: "DELETE",
         }
      );

      const response = await DELETE(req, {
         params: Promise.resolve({
            memberId: "member-1",
         }),
      });

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         success: true,
      });

      expect(mocks.delete).toHaveBeenCalled();
      expect(mocks.createActivity).toHaveBeenCalled();
   });
});