"use client";

import withAuth from "@/components/withAuth";
import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ContactData } from "../../../models/ContactData";
import { ChevronDown, ChevronUp } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import WarningModal from "@/components/WarningModal";
import AdminLayout from "@/components/AdminLayout";

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
  const [openAccordion, setOpenAccordion] = useState<
    keyof ContactData["socials"] | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      const docRef = doc(db, "contact", "contact");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ContactData;
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
      const docRef = doc(db, "contact", "contact");
      await setDoc(docRef, contactData);
      setSuccessMessage("Información de contacto actualizada correctamente");
      setErrorMessage(null);
    } catch (error) {
      console.error("Error updating contact information: ", error);
      setErrorMessage(
        "Hubo un error al actualizar la información de contacto: " +
          (error as Error).message
      );
      setSuccessMessage(null);
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
    <AdminLayout title="Administrar contactos">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={contactData.email}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
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
                  <button
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-2 border rounded-md hover:bg-muted/50 transition-colors"
                    onClick={() =>
                      toggleAccordion(platform as keyof ContactData["socials"])
                    }>
                    <span className="capitalize">{platform}</span>
                    {isOpen ? (
                      <ChevronUp className="ml-2" />
                    ) : (
                      <ChevronDown className="ml-2" />
                    )}
                  </button>
                </div>
                {isOpen && (
                  <animated.div
                    style={props}
                    className="mt-2 mb-8 px-8 w-full space-y-2 pl-4 border-l-2 border-primary">
                    <Input
                      name="url"
                      placeholder="URL"
                      value={editContact?.url || ""}
                      onChange={handleChange}
                      className="mb-2 w-full"
                    />
                    <Input
                      name="username"
                      placeholder="Username"
                      value={editContact?.username || ""}
                      onChange={handleChange}
                      className="mb-2 w-full"
                    />
                  </animated.div>
                )}
              </div>
            );
          })}
        </div>
        <Button type="submit" className="w-full">
          Guardar Cambios
        </Button>
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
      {warningMessage && (
        <WarningModal
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
          onConfirm={() => {
            setWarningMessage(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

export default withAuth(AdminContacts);
