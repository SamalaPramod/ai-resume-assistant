"use client";

import { useState } from "react";

export default function DashboardPage() {

  const [resumeFile, setResumeFile] =
    useState<File | null>(null);

  const [jdFile, setJdFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [atsScore, setAtsScore] =
    useState(0);

  const [jobMatch, setJobMatch] =
    useState(0);

  const [aiSuggestions, setAiSuggestions] =
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

        if (!resumeFile) {

          alert(
            "Please upload resume PDF"
          );

          return;
        }

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          resumeFile
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

        setAiSuggestions(
          data.aiFeedback || ""
        );

      } catch (error) {

        console.log(error);

        alert(
          "Analyze failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // INTERVIEW
  // =========================

  const generateInterviewQuestions =
    async () => {

      try {

        if (!resumeFile) {

          alert(
            "Please upload resume PDF"
          );

          return;
        }

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          resumeFile
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

        alert(
          "Interview generation failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // REWRITE
  // =========================

  const rewriteResume =
    async () => {

      try {

        if (!resumeFile) {

          alert(
            "Please upload resume PDF"
          );

          return;
        }

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          resumeFile
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

        alert(
          "Rewrite failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        AI Resume Assistant
      </h1>

      {/* Upload Section */}

      <div className="bg-[#0f172a] p-8 rounded-3xl mb-8">

        <div className="grid md:grid-cols-2 gap-8">

          {/* Resume Upload */}

          <div>

            <label className="block text-xl mb-4">
              Upload Resume PDF
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setResumeFile(
                  e.target.files?.[0] || null
                )
              }
              className="bg-white text-black p-4 rounded-xl w-full"
            />
          </div>

          {/* JD Upload */}

          <div>

            <label className="block text-xl mb-4">
              Upload Job Description PDF
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setJdFile(
                  e.target.files?.[0] || null
                )
              }
              className="bg-white text-black p-4 rounded-xl w-full"
            />
          </div>
        </div>

        {/* Buttons */}

        <div className="flex flex-wrap gap-6 mt-10">

          <button
            onClick={analyzeResume}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-2xl text-xl font-semibold"
          >
            Analyze Resume
          </button>

          <button
            onClick={
              generateInterviewQuestions
            }
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl text-xl font-semibold"
          >
            Interview Questions
          </button>

          <button
            onClick={rewriteResume}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl text-xl font-semibold"
          >
            Rewrite Resume
          </button>
        </div>

        {/* Loading */}

        {loading && (

          <p className="mt-6 text-cyan-400 text-lg">
            Processing...
          </p>
        )}
      </div>

      {/* Scores */}

      <div className="grid md:grid-cols-2 gap-8 mb-8">

        <div className="bg-[#0f172a] p-8 rounded-3xl">

          <h2 className="text-3xl mb-6">
            ATS Score
          </h2>

          <div className="text-7xl text-cyan-400 font-bold">
            {atsScore}%
          </div>
        </div>

        <div className="bg-[#0f172a] p-8 rounded-3xl">

          <h2 className="text-3xl mb-6">
            Job Match
          </h2>

          <div className="text-7xl text-green-400 font-bold">
            {jobMatch}%
          </div>
        </div>
      </div>

      {/* RESULTS */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* AI */}

        <div className="bg-[#0f172a] p-6 rounded-3xl h-[700px] overflow-y-auto">

          <div className="text-cyan-400 text-2xl font-bold mb-6">
            Suggestions
          </div>

          <div className="whitespace-pre-wrap leading-8 text-gray-300">
            {aiSuggestions}
          </div>
        </div>

        {/* INTERVIEW */}

        <div className="bg-[#0f172a] p-6 rounded-3xl h-[700px] overflow-y-auto">

          <div className="text-green-400 text-2xl font-bold mb-6">
            Interview
          </div>

          <div className="whitespace-pre-wrap leading-8 text-gray-300">
            {interviewQuestions}
          </div>
        </div>

        {/* REWRITE */}

        <div className="bg-[#0f172a] p-6 rounded-3xl h-[700px] overflow-y-auto">

          <div className="text-orange-400 text-2xl font-bold mb-6">
            Rewrite
          </div>

          <div className="whitespace-pre-wrap leading-8 text-gray-300">
            {rewrittenResume}
          </div>
        </div>
      </div>
    </div>
  );
}