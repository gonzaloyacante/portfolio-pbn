"use client";

import Link from "next/link";
import { Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { ContactData, socialIcons } from "@/models/ContactData";
import Loader from "@/components/ui/loader";
import NoData from "@/components/NoData";
import Error from "@/components/ui/Error";

export default function Contacto() {
  const [isCopied, setIsCopied] = useState(false);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = useCallback(() => {
    if (contactData) {
      navigator.clipboard.writeText(contactData.email);
      setIsCopied(true);
      toast({
        title: "Correo copiado",
        description: "El correo ha sido copiado al portapapeles.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [contactData, toast]);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "contact"));
        const contactData = querySnapshot.docs.map(
          (doc) => doc.data() as ContactData
        )[0];
        if (contactData) {
          setContactData(contactData);
        } else {
          console.error("No such document!");
          setError("No se encontró la información de contacto.");
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setError("Error al obtener la información de contacto.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ height: "calc(100vh - 10rem)" }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Error message={error} />
      </div>
    );
  }

  if (!contactData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <NoData message="No hay información de contacto." />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold text-center">Contacto</h1>
      <div className="flex flex-col items-center space-y-4">
        {contactData && (
          <>
            {Object.entries(contactData.socials).map(([key, value]) => {
              if (value && value.url) {
                const Icon = socialIcons[key as keyof typeof socialIcons];
                return (
                  <Button asChild key={key}>
                    <Link
                      href={value.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2">
                      <Icon className="w-7 h-7" />
                      <span>{value.username}</span>
                    </Link>
                  </Button>
                );
              }
              return null;
            })}
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 text-primary hover:underline focus:outline-none">
              <span>{contactData.email}</span>
              <Clipboard className="w-4 h-4" />
            </button>
          </>
        )}
        {isCopied && (
          <motion.p
            className="text-sm text-green-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            ¡Correo copiado al portapapeles!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
