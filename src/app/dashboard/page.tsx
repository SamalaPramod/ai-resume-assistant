"use client";

import {
  useEffect,
  useState,
} from "react";

export default function DashboardPage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [atsScore, setAtsScore] =
    useState(0);

  const [jobMatchScore, setJobMatchScore] =
    useState(0);

  const [resumeLevel, setResumeLevel] =
    useState("");

  const [analysis, setAnalysis] =
    useState("");

  // =========================
  // AI REWRITER STATE
  // =========================

  const [
    rewrittenResume,
    setRewrittenResume
  ] = useState("");

  const [matchedKeywords, setMatchedKeywords] =
    useState<string[]>([]);

  const [missingKeywords, setMissingKeywords] =
    useState<string[]>([]);

  const [strengths, setStrengths] =
    useState<string[]>([]);

  const [weaknesses, setWeaknesses] =
    useState<string[]>([]);

  // =========================
  // HISTORY STATE
  // =========================

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

      const data =
        await response.json();

      setHistory(data);

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // ANALYZE RESUME
  // =========================

  const analyzeResume = async () => {

    if (!file) {

      alert("Upload resume");

      return;
    }

    try {

      setLoading(true);

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

      alert(
        error.message ||
        "Analysis failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // AI RESUME REWRITER
  // =========================

  const rewriteResume = async () => {

    if (!file) {

      alert("Upload resume");

      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "resume",
        file
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

      alert(
        error.message ||
        "Rewrite failed"
      );

    } finally {

      setLoading(false);
    }
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

      <h1
        style={{
          fontSize: "70px",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        AI Resume Analyzer
      </h1>

      {/* ========================= */}
      {/* UPLOAD */}
      {/* ========================= */}

      <div
        style={{
          background: "#111827",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >

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
            color: "black",
          }}
        />

        

        


        {/* ANALYZE BUTTON */}

        <button
          onClick={analyzeResume}
          disabled={loading}
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

          {loading
            ? "Analyzing..."
            : "Analyze Resume"}

        </button>

        {/* REWRITE BUTTON */}

        <button
          onClick={rewriteResume}
          disabled={loading}
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

          {loading
            ? "Rewriting..."
            : "Rewrite Resume"}

        </button>
      </div>

      {/* ========================= */}
      {/* SCORES */}
      {/* ========================= */}

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

      {/* ========================= */}
      {/* KEYWORDS */}
      {/* ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
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

          <h2>
            Matched Keywords
          </h2>

          {matchedKeywords.map(
            (item, index) => (

              <p key={index}>
                ✅ {item}
              </p>
            )
          )}
        </div>

        <div
          style={{
            background: "#111827",
            padding: "25px",
            borderRadius: "20px",
          }}
        >

          <h2>
            Missing Keywords
          </h2>

          {missingKeywords.map(
            (item, index) => (

              <p key={index}>
                ❌ {item}
              </p>
            )
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* STRENGTHS / WEAKNESSES */}
      {/* ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
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

          <h2>
            Strengths
          </h2>

          {strengths.map(
            (item, index) => (

              <p key={index}>
                ✅ {item}
              </p>
            )
          )}
        </div>

        <div
          style={{
            background: "#111827",
            padding: "25px",
            borderRadius: "20px",
          }}
        >

          <h2>
            Weaknesses
          </h2>

          {weaknesses.map(
            (item, index) => (

              <p key={index}>
                ❌ {item}
              </p>
            )
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* AI ANALYSIS */}
      {/* ========================= */}

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
            marginBottom: "20px",
          }}
        >
          AI Suggestions
        </h2>

        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.8",
          }}
        >
          {analysis}
        </div>
      </div>

      {/* ========================= */}
      {/* AI REWRITTEN RESUME */}
      {/* ========================= */}

      <div
        style={{
          background: "#111827",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >

        <h2>
          AI Rewritten Resume
        </h2>

        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.8",
            marginTop: "20px",
          }}
        >
          {rewrittenResume}
        </div>
      </div>

      {/* ========================= */}
      {/* RESUME HISTORY */}
      {/* ========================= */}

      <div
        style={{
          background: "#111827",
          padding: "30px",
          borderRadius: "20px",
        }}
      >

        <h2>
          Resume History
        </h2>

        {history.map((item) => (

          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >

            <h3>
              {item.filename}
            </h3>

            <p>
              ATS Score:
              {" "}
              {item.ats_score}
            </p>

            <p>
              Job Match Score:
              {" "}
              {item.job_match_score}
            </p>

            <small>
              {item.created_at}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}