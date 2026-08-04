
"use client";

import { FormattedNotification } from "@/app/types/models";
import { formatDistanceToNow } from "date-fns";

interface NotificationCardProps {
   notification: FormattedNotification;
   onClick: () => void;
}

export default function NotificationCard({
   notification,
   onClick,
}: NotificationCardProps) {
   return (
      <button
         onClick={onClick}
         className="flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-card"
      >
         <div
            className={`mt-2 h-2 w-2 rounded-full ${
               notification.isRead
                  ? "bg-transparent"
                  : "bg-primary"
            }`}
         />

         <div className="flex-1">
            <h4 className="font-medium text-text-primary">
               {notification.title}
            </h4>

            <p className="mt-1 text-sm text-text-secondary">
               {notification.description}
            </p>

            <span className="mt-2 block text-xs text-text-secondary">
               {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
               })}
            </span>
         </div>
      </button>
   );
}