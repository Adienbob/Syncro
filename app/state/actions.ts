import { Board, Task, BoardMember, ActivityLog, AppNotification } from "../types/models"
export type Actions = 
   | { type: "SET_NOTIFICATIONS"; payload: { notifications: AppNotification[] } }
   | { type: "ADD_NOTIFICATION"; payload: { notification: AppNotification } }
   | { type: "MARK_NOTIFICATION_READ"; payload: { id: string } }
   | { type: "MARK_ALL_NOTIFICATIONS_READ" }
   | { type: "SET_ACTIVITIES"; payload: { activities: ActivityLog[] } }
   | { type: "ADD_ACTIVITY"; payload: { activity: ActivityLog } }
   | { type: "SET_MEMBERS", payload: { members: BoardMember[] }}
   | { type: "ADD_MEMBER", payload: { member: BoardMember}}
   | { type: "UPDATE_MEMBER";payload: {id: string, role: "owner" | "editor" | "viewer"}}
   | { type: "REMOVE_MEMBER", payload: {id: string}}
   | { type: "SET_BOARDS", payload: { boards: Board[] }}
   | { type: "ADD_BOARD", payload: { id: string, title: string, userId: string, createdAt: string}}
   | { type: "RENAME_BOARD", payload: {id: string, title: string}}
   | { type: "DELETE_BOARD", payload: {id: string}}
   | { type: "SET_TASKS", payload: { tasks: Task[] }}
   | { type: "ADD_TASK", payload: { id: string, title: string, createdAt: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null, status?: "todo" | "in-progress" | "done", boardId: string}}
   | { type: "DELETE_TASK", payload: {id: string}}
   | { type: "MOVE_TASK", payload: {id: string, newStatus: "todo" | "in-progress" | "done", newBoardId?: string}}
   | { type: "EDIT_TASK", payload: {id: string, title: string, description: string, priority: "low" | "medium" | "high", dueDate: string | null}}