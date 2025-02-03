"use client";

import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ArrowLeft, Image, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CldUploadWidget } from "next-cloudinary";
import dynamic from "next/dynamic";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import "react-image-crop/dist/ReactCrop.css";
import AdminLayout from "@/components/AdminLayout";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";

const modules = {
  toolbar: [
    [{ header: "1" }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
  ],
};

export default function AdminSobreMi() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutMe = async () => {
      const docRef = doc(db, "presentation", "presentation");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || "");
        setAboutMe(data.content || "");
        setProfileImageUrl(data.imageUrl || "");
      } else {
        console.log("No such document!");
      }
    };

    fetchAboutMe();
  }, []);

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        setProfileImageUrl(imageUrl);
      } else {
        console.error("Invalid image URL:", imageUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "presentation", "presentation");
      await setDoc(docRef, {
        title,
        content: aboutMe,
        imageUrl: profileImageUrl,
      });
      setSuccessMessage("Información actualizada correctamente");
    } catch (error) {
      console.error("Error actualizando la información:", error);
      setErrorMessage("Hubo un error al actualizar la información");
    }
  };

  return (
    <AdminLayout title={"Sobre Mí"}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-white mb-2">
            Título
          </label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col items-center">
          <label
            htmlFor="profileImage"
            className="block text-sm font-medium text-white">
            Cambiar foto de Perfil
          </label>
          <CldUploadWidget
            uploadPreset="ml_default"
            options={{
              cropping: true,
              croppingAspectRatio: 1,
              multiple: false,
              showSkipCropButton: false,
            }}
            onSuccess={handleImageUpload}>
            {({ open }) => {
              function handleOnClick(e: any) {
                e.preventDefault();
                open();
              }
              return (
                <Button onClick={handleOnClick} variant="outline">
                  <Plus className="mr-2" /> Subir Imagen
                </Button>
              );
            }}
          </CldUploadWidget>
          <div className="mt-4 w-40 h-40 flex items-center justify-center border-2 rounded-full overflow-hidden relative">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Foto de Perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image className="w-16 h-16 text-gray-400" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">Editar</span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="aboutMe"
            className="block text-sm font-medium text-white mb-2">
            Descripción
          </label>
          <ReactQuill
            value={aboutMe}
            onChange={setAboutMe}
            modules={modules}
            className="bg-background text-white rounded-lg"
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
