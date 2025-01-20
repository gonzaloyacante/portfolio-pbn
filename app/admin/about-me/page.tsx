"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AdminSobreMi() {
  const router = useRouter();
  const [aboutMe, setAboutMe] = useState("");

  useEffect(() => {
    const fetchAboutMe = async () => {
      const docRef = doc(db, "about", "aboutMe");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAboutMe(data.content);
      } else {
        console.log("No such document!");
      }
    };

    fetchAboutMe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "about", "aboutMe");
      await setDoc(docRef, { content: aboutMe });
      alert("Información actualizada correctamente");
    } catch (error) {
      console.error("Error actualizando la información:", error);
      alert("Hubo un error al actualizar la información");
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
          <h2 className="text-xl font-bold">Sobre Mí</h2>
        </div>
      </header>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="aboutMe"
              className="block text-sm font-medium text-gray-700">
              Sobre Mí
            </label>
            <ReactQuill
              value={aboutMe}
              onChange={setAboutMe}
              className="bg-background"
            />
          </div>
          <Button type="submit">Guardar Cambios</Button>
        </form>
      </CardContent>
    </div>
  );
}
