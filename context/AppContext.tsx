import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

interface AppContextProps {
  title: string;
  setTitle: (title: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState("Portfolio");

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const docRef = doc(db, "settings", "settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const titleData = docSnap.data().title;
          setTitle(titleData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };

    fetchTitle();
  }, []);

  return (
    <AppContext.Provider value={{ title, setTitle }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
