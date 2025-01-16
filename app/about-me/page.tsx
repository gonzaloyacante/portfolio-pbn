"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

type PresentationData = {
  image: string;
  information: string[];
};

export default function SobreMi() {
  const [presentationData, setPresentationData] =
    useState<PresentationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresentationData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "presentation"));
        const presentationData = querySnapshot.docs.map(
          (doc) => doc.data() as PresentationData
        )[0];
        setPresentationData(presentationData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching presentation data:", error);
        setLoading(false);
      }
    };

    fetchPresentationData();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold text-center">Sobre Mí</h1>
      <Card>
        <CardHeader>
          <CardTitle>Mi Pasión por la Caracterización</CardTitle>
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
