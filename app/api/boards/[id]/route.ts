import { supabase } from "@/app/shared/services/supabase";

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ id: string }> }
   ) {
   const { id } = await params;

   const { error } = await supabase
      .from("boards")
      .delete()
      .eq("id", id);

   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
   }

   return Response.json({ success: true });
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ id: string }> }
   ) {
   const { id } = await params;

   const body = await req.json();
   
   const { title } = body;
   const { error } = await supabase
      .from("boards")
      .update({ title })
      .eq("id", id);

   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
   }

   return Response.json({ success: true });
}