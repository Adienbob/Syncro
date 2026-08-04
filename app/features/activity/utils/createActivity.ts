import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { CreateActivityInput } from "@/app/types/models";

export async function createActivity({
   boardId,
   actorId,
   action,
   entityType,
   entityId,
   metadata,
}: CreateActivityInput): Promise<void> {

   const supabase = await createSupabaseServerClient()
   const { error } = await supabase
      .from("activity_logs")
      .insert({
         board_id: boardId,
         actor_id: actorId,
         action,
         entity_type: entityType,
         entity_id: entityId,
         metadata,
      });


   if (error) {
      throw new Error(error.message);
   }
}