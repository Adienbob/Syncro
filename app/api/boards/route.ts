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
      boards (
        *
      )
      `)
      .eq("user_id", user.id)
    if (error) {
        return Response.json(
          { error: error.message },
          { status: 500 }
        );
    }

    const boards = data.map((row) => row.boards);

    return Response.json(boards);
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
    
    const supabase = await createSupabaseServerClient()
    const body = await req.json();
    const { title } = body;
    
    const { data: board, error } = await supabase.rpc("create_board", {
      p_title: title,
    });

    const { data: member, error: memberError } = await supabase
      .from("board_members")
      .select("*")
      .eq("board_id", board.id)
      .eq("user_id", user.id)
      .single();

    if (error && memberError) {
      console.error(error, memberError);
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({board, member,});
  } catch (err) {
    console.log("CATCH ERROR:", err);
    return Response.json({ error: "Server crashed" }, { status: 500 });
  }
}