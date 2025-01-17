"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "../../lib/firebaseClient";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ContactData, Social } from "../../models/ContactData"; // Importa el modelo ContactData
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";

export function ContactosAdmin() {
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
      alert("Información de contacto actualizada correctamente");
    } catch (error) {
      console.error("Error actualizando la información de contacto:", error);
    }
  };

  const handleEdit = (platform: keyof ContactData["socials"]) => {
    const social = contactData.socials[platform];
    setEditContact({ platform, url: social.url, username: social.username });
  };

  const handleDelete = async (platform: keyof ContactData["socials"]) => {
    const updatedSocials = { ...contactData.socials };
    delete updatedSocials[platform];
    setContactData({ ...contactData, socials: updatedSocials });

    const docRef = doc(db, "contact", "contact");
    await updateDoc(docRef, { socials: updatedSocials });
  };

  const handleSave = async () => {
    if (editContact) {
      const updatedSocials = {
        ...contactData.socials,
        [editContact.platform]: {
          url: editContact.url,
          username: editContact.username,
        },
      };
      setContactData({ ...contactData, socials: updatedSocials });

      const docRef = doc(db, "contact", "contact");
      await updateDoc(docRef, { socials: updatedSocials });

      setEditContact(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Información de Contacto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              value={contactData.email}
              onChange={(e) =>
                setContactData({ ...contactData, email: e.target.value })
              }
            />
          </div>
          <div>
            <h3 className="text-lg font-medium">Redes Sociales</h3>
            <ul className="space-y-2">
              {Object.keys(contactData.socials).map((platform) => (
                <li
                  key={platform}
                  className="flex justify-between items-center">
                  <span>{platform}</span>
                  <Menu menuButton={<MenuButton>⋮</MenuButton>}>
                    <MenuItem onClick={() => handleEdit(platform as keyof ContactData["socials"])}>Editar</MenuItem>
                    <MenuItem onClick={() => handleDelete(platform as keyof ContactData["socials"])}>Eliminar</MenuItem>
                  </Menu>
                </li>
              ))}
            </ul>
          </div>
          <Button type="submit">Guardar Cambios</Button>
        </form>
        {editContact && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">
              Editar {editContact.platform}
            </h3>
            <Input
              placeholder="URL"
              value={editContact.url}
              onChange={(e) =>
                setEditContact({ ...editContact, url: e.target.value })
              }
            />
            <Input
              placeholder="Nombre de Usuario"
              value={editContact.username}
              onChange={(e) =>
                setEditContact({ ...editContact, username: e.target.value })
              }
            />
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
