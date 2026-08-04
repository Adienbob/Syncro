import { NotificationMetadata, NotificationType } from "@/app/types/models";
import { createSupabaseServerClient } from "@/app/shared/services/supabase";

interface CreateNotificationParams {
   userId: string;
   boardId: string;
   type: NotificationType;
   metadata: NotificationMetadata;
}

export async function createNotification({
   userId,
   boardId,
   type,
   metadata,
}: CreateNotificationParams) {
   const supabase = await createSupabaseServerClient();

   const { error } = await supabase
      .from("notifications")
      .insert({
         user_id: userId,
         board_id: boardId,
         type,
         metadata,
      });

   if (error) {
      throw new Error(error.message);
   }
}