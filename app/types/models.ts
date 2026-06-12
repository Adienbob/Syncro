
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
}