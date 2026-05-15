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
    // JOB DESCRIPTION PDF
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
    // AI ANALYSIS
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
You are an advanced ATS scanner.

Analyze:
- resume quality
- technical skills
- ATS strength
- recruiter readability
- missing skills
- improvements

Give:
- ATS score out of 100
- Job match percentage
- Suggestions
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

    const aiFeedback =
      completion.choices[0]
        .message.content || "";

    // =========================
    // BASIC SCORING
    // =========================

    const atsScore =
      Math.min(
        95,
        Math.max(
          60,
          Math.floor(
            resumeText.length / 25
          )
        )
      );

    const jobMatch =
      jdText.length > 0
        ? Math.min(
            95,
            Math.max(
              50,
              Math.floor(
                atsScore - 5
              )
            )
          )
        : 0;

    return Response.json({

      atsScore,

      jobMatch,

      aiFeedback,
    });

  } catch (error: unknown) {

    console.log(error);

    return Response.json({

      error:
        error instanceof Error
          ? error.message
          : "Analyze failed",
    });
  }
}