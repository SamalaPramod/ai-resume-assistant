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
    interviewContent,
    setInterviewContent,
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

  const [
    selectedHistory,
    setSelectedHistory,
  ] = useState<any>(null);

  // =========================
  // ACTIVE TAB
  // =========================

  const [
    activeSection,
    setActiveSection,
  ] = useState("analysis");

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
  // OPEN HISTORY
  // =========================

  const openHistory =
    (item: any) => {

      setSelectedHistory(item);

      setAtsScore(
        item.ats_score || 0
      );

      setJobMatchScore(
        item.job_match_score || 0
      );

      setResumeLevel(
        item.resume_level || ""
      );

      setAnalysis(
        item.analysis || ""
      );

      setRewrittenResume(
        item.rewritten_resume || ""
      );

      setInterviewContent(
        item.interview_content || ""
      );

      setMatchedKeywords(
        item.matched_keywords || []
      );

      setMissingKeywords(
        item.missing_keywords || []
      );

      setStrengths(
        item.strengths || []
      );

      setWeaknesses(
        item.weaknesses || []
      );

      setJobDescription(
        item.job_description || ""
      );
    };

  // =========================
  // ANALYZE
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
  // REWRITE
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

        fetchHistory();

      } catch (error: any) {

        alert(error.message);

      } finally {

        setRewriting(false);
      }
    };

  // =========================
  // INTERVIEW PREP
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

        setInterviewContent(
          result.interviewContent
        );

        fetchHistory();

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

      {/* UPLOAD */}

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
            ? "Preparing..."
            : "Interview Prep"}
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

      {/* TABS */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
        }}
      >

        <button
          onClick={() =>
            setActiveSection(
              "analysis"
            )
          }
          style={{
            background:

              activeSection ===
              "analysis"

                ? "#06b6d4"

                : "#111827",

            color: "white",

            border: "none",

            padding: "15px 25px",

            borderRadius: "12px",

            cursor: "pointer",

            fontSize: "18px",
          }}
        >
          AI Suggestions
        </button>

        <button
          onClick={() =>
            setActiveSection(
              "rewrite"
            )
          }
          style={{
            background:

              activeSection ===
              "rewrite"

                ? "#22c55e"

                : "#111827",

            color: "white",

            border: "none",

            padding: "15px 25px",

            borderRadius: "12px",

            cursor: "pointer",

            fontSize: "18px",
          }}
        >
          Rewrite Resume
        </button>

        <button
          onClick={() =>
            setActiveSection(
              "interview"
            )
          }
          style={{
            background:

              activeSection ===
              "interview"

                ? "#f59e0b"

                : "#111827",

            color: "white",

            border: "none",

            padding: "15px 25px",

            borderRadius: "12px",

            cursor: "pointer",

            fontSize: "18px",
          }}
        >
          Interview Prep
        </button>
      </div>

      {/* ANALYSIS */}

      {activeSection ===
      "analysis" && (

        <div
          style={{
            background: "#0f172a",
            padding: "35px",
            borderRadius: "20px",
            marginBottom: "30px",
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
      )}

      {/* REWRITE */}

      {activeSection ===
      "rewrite" && (

        <div
          id="rewrite-section"
          style={{
            background: "#0f172a",
            padding: "35px",
            borderRadius: "20px",
            marginBottom: "30px",
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

          <div
            style={{
              marginTop: "25px",
            }}
          >

            <button
              onClick={
                downloadPDF
              }
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
              onClick={
                downloadDOCX
              }
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
      )}

      {/* INTERVIEW */}

      {activeSection ===
      "interview" && (

        <div
          style={{
            background: "#0f172a",
            padding: "35px",
            borderRadius: "20px",
            marginBottom: "30px",
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
            AI Interview Preparation
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
            {interviewContent}
          </div>
        </div>
      )}

      {/* HISTORY */}

      <div
        style={{
          background: "#111827",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            fontSize: "32px",
            marginBottom: "25px",
          }}
        >
          Resume History
        </h2>

        {history.map((item) => (

          <div
            key={item.id}
            style={{
              background: "#020617",
              padding: "25px",
              borderRadius: "15px",
              marginBottom: "20px",
              border:
                "1px solid #1e293b",
            }}
          >

            <h3
              style={{
                color: "#38bdf8",
                marginBottom: "10px",
              }}
            >
              {item.filename}
            </h3>

            <p>
              ATS Score:
              {" "}
              {item.ats_score}%
            </p>

            <p>
              Job Match:
              {" "}
              {item.job_match_score}%
            </p>

            <p
              style={{
                color: "#94a3b8",
                marginTop: "10px",
              }}
            >
              {item.created_at}
            </p>

            <div
              style={{
                marginTop: "20px",
              }}
            >

              <button
                onClick={() =>
                  openHistory(item)
                }
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}