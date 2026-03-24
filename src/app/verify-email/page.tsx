"use client";

import { Suspense } from "react";
import VerifyEmailContent from "./verify-email-content";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4f4"
      }}>
        <p>Cargando...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
