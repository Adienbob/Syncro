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