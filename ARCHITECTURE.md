# Syncro — Architecture

## Folder Structure
app/
├── features/
│   ├── boards/
│   │     ├── components/   # Board-related components
│   │     ├── hooks/        # Board-related custom hooks
│   │     └── utils/        # Board-related helper functions
│   │
│   └── tasks/
│         ├── components/   # Task-related components
│         ├── hooks/        # Task-related custom hooks
│         └── utils/        # Task-related helper functions
│
├── state/
│   ├── AppContext.tsx      # Global context provider
│   ├── reducer.ts          # useReducer logic
│   ├── actions.ts          # Action type constants
│   └── initialState.ts     # Initial state shape
│
├── shared/
│   ├── ui/                 # Reusable UI components (Button, Input, Modal, Card)
│   ├── layout/             # Layout components (Navbar, Header)
│   └── utils/              # Shared helper functions
│
├── types/
│   └── models.ts           # Global TypeScript interfaces (Board, Task, AppState)
│
└── pages/
├── BoardsPage/         # Shows all boards in a grid
└── BoardPage/          # Shows tasks in To Do / Done columns

## State Management

Context API + useReducer

Global state shape:
```ts
{
  boards: Board[],
  tasks: Task[]
}
```

## Data Models

```ts
type Board = {
  id: string
  title: string
  createdAt: string
}

type Task = {
  id: string
  title: string
  status: "todo" | "done"
  boardId: string
}
```

## Actions

| Action | Description |
|--------|-------------|
| ADD_BOARD | Push new board to boards[] |
| DELETE_BOARD | Remove board + all related tasks |
| ADD_TASK | Push new task to tasks[] with boardId |
| DELETE_TASK | Filter task by id |
| MOVE_TASK | Toggle task.status (todo ↔ done) |
| EDIT_TASK | Update task fields |