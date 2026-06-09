"use client";

import Image from "next/image";
import styles from "@/app/page.module.css";
import { useScrollContext } from "@/context/provider/ScrollProvider";
import { RefObject, useEffect, useRef, useState } from "react";
import { useMusicContext } from "@/context/provider/MusicProvider";
import { SECTION_START_POS } from "./const";
import Link from "next/link";

export const Header = ({
  audioRef,
}: {
  audioRef: RefObject<HTMLAudioElement | null>;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { musicIsPlayed } = useMusicContext();
  const { scrollToRatio } = useScrollContext();
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        if (!audio.paused) {
          wasPlayingRef.current = true;
          audio.pause();
        }
      } else if (wasPlayingRef.current) {
        audio.play().catch();
        wasPlayingRef.current = false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (musicIsPlayed) {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [musicIsPlayed]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div
          className={styles.headerTitleWrap}
          onClick={() => {
            scrollToRatio(SECTION_START_POS.top);
          }}
        >
          <div>
            <div className={styles.headerTitleBox}>
              <Image
                className={styles.headerIcon}
                priority
                src="/icon-white.png"
                width="50"
                height="50"
                alt="ポートフォリオロゴ"
              />
              <h1 className={styles.headerTitle}>Takumi Okamoto</h1>
              <p className={styles.jobTitle}>DEVELOPER/DESIGNER</p>
            </div>
            <h1 className={styles.headerTitle}> Portfolio</h1>
          </div>
        </div>
        <div
          className={styles.headerMenuButtons}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ul className={styles.menuList}>
            <li
              onClick={() => {
                scrollToRatio(SECTION_START_POS.top);
              }}
              className={styles.menuListItem}
            >
              <Image
                className={styles.menuListIcon}
                priority
                src="/top-white.png"
                width="30"
                height="30"
                alt="topアイコン"
              />
              <p className={styles.menuListText}>TOP</p>
            </li>
            <li
              onClick={() => {
                scrollToRatio(SECTION_START_POS.about);
              }}
              className={styles.menuListItem}
            >
              <Image
                className={styles.menuListIcon}
                priority
                src="/about-white.png"
                width="30"
                height="30"
                alt="aboutアイコン"
              />
              <p className={styles.menuListText}>ABOUT</p>
            </li>
            <li
              onClick={() => {
                scrollToRatio(SECTION_START_POS.works);
              }}
              className={styles.menuListItem}
            >
              <Image
                className={styles.menuListIcon}
                priority
                src="/works-white.png"
                width="30"
                height="30"
                alt="worksアイコン"
              />
              <p className={styles.menuListText}>WORKS</p>
            </li>
            <li>
              <Link
                target="_blank"
                href="https://github.com/to-dev-jp"
                className={styles.menuListItem}
              >
                <Image
                  className={styles.menuListIcon}
                  priority
                  src="/github-white.png"
                  width="30"
                  height="30"
                  alt="githubアイコン"
                />
                <p className={styles.menuListText}>GITHUB</p>
              </Link>
            </li>
          </ul>
          <div className={styles.menuButtonWrap}>
            <button
              className={styles.musicToggleButton}
              style={{
                display: "flex",
              }}
              onClick={() => {
                handlePlayPause();
              }}
            >
              {isPlaying ? (
                <>
                  <Image
                    className={styles.soundIcon}
                    priority
                    src="/soundon.png"
                    width="30"
                    height="30"
                    alt="サウンドオフアイコン"
                  />
                  <p className={styles.soundText}>Sound On</p>
                </>
              ) : (
                <>
                  <Image
                    className={styles.soundIcon}
                    priority
                    src="/sound.png"
                    width="30"
                    height="30"
                    alt="サウンドオンアイコン"
                  />
                  <p className={styles.soundText}>Sound Off</p>
                </>
              )}
            </button>
            <button
              onClick={() => {
                scrollToRatio(SECTION_START_POS.contact);
              }}
              className={styles.menuButton}
            >
              <Image
                className={styles.menuIcon}
                priority
                src="/contact-white.png"
                width="30"
                height="30"
                alt="メニューアイコン"
              />
              <p className={styles.soundText}>Contact</p>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
