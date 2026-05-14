"use client";

import { useState }
from "react";

import { supabase }
from "@/app/lib/supabase";

import { useRouter }
from "next/navigation";

export default function ForgotPasswordPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // RESET PASSWORD
  // =========================

  const resetPassword =
    async () => {

      if (!email.trim()) {

        alert("Enter email");

        return;
      }

      try {

        setLoading(true);

        const {
          error,
        } =
        await supabase.auth.resetPasswordForEmail(

          email,

          {
            redirectTo:
              "http://localhost:3000/update-password",
          }
        );

        if (error) {

          alert(error.message);

          return;
        }

        alert(
          "Password reset email sent"
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
            fontSize: "38px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Forgot Password
        </h1>

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          We will send reset link
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
            marginBottom: "25px",
            outline: "none",
            fontSize: "16px",
          }}
        />

        {/* BUTTON */}

        <button
          onClick={resetPassword}
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
            ? "Sending..."
            : "Send Reset Link"}

        </button>

        {/* BACK */}

        <p
          style={{
            color: "#94a3b8",
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Back to
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