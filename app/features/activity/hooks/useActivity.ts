"use client";

import { useEffect, useState } from "react";
import { ActivityAction, ActivityEntityType, ActivityLog, ActivityMetadata, FormattedActivity } from "../model";
import { formatActivity } from "../utils/formatActivity";

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
   const [activities, setActivities] = useState<FormattedActivity[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function loadActivities() {
         try {
            setLoading(true);

            const res = await fetch(`/api/boards/${boardId}/activity`);

            if (!res.ok) {
               throw new Error("Failed to load activities.");
            }

            const rawData: ActivityLogDB[] = await res.json();

            const activities: ActivityLog[] = rawData.map((activity: ActivityLogDB) => ({
               ...activity,
               createdAt: activity.created_at,
               boardId: activity.board_id,
               actorId: activity.actor_id,
               entityType: activity.entity_type,
               entityId: activity.entity_id,
            }));

            setActivities(activities.map(formatActivity));
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

      loadActivities();
   }, [boardId]);

   return {
      activities,
      loading,
      error,
   };
}