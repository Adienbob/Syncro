import { createSupabaseServerClient } from "@/app/shared/services/supabase";


export async function GET() {
   const supabase = await createSupabaseServerClient()
   const { data, error } = await supabase
      .from("tasks")
      .select("*");

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
         const supabase = await createSupabaseServerClient()

      const body = await req.json();
      console.log("BODY:", body);

      const { title, description, priority, dueDate, status, boardId } = body;

      const { data, error } = await supabase
         .from("tasks")
         .insert([{ title, description, priority, due_date: dueDate, status, board_id: boardId }])
         .select()
         .single();

      if (error) {
         return Response.json({ error: error.message }, { status: 500 });
      }

      return Response.json(data);
   } catch (err) {
      console.log("CATCH ERROR:", err);
      return Response.json({ error: "Server crashed" }, { status: 500 });
   }
}