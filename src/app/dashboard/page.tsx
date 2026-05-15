"use client";

import { useState } from "react";

export default function DashboardPage() {

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [jdFile, setJdFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [atsScore, setAtsScore] =
    useState(0);

  const [jobMatch, setJobMatch] =
    useState(0);

  const [aiFeedback, setAiFeedback] =
    useState("");

  const [matchedKeywords, setMatchedKeywords] =
    useState<string[]>([]);

  const [missingKeywords, setMissingKeywords] =
    useState<string[]>([]);

  const [strengths, setStrengths] =
    useState<string[]>([]);

  const [weaknesses, setWeaknesses] =
    useState<string[]>([]);

  const [interviewQuestions, setInterviewQuestions] =
    useState("");

  const [rewrittenResume, setRewrittenResume] =
    useState("");

  // =========================
  // ANALYZE RESUME
  // =========================

  const analyzeResume = async () => {

    try {

      if (!selectedFile) {

        alert("Please upload resume");
        return;
      }

      setLoading(true);

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

      setMatchedKeywords(
        data.matchedKeywords || []
      );

      setMissingKeywords(
        data.missingKeywords || []
      );

      setStrengths(
        data.strengths || []
      );

      setWeaknesses(
        data.weaknesses || []
      );

    } catch (error) {

      console.log(error);
      alert("Analysis failed");

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

        if (!selectedFile) {

          alert("Please upload resume");
          return;
        }

        setLoading(true);

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
        alert("Interview generation failed");

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

        if (!selectedFile) {

          alert("Please upload resume");
          return;
        }

        setLoading(true);

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
        alert("Rewrite failed");

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          AI Resume Assistant
        </h1>

        {/* Upload Section */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

          <h2 className="text-2xl font-semibold mb-4">
            Upload Files
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="font-medium block mb-2">
                Resume PDF
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setSelectedFile(
                    e.target.files?.[0] || null
                  )
                }
                className="border p-3 rounded-lg w-full"
              />
            </div>

            <div>

              <label className="font-medium block mb-2">
                Job Description PDF
              </label>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setJdFile(
                    e.target.files?.[0] || null
                  )
                }
                className="border p-3 rounded-lg w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">

            <button
              onClick={analyzeResume}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Analyze Resume
            </button>

            <button
              onClick={generateInterviewQuestions}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Interview Questions
            </button>

            <button
              onClick={rewriteResume}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Rewrite Resume
            </button>
          </div>

          {loading && (
            <p className="mt-4 text-blue-600 font-medium">
              Processing...
            </p>
          )}
        </div>

        {/* ATS Section */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4">
              ATS Score
            </h2>

            <div className="text-5xl font-bold text-blue-600 mb-4">
              {atsScore}%
            </div>

            <p className="text-lg">
              Job Match: {jobMatch}%
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4">
              AI Suggestions
            </h2>

            <div className="whitespace-pre-wrap text-gray-700">
              {aiFeedback}
            </div>
          </div>
        </div>

        {/* Keywords */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4 text-green-700">
              Matched Keywords
            </h2>

            <div className="flex flex-wrap gap-2">

              {matchedKeywords.map((item, index) => (

                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4 text-red-700">
              Missing Keywords
            </h2>

            <div className="flex flex-wrap gap-2">

              {missingKeywords.map((item, index) => (

                <span
                  key={index}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Strengths
            </h2>

            <ul className="list-disc pl-6 space-y-2">

              {strengths.map((item, index) => (

                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-4">
              Weaknesses
            </h2>

            <ul className="list-disc pl-6 space-y-2">

              {weaknesses.map((item, index) => (

                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interview Questions */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

          <h2 className="text-2xl font-semibold mb-4">
            Interview Questions
          </h2>

          <div className="whitespace-pre-wrap text-gray-700">
            {interviewQuestions}
          </div>
        </div>

        {/* Resume Rewrite */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-2xl font-semibold mb-4">
            Rewritten Resume
          </h2>

          <div className="whitespace-pre-wrap text-gray-700">
            {rewrittenResume}
          </div>
        </div>
      </div>
    </div>
  );
}