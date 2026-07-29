import { CreateActivityInput } from "../model";
import { createSupabaseServerClient } from "@/app/shared/services/supabase";

export async function createActivity({
   boardId,
   actorId,
   action,
   entityType,
   entityId,
   metadata,
}: CreateActivityInput): Promise<void> {

   const supabase = await createSupabaseServerClient()
   const { data, error } = await supabase
      .from("activity_logs")
      .insert({
         board_id: boardId,
         actor_id: actorId,
         action,
         entity_type: entityType,
         entity_id: entityId,
         metadata,
      }).select().single();

      console.log(data)

   if (error) {
      throw error;
   }
}