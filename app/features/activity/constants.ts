   export const ActivityActions = { 
      BOARD_CREATED: "board.created", 
      BOARD_RENAMED: "board.renamed", 
      BOARD_DELETED: "board.deleted", 
      TASK_CREATED: "task.created", 
      TASK_UPDATED: "task.updated", 
      TASK_DELETED: "task.deleted", 
      TASK_MOVED: "task.moved", 
      MEMBER_INVITED: "member.invited", 
      MEMBER_REMOVED: "member.removed", 
      MEMBER_ROLE_CHANGED: "member.role_changed", 
   } as const; 
   export type ActivityAction = (typeof ActivityActions)[keyof typeof ActivityActions];