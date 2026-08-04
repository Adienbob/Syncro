import { ActivityActions } from "@/app/features/activity/constants";
import { createActivity } from "@/app/features/activity/utils/createActivity";
import { NotificationTypes } from "@/app/features/notifications/constants";
import { createNotification } from "@/app/features/notifications/utils/createNotification";
import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

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
      if (error.code === "23505") {
         return Response.json(
            { error: "User is already a member of this board." },
            { status: 409 }
         );
      }
      return Response.json(
         { error: error.message },
         { status: 500 }
      );
   }
   
   const { data: board, error: boardError } = await supabase 
      .from("boards")
      .select("title")
      .eq("id", boardId)
      .single();
      
   if (boardError) {
      throw new Error(boardError.message);
   }

   try {
      await createActivity({
         boardId: boardId,
         actorId: user.id,
         action: ActivityActions.MEMBER_INVITED,
         entityType: "member",
         entityId: member.id,
         metadata: {
            snapshot: {
               actor: {
                  display:
                     user.fullName ??
                     user.username ??
                     "Unknown User",
               },
               entity: {
                  display: member.fullName ??
                  member.username ??
                  member.primaryEmailAddress?.emailAddress ??
                  "Unknown User",
               },
            },
            details: {
               role
            },
         },
      });


      await createNotification({
         userId: member.id,
         boardId: boardId,
         type: NotificationTypes.MEMBER_INVITED,
         metadata: {
            snapshot: {
               actor: {
                  display: user.fullName ??
                           user.username ??
                           "Unknown User",
               },
               board: {
                  display: board.title
               }
            },
            details: {}
         }
      })
      
   } catch (error) {
      console.error("Failed to create activity/notification:", error);
   }
   
   console.log(boardId)
   return Response.json(
      { message: "Member invited successfully." },
      { status: 201 }
   );
}
