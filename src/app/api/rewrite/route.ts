import OpenAI from "openai";
import pdfParse from "pdf-parse";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {

  try {

    const data = await req.formData();

    const file =
      data.get("resume") as File;

    if (!file) {

      return Response.json({
        error: "No file uploaded",
      });
    }

    // PDF EXTRACTION

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const parsed =
      await pdfParse(buffer);

    const resumeText =
      parsed.text || "";

    // AI REWRITE

    const completion =
      await client.chat.completions.create({

        model:
          "llama-3.1-8b-instant",

        temperature: 0.4,

        messages: [

          {
            role: "system",

            content: `
You are a professional resume writer.

Rewrite the resume professionally.

Improve:
- ATS optimization
- wording
- action verbs
- recruiter readability
- project descriptions
- technical wording
`,
          },

          {
            role: "user",

            content: `
Rewrite this resume:

${resumeText}
`,
          },
        ],
      });

    return Response.json({

      rewrittenResume:
        completion.choices[0]
          .message.content || "",
    });

  } catch (error: unknown) {

    console.log(error);

    return Response.json({

      error:
        error instanceof Error
          ? error.message
          : "Rewrite failed",
    });
  }
}