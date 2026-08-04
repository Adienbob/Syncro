import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ id: string }> }
) {
   const user = await currentUser();

   if (!user) {
      return Response.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }

   const { id } = await params;

   const supabase = await createSupabaseServerClient();

   const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id);

   if (error) {
      return Response.json(
         { error: error.message },
         { status: 500 }
      );
   }

   return Response.json(
      { success: true },
      { status: 200 }
   );
}