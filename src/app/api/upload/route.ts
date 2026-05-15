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

      if (jdMatch && !resumeMatch) {

        missingKeywords.push(
          mainKeyword
        );
      }
    });

    // =========================
    // STRENGTHS
    // =========================

    if (resumeText.length > 1000) {

      strengths.push(
        "Good resume content length"
      );
    }

    if (matchedKeywords.length > 8) {

      strengths.push(
        "Strong technical keyword coverage"
      );
    }

    if (
      lowerResume.includes("project")
    ) {

      strengths.push(
        "Projects section detected"
      );
    }

    // =========================
    // WEAKNESSES
    // =========================

    if (missingKeywords.length > 5) {

      weaknesses.push(
        "Missing important job keywords"
      );
    }

    if (resumeText.length < 500) {

      weaknesses.push(
        "Resume content too short"
      );
    }

    // =========================
    // FINAL SCORE
    // =========================

    atsScore =
      Math.min(100, atsScore);

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
You are an ATS resume analyzer.

Analyze the resume professionally.

Give:
- ATS feedback
- improvements
- missing skills
- recruiter suggestions
- resume optimization tips
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
    // SAVE TO SUPABASE
    // =========================

    await supabase
      .from("resume_analyses")
      .insert({

        ats_score: atsScore,

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

      matchedKeywords,

      missingKeywords,

      strengths,

      weaknesses,

      aiFeedback,
    });

  } catch (error: unknown) {

    console.log(error);

    return Response.json({

      error:
        error instanceof Error
          ? error.message
          : "Upload failed",
    });
  }
}