
import { BoardMember } from "@/app/types/models";

export function getRole(
   members: BoardMember[],
   boardId: string,
   userId?: string
): "owner" | "editor" | "viewer" | undefined {

   
   return members.find(
      (member) =>
         member.boardId === boardId &&
         member.userId === userId
   )?.role;
}