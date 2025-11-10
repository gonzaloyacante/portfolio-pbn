import { createContext, useContext, useEffect, useState } from "react";
import { settingsService } from "@/lib/services/settings";

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
        const s = await settingsService.get();
        if (s) setTitle(s.title);
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
