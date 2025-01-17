"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { Presentation } from "@/models/Presentation";
import Loader from "@/components/ui/loader";
import NoData from "@/components/ui/NoData";
import Error from "@/components/ui/Error";

export default function AboutMe() {
  const [presentationData, setPresentationData] = useState<Presentation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresentationData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "presentation"));
        const presentationData = querySnapshot.docs.map(
          (doc) => doc.data() as Presentation
        )[0];
        setPresentationData(presentationData);
      } catch (error) {
        console.error("Error fetching presentation data:", error);
        setError("Error fetching presentation data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPresentationData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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

  if (!presentationData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <NoData />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 min-h-screen flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold text-center">Sobre mí</h1>
      <Card>
        <CardHeader>
          <CardTitle>{presentationData?.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <Image
              src={presentationData?.image || "/placeholder.svg"}
              alt="Foto de perfil"
              width={300}
              height={400}
              className="rounded-lg object-cover"
              priority
            />
          </motion.div>
          <div className="space-y-4">
            {presentationData?.information.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                {text}
              </motion.p>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
