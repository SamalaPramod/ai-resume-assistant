import OpenAI from "openai";
import pdfParse from "pdf-parse";

const client = new OpenAI({

  apiKey:
    process.env.GROQ_API_KEY,

  baseURL:
    "https://api.groq.com/openai/v1",
});

export async function POST(
  req: Request
) {

  try {

    const formData =
      await req.formData();

    const resumeFile =
      formData.get(
        "resume"
      ) as File;

    const jdFile =
      formData.get(
        "jdFile"
      ) as File;

    if (
      !resumeFile ||
      !jdFile
    ) {

      return Response.json({

        error:
          "Resume and JD required",
      });
    }

    // Resume

    const resumeBuffer =
      Buffer.from(

        await resumeFile.arrayBuffer()
      );

    const resumeParsed =
      await pdfParse(
        resumeBuffer
      );

    const resumeText =
      resumeParsed.text;

    // JD

    const jdBuffer =
      Buffer.from(

        await jdFile.arrayBuffer()
      );

    const jdParsed =
      await pdfParse(
        jdBuffer
      );

    const jdText =
      jdParsed.text;

    const completion =
      await client.chat.completions.create({

        model:
          "llama-3.1-8b-instant",

        temperature:
          0.4,

        messages: [

          {

            role:
              "system",

            content: `
You are an AI career mentor.

Analyze resume and job description.

Find skill gaps.

Create roadmap.

Format:

Missing Skills

Week 1

Week 2

Week 3

Week 4

Projects to Build

Estimated readiness improvement
`,
          },

          {

            role:
              "user",

            content:

`
RESUME

${resumeText}

JOB DESCRIPTION

${jdText}
`,
          },
        ],
      });

    const roadmap =

      completion
      .choices[0]
      .message.content;

    return Response.json({

      roadmap,
    });

  } catch (error) {

    console.log(
      error
    );

    return Response.json({

      error:
        "Roadmap failed",
    });
  }
}