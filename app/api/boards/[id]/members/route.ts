import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function POST(
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

   const { id: boardId } = await params;
   const { email, role } = await req.json();

   const supabase = await createSupabaseServerClient();
   const clerk = await clerkClient();
   const users = await clerk.users.getUserList({
   emailAddress: [email],
   });

   if (users.data.length === 0) {
      return Response.json(
         { error: "This email isn't registered." },
         { status: 404 }
      );
   }

   const member = users.data[0];

   const { error } = await supabase
   .from("board_members")
   .insert({
      board_id: boardId,
      user_id: member.id,
      role,
   });

   if (error) {
      return Response.json(
         { error: error.message },
         { status: 500 }
      );
   }

   return Response.json(
      { message: "Member invited successfully." },
      { status: 201 }
   );
}