import OpenAI from "openai";
import pdfParse from "pdf-parse";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {

  try {

    const formData =
      await req.formData();

    const resumeFile =
      formData.get("resume") as File;

    const jdFile =
      formData.get("jdFile") as File;

    if (!resumeFile) {

      return Response.json({
        error: "Resume missing",
      });
    }

    // =========================
    // RESUME PDF
    // =========================

    const resumeBytes =
      await resumeFile.arrayBuffer();

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
    // AI QUESTIONS
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
- HR questions
- technical questions
- coding questions
- project questions
- scenario questions

based on resume and job description.
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

    const interviewQuestions =
      completion.choices[0]
        .message.content || "";

    return Response.json({

      interviewQuestions,
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