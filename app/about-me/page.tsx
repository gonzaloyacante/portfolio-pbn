"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Loader } from "../../components/Loader";
import NoData from "@/components/NoData";
import Error from "@/components/ui/Error";

export default function AboutMe() {
  const [title, setTitle] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching presentation data:", error);
        setError("Error fetching presentation data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Error message={error} />
      </div>
    );
  }

  if (!title && !aboutMe && !profileImageUrl) {
    return (
      <div className="flex justify-center items-center h-screen">
        <NoData message="No hay información disponible." />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6 max-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      {title ? (
        <h1 className="text-xl font-bold text-center">{title}</h1>
      ) : (
        <NoData message="No hay título disponible." />
      )}

      {profileImageUrl ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center">
          <Image
            src={profileImageUrl || "/placeholder.svg"}
            alt="Foto de perfil"
            width={150}
            height={150}
            className="rounded-full object-cover"
            style={{ objectFit: "cover" }}
            priority
          />
        </motion.div>
      ) : (
        <NoData message="No hay imagen de perfil disponible." />
      )}

      {aboutMe ? (
        <div className="space-y-4 w-full mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <div dangerouslySetInnerHTML={{ __html: aboutMe }} />
          </motion.div>
        </div>
      ) : (
        <NoData message="No hay información sobre mí disponible." />
      )}
    </motion.div>
  );
}
