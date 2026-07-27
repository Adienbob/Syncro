import { useAppContext } from "@/app/state/AppContext";
import { BoardMember } from "@/app/types/models";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner";


interface UseBoardMember {
   members: BoardMember[];

   removeMember: (memberId: string) => Promise<void>;
   inviteMember: (id: string, email: string, role: "editor" | "viewer") => Promise<void>
   updateMemberRole: (memberId: string, role: "owner" | "editor" | "viewer") => Promise<void>;
}

export function useBoardMember(): UseBoardMember {
   const {state, dispatch} = useAppContext()

   const members = state.members

   const router = useRouter()
   const { isSignedIn } = useUser()



   async function removeMember(memberId: string) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      try {
         const res = await fetch(`/api/board-members/${memberId}`, {
            method: "DELETE",
         });

         if (!res.ok) {
            throw new Error("Failed");
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
      role: "owner" | "editor" | "viewer"
   ) {
      if (!isSignedIn) {
         router.push("/sign-in");
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

         // dispatch({
         //    type: "UPDATE_MEMBER_ROLE",
         //    payload: {
         //       id: memberId,
         //       role,
         //    },
         // });

         toast.success("Member role updated successfully.");
      } catch (err) {
         if (err instanceof Error) {
            toast.error(err.message);
         } else {
            toast.error("Something went wrong.");
         }
      }
   }

   async function inviteMember( id: string, email: string, role: "editor" | "viewer" ) {
      if (!isSignedIn) {
         router.push("/sign-in");
         return;
      }

      
      try {
         const res = await fetch(`/api/boards/${id}/members`, {
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