import { useMusic } from "@/hooks/useMusic";
import { createContext, useContext } from "react";

type MusicContextValue = ReturnType<typeof useMusic>;

const MusicContext = createContext<MusicContextValue | null>(null);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const musicHook = useMusic();

  return (
    <MusicContext.Provider value={musicHook}>{children}</MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const ctx = useContext(MusicContext);
  if (!ctx)
    throw new Error("useMusicContext must be used within MusicProvider");
  return ctx;
};
