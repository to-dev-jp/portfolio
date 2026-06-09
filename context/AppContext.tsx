import { ScrollProvider } from "./provider/ScrollProvider";
import { MusicProvider } from "./provider/MusicProvider";
import { WorksUrlProvider } from "./provider/WorksProvider";
import { Work } from "@/types/Types";

export const AppProvider = ({
  children,
  works,
}: {
  children: React.ReactNode;
  works: Work[];
}) => {
  return (
    <ScrollProvider>
      <WorksUrlProvider works={works}>
        <MusicProvider>{children}</MusicProvider>
      </WorksUrlProvider>
    </ScrollProvider>
  );
};
