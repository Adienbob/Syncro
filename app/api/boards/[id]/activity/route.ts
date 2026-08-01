import { createSupabaseServerClient } from "@/app/shared/services/supabase";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
   
   const supabase = await createSupabaseServerClient()
   const { id } = await params;
   const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("board_id", id)
      .order("created_at", { ascending: false})
      .order("id", { ascending: false })
      .limit(20);
      
   if (error) {
      console.log(error)
      return Response.json(
         { error: error.message },
         { status: 500 }
      );
   }
   return Response.json(data);
}
