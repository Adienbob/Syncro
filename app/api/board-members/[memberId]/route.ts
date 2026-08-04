import { ActivityActions } from "@/app/features/activity/constants";
import { createActivity } from "@/app/features/activity/utils/createActivity";
import { NotificationTypes } from "@/app/features/notifications/constants";
import { createNotification } from "@/app/features/notifications/utils/createNotification";
import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export async function DELETE(
   req: Request,
   { params }: { params: Promise<{ memberId: string }> }
   ) {
   const { memberId } = await params;
   const supabase = await createSupabaseServerClient()

   const { data: memberRow, error: getRowError } = await supabase 
      .from("board_members")
      .select("*")
      .eq("id", memberId)
      .single()
      
   if (getRowError) {
      return Response.json({ error: getRowError.message }, { status: 500 });
   }


   const { error: removeMemberError } = await supabase
      .from("board_members")
      .delete()
      .eq("id", memberId)

   if (removeMemberError) {
      return Response.json({ error: removeMemberError.message }, { status: 500 });
   }

   const user = await currentUser();
   if(!user) return null;

   const clerk = await clerkClient();
   const member = await clerk.users.getUser(memberRow.user_id);


   try {
      await createActivity({
         boardId: memberRow.board_id,
         actorId: user.id,
         action: ActivityActions.MEMBER_REMOVED,
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
            details: {},
         },
      });

      } catch (error) {
         console.error("Failed to create activity log:", error);
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
   
   const user = await currentUser();
   if(!user) return null;
   const allowedRoles = ["editor", "viewer"];
   if (!allowedRoles.includes(role)) {
      return Response.json(
         { error: "Invalid role." },
         { status: 400 }
      );
   }

   const { data, error } = await supabase
      .from("board_members")
      .update({ role: role })
      .eq("id", memberId)
      .select()
      .single();

   if (error) {
      console.log(error)
      return Response.json({ error: error.message }, { status: 500 });
   }

   const { data: board, error: boardError } = await supabase 
      .from("boards")
      .select("title")
      .eq("id", data.board_id)
      .single();
   
   if (boardError) {
      console.log(boardError)
      throw new Error(boardError.message);
   }
   

   const clerk = await clerkClient();
   const member = await clerk.users.getUser(data.user_id);

   try {
      await createActivity({
         boardId: data.board_id,
         actorId: user.id,
         action: ActivityActions.MEMBER_ROLE_CHANGED,
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
         boardId: data.board_id,
         type: NotificationTypes.MEMBER_ROLE_CHANGED,
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
         console.error("Failed to create activity log:", error);
   }

   return Response.json({ success: true });
}