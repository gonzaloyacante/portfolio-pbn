"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "../../lib/firebaseClient"; // Importa db desde firebaseClient.js
import { doc, getDoc, setDoc } from "firebase/firestore";

export function SobreMiAdmin() {
  const [sobreMi, setSobreMi] = useState("");

  useEffect(() => {
    const fetchSobreMi = async () => {
      const docRef = doc(db, "information", "aboutMe");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSobreMi(docSnap.data().content);
      } else {
        console.log("No such document!");
      }
    };

    fetchSobreMi();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "information", "aboutMe");
      await setDoc(docRef, { content: sobreMi });
      alert("Sección Sobre Mí actualizada correctamente");
    } catch (error) {
      console.error("Error actualizando la sección Sobre Mí:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Sección Sobre Mí</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={sobreMi}
            onChange={(e) => setSobreMi(e.target.value)}
            rows={10}
          />
          <Button type="submit">Guardar Cambios</Button>
        </form>
      </CardContent>
    </Card>
  );
}
