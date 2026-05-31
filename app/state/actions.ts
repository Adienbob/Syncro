export type Actions = 
   | { type: "ADD_BOARD", payload: {title: string,} }
   | { type: "DELETE_BOARD", payload: {id: string}}
   | { type: "ADD_TASK", payload: { title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, status?: "todo" | "done", boardId: string}}
   | { type: "DELETE_TASK", payload: {id: string}}
   | { type: "MOVE_TASK", payload: {id: string, newStatus?: "todo" | "done", newBoardId?: string}}
   | { type: "EDIT_TASK", payload: {id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null}}