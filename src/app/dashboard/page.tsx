"use client";

import { useState } from "react";

export default function DashboardPage() {

  // =========================
  // STATES
  // =========================

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

  const [resumeLevel, setResumeLevel] =
    useState("Beginner");

  const [aiSuggestions, setAiSuggestions] =
    useState("");

  const [rewrittenResume, setRewrittenResume] =
    useState("");

  const [interviewQuestions, setInterviewQuestions] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("suggestions");

  // =========================
  // ANALYZE RESUME
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

        console.log(data);

        // =========================
        // UPDATE STATES
        // =========================

        setAtsScore(

          Number(
            data.atsScore || 0
          )
        );

        setJobMatch(

          Number(
            data.jobMatch || 0
          )
        );

        setResumeLevel(

          data.resumeLevel ||
          "Beginner"
        );

        setAiSuggestions(

          data.aiFeedback ||

          "No suggestions generated"
        );

        // OPEN AI SECTION

        setActiveSection(
          "suggestions"
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
  // REWRITE RESUME
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

        console.log(data);

        setRewrittenResume(

          data.rewrittenResume ||

          "No rewritten resume generated"
        );

        setActiveSection(
          "rewrite"
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

  // =========================
  // INTERVIEW QUESTIONS
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

        console.log(data);

        setInterviewQuestions(

          data.interviewQuestions ||

          "No interview questions generated"
        );

        setActiveSection(
          "interview"
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
  // UI
  // =========================

  return (

    <div className="min-h-screen bg-[#020617] text-white p-6">

      {/* HEADER */}

      <h1 className="text-5xl font-bold mb-8">
        AI Resume Assistant
      </h1>

      {/* UPLOAD SECTION */}

      <div className="bg-[#0f172a] rounded-3xl p-8 mb-8">

        <div className="grid md:grid-cols-2 gap-8">

          {/* Resume Upload */}

          <div>

            <label className="text-xl block mb-4">
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
              className="bg-white text-black w-full p-4 rounded-xl"
            />
          </div>

          {/* JD Upload */}

          <div>

            <label className="text-xl block mb-4">
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
              className="bg-white text-black w-full p-4 rounded-xl"
            />
          </div>
        </div>

        {/* BUTTONS */}

        <div className="flex flex-wrap gap-6 mt-10">

          <button
            onClick={analyzeResume}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-2xl text-xl font-semibold"
          >
            Analyze Resume
          </button>

          <button
            onClick={rewriteResume}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl text-xl font-semibold"
          >
            Rewrite Resume
          </button>

          <button
            onClick={
              generateInterviewQuestions
            }
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl text-xl font-semibold"
          >
            Interview Prep
          </button>
        </div>

        {loading && (

          <p className="text-cyan-400 mt-6 text-lg">
            Processing...
          </p>
        )}
      </div>

      {/* SCORE SECTION */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        {/* ATS */}

        <div className="bg-[#0f172a] rounded-3xl p-8">

          <h2 className="text-3xl mb-6">
            ATS Score
          </h2>

          <div className="text-7xl text-cyan-400 font-bold">
            {atsScore}%
          </div>
        </div>

        {/* JOB MATCH */}

        <div className="bg-[#0f172a] rounded-3xl p-8">

          <h2 className="text-3xl mb-6">
            Job Match
          </h2>

          <div className="text-7xl text-green-400 font-bold">
            {jobMatch}%
          </div>
        </div>

        {/* LEVEL */}

        <div className="bg-[#0f172a] rounded-3xl p-8">

          <h2 className="text-3xl mb-6">
            Resume Level
          </h2>

          <div className="text-5xl text-yellow-400 font-bold">
            {resumeLevel}
          </div>
        </div>
      </div>

      {/* SECTION BUTTONS */}

      <div className="flex gap-4 mb-8 flex-wrap">

        <button
          onClick={() =>
            setActiveSection(
              "suggestions"
            )
          }
          className={`px-8 py-4 rounded-2xl text-xl font-semibold ${
            activeSection ===
            "suggestions"
              ? "bg-cyan-500"
              : "bg-[#0f172a]"
          }`}
        >
          AI Suggestions
        </button>

        <button
          onClick={() =>
            setActiveSection(
              "rewrite"
            )
          }
          className={`px-8 py-4 rounded-2xl text-xl font-semibold ${
            activeSection ===
            "rewrite"
              ? "bg-green-500"
              : "bg-[#0f172a]"
          }`}
        >
          Rewrite Resume
        </button>

        <button
          onClick={() =>
            setActiveSection(
              "interview"
            )
          }
          className={`px-8 py-4 rounded-2xl text-xl font-semibold ${
            activeSection ===
            "interview"
              ? "bg-orange-500"
              : "bg-[#0f172a]"
          }`}
        >
          Interview Prep
        </button>
      </div>

      {/* CONTENT */}

      <div className="bg-[#0f172a] rounded-3xl p-8 min-h-[600px]">

        {/* AI Suggestions */}

        {activeSection ===
          "suggestions" && (

          <div>

            <h2 className="text-5xl text-cyan-400 mb-10">
              AI Suggestions
            </h2>

            <div className="bg-[#020617] rounded-3xl p-8 whitespace-pre-wrap leading-9 text-lg text-gray-300">
              {aiSuggestions}
            </div>
          </div>
        )}

        {/* Rewrite */}

        {activeSection ===
          "rewrite" && (

          <div>

            <h2 className="text-5xl text-green-400 mb-10">
              Rewrite Resume
            </h2>

            <div className="bg-[#020617] rounded-3xl p-8 whitespace-pre-wrap leading-9 text-lg text-gray-300">
              {rewrittenResume}
            </div>
          </div>
        )}

        {/* Interview */}

        {activeSection ===
          "interview" && (

          <div>

            <h2 className="text-5xl text-orange-400 mb-10">
              Interview Prep
            </h2>

            <div className="bg-[#020617] rounded-3xl p-8 whitespace-pre-wrap leading-9 text-lg text-gray-300">
              {interviewQuestions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}