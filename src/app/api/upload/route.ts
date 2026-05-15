export const runtime = "nodejs";

import OpenAI from "openai";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { supabase } from "@/app/lib/supabase";

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
    // JOB DESCRIPTION PDF
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
    // NORMALIZE TEXT
    // =========================

    const normalize = (
      text: string
    ) => {

      return text
        .toLowerCase()
        .replace(
          /[^a-z0-9\s]/g,
          " "
        );
    };

    const resumeWords =
      normalize(resumeText);

    const jdWords =
      normalize(jobDescription);

    // =========================
    // KEYWORDS
    // =========================

    const keywordMap = [

      "react",
      "nextjs",
      "typescript",
      "javascript",
      "nodejs",
      "express",
      "mongodb",
      "sql",
      "tailwind",
      "docker",
      "aws",
      "redis",
      "python",
      "java",
      "git",
      "rest api",
      "firebase",
      "supabase",
      "machine learning",
      "ai",
      "data structures",
      "algorithms",
      "problem solving",
      "leadership",
      "communication",
      "teamwork",
    ];

    const matchedKeywords:
      string[] = [];

    const missingKeywords:
      string[] = [];

    keywordMap.forEach(
      (skill) => {

        const inResume =
          resumeWords.includes(
            skill
          );

        const inJD =
          jdWords.includes(
            skill
          );

        if (
          inResume &&
          inJD
        ) {

          matchedKeywords.push(
            skill
          );
        }

        if (
          inJD &&
          !inResume
        ) {

          missingKeywords.push(
            skill
          );
        }
      }
    );

    // =========================
    // ATS SCORE
    // =========================

    const totalJDKeywords =
      matchedKeywords.length +
      missingKeywords.length;

    const atsScore =
      totalJDKeywords === 0
        ? 50
        : Math.round(

            (
              matchedKeywords.length /

              totalJDKeywords
            ) * 100
          );

    const jobMatch =
      atsScore;

    // =========================
    // RESUME LEVEL
    // =========================

    let resumeLevel =
      "Beginner";

    if (atsScore >= 80) {

      resumeLevel =
        "Advanced";

    } else if (
      atsScore >= 60
    ) {

      resumeLevel =
        "Intermediate";
    }

    // =========================
    // STRENGTHS
    // =========================

    const strengths:
      string[] = [];

    if (
      matchedKeywords.length > 8
    ) {

      strengths.push(
        "Strong technical skill match"
      );
    }

    if (
      resumeText.length > 1500
    ) {

      strengths.push(
        "Detailed resume content"
      );
    }

    if (
      resumeWords.includes(
        "project"
      )
    ) {

      strengths.push(
        "Projects section detected"
      );
    }

    if (
      resumeWords.includes(
        "internship"
      )
    ) {

      strengths.push(
        "Internship experience included"
      );
    }

    // =========================
    // WEAKNESSES
    // =========================

    const weaknesses:
      string[] = [];

    if (
      missingKeywords.length > 5
    ) {

      weaknesses.push(
        "Missing important job keywords"
      );
    }

    if (
      resumeText.length < 800
    ) {

      weaknesses.push(
        "Resume content is too short"
      );
    }

    if (
      !resumeWords.includes(
        "achievement"
      )
    ) {

      weaknesses.push(
        "Achievements are not highlighted"
      );
    }

    // =========================
    // AI FEEDBACK
    // =========================

    const completion =
      await client.chat.completions.create({

        model:
          "llama-3.1-8b-instant",

        temperature: 0.5,

        messages: [

          {
            role: "system",

            content: `
You are an expert ATS analyzer and recruiter.

Analyze the resume against the job description.

Return:
1. ATS feedback
2. Missing skills
3. Resume improvements
4. Strong points
5. Weak points
6. Better project wording
7. Recruiter suggestions

Keep response professional and structured.
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

    const aiFeedback =
      completion.choices[0]
        .message.content || "";

    // =========================
    // SAVE TO DATABASE
    // =========================

    await supabase
      .from(
        "resume_analyses"
      )
      .insert({

        ats_score:
          atsScore,

        job_match:
          jobMatch,

        resume_level:
          resumeLevel,

        matched_keywords:
          matchedKeywords,

        missing_keywords:
          missingKeywords,

        strengths,

        weaknesses,

        ai_feedback:
          aiFeedback,
      });

    // =========================
    // RESPONSE
    // =========================

    return Response.json({

      success: true,

      atsScore,

      jobMatch,

      resumeLevel,

      matchedKeywords,

      missingKeywords,

      strengths,

      weaknesses,

      aiFeedback,
    });

  } catch (
    error: unknown
  ) {

    console.log(error);

    return Response.json({

      error:
        error instanceof Error
          ? error.message
          : "Upload failed",
    });
  }
}