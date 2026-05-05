
// Board model
export interface Board {
   id: string
   title: string
   createdAt: string
}

// Task model
export interface Task {
   id: string
   title: string
   status: "todo" | "done"
   boardId: string
}

// App state shape
export interface AppState {
   boards: Board[]
   tasks: Task[]
}