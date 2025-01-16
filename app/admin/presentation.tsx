"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Presentation } from "@/models/Presentation";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export default function PresentationComponent() {
  const [presentation, setPresentation] = useState<Presentation>({
    image: "",
    information: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchPresentation = async () => {
      const presentationSnapshot = await getDocs(
        collection(db, "presentation")
      );
      const presentationData = presentationSnapshot.docs.map((doc) => {
        const data = doc.data();
        return { image: data.image || "", information: data.information || [] };
      })[0] as Presentation;
      setPresentation(presentationData);
    };

    fetchPresentation();
  }, []);

  const handleUpdatePresentation = async (
    newPhoto: string,
    newInfo: string[]
  ) => {
    const presentationRef = doc(db, "presentation", "miInfo");

    await updateDoc(presentationRef, {
      image: newPhoto,
      information: newInfo,
    });

    setPresentation({ image: newPhoto, information: newInfo });
    toast({
      title: "Presentación actualizada",
      description: "La presentación ha sido actualizada exitosamente.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">
          <Edit className="mr-2" /> Gestionar Presentación
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 bg-gray-100">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">Presentación</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 text-white">
                <Edit className="mr-2" /> Actualizar Presentación
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 bg-gray-100">
              <h3 className="text-xl font-bold text-gray-700">
                Actualizar Presentación
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const newPhoto = formData.get("nuevaFoto") as string;
                  const newInfo = (
                    formData.get("nuevaInformacion") as string
                  ).split(",");
                  handleUpdatePresentation(newPhoto, newInfo);
                }}>
                <Input
                  name="nuevaFoto"
                  placeholder="URL de la nueva foto"
                  defaultValue={presentation.image}
                  required
                  className="mb-4"
                />
                <Input
                  name="nuevaInformacion"
                  placeholder="Nueva información (separada por comas)"
                  defaultValue={presentation.information.join(", ")}
                  required
                  className="mb-4"
                />
                <Button type="submit" className="bg-blue-500 text-white">
                  Actualizar Presentación
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="mt-4">
            <Image
              src={presentation.image}
              alt="Foto de presentación"
              width={150}
              height={150}
              className="rounded-lg"
            />
            <ul className="mt-2 space-y-2">
              {presentation.information.map((info: string, index: number) => (
                <li key={index} className="text-gray-700">
                  {info}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
