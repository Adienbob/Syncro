
// Board model
export interface Board {
   id: string
   title: string
   createdAt: string
}

// Task model
export interface Task {
   id: string;
   title: string;
   createdAt: string;
   description: string;
   priority: "low" | "medium" | "high";
   dueDate: string | null;
   status: "todo" | "in-progress" | "done",
   boardId: string;
}

// App state shape
export interface AppState {
   boards: Board[]
   tasks: Task[]
   members: BoardMember[]
   activities: ActivityLog[]
   notifications: AppNotification[]
}

// Board Member model
export interface BoardMember {
   id: string;
   boardId: string;
   userId: string;
   role: "owner" | "editor" | "viewer";
   joinedAt: string;
}

// Activities model 
export type ActivityAction =
   | "board.created"
   | "board.renamed"
   | "board.deleted"
   | "task.created"
   | "task.updated"
   | "task.deleted"
   | "task.moved"
   | "member.invited"
   | "member.removed"
   | "member.role_changed";

export type ActivityEntityType =
   | "board"
   | "task"
   | "member";

export interface ActivitySnapshot {
   actor: {
      display: string;
   };

   entity: {
      display: string;
   };
}

export type ActivityDetails = Record<string, unknown>;

export interface ActivityMetadata {
   snapshot: ActivitySnapshot;
   details: ActivityDetails;
}

export interface ActivityLog {
   id: string;
   boardId: string;
   actorId: string;
   action: ActivityAction;
   entityType: ActivityEntityType;
   entityId: string;
   metadata: ActivityMetadata;
   createdAt: string;
}

export interface CreateActivityInput {
   boardId: string;
   actorId: string;
   action: ActivityAction;
   entityType: ActivityEntityType;
   entityId: string;
   metadata: ActivityMetadata;
}

export interface FormattedActivity {
   id: string;
   action: ActivityAction;
   message: string;
   createdAt: string;
}


// Notifications model types
export type NotificationType =
   | "member.invited"
   | "member.role_changed"
   | "task.assigned";

export interface NotificationMetadata {
   snapshot: {
      actor: {
         display: string;
      };

      board: {
         display: string;
      };

      task?: {
         display: string;
      };

      role?: string;
   };

   details: Record<string, never>;
}

export interface AppNotification  {
   id: string;

   userId: string;

   boardId: string;

   type: NotificationType;

   metadata: NotificationMetadata;

   isRead: boolean;

   createdAt: string;
}

export interface FormattedNotification {
   id: string;

   title: string;

   description: string;

   boardId: string;

   isRead: boolean;

   createdAt: string;
}