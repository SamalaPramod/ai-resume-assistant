import OpenAI from "openai";

const pdfParse =
  require("pdf-parse");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL:
    "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {

  try {

    const data =
      await req.formData();

    const file =
      data.get("resume") as File;

    if (!file) {

      return Response.json({
        error: "No file uploaded",
      });
    }

    // =========================
    // PDF EXTRACTION
    // =========================

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const parsed =
      await pdfParse(buffer);

    const resumeText =
      parsed.text || "";

    // =========================
    // AI REWRITE
    // =========================

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
- project descriptions
- experience points
- ATS optimization
- technical wording
- action verbs
- recruiter readability

Make the resume stronger and more professional.
`,
          },

          {
            role: "user",

            content: `
Rewrite this resume professionally:

${resumeText}
`,
          },
        ],
      });

    const rewrittenResume =
      completion
        .choices[0]
        .message
        .content || "";

    return Response.json({

      rewrittenResume,
    });

  } catch (error: any) {

    console.log(error);

    return Response.json({

      error:
        error.message ||
        "Rewrite failed",
    });
  }
}