import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BoardMember } from "@/app/types/models";
import { useAppContext } from "@/app/state/AppContext";
import { requireAuth } from "@/app/shared/utils/requireAuth";
import { getRole } from "@/app/shared/utils/getRole";



interface UseBoardMember {
   members: BoardMember[];

   removeMember: (memberId: string, boardId: string) => Promise<void>;
   inviteMember: (boardId: string, email: string, role: "editor" | "viewer") => Promise<void>
   updateMemberRole: (memberId: string, boardId: string, role: "owner" | "editor" | "viewer") => Promise<void>;
}

export function useBoardMember(): UseBoardMember {
   const {state, dispatch} = useAppContext()
   const members = state.members

   const router = useRouter()
   const { isSignedIn, user } = useUser()


   async function removeMember(memberId: string, boardId: string) {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      const myRole = getRole(members, boardId, user?.id )

      if (myRole !== "owner") {
         toast.error("You don't have permission");
         return;
      }

      try {
         const res = await fetch(`/api/board-members/${memberId}`, {
            method: "DELETE",
         });

         const data = await res.json()

         if (!res.ok) {
            throw new Error(data.error || "Failed to remove member")
         }

         dispatch({
            type: "REMOVE_MEMBER",
            payload: {
               id: memberId,
            },
         });

         toast.success("Member removed successfully!");
      } catch {
         toast.error("Failed to remove member.");
      }
   }

   

   async function updateMemberRole(
      memberId: string,
      boardId: string,
      role: "owner" | "editor" | "viewer"
   ) {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      const myRole = getRole(members, boardId, user?.id )

      if (myRole !== "owner") {
         toast.error("You don't have permission");
         return;
      }


      try {
         const res = await fetch(`/api/board-members/${memberId}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ role }),
         });

         const data = await res.json();

         if (!res.ok) {
            throw new Error(data.error || "Failed to update member role");
         }



         dispatch({
            type: "UPDATE_MEMBER",
            payload: {
               id: memberId,
               role,
            },
         });

         toast.success("Member role updated successfully.");
      } catch (err) {
         if (err instanceof Error) {
            toast.error(err.message);
         } else {
            toast.error("Something went wrong.");
         }
      }
   }

   async function inviteMember( boardId: string, email: string, role: "editor" | "viewer" ) {
      if (!requireAuth({ isSignedIn, router })) {
         return;
      }

      const myRole = getRole(members, boardId, user?.id )

      if (myRole !== "owner") {
         toast.error("You don't have permission");
         return;
      }
      try {
         const res = await fetch(`/api/boards/${boardId}/members`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email,
               role,
            }),
         });

         const data = await res.json();

         if (!res.ok) {
            throw new Error(data.error || "Failed to invite member");
         }

         dispatch({
            type: "ADD_MEMBER",
            payload: {
               member: {
                  id: data.id,
                  boardId: data.board_id,
                  userId: data.user_id,
                  role: data.role,
                  joinedAt: data.joined_at,
                  displayName: data.display_name,
                  imageUrl: data.image_url,
                  email: data.email
               },
            },
         });

         toast.success("Member invited successfully.");
      } catch (err) {
         if (err instanceof Error) {
            toast.error(err.message);
         } else {
            toast.error("Something went wrong.");
         }
      }
      
   }

   return {members, removeMember, inviteMember, updateMemberRole}
}