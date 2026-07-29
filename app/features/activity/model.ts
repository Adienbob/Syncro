export type ActivityAction =
   | "board.created";

export type ActivityEntityType =
   | "board";

export interface ActivitySnapshot {
   actor: {
      display: string;
   };

   entity: {
      type: ActivityEntityType;
      display: string;
   };
}

export interface ActivityMetadata {
   snapshot: ActivitySnapshot;
   details: Record<string, never>;
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