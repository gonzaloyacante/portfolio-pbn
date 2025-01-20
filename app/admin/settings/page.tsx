"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";

export default function AdminSettings() {
  const [title, setTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const docRef = doc(db, "settings", "settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const titleData = docSnap.data().title;
          setTitle(titleData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching title:", error);
        setErrorMessage("Error fetching title: " + (error as Error).message);
      }
    };

    fetchTitle();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "settings", "settings");
      await setDoc(docRef, { title }, { merge: true });
      setSuccessMessage("Título actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando el título:", error);
      setErrorMessage(
        "Hubo un error al actualizar el título: " + (error as Error).message
      );
    }
  };

  return (
    <div className="space-y-6 h-full">
      <header className="flex items-center space-x-4 w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="h-20 w-20" />
            <span className="sr-only">Volver</span>
          </Button>
          <h2 className="text-xl font-bold">Configuración</h2>
        </div>
      </header>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </CardContent>
      {successMessage && (
        <SuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
}
