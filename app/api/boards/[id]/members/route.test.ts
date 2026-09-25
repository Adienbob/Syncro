import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   clerkClient: vi.fn(),
   createSupabaseServerClient: vi.fn(),

   users: {
      getUserList: vi.fn(),
   },

   from: vi.fn(),
   insert: vi.fn(),
   select: vi.fn(),
   single: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
   currentUser: mocks.currentUser,
   clerkClient: mocks.clerkClient,
}));

vi.mock("@/app/shared/services/supabase", () => ({
   createSupabaseServerClient:
      mocks.createSupabaseServerClient,
}));

describe("API /api/boards/[id]/members", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.clerkClient.mockResolvedValue({
         users: mocks.users,
      });

      mocks.from.mockReturnValue({
         insert: mocks.insert,
      });

      mocks.insert.mockReturnValue({
         select: mocks.select,
      });

      mocks.select.mockReturnValue({
         single: mocks.single,
      });
   });

it("returns 401 when the user is not authenticated", async () => {
   const { POST } = await import("./route");

   mocks.currentUser.mockResolvedValue(null);

   const req = new Request(
      "http://localhost/api/boards/board-1/members",
      {
         method: "POST",
         body: JSON.stringify({
            email: "user@example.com",
            role: "editor",
         }),
      }
   );

   const response = await POST(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(response.status).toBe(401);

   expect(await response.json()).toEqual({
      error: "Unauthorized",
   });

   expect(mocks.createSupabaseServerClient).not.toHaveBeenCalled();
   expect(mocks.clerkClient).not.toHaveBeenCalled();
});

it("returns 404 when the email is not registered", async () => {
   const { POST } = await import("./route");

   mocks.currentUser.mockResolvedValue({
      id: "owner-1",
   });

   mocks.users.getUserList.mockResolvedValue({
      data: [],
   });

   const req = new Request(
      "http://localhost/api/boards/board-1/members",
      {
         method: "POST",
         body: JSON.stringify({
            email: "unknown@example.com",
            role: "editor",
         }),
      }
   );

   const response = await POST(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(response.status).toBe(404);

   expect(await response.json()).toEqual({
      error: "This email isn't registered.",
   });

   expect(mocks.users.getUserList).toHaveBeenCalledWith({
      emailAddress: ["unknown@example.com"],
   });

   expect(mocks.from).not.toHaveBeenCalled();
});

it("returns 404 when the email is not registered", async () => {
   const { POST } = await import("./route");

   mocks.currentUser.mockResolvedValue({
      id: "owner-1",
   });

   mocks.users.getUserList.mockResolvedValue({
      data: [],
   });

   const req = new Request(
      "http://localhost/api/boards/board-1/members",
      {
         method: "POST",
         body: JSON.stringify({
            email: "unknown@example.com",
            role: "editor",
         }),
      }
   );

   const response = await POST(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(response.status).toBe(404);

   expect(await response.json()).toEqual({
      error: "This email isn't registered.",
   });

   expect(mocks.users.getUserList).toHaveBeenCalledWith({
      emailAddress: ["unknown@example.com"],
   });

   expect(mocks.from).not.toHaveBeenCalled();
});

it("invites a registered user successfully", async () => {
   const { POST } = await import("./route");

   mocks.currentUser.mockResolvedValue({
      id: "owner-1",
   });

   mocks.users.getUserList.mockResolvedValue({
      data: [
         {
            id: "user-2",
            fullName: "Ahmed Ali",
            username: "ahmed",
            emailAddresses: [
               {
                  emailAddress: "ahmed@example.com",
               },
            ],
            imageUrl: "https://example.com/avatar.jpg",
         },
      ],
   });

   const insertedMember = {
      id: "member-1",
      board_id: "board-1",
      user_id: "user-2",
      role: "editor",
      display_name: "Ahmed Ali",
      email: "ahmed@example.com",
      image_url: "https://example.com/avatar.jpg",
   };

   mocks.single.mockResolvedValue({
      data: insertedMember,
      error: null,
   });

   const req = new Request(
      "http://localhost/api/boards/board-1/members",
      {
         method: "POST",
         body: JSON.stringify({
            email: "ahmed@example.com",
            role: "editor",
         }),
      }
   );

   const response = await POST(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(response.status).toBe(201);

   expect(await response.json()).toEqual(insertedMember);

   expect(mocks.users.getUserList).toHaveBeenCalledWith({
      emailAddress: ["ahmed@example.com"],
   });

   expect(mocks.from).toHaveBeenCalledWith("board_members");

   expect(mocks.insert).toHaveBeenCalledWith({
      board_id: "board-1",
      user_id: "user-2",
      role: "editor",
      display_name: "Ahmed Ali",
      email: "ahmed@example.com",
      image_url: "https://example.com/avatar.jpg",
   });
});

it("returns 409 when the user is already a member", async () => {
   const { POST } = await import("./route");

   mocks.currentUser.mockResolvedValue({
      id: "owner-1",
   });

   mocks.users.getUserList.mockResolvedValue({
      data: [
         {
            id: "user-2",
            fullName: "Ahmed Ali",
            username: "ahmed",
            emailAddresses: [
               {
                  emailAddress: "ahmed@example.com",
               },
            ],
            imageUrl: "https://example.com/avatar.jpg",
         },
      ],
   });

   mocks.single.mockResolvedValue({
      data: null,
      error: {
         code: "23505",
         message: "duplicate key value violates unique constraint",
      },
   });

   const req = new Request(
      "http://localhost/api/boards/board-1/members",
      {
         method: "POST",
         body: JSON.stringify({
            email: "ahmed@example.com",
            role: "editor",
         }),
      }
   );

   const response = await POST(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(response.status).toBe(409);

   expect(await response.json()).toEqual({
      error: "User is already a member of this board.",
   });
});

it("returns 500 when inserting the member fails", async () => {
   const { POST } = await import("./route");

   mocks.currentUser.mockResolvedValue({
      id: "owner-1",
   });

   mocks.users.getUserList.mockResolvedValue({
      data: [
         {
            id: "user-2",
            fullName: "Ahmed Ali",
            username: "ahmed",
            emailAddresses: [
               {
                  emailAddress: "ahmed@example.com",
               },
            ],
            imageUrl: "https://example.com/avatar.jpg",
         },
      ],
   });

   mocks.single.mockResolvedValue({
      data: null,
      error: {
         code: "23514",
         message: "Invalid role",
      },
   });

   const req = new Request(
      "http://localhost/api/boards/board-1/members",
      {
         method: "POST",
         body: JSON.stringify({
            email: "ahmed@example.com",
            role: "invalid-role",
         }),
      }
   );

   const response = await POST(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(response.status).toBe(500);

   expect(await response.json()).toEqual({
      error: "Invalid role",
   });
});
});