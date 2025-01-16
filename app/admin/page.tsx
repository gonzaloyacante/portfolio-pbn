"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import Auth from "./auth";
import Projects from "./projects";
import Categories from "./categories";
import Presentation from "./presentation";
import Color from "./color";
import { auth } from "@/lib/firebaseClient";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <div className="space-y-8 flex-col">
      <h1 className="text-4xl font-bold text-center">Admin Panel</h1>
      <Button onClick={handleLogout} className="mb-4">
        Cerrar Sesión
      </Button>
      <Projects />
      <Categories />
      <Presentation />
      <Color />
    </div>
  );
}
