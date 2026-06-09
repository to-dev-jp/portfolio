"use client";

import { AppProvider } from "@/context/AppContext";
import MainContent from "./MainContent";
import { Work } from "@/types/Types";

export default function MainView({ works }: { works: Work[] }) {
  return (
    <AppProvider works={works}>
      <MainContent works={works} />
    </AppProvider>
  );
}
