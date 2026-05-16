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

        error:
          "Resume missing",
      });
    }

    // =========================
    // RESUME PDF
    // =========================

    const resumeBytes =
      await resumeFile.arrayBuffer();

    const resumeBuffer =
      Buffer.from(
        resumeBytes
      );

    const parsedResume =
      await pdfParse(
        resumeBuffer
      );

    let resumeText =
      parsedResume.text || "";

    resumeText =
      resumeText
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[^\x20-\x7E]/g, "")
        .trim();

    // =========================
    // JD PDF
    // =========================

    let jdText = "";

    if (jdFile) {

      const jdBytes =
        await jdFile.arrayBuffer();

      const jdBuffer =
        Buffer.from(
          jdBytes
        );

      const parsedJD =
        await pdfParse(
          jdBuffer
        );

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
    // LOWERCASE
    // =========================

    const lowerResume =
      resumeText.toLowerCase();

    const lowerJD =
      jdText.toLowerCase();

    // =========================
    // KEYWORDS
    // =========================

    const importantKeywords = [

      // Languages

      "python",
      "java",
      "javascript",
      "typescript",
      "c++",
      "sql",

      // AI / ML

      "machine learning",
      "deep learning",
      "nlp",
      "bert",
      "tensorflow",
      "pytorch",
      "llm",
      "langchain",
      "rag",
      "vector",

      // Web

      "react",
      "nextjs",
      "node",
      "express",
      "api",
      "rest api",

      // Databases

      "mysql",
      "mongodb",
      "postgresql",

      // Cloud

      "aws",
      "docker",
      "kubernetes",

      // Concepts

      "data structures",
      "algorithms",
      "problem solving",
      "system design",

      // Resume Sections

      "project",
      "experience",
      "skills",
      "education",
    ];

    // =========================
    // MATCHING
    // =========================

    let matchedKeywords = 0;

    let missingKeywords: string[] = [];

    importantKeywords.forEach(

      (keyword) => {

        const inJD =
          lowerJD.includes(
            keyword
          );

        const inResume =
          lowerResume.includes(
            keyword
          );

        if (
          inJD &&
          inResume
        ) {

          matchedKeywords++;

        } else if (
          inJD &&
          !inResume
        ) {

          missingKeywords.push(
            keyword
          );
        }
      }
    );

    // =========================
    // JOB MATCH
    // =========================

    const totalJDKeywords =
      importantKeywords.filter(

        (keyword) =>

          lowerJD.includes(
            keyword
          )
      ).length;

    let jobMatch =
      totalJDKeywords > 0

        ? Math.round(

            (
              matchedKeywords /

              totalJDKeywords
            ) * 100
          )

        : 0;

    // =========================
    // ATS SCORE
    // =========================

    let atsScore =
      jobMatch;

    // =========================
    // BONUS POINTS
    // =========================

    const bonusKeywords = [

      "project",
      "experience",
      "skills",
      "education",
      "achievement",
      "internship",
      "certification",
    ];

    bonusKeywords.forEach(

      (word) => {

        if (
          lowerResume.includes(
            word
          )
        ) {

          atsScore += 3;
        }
      }
    );

    // =========================
    // AI/ML BONUS
    // =========================

    const aiKeywords = [

      "bert",
      "nlp",
      "tensorflow",
      "pytorch",
      "machine learning",
      "deep learning",
    ];

    aiKeywords.forEach(

      (word) => {

        if (
          lowerResume.includes(
            word
          )
        ) {

          atsScore += 2;
        }
      }
    );

    // =========================
    // PENALTIES
    // =========================

    if (
      !lowerResume.includes(
        "project"
      )
    ) {

      atsScore -= 10;
    }

    if (
      !lowerResume.includes(
        "skills"
      )
    ) {

      atsScore -= 10;
    }

    if (
      resumeText.length < 1200
    ) {

      atsScore -= 10;
    }

    // =========================
    // LIMITS
    // =========================

    atsScore =
      Math.max(
        20,
        Math.min(
          atsScore,
          100
        )
      );

    jobMatch =
      Math.max(
        0,
        Math.min(
          jobMatch,
          100
        )
      );

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
You are an expert ATS scanner and recruiter.

Analyze:
- ATS optimization
- technical skills
- recruiter readability
- missing skills
- project quality
- resume structure
- improvements

Provide:
- strengths
- weaknesses
- detailed suggestions
`,
          },

          {
            role: "user",

            content: `
RESUME:

${resumeText}

JOB DESCRIPTION:

${jdText}

MISSING KEYWORDS:

${missingKeywords.join(", ")}
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

      matchedKeywords,

      missingKeywords,

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