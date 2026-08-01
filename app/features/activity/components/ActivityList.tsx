"use client";

import { useActivity } from "../hooks/useActivity";
import ActivityCard from "./ActivityCard";
import ActivityListSkeleton from "./ActivitySkeleton";

interface Props {
   boardId: string;
}

export default function ActivityList({ boardId }: Props) {
   const { activities, loading } = useActivity(boardId);

   if (loading) {
      return (
         <ActivityListSkeleton />
      );
   }

   return (
      <section className="rounded-[8px] border border-border bg-surface p-4">
         <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Recent Activity
         </h2>

         {activities.length > 0 ? (
            <div className="space-y-3">
               {activities.map((activity) => (
                  <ActivityCard
                     key={activity.id}
                     activity={activity}
                  />
               ))}
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface-low px-6 py-12 text-center">
               <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-high">
                  📝
               </div>

               <h3 className="mb-2 text-lg font-semibold text-text-primary">
                  No activity yet
               </h3>

               <p className="max-w-sm text-body-md text-text-muted">
                  Activity will appear here when members create, update,
                  move or delete tasks.
               </p>
            </div>
         )}
      </section>
   );
}