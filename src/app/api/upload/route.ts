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
        .replace(/[^\x20-\x7E]/g, "")
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
          .replace(/[^\x20-\x7E]/g, "")
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
You are an advanced ATS scanner and recruiter.

Analyze:
- resume quality
- ATS compatibility
- recruiter readability
- technical skills
- missing skills
- projects
- strengths
- weak areas

Provide professional suggestions.
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
    // KEYWORD MATCHING
    // =========================

    const resumeWords =
      resumeText
        .toLowerCase()
        .split(/\W+/);

    const jdWords =
      jdText
        .toLowerCase()
        .split(/\W+/);

    // Remove duplicates

    const uniqueResumeWords =
      [...new Set(resumeWords)];

    const uniqueJDWords =
      [...new Set(jdWords)];

    // Filter important words

    const filteredJDWords =
      uniqueJDWords.filter(

        (word) =>

          word.length > 3
      );

    // Find matches

    const matchedKeywords =
      filteredJDWords.filter(

        (word) =>

          uniqueResumeWords.includes(word)
      );

    // =========================
    // JOB MATCH
    // =========================

    const jobMatch =
      jdText.length > 0

        ? Math.round(

            (
              matchedKeywords.length /

              Math.max(
                filteredJDWords.length,
                1
              )
            ) * 100
          )

        : 0;

    // =========================
    // ATS SCORE
    // =========================

    let atsScore =
      jobMatch;

    // BONUS POINTS

    if (
      resumeText
        .toLowerCase()
        .includes("project")
    ) {

      atsScore += 5;
    }

    if (
      resumeText
        .toLowerCase()
        .includes("experience")
    ) {

      atsScore += 5;
    }

    if (
      resumeText
        .toLowerCase()
        .includes("skills")
    ) {

      atsScore += 5;
    }

    // LIMIT SCORE

    atsScore =
      Math.min(100, atsScore);

    // =========================
    // RESUME LEVEL
    // =========================

    let resumeLevel =
      "Beginner";

    if (
      atsScore >= 85
    ) {

      resumeLevel =
        "Advanced";

    } else if (
      atsScore >= 70
    ) {

      resumeLevel =
        "Intermediate";
    }

    // =========================
    // RESPONSE
    // =========================

    return Response.json({

      atsScore,

      jobMatch,

      resumeLevel,

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