import { Work } from "@/types/Types";
import { useContext, useMemo } from "react";
import { createContext } from "react";

const WorksUrlContext = createContext<string[] | null>(null);

export const WorksUrlProvider = ({
  works,
  children,
}: {
  works: Work[];
  children: React.ReactNode;
}) => {
  const worksUrls = useMemo(
    () => works.map((w) => w.work_img?.url ?? "/normal.png"),
    [works],
  );

  return (
    <WorksUrlContext.Provider value={worksUrls}>
      {children}
    </WorksUrlContext.Provider>
  );
};

export const useWorksUrls = () => {
  const ctx = useContext(WorksUrlContext);
  if (!ctx)
    throw new Error("useWorksUrls must be used within WorksUrlProvider");
  return ctx;
};
