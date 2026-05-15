
"use client";

import { useState } from "react";

export default function DashboardPage() {

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [atsScore, setAtsScore] =
    useState(0);

  const [analysis, setAnalysis] =
    useState("");

  const [jobMatchScore, setJobMatchScore] =
    useState(0);

  const [resumeLevel, setResumeLevel] =
    useState("");

  const [matchedKeywords, setMatchedKeywords] =
    useState<string[]>([]);

  const [missingKeywords, setMissingKeywords] =
    useState<string[]>([]);

  const [strengths, setStrengths] =
    useState<string[]>([]);

  const [weaknesses, setWeaknesses] =
    useState<string[]>([]);

  const analyzeResume = async () => {

    try {

      if (!selectedFile) {

        alert(
          "Please upload a resume"
        );

        return;
      }

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "resume",
        selectedFile
      );

      formData.append(
        "jobDescription",
        jobDescription
      );

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      if (result.error) {

        throw new Error(
          result.error
        );
      }

      setAtsScore(
        result.atsScore || 0
      );

      setJobMatchScore(
        result.jobMatchScore || 0
      );

      setResumeLevel(
        result.resumeLevel || ""
      );

      setMatchedKeywords(
        result.matchedKeywords || []
      );

      setMissingKeywords(
        result.missingKeywords || []
      );

      setStrengths(
        result.strengths || []
      );

      setWeaknesses(
        result.weaknesses || []
      );

      setAnalysis(
        result.analysis || ""
      );

    } catch (error: any) {

      alert(
        error.message ||
        "Analysis failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{
        padding: "40px",
        background: "#0b1020",
        minHeight: "100vh",
        color: "white",
      }}
    >

      <h1
        style={{
          fontSize: "50px",
          marginBottom: "30px",
        }}
      >
        AI Resume Analyzer
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {

          if (
            e.target.files &&
            e.target.files[0]
          ) {

            setSelectedFile(
              e.target.files[0]
            );
          }
        }}
      />

      

      


      <textarea
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(
            e.target.value
          )
        }
        style={{
          width: "100%",
          height: "150px",
          padding: "10px",
          color: "black",
        }}
      />

      

      


      <button
        onClick={analyzeResume}
        style={{
          padding: "15px 30px",
          background: "#22d3ee",
          border: "none",
          borderRadius: "10px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        {
          loading
            ? "Analyzing..."
            : "Analyze Resume"
        }
      </button>

      

      


      <h2>
        ATS Score: {atsScore}
      </h2>

      <h2>
        Job Match Score:
        {" "}
        {jobMatchScore}
      </h2>

      <h2>
        Resume Level:
        {" "}
        {resumeLevel}
      </h2>

      


      <h2>
        Matched Keywords
      </h2>

      <ul>
        {matchedKeywords.map(
          (keyword, index) => (

          <li key={index}>
            {keyword}
          </li>
        ))}
      </ul>

      <h2>
        Missing Keywords
      </h2>

      <ul>
        {missingKeywords.map(
          (keyword, index) => (

          <li key={index}>
            {keyword}
          </li>
        ))}
      </ul>

      <h2>
        Strengths
      </h2>

      <ul>
        {strengths.map(
          (item, index) => (

          <li key={index}>
            {item}
          </li>
        ))}
      </ul>

      <h2>
        Weaknesses
      </h2>

      <ul>
        {weaknesses.map(
          (item, index) => (

          <li key={index}>
            {item}
          </li>
        ))}
      </ul>

      <h2>
        AI Suggestions
      </h2>

      <pre
        style={{
          whiteSpace:
            "pre-wrap",
          lineHeight: "1.7",
        }}
      >
        {analysis}
      </pre>

    </div>
  );
}