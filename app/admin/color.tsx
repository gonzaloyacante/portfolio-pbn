"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HexColorPicker } from "react-colorful";
import { Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Color() {
  const [color, setColor] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchColor = async () => {
      const colorSnapshot = await getDocs(collection(db, "settings"));
      const colorData = colorSnapshot.docs.map((doc) => doc.data().color)[0];
      setColor(colorData);
    };

    fetchColor();
  }, []);

  const handleUpdateColor = async (newColor: string) => {
    const colorRef = doc(db, "settings", "color");

    await updateDoc(colorRef, { color: newColor });

    if (newColor !== null) {
      setColor(newColor);
    }
    toast({
      title: "Color actualizado",
      description: "El color de la página ha sido actualizado exitosamente.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Edit className="mr-2" /> Gestionar Color
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Color de la Página</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Edit className="mr-2" /> Actualizar Color
              </Button>
            </DialogTrigger>
            <DialogContent>
              <h3 className="text-xl font-bold">Actualizar Color</h3>
              <HexColorPicker color={color} onChange={setColor} />
              <Button onClick={() => handleUpdateColor(color)} className="mt-4">
                Actualizar Color
              </Button>
            </DialogContent>
          </Dialog>
          <div
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: color }}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
