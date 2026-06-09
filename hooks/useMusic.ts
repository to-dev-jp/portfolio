import { useState } from "react";

export const useMusic = () => {
  const [musicIsPlayed, setMusicIsPlayed] = useState(false);
  return { musicIsPlayed, setMusicIsPlayed };
};
