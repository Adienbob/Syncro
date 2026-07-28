// shared/utils/requireAuth.ts

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type RequireAuthParams = {
   isSignedIn: boolean | undefined;
   router: AppRouterInstance;
};

export function requireAuth({
   isSignedIn,
   router,
}: RequireAuthParams): boolean {
   if (!isSignedIn) {
      router.push("/sign-in");
      return false;
   }

   return true;
}