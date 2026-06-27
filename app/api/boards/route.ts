import { supabase } from "@/app/shared/services/supabase";
import { currentUser } from "@clerk/nextjs/server";


export async function GET() {
  const user = await currentUser()


  if (user === null) {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", "demo-user")
      if (error) {
          return Response.json(
            { error: error.message },
            { status: 500 }
          );
      }
      return Response.json(data);
  } else {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .eq("user_id", user?.id)
      if (error) {
          return Response.json(
            { error: error.message },
            { status: 500 }
          );
      }
      console.log(data)
      return Response.json(data);
  }

}

export async function POST(req: Request) {
  try {
    const body = await req.json();


    const { data, error } = await supabase
      .from("boards")
      .insert([body])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.log("CATCH ERROR:", err);
    return Response.json({ error: "Server crashed" }, { status: 500 });
  }
}