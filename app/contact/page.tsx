"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Contacto() {
  const [isCopied, setIsCopied] = useState(false);
  interface ProfileData {
    graphql: {
      user: {
        full_name: string;
        biography: string;
        profile_pic_url_hd: string;
        edge_owner_to_timeline_media: {
          edges: {
            node: {
              display_url: string;
            };
          }[];
        };
      };
    };
  }

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const { toast } = useToast();

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText("paola@correo.com");
    setIsCopied(true);
    toast({
      title: "Correo copiado",
      description: "El correo ha sido copiado al portapapeles.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  }, [toast]);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await fetch(
          "https://www.instagram.com/paolabolivarn/?__a=1&__d=dis"
        );
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching Instagram profile data:", error);
      }
    }
    fetchProfileData();
  }, []);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold text-center">Contacto</h1>
      <div className="flex flex-col items-center space-y-4">
        <Button asChild>
          <Link
            href="https://www.instagram.com/paolabolivarn?igsh=dmV4MnV6Y25sM2M2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2">
            <Instagram className="w-5 h-5" />
            <span>Sígueme en Instagram</span>
          </Link>
        </Button>
        {profileData && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <Image
              src={profileData.graphql.user.profile_pic_url_hd}
              alt="Foto de perfil"
              width={150}
              height={150}
              className="rounded-full"
            />
            <p className="text-lg">
              Nombre: {profileData.graphql.user.full_name}
            </p>
            <p className="text-lg">
              Biografía: {profileData.graphql.user.biography}
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {profileData.graphql.user.edge_owner_to_timeline_media.edges
                .slice(0, 3)
                .map((edge, index) => (
                  <Image
                    key={index}
                    src={edge.node.display_url}
                    alt={`Foto ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-auto rounded-md"
                  />
                ))}
            </div>
          </motion.div>
        )}
        <p className="text-lg">
          O contáctame por correo:{" "}
          <button
            onClick={copyToClipboard}
            className="text-primary hover:underline focus:outline-none">
            paola@correo.com
          </button>
        </p>
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
