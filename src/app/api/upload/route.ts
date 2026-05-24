import OpenAI from "openai";
import pdfParse from "pdf-parse";

import {
  getEmbedding,
  cosineSimilarity,
} from "@/lib/semantic";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {

  try {

    const formData =
      await req.formData();

    const resumeFile =
      formData.get(
        "resume"
      ) as File;

    const jdFile =
      formData.get(
        "jdFile"
      ) as File;

    if (!resumeFile) {

      return Response.json({

        error:
          "Resume missing",

      });

    }

    // ===================
    // RESUME PDF
    // ===================

    const resumeBytes =
      await resumeFile
      .arrayBuffer();

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

      .replace(
        /\n/g,
        " "
      )

      .replace(
        /\s+/g,
        " "
      )

      .trim();

    // ===================
    // JD PDF
    // ===================

    let jdText = "";

    if (jdFile) {

      const jdBytes =
        await jdFile
        .arrayBuffer();

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

        .replace(
          /\n/g,
          " "
        )

        .replace(
          /\s+/g,
          " "
        )

        .trim();

    }

    // ===================
    // SEMANTIC SEARCH
    // ===================

    let semanticScore =
      0;

    if (

      resumeText &&

      jdText

    ){

      const resumeEmbedding =

        await getEmbedding(

          resumeText

        );

      const jdEmbedding =

        await getEmbedding(

          jdText

        );

      semanticScore =

        cosineSimilarity(

          resumeEmbedding,

          jdEmbedding

        );

    }

    const jobMatch =

      jdText

      ?

      Math.round(

        semanticScore * 100

      )

      :

      0;

    const atsScore =

      jdText

      ?

      Math.min(

        100,

        Math.max(

          35,

          Math.round(

            jobMatch *

            0.8 +

            20

          )

        )

      )

      :

      75;

    let resumeLevel =
    "Beginner";

    if(

    atsScore >= 85

    ){

    resumeLevel =
    "Advanced";

    }

    else if(

    atsScore >= 60

    ){

    resumeLevel =
    "Intermediate";

    }

    else{

    resumeLevel =
    "Beginner";

    }

    // ===================
    // DEBUG LOGS
    // ===================

    console.log(

      "Resume Length:",

      resumeText.length

    );

    console.log(

      "JD Length:",

      jdText.length

    );

    console.log(

      "Semantic Score:",

      semanticScore

    );

    console.log(

      "Job Match:",

      jobMatch

    );

    console.log(

      "ATS Score:",

      atsScore

    );

    // ===================
    // SKILLS
    // ===================

    const skillPool = [

      "python",
      "java",
      "javascript",
      "typescript",
      "react",
      "next.js",
      "node.js",
      "sql",
      "mongodb",
      "docker",
      "kubernetes",
      "aws",
      "git",
      "machine learning",
      "deep learning",
      "nlp",
      "llm",
      "langchain",
      "transformers",
      "bert",
      "minilm",
      "agentic ai",

    ];

    const matchedSkills =

      skillPool.filter(

        (skill)=>

        resumeText

        .toLowerCase()

        .includes(

          skill

        )

      );

    const missingSkills =

      jdText

      ?

      skillPool.filter(

        (skill)=>

        jdText

        .toLowerCase()

        .includes(

          skill

        )

        &&

        !

        resumeText

        .toLowerCase()

        .includes(

          skill

        )

      )

      :

      [];

    const scoreBreakdown = [

      `Semantic Match : ${jobMatch}%`,

      `Matched Skills : ${matchedSkills.length}`,

      `Missing Skills : ${missingSkills.length}`,

      `Resume Level : ${resumeLevel}`,

    ];

    // ===================
    // AI ANALYSIS
    // ===================

    const completion =

      await client.chat

      .completions.create({

      model:

      "llama-3.1-8b-instant",

      temperature:

      0.4,

      messages:[

      {

      role:"system",

      content:`

Analyze resume.

Give ATS feedback.

Keep concise.

`

      },

      {

      role:"user",

      content:`

RESUME

${resumeText}

JD

${jdText}

`

      }

      ]

    });

    const aiFeedback =

      completion

      .choices[0]

      ?.message

      ?.content

      ||

      "No feedback";

    return Response.json({

      atsScore,

      jobMatch,

      resumeLevel,

      matchedSkills,

      missingSkills,

      scoreBreakdown,

      aiFeedback,

    });

  }

  catch(error){

    console.log(error);

    return Response.json({

      error:

      error instanceof Error

      ?

      error.message

      :

      "Analyze failed",

    });

  }

}