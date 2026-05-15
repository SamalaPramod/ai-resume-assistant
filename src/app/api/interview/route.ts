export const runtime = "nodejs";

import OpenAI from "openai";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {

  try {

    // =========================
    // FORM DATA
    // =========================

    const data =
      await req.formData();

    const file =
      data.get("resume") as File;

    const jdFile =
      data.get("jdFile") as File;

    let jobDescription =
      (data.get(
        "jobDescription"
      ) as string) || "";

    if (!file) {

      return Response.json({

        error:
          "No resume uploaded",
      });
    }

    // =========================
    // RESUME PDF
    // =========================

    const resumeBytes =
      await file.arrayBuffer();

    const resumeBuffer =
      Buffer.from(resumeBytes);

    const parsedResume =
      await pdfParse(
        resumeBuffer
      );

    let resumeText =
      parsedResume.text || "";

    resumeText =
      resumeText
        .replace(/\s+/g, " ")
        .trim();

    // =========================
    // JD PDF
    // =========================

    if (jdFile) {

      const jdBytes =
        await jdFile.arrayBuffer();

      const jdBuffer =
        Buffer.from(jdBytes);

      const parsedJD =
        await pdfParse(
          jdBuffer
        );

      jobDescription =
        parsedJD.text || "";
    }

    // =========================
    // AI INTERVIEW QUESTIONS
    // =========================

    const completion =
      await client.chat.completions.create({

        model:
          "llama-3.1-8b-instant",

        temperature: 0.7,

        messages: [

          {
            role: "system",

            content: `
You are a senior technical interviewer.

Generate:
- Technical interview questions
- HR questions
- Project-based questions
- Resume-based questions
- Coding questions

based on the candidate resume and job description.

Rules:
- Return at least 15 questions
- Make questions realistic
- Include frontend/backend/system design questions if relevant
- Keep questions professional
`,
          },

          {
            role: "user",

            content: `
Resume:

${resumeText}

Job Description:

${jobDescription}
`,
          },
        ],
      });

    const interviewQuestions =
      completion.choices[0]
        .message.content || "";

    // =========================
    // RESPONSE
    // =========================

    return Response.json({

      success: true,

      interviewQuestions,
    });

  } catch (
    error: unknown
  ) {

    console.log(error);

    return Response.json({

      error:
        error instanceof Error
          ? error.message
          : "Interview generation failed",
    });
  }
}