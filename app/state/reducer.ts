import { AppState } from "../types/models"

import { Actions } from "./actions"

export function reducer(state: AppState, action: Actions) {
   switch (action.type) {
      case "SET_NOTIFICATIONS":
         return {
            ...state,
            notifications: action.payload.notifications,
         };
      case "ADD_NOTIFICATION":
         return {
            ...state,
            notifications: [
               action.payload.notification,
               ...state.notifications,
            ],
         };
      case "MARK_NOTIFICATION_READ":
         return {
            ...state,
            notifications: state.notifications.map((notification) =>
               notification.id === action.payload.id
                  ? { ...notification, isRead: true }
                  : notification
            ),
         };
      case "MARK_ALL_NOTIFICATIONS_READ":
         return {
            ...state,
            notifications: state.notifications.map((notification) => ({
               ...notification,
               isRead: true,
            })),
         };
      case "SET_ACTIVITIES":
         return {
            ...state,
            activities: action.payload.activities,
         }
      case "ADD_ACTIVITY":
         const exists = state.activities.some(
            (activity) => activity.id === action.payload.activity.id
         );

         if (exists) {
            return state;
         }
         return {
            ...state,
            activities: [
               action.payload.activity,
               ...state.activities,
            ],
         }
      case "SET_MEMBERS":
         return {
            ...state,
            members: action.payload.members
         }
      case "ADD_MEMBER":
         return {
            ...state,
            members: [...state.members, action.payload.member],
         };
      case "UPDATE_MEMBER":
         return {
            ...state,
            members: state.members.map((member) =>
               member.id === action.payload.id
                  ? {
                     ...member,
                     role: action.payload.role,
                  }
                  : member
            ),
         }
      case "REMOVE_MEMBER":
         return {
            ...state,
            members: state.members.filter(
               (member) => member.id !== action.payload.id
            ),
         }
      case "SET_BOARDS":
         return {
            ...state,
            boards: action.payload.boards
         }
      case "ADD_BOARD":
         return {
         ...state,
         boards: [...state.boards, {id: action.payload.id, title: action.payload.title, createdAt: action.payload.createdAt}]
      }
      case "RENAME_BOARD": 
         return {
            ...state,
            boards: state.boards.map((b) => (
               b.id === action.payload.id
               ? {...b, title: action.payload.title}
               : b
            ))
         }
      case "DELETE_BOARD":
         return {
            ...state,
            boards: state.boards.filter( b => b.id !== action.payload.id ),
            tasks: state.tasks.filter(t => t.boardId !== action.payload.id )
         }
         case "SET_TASKS":
            return {
               ...state,
               tasks: action.payload.tasks
            }
      case "ADD_TASK":
         return {
            ...state,
            tasks: [...state.tasks, action.payload.task],
         };

      case "UPDATE_TASK":
         return {
            ...state,
            tasks: state.tasks.map((task) =>
               task.id === action.payload.task.id
                  ? action.payload.task
                  : task
            ),
         };
      case "DELETE_TASK":
         console.log(
            "Reducer DELETE",
            action.payload.id,
            state.tasks.map(t => t.id)
         );

         return {
            ...state,
            tasks: state.tasks.filter(
               (task) => task.id !== action.payload.id
            ),
         };
      default:
         return state;
   }
}