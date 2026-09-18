import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function createSupabaseServerClient() {
  const { getToken } = await auth();

  const token = await getToken({
    template: "supabase",
  });

  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}