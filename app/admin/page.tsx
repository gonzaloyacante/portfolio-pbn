"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    if (authError) {
      alert(authError);
    }
    router.push("/admin/auth/login");
  }, [authError, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirigiendo...</h1>
      </div>
    </div>
  );
}
