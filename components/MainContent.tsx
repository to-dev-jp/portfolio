"use client";

import styles from "@/app/page.module.css";
import ThreeCanvas from "./three/ThreeCanvas";
import { MainOverlay } from "./MainOverlay";
import { AboutOverlay } from "./AboutOverlay";
import { WorksOverlay } from "./WorksOverlay";
import { ContactOverlay } from "./ContactOverlay";
import { Work } from "@/types/Types";
import { useScrollContext } from "@/context/provider/ScrollProvider";

export default function MainContent({ works }: { works: Work[] }) {
  const { scrollAreaRef, contentAreaRef } = useScrollContext();
  return (
    <>
      <div ref={scrollAreaRef} className={styles.viewPortWrapper}>
        <main ref={contentAreaRef} className={styles.mainContainer}>
          <section className={styles.mainSections}>
            <ThreeCanvas />
            <MainOverlay />
            <AboutOverlay />
            <WorksOverlay works={works} />
            <ContactOverlay />
          </section>
        </main>
      </div>
    </>
  );
}
