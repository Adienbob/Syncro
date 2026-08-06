"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabaseBrowser } from "@/app/shared/services/supabase-browser";
import { useAppContext } from "@/app/state/AppContext";
import { Task } from "@/app/types/models";

interface TaskDB {
   id: string;
   board_id: string;
   title: string;
   description: string;
   status: "todo" | "in-progress" | "done";
   priority: "low" | "medium" | "high";
   due_date: string | null;
   assignee_id: string | null;
   created_at: string;
}

function normalizeTask(task: TaskDB): Task {
   return {
      id: task.id,
      boardId: task.board_id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      assigneeId: task.assignee_id,
      createdAt: task.created_at,
   };
}

export function useTasksRealtime(boardId: string) {
   const { dispatch } = useAppContext();
   const { getToken } = useAuth();
   const { user, isSignedIn } = useUser();

   useEffect(() => {
      if (!user || !isSignedIn) return;

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
            
            const existing = supabaseBrowser
            .getChannels()
            .find((c) => c.topic === `realtime:tasks-${boardId}`);

            if (existing) {
            await supabaseBrowser.removeChannel(existing);
            }


            channel = supabaseBrowser
               .channel(`tasks-${boardId}`)
               .on(
                  "postgres_changes",
                  {
                     event: "*",
                     schema: "public",
                     table: "tasks",
                     filter: `board_id=eq.${boardId}`,
                  },
                  (payload) => {

                     const task =
                        payload.eventType !== "DELETE"
                           ? normalizeTask(payload.new as TaskDB)
                           : normalizeTask(payload.old as TaskDB);

                     switch (payload.eventType) {
                        case "INSERT":
                           dispatch({
                              type: "ADD_TASK",
                              payload: { task },
                           });
                           break;

                        case "UPDATE":
                           dispatch({
                              type: "UPDATE_TASK",
                              payload: { task },
                           });
                           break;

                        case "DELETE":
                           dispatch({
                              type: "DELETE_TASK",
                              payload: { id: task.id },
                           });
                           break;
                     }
                  }
               )
               .subscribe();
         } catch (error) {
            console.error("Failed to subscribe to tasks:", error);
         }
      }

      initialize();

      return () => {
         if (channel) {
            supabaseBrowser.removeChannel(channel);
         }
      };
   }, [boardId, dispatch, getToken, user, isSignedIn]);
}