import { createSupabaseServerClient } from "@/app/shared/services/supabase";

export async function GET() {
   const supabase = await createSupabaseServerClient()
   const { data, error } = await supabase
      .from("board_members")
      .select("*");

   if (error) {
      return Response.json(
         { error: error.message },
         { status: 500 }
      );
   }

   return Response.json(data);
}
