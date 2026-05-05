export type Actions = 
   | { type: "ADD_BOARD", payload: {id: string, title: string, createdAt: string} }
   | { type: "DELETE_BOARD", payload: {id: string}}
   | { type: "ADD_TASK", payload: {id: string, title: string, status: "todo" | "done", boardId: string}}
   | { type: "DELETE_TASK", payload: {id: string}}
   | { type: "MOVE_TASK", payload: {id: string, newStatus?: "todo" | "done", newBoardId?: string}}
   | { type: "EDIT_TASK", payload: {id: string, title: string}}