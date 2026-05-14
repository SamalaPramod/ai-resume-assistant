"use client";

import { useState }
from "react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/app/lib/supabase";

export default function LoginPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOGIN
  // =========================

  const login = async () => {

    // VALIDATION

    if (!email.trim()) {

      alert("Enter email");

      return;
    }

    if (!password.trim()) {

      alert("Enter password");

      return;
    }

    try {

      setLoading(true);

      const {
        error,
      } =
      await supabase.auth.signInWithPassword({

        email,
        password,
      });

      if (error) {

        alert(error.message);

        return;
      }

      router.push(
        "/dashboard"
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
          Welcome Back
        </h1>

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          Login to AI Resume Analyzer
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
          placeholder="Enter password"
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
            marginBottom: "15px",
            outline: "none",
            fontSize: "16px",
          }}
        />

        {/* FORGOT PASSWORD */}

        <p
          onClick={() =>
            router.push(
              "/forgot-password"
            )
          }
          style={{
            color: "#38bdf8",
            marginBottom: "25px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Forgot Password?
        </p>

        {/* LOGIN BUTTON */}

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            background: "#06b6d4",
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
            ? "Logging in..."
            : "Login"}

        </button>

        {/* SIGNUP LINK */}

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Don&apos;t have an account?
          {" "}

          <span
            onClick={() =>
              router.push(
                "/signup"
              )
            }
            style={{
              color: "#22c55e",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}