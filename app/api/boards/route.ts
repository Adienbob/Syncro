import { createSupabaseServerClient } from "@/app/shared/services/supabase";
import { currentUser } from "@clerk/nextjs/server";


export async function GET() {
  const user = await currentUser()
  const supabase = await createSupabaseServerClient()
  if (user === null) {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", "demo_user")
      if (error) {
          return Response.json(
            { error: error.message },
            { status: 500 }
          );
      }
      return Response.json(data);
    } else {
      const { data, error } = await supabase
        .from("board_members")
        .select(`
          role,
          boards (
           *
          )
          `)
        .eq("user_id", user?.id)
        if (error) {
            return Response.json(
              { error: error.message },
              { status: 500 }
            );
        }
        console.log("boards data", data)
      return Response.json(data);
  }

}

export async function POST(req: Request) {
  try {
    // Check if user signed in or undfined
    const user = await currentUser()
    if (!user) {
      return Response.json(
          { error: "Unauthorized" },
          { status: 401 }
      );
    }
    
    // Add board and check if successfully added
    const supabase = await createSupabaseServerClient()
    const body = await req.json();
    const { title } = body;
    const { data, error } = await supabase
      .from("boards")
      .insert({title, user_id: user.id})
      .select()
      .single();
      
      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }

      // Add relation ( board_member ) and check it successfully added
      const { error: memberError } = await supabase
        .from("board_members")
        .insert({
          board_id: data.id,
          user_id: user.id,
          role: "owner",
        });

      if (memberError) {
        return Response.json(
          { error: memberError.message },
          { status: 500 }
        );
      }

    return Response.json(data);
  } catch (err) {
    console.log("CATCH ERROR:", err);
    return Response.json({ error: "Server crashed" }, { status: 500 });
  }
}