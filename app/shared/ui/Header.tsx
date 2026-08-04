"use client"
import NotificationBell from "@/app/features/notifications/components/NotifiBill";
import NotificationDropdown from "@/app/features/notifications/components/NotifiDropdown";
import { useAppContext } from "@/app/state/AppContext";
import { FormattedNotification } from "@/app/types/models";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { requireAuth } from "../utils/requireAuth";
import { toast } from "sonner";
import { formatNotification } from "@/app/features/notifications/utils/formatNotification";

export type HeaderProps = {
   searchTerm: string;
   onSearchChange: (value: string) => void;
};
export default function Header({searchTerm, onSearchChange}: HeaderProps) {
   const { state, dispatch } = useAppContext()
   const [ isNotificationOpen, setIsNotificationOpen ] = useState(false)
   const formattedNotifications = state.notifications.map(formatNotification)
   const { isSignedIn } = useUser();
   const router = useRouter()
   const loading = false;

   const unreadCount = formattedNotifications.filter(
      (notification) => !notification.isRead
   ).length;
   
   async function handleMarkAllAsRead() {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      try {
         const res = await fetch(
            "/api/notifications/read-all",
            {
               method: "PATCH",
            }
         );

         const data = await res.json();

         if (!res.ok) {
            throw new Error(
               data.error ||
               "Failed to mark all notifications as read."
            );
         }

         dispatch({
            type: "MARK_ALL_NOTIFICATIONS_READ",
         });

         toast.success("All notifications marked as read.");
      } catch (err) {
         if (err instanceof Error) {
            toast.error(err.message);
         } else {
            toast.error("Something went wrong.");
         }
      }
   }

   async function handleNotificationClick(
      notification: FormattedNotification
   ) {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      try {
         const res = await fetch(
            `/api/notifications/${notification.id}`,
            {
               method: "PATCH",
            }
         );

         const data = await res.json();

         if (!res.ok) {
            throw new Error(
               data.error || "Failed to mark notification as read."
            );
         }

         dispatch({
            type: "MARK_NOTIFICATION_READ",
            payload: {id: notification.id},
         });

         router.push(`/BoardPage/${notification.boardId}`);
      } catch (err) {
         if (err instanceof Error) {
            toast.error(err.message);
         } else {
            toast.error("Something went wrong.");
         }
      }
   }
      
   return (
      <header className="text-white bg-background border-border border-b px-6 py-4.5 flex justify-between">
         <div className="flex gap-4 items-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
               <rect width="32" height="32" fill="url(#pattern0_13_5)"/>
               <defs>
               <pattern id="pattern0_13_5" patternContentUnits="objectBoundingBox" width="1" height="1">
               <use xlinkHref="#image0_13_5" transform="scale(0.015625)"/>
               </pattern>
               <image id="image0_13_5" width="64" height="64" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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"/>
               </defs>
            </svg>

            <span className="text-primary-light font-bold leading-7 text-[20px]">Syncro</span>
         </div>

         <div className="flex items-center gap-4">
            <div className="relative w-full max-w-md">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
               <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z"
                     fill="#A1A1AA"
                  />
               </svg>
               </span>

               <input
               type="text"
               value={searchTerm}
               onChange={(e) => onSearchChange(e.target.value)}
               placeholder="Search...."
               className="
                  w-full
                  bg-[#1A1A1F]
                  border border-border
                  text-[#F4F4F5]
                  placeholder:text-[#A1A1AA]
                  pl-10
                  pr-4
                  py-2
                  rounded-md
                  outline-none
                  focus:border-[#7C3AED]
                  transition
               "
               />
            </div>
            
            <div className="relative">
               <button onClick={() => setIsNotificationOpen(prev => !prev)}>
                  <NotificationBell unreadCount={unreadCount}    onClick={() => setIsNotificationOpen((prev) => !prev)}/>
               </button>

               {isNotificationOpen && (
                  <NotificationDropdown
                     notifications={formattedNotifications}
                     loading={loading}
                     onMarkAllAsRead={handleMarkAllAsRead}
                     onNotificationClick={handleNotificationClick}
                  />
               )}
            </div>

            {isSignedIn ? (
               <UserButton />
               ) : (
                  <SignInButton>
                     <button className="px-4 py-2 rounded-md border border-border">
                        Sign In
                     </button>
                  </SignInButton>
               )
            }
         </div>
      </header>
   )
}