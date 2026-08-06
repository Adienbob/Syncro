import { ActivityActions } from "@/app/features/activity/constants";
import { createActivity } from "@/app/features/activity/utils/createActivity";
import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ id: string }> }
   ) {
   const { id } = await params;
   const supabase = await createSupabaseServerClient()
   const { error } = await supabase
      .from("boards")
      .delete()
      .eq("id", id);

   if (error) {
      console.log(error)
      return Response.json({ error: error.message }, { status: 500 });
   }

   return Response.json({ success: true });
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ id: string }> }
   ) {
   const { id } = await params;
   const supabase = await createSupabaseServerClient()
   const body = await req.json();

   const user = await currentUser()
   if (!user) {
      return Response.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }
   const { title } = body;
   const { error } = await supabase
      .from("boards")
      .update({ title })
      .eq("id", id);

   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
   }

   try {
      await createActivity({
         boardId: id,
         actorId: user.id,
         action: ActivityActions.BOARD_RENAMED,
         entityType: "board",
         entityId: id,
         metadata: {
            snapshot: {
               actor: {
                  display: user.fullName ?? user.username ?? "Unknown User",
               },
               entity: {
                  display: title,
               },
            },
            details: {
               title
            },
         },
      });
   } catch (error) {
      console.error("Failed to create activity log:", error);
   }

   return Response.json({ success: true });
}