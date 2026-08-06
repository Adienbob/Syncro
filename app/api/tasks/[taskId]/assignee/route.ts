import { currentUser } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { createActivity } from "@/app/features/activity/utils/createActivity";
import { ActivityActions } from "@/app/features/activity/constants";
import { createNotification } from "@/app/features/notifications/utils/createNotification";
import { NotificationTypes } from "@/app/features/notifications/constants";

export async function PATCH(
   req: Request,
   { params }: { params: Promise<{ taskId: string }> }
) {
   try {
      const user = await currentUser();

      if (!user) {
         return Response.json(
         { error: "Unauthorized" },
         { status: 401 }
         );
      }

      const { taskId } = await params;
      const { assigneeId }: { assigneeId: string | null } = await req.json();

      const supabase = await createSupabaseServerClient();

      const { data: task, error: taskError } = await supabase
         .from("tasks")
         .select("*")
         .eq("id", taskId)
         .single();

      if (taskError || !task) {
         console.log(taskError)
         return Response.json(
         { error: "Task not found" },
         { status: 404 }
         );
      }

      const { data: member } = await supabase
         .from("board_members")
         .select("role")
         .eq("board_id", task.board_id)
         .eq("user_id", user.id)
         .single();

         if (!member || member.role === "viewer") {
            return Response.json(
               { error: "Forbidden" },
               { status: 403 }
            );
         }

      if (task.assignee_id === assigneeId) {
         return Response.json(task);
      }

      const { data: board, error: boardError } = await supabase
         .from("boards")
         .select("title")
         .eq("id", task.board_id)
         .single();

      if (boardError || !board) {
         console.log(boardError)
         return Response.json(
         { error: "Task not found" },
         { status: 404 }
         );
      }

      if (assigneeId !== null) {
         const { data: assigneeMember } = await supabase
            .from("board_members")
            .select("id")
            .eq("board_id", task.board_id)
            .eq("user_id", assigneeId)
            .maybeSingle();

         if (!assigneeMember) {
            return Response.json(
               { error: "Assignee is not a board member" },
               { status: 400 }
            );
         }
      }
      
      // 5. Update task
      const { data: updatedTask, error: updateError } = await supabase
         .from("tasks")
         .update({
         assignee_id: assigneeId,
         })
         .eq("id", taskId)
         .select()
         .single();

      if (updateError) {
         return Response.json(
         { error: updateError.message },
         { status: 500 }
         );
      }

      // Check if task reassigned
      const isReassignment =
         task.assignee_id !== null &&
         assigneeId !== null;
      
      
      try {
         await createActivity({
            boardId: task.board_id,
            actorId: user.id,
            action: isReassignment
               ? ActivityActions.TASK_REASSIGNED
               : assigneeId
                  ? ActivityActions.TASK_ASSIGNED
                  : ActivityActions.TASK_UNASSIGNED,
            entityType: "task",
            entityId: task.id,
            metadata: {
               snapshot: {
                  actor: {
                     display:
                        user.fullName ??
                        user.username ??
                        "Unknown User",
                  },
                  entity: {
                     display: task.title,
                  },
               },
               details: isReassignment ?
               {
                  previousAssignee: task.assignee_id,
                  newAssignee: assigneeId,
               }
               : 
               {}
            },
         });
      } catch (error) {
         console.error("Failed to create activity log:", error);
      }

      // 7.
      // createNotification(...)
      if (assigneeId !== null) {
         
         try {
            await createNotification({
               userId: assigneeId,
               boardId: task.board_id,
               type: NotificationTypes.TASK_ASSIGNED,
               metadata: {
                  snapshot: {
                     actor: {
                        display: user.fullName ??
                                 user.username ??
                                 "Unknown User",
                     },
                     board: {
                        display: board.title
                     },
                     task: {
                        display: task.title
                     }
                  },
                  details: {}
               }
            })
         } catch (error) {
            console.error("Failed to create notification:", error);
         }
      }

      return Response.json(updatedTask);

   } catch (error) {
   console.error(error);

   return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
   );
}
}