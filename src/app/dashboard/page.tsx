"use client";

import { useState } from "react";

export default function DashboardPage() {

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [jdFile, setJdFile] =
    useState<File | null>(null);

  const [atsScore, setAtsScore] =
    useState(0);

  const [jobMatch, setJobMatch] =
    useState(0);

  const [aiFeedback, setAiFeedback] =
    useState("");

  const [interviewQuestions, setInterviewQuestions] =
    useState("");

  const [rewrittenResume, setRewrittenResume] =
    useState("");

  // =========================
  // ANALYZE
  // =========================

  const analyzeResume =
    async () => {

      try {

        if (!selectedFile) {

          alert(
            "Upload resume"
          );

          return;
        }

        const formData =
          new FormData();

        formData.append(
          "resume",
          selectedFile
        );

        if (jdFile) {

          formData.append(
            "jdFile",
            jdFile
          );
        }

        const response =
          await fetch(
            "/api/upload",
            {

              method: "POST",

              body: formData,
            }
          );

        const data =
          await response.json();

        setAtsScore(
          data.atsScore || 0
        );

        setJobMatch(
          data.jobMatch || 0
        );

        setAiFeedback(
          data.aiFeedback || ""
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // INTERVIEW
  // =========================

  const generateInterview =
    async () => {

      try {

        if (!selectedFile) {

          alert(
            "Upload resume"
          );

          return;
        }

        const formData =
          new FormData();

        formData.append(
          "resume",
          selectedFile
        );

        if (jdFile) {

          formData.append(
            "jdFile",
            jdFile
          );
        }

        const response =
          await fetch(
            "/api/interview",
            {

              method: "POST",

              body: formData,
            }
          );

        const data =
          await response.json();

        setInterviewQuestions(
          data.interviewQuestions || ""
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================
  // REWRITE
  // =========================

  const rewriteResume =
    async () => {

      try {

        if (!selectedFile) {

          alert(
            "Upload resume"
          );

          return;
        }

        const formData =
          new FormData();

        formData.append(
          "resume",
          selectedFile
        );

        const response =
          await fetch(
            "/api/rewrite",
            {

              method: "POST",

              body: formData,
            }
          );

        const data =
          await response.json();

        setRewrittenResume(
          data.rewrittenResume || ""
        );

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        AI Resume Assistant
      </h1>

      {/* Upload Section */}

      <div className="bg-[#0f172a] p-8 rounded-3xl mb-8">

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setSelectedFile(
                e.target.files?.[0] || null
              )
            }
            className="bg-white text-black p-4 rounded-xl"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setJdFile(
                e.target.files?.[0] || null
              )
            }
            className="bg-white text-black p-4 rounded-xl"
          />
        </div>

        <div className="flex gap-6 mt-8">

          <button
            onClick={analyzeResume}
            className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-2xl text-2xl font-semibold"
          >
            Analyze Resume
          </button>

          <button
            onClick={generateInterview}
            className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl text-2xl font-semibold"
          >
            Interview Prep
          </button>

          <button
            onClick={rewriteResume}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl text-2xl font-semibold"
          >
            Rewrite Resume
          </button>
        </div>
      </div>

      {/* Scores */}

      <div className="grid md:grid-cols-2 gap-8 mb-8">

        <div className="bg-[#0f172a] p-8 rounded-3xl">

          <h2 className="text-3xl mb-4">
            ATS Score
          </h2>

          <div className="text-7xl text-cyan-400 font-bold">
            {atsScore}%
          </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-3xl">

          <h2 className="text-3xl mb-4">
            Job Match
          </h2>

          <div className="text-7xl text-green-400 font-bold">
            {jobMatch}%
          </div>
        </div>
      </div>

      {/* AI Suggestions */}

      <div className="bg-[#0f172a] p-8 rounded-3xl mb-8">

        <h2 className="text-3xl mb-6">
          AI Suggestions
        </h2>

        <div className="whitespace-pre-wrap leading-8 text-gray-300">
          {aiFeedback}
        </div>
      </div>

      {/* Interview Questions */}

      <div className="bg-[#0f172a] p-8 rounded-3xl mb-8">

        <h2 className="text-3xl mb-6">
          Interview Questions
        </h2>

        <div className="whitespace-pre-wrap leading-8 text-gray-300">
          {interviewQuestions}
        </div>
      </div>

      {/* Rewrite */}

      <div className="bg-[#0f172a] p-8 rounded-3xl">

        <h2 className="text-3xl mb-6">
          Rewritten Resume
        </h2>

        <div className="whitespace-pre-wrap leading-8 text-gray-300">
          {rewrittenResume}
        </div>
      </div>
    </div>
  );
}