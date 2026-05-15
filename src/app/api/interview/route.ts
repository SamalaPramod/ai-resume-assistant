export async function POST(req: Request) {

  try {

    const data =
      await req.formData();

    const file =
      data.get("resume");

    if (!file) {

      return Response.json({

        error:
          "No resume uploaded",
      });
    }

    return Response.json({

      success: true,

      message:
        "Interview API working successfully",
    });

  } catch (error: unknown) {

    console.log(error);

    return Response.json({

      error:
        error instanceof Error
          ? error.message
          : "Interview API failed",
    });
  }
}