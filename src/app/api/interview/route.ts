export const runtime = "nodejs";

import OpenAI from "openai";

import { supabase }
from "@/app/lib/supabase";

const pdfParse =
  require("pdf-parse");

const client = new OpenAI({

  apiKey:
    process.env.GROQ_API_KEY,

  baseURL:
    "https://api.groq.com/openai/v1",
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

    const jobDescription =
      (data.get(
        "jobDescription"
      ) as string) || "";

    if (!file) {

      return Response.json({

        error:
          "Resume not uploaded",
      });
    }

    // =========================
    // READ PDF
    // =========================

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const parsed =
      await pdfParse(buffer);

    const resumeText =
      parsed.text || "";

    // =========================
    // AI GENERATION
    // =========================

    const completion =
      await client.chat.completions.create({

        // BIG MODEL

        model:
          "llama-3.3-70b-versatile",

        // MORE VARIETY

        temperature: 0.9,

        // IMPORTANT
        // ALLOW HUGE OUTPUT

        max_tokens: 8000,

        messages: [

          {
            role: "system",

            content: `
You are a senior FAANG interviewer.

Generate:

1. HR Questions → EXACTLY 10
2. Technical Questions → EXACTLY 10
3. Project Questions → EXACTLY 10
4. Behavioral Questions → EXACTLY 10
5. Coding Questions → EXACTLY 10

TOTAL = 50 QUESTIONS.

VERY IMPORTANT:
- Every section MUST contain exactly 10 questions.
- Do NOT generate fewer questions.
- Do NOT skip sections.
- Generate NEW questions every time.
- Avoid repeating previous questions.
- Questions must depend on:
  - resume
  - projects
  - job description
  - skills

For EVERY question provide:
- Question
- Professional Answer
- Key Points

Make answers concise but professional.

Format EXACTLY:

# HR QUESTIONS

1. Question:
Answer:
Key Points:

2. Question:
Answer:
Key Points:

Continue until 10.

# TECHNICAL QUESTIONS

1. Question:
Answer:
Key Points:

Continue until 10.

# PROJECT QUESTIONS

1. Question:
Answer:
Key Points:

Continue until 10.

# BEHAVIORAL QUESTIONS

1. Question:
Answer:
Key Points:

Continue until 10.

# CODING QUESTIONS

1. Question:
Answer:
Key Points:

Continue until 10.
`,
          },

          {
            role: "user",

            content: `
JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}
`,
          },
        ],
      });

    const interviewContent =
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

        filename:
          file.name,

        interview_content:
          interviewContent,

        job_description:
          jobDescription,
      });

    // =========================
    // RESPONSE
    // =========================

    return Response.json({

      interviewContent,
    });

  } catch (error: any) {

    console.log(error);

    return Response.json({

      error:
        error.message ||
        "Failed to generate interview prep",
    });
  }
}