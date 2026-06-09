"use client";

import { useRef } from "react";
import { Header } from "./Header";
import styles from "@/app/page.module.css";
import { useScrollContext } from "@/context/provider/ScrollProvider";
import { useMusicContext } from "@/context/provider/MusicProvider";
import { AdvancedLoadingScreen } from "./LoadingScreen";

export const MainOverlay = () => {
  const { section } = useScrollContext();
  const { setMusicIsPlayed } = useMusicContext();

  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <>
      <audio loop ref={audioRef} src="/audio.mp3" />
      <Header audioRef={audioRef} />
      <div
        className={
          section != "top"
            ? `${styles.headline} ${styles.none}`
            : styles.headline
        }
      >
        <p className={styles.mainCopy}>The beauty of what comes next.</p>
        <p className={styles.subCopy}>
          Chasing the spark where imagination meets craft.
        </p>
        <p className={styles.introduction}>
          I'm a front-end engineer based in Ishikawa
          <br />I have a broad interest in new technologies and fields.
          <br />I love animals and own three cats.
        </p>
      </div>
      <AdvancedLoadingScreen
        models={["/hummingbird.gltf"]}
        audioStateControl={(state) => {
          setMusicIsPlayed(state);
        }}
      />
    </>
  );
};
