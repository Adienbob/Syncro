import {
   AppNotification,
   FormattedNotification,
} from "@/app/types/models";

export function formatNotification(
   notification: AppNotification
): FormattedNotification {
   const actor = notification.metadata.snapshot.actor.display;
   const board = notification.metadata.snapshot.board.display;

   switch (notification.type) {
      case "member.invited":
         return {
            id: notification.id,
            title: "Board Invitation",
            description: `${actor} invited you to "${board}".`,
            boardId: notification.boardId,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
         };

      case "member.role_changed":
         return {
            id: notification.id,
            title: "Role Updated",
            description: `${actor} changed your role in "${board}".`,
            boardId: notification.boardId,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
         };

      case "task.assigned":
         return {
            id: notification.id,
            title: "Task Assigned",
            description: `${actor} assigned you "${notification.metadata.snapshot.task?.display}" in "${board}".`,
            boardId: notification.boardId,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
         };

      default:
         return {
            id: notification.id,
            title: "Notification",
            description: "You have a new notification.",
            boardId: notification.boardId,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
         };
   }
}