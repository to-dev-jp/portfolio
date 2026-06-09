"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "@/app/page.module.css";
import { useScrollContext } from "@/context/provider/ScrollProvider";

export const AboutOverlay = () => {
  const { section } = useScrollContext();
  const [aboutModal, setAboutModal] = useState(false);

  return (
    <>
      <div
        className={
          section === "about"
            ? `${styles.aboutContainer} ${styles.show}`
            : styles.aboutContainer
        }
      >
        <p className={styles.overlayHead}>ABOUT-ME</p>
        <div className={styles.aboutBox}>
          <p className={styles.overlayText}>
            初めまして、岡本 匠と申します。
            <br />
            フリーのエンジニアとして活動してきました。
            <br />
            現在は活躍の場を広めるべく就職を目指しています。
            <br />
            動物、主に猫が好き。
          </p>
          <button
            onClick={() => {
              setAboutModal(true);
            }}
            className={
              section === "about"
                ? `${styles.aboutOverlayButton} ${styles.show}`
                : styles.aboutOverlayButton
            }
          >
            <p className={styles.overlaySubHead}>プロフィールへ</p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <p className={styles.overlaySubHead}>view more</p>
              <Image
                width={14}
                height={14}
                style={{ transform: "translateY(2.6px)" }}
                src="/double-arrow.png"
                alt=""
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={
          aboutModal ? `${styles.aboutModal} ${styles.open}` : styles.aboutModal
        }
      >
        <div className={styles.modalWrap}>
          <div className={styles.modalBox}>
            <button
              className={styles.aboutModalCloseButton}
              onClick={() => {
                setAboutModal(false);
              }}
            >
              <Image src="/close.png" width="22" height="22" alt="" />
            </button>
            <p className={styles.modalHead}>INTRODUCTION</p>
            <div className={styles.aboutTopBox}>
              <Image
                className={styles.aboutProfileImg}
                width={100}
                height={100}
                alt=""
                src="/icon-black.png"
              />
              <div>
                <p className={styles.modalText}>
                  初めまして、岡本 匠と申します。
                  <br />
                  1996年生まれ、大阪府育ち、石川県在住。
                  <br />
                  大学在学中に、精神的な病にかかってしまい、そこから引きこもり生活へ。
                  <br />
                  体調が回復してきた26歳の頃に、「このままではダメだ」と、プログラミングの勉強を始めました。
                  <br />
                  最初は、苦戦しながらも、wordpressのブロックエディタ制作から始まり、次第にオリジナルテーマを自作できるようになり、まずはフリーとして活動を始めることに。
                  <br />
                  学習を進めるにつれ、案件も少しずつ獲得できるようになり、
                  <br />
                  さらに学習した内容を、もっと高いレベルで実践してみたいと思うようになったことで就職を決意。
                  <br />
                  Typescript, Next.js, Electron,
                  react-three/fiberなどをメインに触っています。
                  <br />
                  現在、その他にもGo(Echo)や、pythonなども学習しながら、Flutter,Docker,ローカルLLMなどにも挑戦中。
                  <br />
                  とにかく、新しい技術に触れるのが好きで、毎日楽しく学習できています。
                </p>
              </div>
            </div>
            <div className={styles.aboutMiddleBox}>
              <p className={styles.modalHead}>SKILLS</p>
              <div className={styles.aboutMiddleInner}>
                <ul className={styles.aboutSkillsList}>
                  <li className={styles.modalText}>Typescript</li>
                  <li className={styles.modalText}>Next.js</li>
                  <li className={styles.modalText}>Electron</li>
                  <li className={styles.modalText}>PHP</li>
                  <li className={styles.modalText}>Wordpress</li>
                  <li className={styles.modalText}>Go(Echo/勉強中)</li>
                  <li className={styles.modalText}>python(勉強中)</li>
                  <li className={styles.modalText}>Blender</li>
                  <li className={styles.modalText}>Dart</li>
                  <li className={styles.modalText}>Flutter(勉強中)</li>
                </ul>
                <div>
                  <p className={styles.modalText}>
                    普段は、フロントエンド領域の分野をメインに学習しています。新しい技術や最適化技術に強い関心があります。理想のエンジニア像として、将来的にはフルスタックでどのような分野でも活躍できるようになりたいと思っており、フロント技術のみならずバックエンドやセキュリティ的な分野にも少しずつ学習範囲を広げている最中です。webからモバイル・デスクトップアプリなど、様々な範囲の学習を通すことで、プログラミングに対する総体的な理解が深まったと感じています。
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.aboutBottomBox}>
              <p className={styles.modalHead}>STRENGTH</p>
              <p className={styles.modalText}>
                私の強みは特に継続力、自走力にあると考えています。成り行きではあるものの、独学のみでwordpress,Next.js,Electron,Echoなどの学習を行い、基本的なアプリケーション制作やweb制作案件などをこなしてきました。また、技術自体への関心が高いことも強みです。そのおかげで、今まで諦めることなく楽しく学習を続けてこれました。「やらされている」のではなく、率先して習得範囲を広げてきたことがその証明だと考えています。エンジニア的な能力の他にもフリーとして活動してきた経験から、営業やクライアント様への対応なども経験してきたことも一つの強みかと思います。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
