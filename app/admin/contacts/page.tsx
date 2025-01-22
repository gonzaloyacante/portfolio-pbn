"use client";

import withAuth from "@/components/withAuth";
import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ContactData } from "../../../models/ContactData";
import { MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";

function ContactAccordion({
  title,
  content,
  isOpen,
  onToggle,
}: {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const props = useSpring({
    height: isOpen ? "auto" : 0,
    opacity: isOpen ? 1 : 0,
    overflow: "hidden",
  });

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full text-left py-4 px-6 font-bold text-lg flex justify-between items-center"
        onClick={onToggle}>
        {title}
        {isOpen ? (
          <ChevronUp className="ml-2" />
        ) : (
          <ChevronDown className="ml-2" />
        )}
      </button>
      <animated.div style={props} className="px-6 border-l-4 border-gray-300">
        <p className="py-4">{content}</p>
      </animated.div>
    </div>
  );
}

function AdminContacts() {
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
  const [openAccordion, setOpenAccordion] = useState<keyof ContactData["socials"] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setSuccessMessage("Información de contacto actualizada correctamente");
    } catch (error) {
      console.error("Error updating contact information: ", error);
      setErrorMessage(
        "Hubo un error al actualizar la información de contacto: " +
          (error as Error).message
      );
    }
  };

  const handleEdit = (platform: keyof ContactData["socials"]) => {
    setEditContact({
      platform,
      url: contactData.socials[platform].url,
      username: contactData.socials[platform].username,
    });
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
    <div className="space-y-4 p-4 h-full">
      <header className="flex items-center space-x-4 w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="h-20 w-20 scale-150" />
            <span className="sr-only">Volver</span>
          </Button>
          <h2 className="text-xl font-bold">Administrar contactos</h2>
        </div>
      </header>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-4">
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
            <label className="block text-sm font-medium mb-4">
              Redes Sociales
            </label>
            {Object.keys(contactData.socials).map((platform) => {
              const isOpen = openAccordion === platform;
              const props = useSpring({
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
              });
              return (
                <div key={platform} className="mb-4 w-full">
                  <div className="flex items-center justify-between w-full">
                    <MenuButton
                      className="w-full flex justify-between items-center px-4 py-2 border rounded-md"
                      onClick={() =>
                        toggleAccordion(
                          platform as keyof ContactData["socials"]
                        )
                      }>
                      <span>{platform}</span>
                      {isOpen ? (
                        <ChevronUp className="ml-2" />
                      ) : (
                        <ChevronDown className="ml-2" />
                      )}
                    </MenuButton>
                  </div>
                  {isOpen && (
                    <animated.div
                      style={props}
                      className="mt-2 w-full space-y-2 pl-4 border-l-4 border-primary">
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
                    </animated.div>
                  )}
                </div>
              );
            })}
          </div>
          <Button type="submit">Guardar Cambios</Button>
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

export default withAuth(AdminContacts);
