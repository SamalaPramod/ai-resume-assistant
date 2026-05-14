export const runtime = "nodejs";

import OpenAI from "openai";
import { supabase } from "@/app/lib/supabase";

const pdfParse =
  require("pdf-parse");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL:
    "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {

  try {

    // =========================
    // GET FORM DATA
    // =========================

    const data =
      await req.formData();

    const file =
      data.get("resume") as File;

    // =========================
    // JOB DESCRIPTION
    // =========================

    let jobDescription =
      (data.get(
        "jobDescription"
      ) as string) || "";

    // =========================
    // JD PDF
    // =========================

    const jdFile =
      data.get("jdFile") as File;

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

    let resumeText =
      parsed.text || "";

    // =========================
    // CLEAN RESUME TEXT
    // =========================

    resumeText =
      resumeText
        .replace(/\s+/g, " ")
        .trim();

    // =========================
    // JD PDF PARSING
    // =========================

    if (jdFile) {

      const jdBytes =
        await jdFile.arrayBuffer();

      const jdBuffer =
        Buffer.from(jdBytes);

      const jdParsed =
        await pdfParse(jdBuffer);

      const jdText =
        jdParsed.text || "";

      jobDescription =
        jdText
          .replace(/\s+/g, " ")
          .trim();
    }

    // =========================
    // ATS ENGINE
    // =========================

    let atsScore = 0;

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    const lowerResume =
      resumeText.toLowerCase();

    const lowerJD =
      jobDescription.toLowerCase();

    const keywordMap = {

      react: [
        "react",
        "reactjs",
        "react.js",
      ],

      "next.js": [
        "next.js",
        "nextjs",
      ],

      typescript: [
        "typescript",
      ],

      javascript: [
        "javascript",
      ],

      tailwind: [
        "tailwind",
      ],

      "node.js": [
        "node.js",
        "nodejs",
      ],

      express: [
        "express",
      ],

      mongodb: [
        "mongodb",
      ],

      sql: [
        "sql",
        "mysql",
        "postgresql",
      ],

      "rest api": [
        "rest api",
        "restful api",
      ],

      github: [
        "github",
        "git",
      ],

      docker: [
        "docker",
      ],

      aws: [
        "aws",
        "azure",
        "gcp",
      ],

      redis: [
        "redis",
      ],

      python: [
        "python",
      ],

      java: [
        "java",
      ],

      ai: [
        "ai",
        "machine learning",
        "tensorflow",
        "keras",
      ],

      experience: [
        "experience",
        "internship",
      ],

      skills: [
        "skills",
      ],

      leadership: [
        "leadership",
      ],

      "problem solving": [
        "problem solving",
        "leetcode",
        "codeforces",
      ],
    };

    // =========================
    // KEYWORD MATCHING
    // =========================

    Object.entries(keywordMap)
    .forEach(([mainKeyword, variants]) => {

      const resumeMatch =
        variants.some((word) =>
          lowerResume.includes(word)
        );

      const jdMatch =
        variants.some((word) =>
          lowerJD.includes(word)
        );

      if (resumeMatch) {

        matchedKeywords.push(
          mainKeyword
        );

        atsScore += 4;
      }

      if (
        jdMatch &&
        !resumeMatch
      ) {

        missingKeywords.push(
          mainKeyword
        );
      }
    });

    // =========================
    // EXPERIENCE ANALYSIS
    // =========================

    const internshipCount =
      (
        lowerResume.match(
          /intern/g
        ) || []
      ).length;

    if (internshipCount >= 1) {

      atsScore += 10;

      strengths.push(
        "Internship experience found"
      );

    } else {

      weaknesses.push(
        "No internship experience"
      );
    }

    // =========================
    // PROJECT ANALYSIS
    // =========================

    const projectCount =
      (
        lowerResume.match(
          /project/g
        ) || []
      ).length;

    if (projectCount >= 2) {

      atsScore += 15;

      strengths.push(
        "Strong project portfolio"
      );

    } else {

      weaknesses.push(
        "Need more technical projects"
      );
    }

    // =========================
    // AI/ML ANALYSIS
    // =========================

    if (
      lowerResume.includes(
        "tensorflow"
      ) ||
      lowerResume.includes(
        "machine learning"
      )
    ) {

      atsScore += 15;

      strengths.push(
        "Strong AI/ML profile"
      );
    }

    // =========================
    // PROBLEM SOLVING
    // =========================

    if (
      lowerResume.includes(
        "leetcode"
      ) ||
      lowerResume.includes(
        "codeforces"
      )
    ) {

      atsScore += 10;

      strengths.push(
        "Excellent problem solving"
      );
    }

    // =========================
    // EDUCATION QUALITY
    // =========================

    if (
      lowerResume.includes(
        "nit"
      ) ||
      lowerResume.includes(
        "iit"
      )
    ) {

      atsScore += 10;

      strengths.push(
        "Strong academic profile"
      );
    }

    // =========================
    // JOB MATCH SCORE
    // =========================

    let jobMatchScore = 0;

    const totalKeywords =
      matchedKeywords.length +
      missingKeywords.length;

    if (totalKeywords > 0) {

      jobMatchScore =
        Math.floor(
          (
            matchedKeywords.length /
            totalKeywords
          ) * 100
        );
    }

    atsScore +=
      Math.floor(
        jobMatchScore / 4
      );

    // =========================
    // SCORE LIMIT
    // =========================

    if (atsScore > 100) {
      atsScore = 100;
    }

    // =========================
    // RESUME LEVEL
    // =========================

    let resumeLevel =
      "Needs Improvement";

    if (atsScore >= 85) {

      resumeLevel =
        "Recruiter Ready";

    } else if (
      atsScore >= 70
    ) {

      resumeLevel =
        "Strong Resume";

    } else if (
      atsScore >= 50
    ) {

      resumeLevel =
        "Intermediate Resume";
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
You are a professional ATS reviewer and world-class resume writer.

Provide:
- ATS improvements
- missing skills
- recruiter analysis
- better projects
- stronger bullet points
- detailed resume improvements
- professional rewriting suggestions
- FAANG-level resume recommendations
`,
          },

          {
            role: "user",

            content: `
JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

ATS SCORE:
${atsScore}

JOB MATCH SCORE:
${jobMatchScore}

MATCHED KEYWORDS:
${matchedKeywords.join(", ")}

MISSING KEYWORDS:
${missingKeywords.join(", ")}

STRENGTHS:
${strengths.join(", ")}

WEAKNESSES:
${weaknesses.join(", ")}
`,
          },
        ],
      });

    const aiSuggestions =
      completion
        .choices[0]
        .message
        .content || "";

    // =========================
    // SAVE HISTORY
    // =========================

    await supabase
      .from("resume_history")
      .insert({
        filename: file.name,
        ats_score: atsScore,
        job_match_score:
          jobMatchScore,
        analysis:
          aiSuggestions,
      });

    // =========================
    // FINAL RESPONSE
    // =========================

    return Response.json({

      atsScore,

      jobMatchScore,

      resumeLevel,

      matchedKeywords,

      missingKeywords,

      strengths,

      weaknesses,

      analysis:
        aiSuggestions,
    });

  } catch (error: any) {

    console.log(
      "DETAILED ERROR:",
      error
    );

    return Response.json({

      error:
        error.message ||
        "Processing failed",
    });
  }
}