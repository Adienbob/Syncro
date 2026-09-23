import { Task } from "@/app/types/models";
import { vi } from "vitest";


const tasks: Task[] = [];
const addTask = vi.fn();
const editTask = vi.fn();
const deleteTask = vi.fn();
const moveTask = vi.fn();
const assignTask = vi.fn();

const useTasks = (_boardId: string) => ({
   tasks: [],
   addTask,
   editTask,
   deleteTask,
   moveTask,
   assignTask,
});

export {
   useTasks,
   tasks,
   addTask,
   editTask,
   deleteTask,
   moveTask,
   assignTask,
};