"use client";

import { FormattedNotification } from "@/app/types/models";
import NotificationCard from "./NotifiCard";

interface NotificationDropdownProps {
   notifications: FormattedNotification[];
   loading: boolean;
   onMarkAllAsRead: () => void;
   onNotificationClick: (notification: FormattedNotification) => void;
}

export default function NotificationDropdown({
   notifications,
   loading,
   onMarkAllAsRead,
   onNotificationClick,
}: NotificationDropdownProps) {

   
   return (
      <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-border bg-background shadow-xl">
         <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-semibold text-text-primary">
               Notifications
            </h3>

            {notifications.length > 0 && (
               <button
                  onClick={onMarkAllAsRead}
                  className="text-sm text-primary hover:underline"
               >
                  Mark all as read
               </button>
            )}
         </div>

         <div className="max-h-[450px] overflow-y-auto">
            {loading ? (
               <div className="space-y-3 p-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                     <div
                        key={index}
                        className="h-16 animate-pulse rounded-lg bg-card"
                     />
                  ))}
               </div>
            ) : notifications.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg">🔔</p>

                  <p className="mt-2 text-sm text-text-secondary">
                     No notifications yet.
                  </p>
               </div>
            ) : (
               notifications.map((notification) => (
                  <NotificationCard
                     key={notification.id}
                     notification={notification}
                     onClick={() =>
                        onNotificationClick(notification)
                     }
                  />
               ))
            )}
         </div>
      </div>
   );
}
