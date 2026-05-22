"use client";

import { useState } from "react";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

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

  const [scoreBreakdown, setScoreBreakdown] =
    useState<string[]>([]);

  const [matchedSkills, setMatchedSkills] =
    useState<string[]>([]);

  const [missingSkills, setMissingSkills] =
    useState<string[]>([]);

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

        setScoreBreakdown(
          data.scoreBreakdown || []
        );

        setMatchedSkills(
          data.matchedSkills || []
        );

        setMissingSkills(
          data.missingSkills || []
        );

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
  // DOWNLOAD HELPERS
  // =========================

  const downloadTextFile = (
    content: string,
    filename: string
  ) => {

    const blob =
      new Blob(
        [content],
        {
          type: "text/plain",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = filename;

    a.click();
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

      {/* UPLOAD */}

      <div className="bg-[#0f172a] rounded-3xl p-8 mb-8">

        <div className="grid md:grid-cols-2 gap-8">

          {/* RESUME */}

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

          {/* JD */}

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

        <div className="bg-[#0f172a] rounded-3xl p-8 flex flex-col items-center">

          <h2 className="text-3xl mb-8">
            ATS Score
          </h2>

          <div className="w-44 h-44">

            <CircularProgressbar
              value={atsScore}
              text={`${atsScore}%`}
              styles={buildStyles({

                textColor: "#22d3ee",

                pathColor: "#22d3ee",

                trailColor: "#1e293b",
              })}
            />
          </div>
        </div>

        {/* JOB MATCH */}

        <div className="bg-[#0f172a] rounded-3xl p-8 flex flex-col items-center">

          <h2 className="text-3xl mb-8">
            Job Match
          </h2>

          <div className="w-44 h-44">

            <CircularProgressbar
              value={jobMatch}
              text={`${jobMatch}%`}
              styles={buildStyles({

                textColor: "#4ade80",

                pathColor: "#4ade80",

                trailColor: "#1e293b",
              })}
            />
          </div>
        </div>

        {/* LEVEL */}

        <div className="bg-[#0f172a] rounded-3xl p-8 flex flex-col justify-center items-center">

          <h2 className="text-3xl mb-8">
            Resume Level
          </h2>

          <div className="text-5xl text-yellow-400 font-bold">
            {resumeLevel}
          </div>
        </div>
      </div>

      {/* SCORING EXPLANATION */}

      <div className="bg-[#0f172a] rounded-3xl p-8 mb-8">

        <h2 className="text-3xl text-cyan-400 mb-6">
          Scoring Explanation
        </h2>

        <div className="space-y-4">

          {scoreBreakdown.map(
            (item, index) => (

              <div
                key={index}
                className="bg-[#020617] p-4 rounded-xl text-lg text-gray-300"
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* MATCHED + MISSING */}

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* MATCHED */}

        <div className="bg-[#0f172a] rounded-3xl p-8">

          <h2 className="text-3xl text-green-400 mb-6">
            Matched Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {matchedSkills.map(
              (skill, index) => (

                <div
                  key={index}
                  className="bg-green-500/20 text-green-300 px-4 py-2 rounded-xl"
                >
                  {skill}
                </div>
              )
            )}
          </div>
        </div>

        {/* MISSING */}

        <div className="bg-[#0f172a] rounded-3xl p-8">

          <h2 className="text-3xl text-red-400 mb-6">
            Missing Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {missingSkills.map(
              (skill, index) => (

                <div
                  key={index}
                  className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl"
                >
                  {skill}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* TABS */}

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

        {/* AI */}

        {activeSection ===
          "suggestions" && (

          <div>

            <h2 className="text-5xl text-cyan-400 mb-10">
              AI Suggestions
            </h2>

            <div className="bg-[#020617] rounded-3xl p-8 whitespace-pre-wrap leading-9 text-lg text-gray-300">
              {aiSuggestions}
            </div>

            <button
              onClick={() =>
                downloadTextFile(
                  aiSuggestions,
                  "ai_suggestions.txt"
                )
              }
              className="mt-6 bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl"
            >
              Download Suggestions
            </button>
          </div>
        )}

        {/* REWRITE */}

        {activeSection ===
          "rewrite" && (

          <div>

            <h2 className="text-5xl text-green-400 mb-10">
              Rewrite Resume
            </h2>

            <div className="bg-[#020617] rounded-3xl p-8 whitespace-pre-wrap leading-9 text-lg text-gray-300">
              {rewrittenResume}
            </div>

            <button
              onClick={() =>
                downloadTextFile(
                  rewrittenResume,
                  "rewritten_resume.txt"
                )
              }
              className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
            >
              Download Resume
            </button>
          </div>
        )}

        {/* INTERVIEW */}

        {activeSection ===
          "interview" && (

          <div>

            <h2 className="text-5xl text-orange-400 mb-10">
              Interview Prep
            </h2>

            <div className="bg-[#020617] rounded-3xl p-8 whitespace-pre-wrap leading-9 text-lg text-gray-300">
              {interviewQuestions}
            </div>

            <button
              onClick={() =>
                downloadTextFile(
                  interviewQuestions,
                  "interview_questions.txt"
                )
              }
              className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl"
            >
              Download Questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}