import { createSupabaseServerClient } from "@/app/shared/services/supabase";

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ memberId: string }> }
   ) {
   const { memberId } = await params;
   const supabase = await createSupabaseServerClient()
   const { error } = await supabase
      .from("board_members")
      .delete()
      .eq("id", memberId);

   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
   }

   return Response.json({ success: true });
}

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ memberId: string }> }
   ) {
   const { memberId } = await params;
   const supabase = await createSupabaseServerClient()
   const body = await req.json();
   const { role } = body;

   const { error } = await supabase
      .from("board_members")
      .update({ role: role })
      .eq("id", memberId);

   
   const allowedRoles = ["editor", "viewer"];
   if (!allowedRoles.includes(role)) {
      return Response.json(
         { error: "Invalid role." },
         { status: 400 }
      );
   }
   
   if (error) {
      return Response.json({ error: error.message }, { status: 500 });
   }

   return Response.json({ success: true });
}