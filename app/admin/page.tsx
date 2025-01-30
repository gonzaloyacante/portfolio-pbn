"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorModal from "@/components/ErrorModal";

export default function Admin() {
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const error = localStorage.getItem("authError");
      if (error) {
        setAuthError(error);
        localStorage.removeItem("authError");
      }
    }
  }, []);

  useEffect(() => {
    router.push("/admin/auth/login");
  }, [authError, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold">Redirigiendo...</h1>
      </div>
      {authError && (
        <ErrorModal message={authError} onClose={() => setAuthError(null)} />
      )}
    </div>
  );
}
