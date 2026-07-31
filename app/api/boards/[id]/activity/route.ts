import { createSupabaseServerClient } from "@/app/shared/services/supabase";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
   
   const supabase = await createSupabaseServerClient()
   const { id } = await params;
   console.log(id)
   const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("board_id", id)
      .order("created_at", { ascending: false});
      
   if (error) {
      console.log(error)
      return Response.json(
         { error: error.message },
         { status: 500 }
      );
   }
   console.log(data)
   return Response.json(data);
}
