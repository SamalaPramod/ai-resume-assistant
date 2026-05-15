import OpenAI from "openai";
import pdfParse from "pdf-parse";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {

  try {

    const data =
      await req.formData();

    const file =
      data.get("resume") as File;

    const jdFile =
      data.get("jdFile") as File;

    if (!file) {

      return Response.json({
        error: "No resume uploaded",
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
      await pdfParse(resumeBuffer);

    let resumeText =
      parsedResume.text || "";

    resumeText =
      resumeText
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    // =========================
    // JD PDF
    // =========================

    let jdText = "";

    if (jdFile) {

      const jdBytes =
        await jdFile.arrayBuffer();

      const jdBuffer =
        Buffer.from(jdBytes);

      const parsedJD =
        await pdfParse(jdBuffer);

      jdText =
        parsedJD.text || "";

      jdText =
        jdText
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();
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
You are a FAANG-level interviewer.

Generate realistic interview questions from:
- candidate projects
- technologies
- experience
- resume
- job description

Include:
- HR questions
- Technical questions
- Project deep-dive questions
- Scenario questions
- Coding questions
`,
          },

          {
            role: "user",

            content: `
RESUME:

${resumeText}

JOB DESCRIPTION:

${jdText}
`,
          },
        ],
      });

    return Response.json({

      interviewQuestions:
        completion.choices[0]
          .message.content || "",
    });

  } catch (error: unknown) {

    console.log(error);

    return Response.json({

      error:
        error instanceof Error
          ? error.message
          : "Interview generation failed",
    });
  }
}