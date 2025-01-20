"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ContactData } from "../../../models/ContactData";
import { MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminContactos() {
  const [contactData, setContactData] = useState<ContactData>({
    email: "",
    socials: {
      facebook: { url: "", username: "" },
      instagram: { url: "", username: "" },
      linkedin: { url: "", username: "" },
      twitter: { url: "", username: "" },
    },
  });
  const [editContact, setEditContact] = useState<{
    platform: keyof ContactData["socials"];
    url: string;
    username: string;
  } | null>(null);
  const [openAccordion, setOpenAccordion] = useState<
    keyof ContactData["socials"] | null
  >(null);

  const router = useRouter();

  useEffect(() => {
    const fetchContactData = async () => {
      const docRef = doc(db, "contact", "contact");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ContactData;
        console.log("Fetched contact data from Firebase:", data);
        setContactData(data);
      } else {
        console.log("No such document!");
      }
    };

    fetchContactData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting contact data to Firebase:", contactData);
      const docRef = doc(db, "contact", "contact");
      await setDoc(docRef, contactData);
      alert("Información de contacto actualizada correctamente");
    } catch (error) {
      console.error("Error updating contact information: ", error);
      alert("Hubo un error al actualizar la información de contacto");
    }
  };

  const handleEdit = (platform: keyof ContactData["socials"]) => {
    setEditContact({
      platform,
      url: contactData.socials[platform].url,
      username: contactData.socials[platform].username,
    });
  };

  const handleSaveEdit = () => {
    if (editContact) {
      setContactData((prevData) => ({
        ...prevData,
        socials: {
          ...prevData.socials,
          [editContact.platform]: {
            url: editContact.url,
            username: editContact.username,
          },
        },
      }));
      setEditContact(null);
    }
  };

  const handleCancelEdit = () => {
    setEditContact(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editContact) {
      setEditContact((prevEditContact) => ({
        ...prevEditContact!,
        [name]: value,
      }));
    } else {
      setContactData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const toggleAccordion = (platform: keyof ContactData["socials"]) => {
    setOpenAccordion(openAccordion === platform ? null : platform);
    handleEdit(platform);
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
          <h2 className="text-xl font-bold">Administrar contactos</h2>
        </div>
      </header>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contactData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Redes Sociales
            </label>
            {Object.keys(contactData.socials).map((platform) => (
              <div key={platform} className="mb-4 w-full">
                <div className="flex items-center justify-between w-full">
                  <MenuButton
                    className="w-full flex justify-between items-center px-4 py-2 border rounded-md"
                    onClick={() =>
                      toggleAccordion(platform as keyof ContactData["socials"])
                    }>
                    <span>{platform}</span>
                    {openAccordion === platform ? (
                      <ChevronUp className="ml-2" />
                    ) : (
                      <ChevronDown className="ml-2" />
                    )}
                  </MenuButton>
                </div>
                {openAccordion === platform && (
                  <div className="mt-2 w-full space-y-2 px-6">
                    <Input
                      name="url"
                      placeholder="URL"
                      value={editContact?.url || ""}
                      onChange={handleChange}
                      className="mb-2"
                    />
                    <Input
                      name="username"
                      placeholder="Username"
                      value={editContact?.username || ""}
                      onChange={handleChange}
                      className="mb-2"
                    />
                    {editContact?.platform === platform && (
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveEdit} className="mr-2">
                          Guardar
                        </Button>
                        <Button onClick={handleCancelEdit} variant="secondary">
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button type="submit">Guardar Cambios</Button>
        </form>
      </CardContent>
    </div>
  );
}
