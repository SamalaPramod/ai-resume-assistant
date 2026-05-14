"use client";

import { useState }
from "react";

import { supabase }
from "@/app/lib/supabase";

import { useRouter }
from "next/navigation";

export default function UpdatePasswordPage() {

  const router =
    useRouter();

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const updatePassword =
    async () => {

      try {

        setLoading(true);

        const {
          error,
        } =
        await supabase.auth.updateUser({

          password,
        });

        if (error) {

          alert(error.message);

          return;
        }

        alert(
          "Password updated successfully"
        );

        router.push("/auth");

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
          background: "#111827",
          padding: "40px",
          borderRadius: "20px",
          width: "400px",
        }}
      >

        <h1
          style={{
            color: "white",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          Update Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#020617",
            color: "white",
          }}
        />

        <button
          onClick={updatePassword}
          disabled={loading}
          style={{
            width: "100%",
            background: "#22c55e",
            color: "white",
            border: "none",
            padding: "15px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >

          {loading
            ? "Updating..."
            : "Update Password"}

        </button>
      </div>
    </div>
  );
}