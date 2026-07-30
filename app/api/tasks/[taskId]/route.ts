import { ActivityActions } from "@/app/features/activity/constants";
import { createActivity } from "@/app/features/activity/utils/createActivity";
import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser } from "@clerk/nextjs/server";

const trackedFields = [
   "title",
   "description",
   "priority",
   "due_date",
] as const;

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ id: string }> }
   ) {

   const user = await currentUser()
   if (!user) return null
   const { id } = await params;
   const supabase = await createSupabaseServerClient()


   const { data: task, error: boardIdError } = await supabase 
      .from("tasks")
      .select("board_id, title")
      .eq("id", id)
      .single();

   if (boardIdError) {
      return Response.json({ error: boardIdError.message }, { status: 500 });
   }

   const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)

   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
   }


   try {
      await createActivity({
         boardId: task.board_id,
         actorId: user.id,
         action: ActivityActions.TASK_DELETED,
         entityType: "task",
         entityId: id,
         metadata: {
            snapshot: {
               actor: {
                  display:
                     user.fullName ??
                     user.username ??
                     "Unknown User",
               },
               entity: {
                  display: task.title,
               },
            },
            details: {},
         },
      });

      } catch (error) {
         console.error("Failed to create activity log:", error);
   }


   return Response.json({ success: true });
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ taskId: string }> }
   ) {
   const { taskId } = await params;
   const supabase = await createSupabaseServerClient()
   const body = await req.json();

   // Check If user signed in 
   const user = await currentUser()
   if (!user) return null
   
   const { data: task, error } = await supabase
      .from("tasks")
      .update(body)
      .eq("id", taskId)
      .select()
      .single();

   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
   }

   const updatedFields = trackedFields.filter(
      (field) => body[field] !== undefined
   );

   if (updatedFields.length > 0) {
      try {
         await createActivity({
            boardId: task.board_id,
            actorId: user.id,
            action: ActivityActions.TASK_UPDATED,
            entityType: "task",
            entityId: taskId,
            metadata: {
               snapshot: {
                  actor: {
                     display: user.fullName ?? user.username ?? "Unknown User",
                  },
                  entity: {
                     display: task.title,
                  },
               },
               details: {
                  updatedFields,
               },
            },
         });
      } catch (error) {
         console.error("Failed to create activity log:", error);
      }
   }

   return Response.json({ success: true });
}