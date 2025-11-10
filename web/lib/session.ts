"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

export type SessionUser = { id: number; email: string; role: string; name?: string };

export async function getSession(): Promise<SessionUser | null> {
  try {
    const me = await fetchJson<SessionUser>(`/api/auth/me`, { method: "GET" });
    return me;
  } catch (e) {
    return null;
  }
}

export function useSession(options?: { redirectTo?: string }) {
  const redirectTo = options?.redirectTo ?? "/admin/auth/login";
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const me = await getSession();
      if (!mounted) return;
      if (!me) {
        try {
          // Redirección lado cliente para proteger rutas
          window.location.replace(redirectTo);
        } catch {}
      } else {
        setUser(me);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [redirectTo]);

  return { user, loading };
}
