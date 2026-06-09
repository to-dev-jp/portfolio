"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "@/app/page.module.css";
import { useResourceLoader } from "@/hooks/useResourceLoader";

interface LoadingScreenProps {
  models: string[];
  audioStateControl: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AdvancedLoadingScreen({
  models,
  audioStateControl,
}: LoadingScreenProps) {
  const loadingState = useResourceLoader({ models });

  // ローディング完了後にaudioModalを表示
  const [audioModal, setAudioModal] = useState(true);

  const isLoaded = !loadingState.isLoading;
  const progress = loadingState.progress ?? 0;
  const totalLoaded = loadingState.loaded ?? 0;
  const total = loadingState.total ?? 0;
  const currentItem = loadingState.currentItem;

  return (
    <>
      <div
        className={
          isLoaded
            ? `${styles.loadingScreen} ${styles.none}`
            : styles.loadingScreen
        }
      >
        <div className={styles.loadingScreenWrap}>
          <div className={styles.loadingHeadWrap}>
            <Image
              priority
              className={styles.loadingLogo}
              src="/icon-black.png"
              width="30"
              height="30"
              alt="ポートフォリオロゴ"
            />
            <h1 className={styles.loadingHead}>
              Takumi Okamoto&apos;s Portfolio
            </h1>
          </div>

          <div className={styles.progressBarWrap}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
            <p className={styles.loadingText}>{progress}%</p>
          </div>

          <div className={styles.progressWrap}>
            <p className={styles.loadingText}>
              {totalLoaded} / {total}
            </p>
            {currentItem && <p className={styles.loadingText}>{currentItem}</p>}
            {loadingState.error && (
              <div className={`${styles.loadingText} ${styles.error}`}>
                {loadingState.error}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={
          audioModal
            ? `${styles.audioSelectModal} ${styles.open}`
            : styles.audioSelectModal
        }
      >
        <div className={styles.audioModalWrap}>
          <p className={styles.audioHead}>
            このサイトでは、音声が再生されます。より没入感のある体験をお楽しみいただくために、ぜひサウンドオンの状態でご覧ください。
          </p>
          <div className={styles.audioButtonWrap}>
            <button
              className={`${styles.audioButton} ${styles.left}`}
              onClick={() => {
                audioStateControl(true);
                setAudioModal(false);
              }}
            >
              <Image
                priority
                className={styles.soundIcon}
                src="/soundon.png"
                width="30"
                height="30"
                alt="サウンドオンアイコン"
              />
              SOUND ON
            </button>
            <button
              className={`${styles.audioButton} ${styles.right}`}
              onClick={() => {
                audioStateControl(false);
                setAudioModal(false);
              }}
            >
              <Image
                priority
                className={styles.soundIcon}
                src="/sound.png"
                width="30"
                height="30"
                alt="サウンドオフアイコン"
              />
              WITHOUT SOUND
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
