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

export async function POST(request: Request) {
   const body = await request.json();

   console.log(body);

   return Response.json({
      success: true,
      received: body,
   });
}