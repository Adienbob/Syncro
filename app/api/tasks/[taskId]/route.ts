import { createSupabaseServerClient } from "@/app/shared/services/supabase";

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ id: string }> }
   ) {
   const { id } = await params;

   const supabase = await createSupabaseServerClient()
   const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
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
   
   const { error } = await supabase
      .from("tasks")
      .update(body)
      .eq("id", taskId);

   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
   }

   return Response.json({ success: true });
}