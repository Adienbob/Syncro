"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabaseBrowser } from "@/app/shared/services/supabase-browser";
import { useAppContext } from "@/app/state/AppContext";
import { AppNotification, NotificationMetadata, NotificationType } from "@/app/types/models";

interface NotificationDB {
   id: string;
   user_id: string;
   board_id: string;
   type: NotificationType;
   metadata: NotificationMetadata;
   is_read: boolean;
   created_at: string;
}

export function useNotificationRealtime() {
   const { dispatch } = useAppContext();
   const { getToken } = useAuth();
   const { user, isSignedIn } = useUser();

   function normalizeNotification(
      notification: NotificationDB
   ): AppNotification {
      return {
         id: notification.id,
         userId: notification.user_id,
         boardId: notification.board_id,
         type: notification.type,
         metadata: notification.metadata,
         isRead: notification.is_read,
         createdAt: notification.created_at,
      };
   }

   useEffect(() => {
      if (!user || isSignedIn) return;

      let channel: ReturnType<typeof supabaseBrowser.channel> | null = null;

      async function initialize() {
         try {
            const token = await getToken({
               template: "supabase",
            });

            if (!token) {
               throw new Error("Failed to get Supabase token.");
            }

            await supabaseBrowser.realtime.setAuth(token);

            channel = supabaseBrowser
               .channel("notifications")
               .on(
                  "postgres_changes",
                  {
                     event: "INSERT",
                     schema: "public",
                     table: "notifications",
                     filter: `user_id=eq.${user?.id}`,
                  },
                  (payload) => {
                     const notification = normalizeNotification(
                        payload.new as NotificationDB
                     );
                     console.log(notification)
                     dispatch({
                        type: "ADD_NOTIFICATION",
                        payload: { notification },
                     });
                  }
               )
               .subscribe();


         } catch (error) {
            console.error("Failed to subscribe to notifications:", error);
         }
      }

      initialize();

      return () => {
         if (channel) {
            supabaseBrowser.removeChannel(channel);
         }
      };
   }, [dispatch, getToken, user, isSignedIn]);
}