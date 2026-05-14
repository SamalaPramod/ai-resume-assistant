"use client";

import { useState }
from "react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/app/lib/supabase";

export default function SignupPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // SIGNUP
  // =========================

  const signUp = async () => {

    // VALIDATION

    if (!email.trim()) {

      alert("Enter email");

      return;
    }

    if (!password.trim()) {

      alert("Enter password");

      return;
    }

    if (
      password.length < 6
    ) {

      alert(
        "Password must be at least 6 characters"
      );

      return;
    }

    try {

      setLoading(true);

      const {
        error,
      } =
      await supabase.auth.signUp({

        email,
        password,
      });

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Signup successful"
      );

      router.push(
        "/login"
      );

    } catch (error: any) {

      alert(error.message);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{
        background: "#020617",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <div
        style={{
          width: "420px",
          background: "#111827",
          padding: "40px",
          borderRadius: "20px",
          border:
            "1px solid #1e293b",
        }}
      >

        <h1
          style={{
            color: "white",
            fontSize: "42px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          Join AI Resume Analyzer
        </p>

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border:
              "1px solid #334155",
            background: "#020617",
            color: "white",
            marginBottom: "20px",
            outline: "none",
            fontSize: "16px",
          }}
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "12px",
            border:
              "1px solid #334155",
            background: "#020617",
            color: "white",
            marginBottom: "25px",
            outline: "none",
            fontSize: "16px",
          }}
        />

        {/* SIGNUP BUTTON */}

        <button
          onClick={signUp}
          disabled={loading}
          style={{
            width: "100%",
            background: "#22c55e",
            color: "white",
            border: "none",
            padding: "16px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >

          {loading
            ? "Creating account..."
            : "Sign Up"}

        </button>

        {/* LOGIN LINK */}

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Already have an account?
          {" "}

          <span
            onClick={() =>
              router.push(
                "/login"
              )
            }
            style={{
              color: "#38bdf8",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}