"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import AdminLayout from "@/components/AdminLayout";

export default function AdminSettings() {
  const [title, setTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <AdminLayout title="Configuración">
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
        <div className="flex justify-end">
          <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
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
    </AdminLayout>
  );
}
