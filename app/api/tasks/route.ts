import { ActivityActions } from "@/app/features/activity/constants";
import { createActivity } from "@/app/features/activity/utils/createActivity";
import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser } from "@clerk/nextjs/server";


export async function GET() {
   const supabase = await createSupabaseServerClient()
   const { data, error } = await supabase
      .from("tasks")
      .select("*");

      console.log(data)

   if (error) {
      return Response.json(
         { error: error.message },
         { status: 500 }
      );
   }

   return Response.json(data);
}

export async function POST(req: Request) {
   try {
      const user = await currentUser()
      if (!user) {
         return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
         );
      }
      const supabase = await createSupabaseServerClient()

      const body = await req.json();

      const { title, description, priority, dueDate, boardId } = body;

      const { data, error } = await supabase
         .from("tasks")
         .insert([{ title, description, priority, due_date: dueDate, board_id: boardId }])
         .select()
         .single();

      if (error) {
         return Response.json({ error: error.message }, { status: 500 });
      }

      try {
         await createActivity({
            boardId: boardId,
            actorId: user?.id,
            action: ActivityActions.TASK_CREATED,
            entityType: "task",
            entityId: data.id,
            metadata: {
               snapshot: {
                  actor: {
                     display:
                        user.fullName ??
                        user.username ??
                        "Unknown User",
                  },
                  entity: {
                     display: title,
                  },
               },
               details: {},
            },
         });
   
         } catch (error) {
            console.error("Failed to create activity log:", error);
      }

      
      return Response.json(data);
   } catch (err) {
      console.log("CATCH ERROR:", err);
      return Response.json({ error: "Server crashed" }, { status: 500 });
   }
}