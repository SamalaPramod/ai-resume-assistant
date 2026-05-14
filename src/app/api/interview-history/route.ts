import { supabase }
from "@/app/lib/supabase";

export async function GET() {

  try {

    const {
      data,
      error,
    } = await supabase

      .from("interview_history")

      .select("*")

      .order("created_at", {

        ascending: false,
      });

    if (error) {

      return Response.json({

        error:
          error.message,
      });
    }

    return Response.json(data);

  } catch (error: any) {

    return Response.json({

      error:
        error.message,
    });
  }
}