"use client";

import { FormattedActivity } from "@/app/types/models";
import { formatDistanceToNow } from "date-fns";

interface Props {
   activity: FormattedActivity;
}
export default function ActivityCard({ activity }: Props) {
   
   return (
      <article className="rounded-[8px] border border-border bg-surface p-4">
         <p className="text-body-md text-text-primary">
            {activity.message}
         </p>

         <span className="mt-2 block text-[13px] text-text-muted">
            {formatDistanceToNow(new Date(activity.createdAt), {
               addSuffix: true,
            })}
         </span>
      </article>
   );
}