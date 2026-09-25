import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   createSupabaseServerClient: vi.fn(),

   from: vi.fn(),
   select: vi.fn(),
   eq: vi.fn(),
   order: vi.fn(),
   limit: vi.fn(),
}));

vi.mock("@/app/shared/services/supabase", () => ({
   createSupabaseServerClient:
      mocks.createSupabaseServerClient,
}));

describe("API /api/boards/[id]/activity", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
      });

      mocks.select.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.eq.mockReturnValue({
         order: mocks.order,
      });

      mocks.order.mockReturnValue({
         order: mocks.order,
         limit: mocks.limit,
      });
   });

it("returns activities successfully", async () => {
   const { GET } = await import("./route");

   const activities = [
      {
         id: "activity-1",
         board_id: "board-1",
         action: "board.created",
      },
      {
         id: "activity-2",
         board_id: "board-1",
         action: "task.created",
      },
   ];

   mocks.limit.mockResolvedValue({
      data: activities,
      error: null,
   });

   const req = new Request(
      "http://localhost/api/boards/board-1/activity"
   );

   const response = await GET(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(response.status).toBe(200);

   expect(await response.json()).toEqual(activities);

   expect(mocks.from).toHaveBeenCalledWith("activity_logs");
   expect(mocks.select).toHaveBeenCalledWith("*");
   expect(mocks.eq).toHaveBeenCalledWith(
      "board_id",
      "board-1"
   );

   expect(mocks.limit).toHaveBeenCalledWith(20);
});

it("orders activities by created_at and id descending", async () => {
   const { GET } = await import("./route");

   mocks.limit.mockResolvedValue({
      data: [],
      error: null,
   });

   const req = new Request(
      "http://localhost/api/boards/board-1/activity"
   );

   await GET(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(mocks.order).toHaveBeenNthCalledWith(
      1,
      "created_at",
      { ascending: false }
   );

   expect(mocks.order).toHaveBeenNthCalledWith(
      2,
      "id",
      { ascending: false }
   );
});

it("returns 500 when loading activities fails", async () => {
   const { GET } = await import("./route");

   mocks.limit.mockResolvedValue({
      data: null,
      error: {
         message: "Failed to load activities",
      },
   });

   const req = new Request(
      "http://localhost/api/boards/board-1/activity"
   );

   const response = await GET(req, {
      params: Promise.resolve({
         id: "board-1",
      }),
   });

   expect(response.status).toBe(500);

   expect(await response.json()).toEqual({
      error: "Failed to load activities",
   });
});
});