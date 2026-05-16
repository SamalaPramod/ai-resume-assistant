import OpenAI from "openai";
import pdfParse from "pdf-parse";
import natural from "natural";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const tokenizer =
  new natural.WordTokenizer();

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
        .toLowerCase()
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
          .toLowerCase()
          .trim();
    }

    // =========================
    // TOKENIZATION
    // =========================

    const resumeTokens =
      tokenizer.tokenize(
        resumeText
      );

    const jdTokens =
      tokenizer.tokenize(
        jdText
      );

    // =========================
    // IMPORTANT SKILLS
    // =========================

    const importantSkills = [

      "python",
      "java",
      "javascript",
      "typescript",
      "react",
      "nextjs",
      "node",
      "express",
      "sql",
      "mongodb",
      "mysql",
      "postgresql",
      "machine",
      "learning",
      "deep",
      "nlp",
      "bert",
      "tensorflow",
      "pytorch",
      "api",
      "docker",
      "aws",
      "langchain",
      "rag",
      "vector",
      "algorithms",
      "data",
      "structures",
      "problem",
      "solving",
    ];

    // =========================
    // MATCHING
    // =========================

    let matchedSkills: string[] = [];

    let missingSkills: string[] = [];

    importantSkills.forEach((skill) => {

      const jdHasSkill =
        jdTokens.includes(skill);

      const resumeHasSkill =
        resumeTokens.includes(skill);

      if (
        jdHasSkill &&
        resumeHasSkill
      ) {

        matchedSkills.push(skill);

      } else if (
        jdHasSkill &&
        !resumeHasSkill
      ) {

        missingSkills.push(skill);
      }
    });

    // =========================
    // JOB MATCH SCORE
    // =========================

    const totalRequiredSkills =
      matchedSkills.length +
      missingSkills.length;

    let jobMatch =
      totalRequiredSkills > 0

        ? Math.round(
            (
              matchedSkills.length /
              totalRequiredSkills
            ) * 100
          )

        : 0;

    // =========================
    // SECTION ANALYSIS
    // =========================

    let sectionScore = 0;

    const importantSections = [

      "skills",
      "projects",
      "experience",
      "education",
      "certification",
      "internship",
    ];

    importantSections.forEach((section) => {

      if (
        resumeText.includes(section)
      ) {

        sectionScore += 4;
      }
    });

    // =========================
    // PROJECT QUALITY
    // =========================

    let projectScore = 0;

    const projectKeywords = [

      "built",
      "developed",
      "implemented",
      "designed",
      "optimized",
      "deployed",
      "integrated",
      "created",
    ];

    projectKeywords.forEach((word) => {

      if (
        resumeText.includes(word)
      ) {

        projectScore += 2;
      }
    });

    // =========================
    // FINAL ATS SCORE
    // =========================

    let atsScore =

      Math.round(

        (
          jobMatch * 0.55 +
          sectionScore * 1.5 +
          projectScore * 1.2
        )
      );

    atsScore =
      Math.max(
        25,
        Math.min(atsScore, 100)
      );

    // =========================
    // RESUME LEVEL
    // =========================

    let resumeLevel =
      "Beginner";

    if (atsScore >= 85) {

      resumeLevel =
        "Advanced";

    } else if (atsScore >= 70) {

      resumeLevel =
        "Intermediate";
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
You are a professional ATS scanner and recruiter.

Analyze:
- strengths
- weaknesses
- recruiter readability
- ATS optimization
- missing skills
- project quality
- improvement suggestions
`,
          },

          {
            role: "user",

            content: `
RESUME:

${resumeText}

JOB DESCRIPTION:

${jdText}

MATCHED SKILLS:

${matchedSkills.join(", ")}

MISSING SKILLS:

${missingSkills.join(", ")}
`,
          },
        ],
      });

    const aiFeedback =
      completion.choices[0]
        .message.content || "";

    // =========================
    // RESPONSE
    // =========================

    return Response.json({

      atsScore,

      jobMatch,

      resumeLevel,

      matchedSkills,

      missingSkills,

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