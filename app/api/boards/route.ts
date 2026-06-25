import { supabase } from "@/app/shared/services/supabase";


export async function GET() {
    const { data, error } = await supabase
        .from("boards")
        .select("*");

    if (error) {
        return Response.json(
          { error: error.message },
          { status: 500 }
        );
    }

    return Response.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title } = body;

    const { data, error } = await supabase
      .from("boards")
      .insert([{ title }])
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