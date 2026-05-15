"use client";

import {
  useEffect,
  useState,
} from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

import { saveAs } from "file-saver";

export default function DashboardPage() {

  // =========================
  // STATES
  // =========================

  const [file, setFile] =
    useState<File | null>(null);

  const [jdFile, setJdFile] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [analyzing, setAnalyzing] =
    useState(false);

  const [rewriting, setRewriting] =
    useState(false);

  const [
    generatingQuestions,
    setGeneratingQuestions,
  ] = useState(false);

  const [atsScore, setAtsScore] =
    useState(0);

  const [jobMatchScore, setJobMatchScore] =
    useState(0);

  const [resumeLevel, setResumeLevel] =
    useState("");

  const [analysis, setAnalysis] =
    useState("");

  const [
    rewrittenResume,
    setRewrittenResume,
  ] = useState("");

  const [
    interviewQuestions,
    setInterviewQuestions,
  ] = useState("");

  const [
    matchedKeywords,
    setMatchedKeywords,
  ] = useState<string[]>([]);

  const [
    missingKeywords,
    setMissingKeywords,
  ] = useState<string[]>([]);

  const [strengths, setStrengths] =
    useState<string[]>([]);

  const [weaknesses, setWeaknesses] =
    useState<string[]>([]);

  const [history, setHistory] =
    useState<any[]>([]);

  // =========================
  // FETCH HISTORY
  // =========================

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const response =
        await fetch("/api/history");

      const text =
        await response.text();

      if (!text) {

        setHistory([]);

        return;
      }

      const data =
        JSON.parse(text);

      if (data.error) {

        console.log(data.error);

        return;
      }

      setHistory(data);

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // ANALYZE RESUME
  // =========================

  const analyzeResume =
    async () => {

      if (!file) {

        alert("Upload resume");

        return;
      }

      try {

        setAnalyzing(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          file
        );

        formData.append(
          "jobDescription",
          jobDescription
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

        const result =
          await response.json();

        if (result.error) {

          alert(result.error);

          return;
        }

        setAtsScore(
          result.atsScore
        );

        setJobMatchScore(
          result.jobMatchScore
        );

        setResumeLevel(
          result.resumeLevel
        );

        setAnalysis(
          result.analysis
        );

        setMatchedKeywords(
          result.matchedKeywords
        );

        setMissingKeywords(
          result.missingKeywords
        );

        setStrengths(
          result.strengths
        );

        setWeaknesses(
          result.weaknesses
        );

        fetchHistory();

      } catch (error: any) {

        alert(error.message);

      } finally {

        setAnalyzing(false);
      }
    };

  // =========================
  // REWRITE RESUME
  // =========================

  const rewriteResume =
    async () => {

      if (!file) {

        alert("Upload resume");

        return;
      }

      try {

        setRewriting(true);

        const formData =
          new FormData();

        formData.append(
          "resume",
          file
        );

        formData.append(
          "jobDescription",
          jobDescription
        );

        const response =
          await fetch(
            "/api/rewrite",
            {
              method: "POST",
              body: formData,
            }
          );

        const result =
          await response.json();

        if (result.error) {

          alert(result.error);

          return;
        }

        setRewrittenResume(
          result.rewrittenResume
        );

      } catch (error: any) {

        alert(error.message);

      } finally {

        setRewriting(false);
      }
    };

  // =========================
  // INTERVIEW QUESTIONS
  // =========================

  const generateQuestions =
    async () => {

      if (!file) {

        alert("Upload resume");

        return;
      }

      try {

        setGeneratingQuestions(
          true
        );

        const formData =
          new FormData();

        formData.append(
          "resume",
          file
        );

        formData.append(
          "jobDescription",
          jobDescription
        );

        const response =
          await fetch(
            "/api/interview",
            {
              method: "POST",
              body: formData,
            }
          );

        const result =
          await response.json();

        if (result.error) {

          alert(result.error);

          return;
        }

        setInterviewQuestions(
          result.questions
        );

      } catch (error: any) {

        alert(error.message);

      } finally {

        setGeneratingQuestions(
          false
        );
      }
    };

  // =========================
  // DOWNLOAD PDF
  // =========================

  const downloadPDF =
    async () => {

      const input =
        document.getElementById(
          "rewrite-section"
        );

      if (!input) return;

      const canvas =
        await html2canvas(
          input
        );

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf =
        new jsPDF();

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (
          canvas.height *
          pdfWidth
        ) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        "rewritten-resume.pdf"
      );
    };

  // =========================
  // DOWNLOAD DOCX
  // =========================

  const downloadDOCX =
    async () => {

      const doc =
        new Document({

          sections: [
            {
              properties: {},

              children: [

                new Paragraph({

                  children: [

                    new TextRun({

                      text:
                        rewrittenResume,

                      size: 24,
                    }),
                  ],
                }),
              ],
            },
          ],
        });

      const blob =
        await Packer.toBlob(
          doc
        );

      saveAs(
        blob,
        "rewritten-resume.docx"
      );
    };

  return (

    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        color: "white",
        padding: "30px",
      }}
    >

      {/* TITLE */}

      <h1
        style={{
          fontSize: "70px",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        AI Resume Analyzer
      </h1>

      {/* UPLOAD SECTION */}

      <div
        style={{
          background: "#111827",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >

        <h2>
          Upload Resume PDF
        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {

            if (
              e.target.files &&
              e.target.files[0]
            ) {

              setFile(
                e.target.files[0]
              );
            }
          }}
        />

        <br />
        <br />

        <h2>
          Paste Job Description
        </h2>

        <textarea
          placeholder="Paste Job Description"
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(
              e.target.value
            )
          }
          rows={10}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            background: "#020617",
            color: "white",
            border:
              "1px solid #334155",
            outline: "none",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        />

        <h2>
          OR Upload Job Description PDF
        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {

            if (
              e.target.files &&
              e.target.files[0]
            ) {

              setJdFile(
                e.target.files[0]
              );
            }
          }}
        />

        <br />
        <br />

        {/* BUTTONS */}

        <button
          onClick={analyzeResume}
          disabled={analyzing}
          style={{
            background: "#06b6d4",
            color: "white",
            border: "none",
            padding: "18px 40px",
            borderRadius: "12px",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >

          {analyzing
            ? "Analyzing..."
            : "Analyze Resume"}

        </button>

        <button
          onClick={rewriteResume}
          disabled={rewriting}
          style={{
            background: "#22c55e",
            color: "white",
            border: "none",
            padding: "18px 40px",
            borderRadius: "12px",
            fontSize: "20px",
            cursor: "pointer",
            marginLeft: "15px",
          }}
        >

          {rewriting
            ? "Rewriting..."
            : "Rewrite Resume"}

        </button>

        <button
          onClick={
            generateQuestions
          }
          disabled={
            generatingQuestions
          }
          style={{
            background: "#f59e0b",
            color: "white",
            border: "none",
            padding: "18px 40px",
            borderRadius: "12px",
            fontSize: "20px",
            cursor: "pointer",
            marginLeft: "15px",
          }}
        >

          {generatingQuestions
            ? "Generating..."
            : "Interview Questions"}

        </button>
      </div>

      {/* SCORES */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        <div
          style={{
            background: "#111827",
            padding: "25px",
            borderRadius: "20px",
          }}
        >
          <h2>ATS Score</h2>

          <h1
            style={{
              fontSize: "60px",
              color: "#22d3ee",
            }}
          >
            {atsScore}%
          </h1>
        </div>

        <div
          style={{
            background: "#111827",
            padding: "25px",
            borderRadius: "20px",
          }}
        >
          <h2>Job Match</h2>

          <h1
            style={{
              fontSize: "60px",
              color: "#4ade80",
            }}
          >
            {jobMatchScore}%
          </h1>
        </div>

        <div
          style={{
            background: "#111827",
            padding: "25px",
            borderRadius: "20px",
          }}
        >
          <h2>Resume Level</h2>

          <h1
            style={{
              fontSize: "32px",
              color: "#facc15",
            }}
          >
            {resumeLevel}
          </h1>
        </div>
      </div>

      {/* AI SUGGESTIONS */}

      <div
        style={{
          background: "#0f172a",
          padding: "35px",
          borderRadius: "20px",
          marginBottom: "30px",
          border:
            "2px solid #1e293b",
        }}
      >

        <h2
          style={{
            background: "#111827",
            padding: "15px 20px",
            borderRadius: "12px",
            color: "#22d3ee",
            fontSize: "28px",
            marginBottom: "25px",
          }}
        >
          AI Suggestions
        </h2>

        <div
          style={{
            background: "#020617",
            padding: "25px",
            borderRadius: "15px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.9",
          }}
        >
          {analysis}
        </div>
      </div>

      {/* AI REWRITTEN RESUME */}

      <div
        id="rewrite-section"
        style={{
          background: "#0f172a",
          padding: "35px",
          borderRadius: "20px",
          marginBottom: "30px",
          border:
            "2px solid #1e293b",
        }}
      >

        <h2
          style={{
            background: "#111827",
            padding: "15px 20px",
            borderRadius: "12px",
            color: "#4ade80",
            fontSize: "28px",
            marginBottom: "25px",
          }}
        >
          AI Rewritten Resume
        </h2>

        <div
          style={{
            background: "#020617",
            padding: "25px",
            borderRadius: "15px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.9",
          }}
        >
          {rewrittenResume}
        </div>

        {/* DOWNLOAD BUTTONS */}

        <div
          style={{
            marginTop: "25px",
          }}
        >

          <button
            onClick={downloadPDF}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "14px 30px",
              borderRadius: "10px",
              cursor: "pointer",
              marginRight: "15px",
            }}
          >
            Download PDF
          </button>

          <button
            onClick={downloadDOCX}
            style={{
              background: "#7c3aed",
              color: "white",
              border: "none",
              padding: "14px 30px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Download DOCX
          </button>
        </div>
      </div>

      {/* INTERVIEW QUESTIONS */}

      <div
        style={{
          background: "#0f172a",
          padding: "35px",
          borderRadius: "20px",
          marginBottom: "30px",
          border:
            "2px solid #1e293b",
        }}
      >

        <h2
          style={{
            background: "#111827",
            padding: "15px 20px",
            borderRadius: "12px",
            color: "#f59e0b",
            fontSize: "28px",
            marginBottom: "25px",
          }}
        >
          AI Interview Questions
        </h2>

        <div
          style={{
            background: "#020617",
            padding: "25px",
            borderRadius: "15px",
            whiteSpace: "pre-wrap",
            lineHeight: "1.9",
            color: "white",
          }}
        >
          {interviewQuestions}
        </div>
      </div>
    </div>
  );
}