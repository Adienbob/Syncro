import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
   
   const supabase = await createSupabaseServerClient()
   const user = await currentUser()
   if (!user) {
      return Response.json(
         { error: "Unauthorized" },
         { status: 401 }
      );
   }
   const { data, error } = await supabase
      .from("notifications")
      .select("*")
      
      
   if (error) {
      console.log(error)
      return Response.json(
         { error: error.message },
         { status: 500 }
      );
   }
   return Response.json(data);
}
