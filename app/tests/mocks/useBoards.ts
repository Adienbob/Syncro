import { vi } from "vitest";

const addBoard = vi.fn();
const renameBoard = vi.fn();
const deleteBoard = vi.fn();


const useBoards = () => ({
   addBoard,
   renameBoard,
   deleteBoard,
})

export {useBoards, addBoard, renameBoard, deleteBoard}