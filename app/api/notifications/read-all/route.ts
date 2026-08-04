import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function PATCH() {
   const user = await currentUser();

   if (!user) {
      return Response.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }

   const supabase = await createSupabaseServerClient();

   const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

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