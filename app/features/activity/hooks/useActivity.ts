"use client";

import { useEffect, useState } from "react";
import { ActivityAction, ActivityEntityType, ActivityLog, ActivityMetadata } from "@/app/types/models";
import { formatActivity } from "../utils/formatActivity";
import { useAppContext } from "@/app/state/AppContext";
import { useAuth } from "@clerk/nextjs";
import { supabaseBrowser } from "@/app/shared/services/supabase-browser";

export interface ActivityLogDB {
   id: string;
   board_id: string;
   actor_id: string;
   action: ActivityAction;
   entity_type: ActivityEntityType;
   entity_id: string;
   metadata: ActivityMetadata;
   created_at: string;
}

export function useActivity(boardId: string) {
   const { state, dispatch } = useAppContext();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const { getToken } = useAuth();


   function normalizeActivity(activity: ActivityLogDB): ActivityLog {
      return {
         ...activity,
         createdAt: activity.created_at,
         boardId: activity.board_id,
         actorId: activity.actor_id,
         entityType: activity.entity_type,
         entityId: activity.entity_id,
      };
   }

   useEffect(() => {
      let channel: ReturnType<typeof supabaseBrowser.channel> | null = null;

      async function initialize() {
         try {
            setLoading(true);

            const res = await fetch(`/api/boards/${boardId}/activity`);

            if (!res.ok) {
               throw new Error("Failed to load activities.");
            }

            const rawData: ActivityLogDB[] = await res.json();

            const activities: ActivityLog[] = rawData.map(normalizeActivity);

            dispatch({
               type: "SET_ACTIVITIES",
               payload: { activities },
            });

            // Realtime 
            const token = await getToken({
               template: "supabase",
            });

            if (!token) {
               throw new Error("Failed to get Supabase token.");
            }

            await supabaseBrowser.realtime.setAuth(token);

            channel = supabaseBrowser
               .channel(`activity-${boardId}`)
               .on(
                  "postgres_changes",
                  {
                     event: "INSERT",
                     schema: "public",
                     table: "activity_logs",
                     filter: `board_id=eq.${boardId}`,
                  },
                  (payload) => {
                     const activity = normalizeActivity(payload.new as ActivityLogDB);

                     dispatch({
                        type: "ADD_ACTIVITY",
                        payload: { activity },
                     });
                  }
               )
               .subscribe();
         } catch (err) {
            setError(
               err instanceof Error
                  ? err.message
                  : "Something went wrong."
            );
         } finally {
            setLoading(false);
         }
      }

      initialize();

      return () => {
         if (channel) {
            supabaseBrowser.removeChannel(channel);
         }
      };
   }, [boardId, dispatch, getToken]);
   return {
      activities: state.activities.map(formatActivity),
      loading,
      error,
   };
}