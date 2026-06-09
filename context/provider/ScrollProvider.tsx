import { useScroll } from "@/hooks/useScroll";
import { useScrollController } from "@/hooks/useScrollController";
import { createContext, useContext } from "react";

type ScrollContextValue = ReturnType<typeof useScroll> &
  ReturnType<typeof useScrollController>;

const ScrollContext = createContext<ScrollContextValue | null>(null);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollHook = useScroll();
  const scrollControllerHook = useScrollController(
    scrollHook.setScrollProgress,
  );

  return (
    <ScrollContext.Provider
      value={{
        ...scrollHook,
        ...scrollControllerHook,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx)
    throw new Error("useScrollContext must be used within ScrollProvider");
  return ctx;
};
