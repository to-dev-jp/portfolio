"use client";

import Image from "next/image";
import styles from "@/app/page.module.css";
import { useScrollContext } from "@/context/provider/ScrollProvider";
import { Work } from "@/types/Types";
import { useState } from "react";

export const WorksOverlay = ({ works }: { works: Work[] }) => {
  const { section, workIndex } = useScrollContext();
  const [workData, setWorkData] = useState<Work | undefined>();

  const isWork = section === "works01" || section === "works02";
  const fallbackImgSize = 300;

  return (
    <>
      <div
        className={
          isWork
            ? `${styles.worksContainer} ${styles.show}`
            : styles.worksContainer
        }
      >
        {works.map((work, index) => {
          if (index !== workIndex) return;
          return (
            <div key={work.id}>
              <p className={styles.overlayHead}>{work.work_title}</p>
              <div className={styles.worksBox}>
                <p className={styles.overlayText}>{work.work_desc}</p>
                <button
                  onClick={() => {
                    setWorkData(work);
                  }}
                  className={
                    isWork
                      ? `${styles.worksOverlayButton} ${styles.show}`
                      : styles.worksOverlayButton
                  }
                >
                  <p className={styles.overlaySubHead}>制作実績詳細へ</p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
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
          );
        })}
      </div>
      <div
        className={
          workData ? `${styles.worksModal} ${styles.open}` : styles.worksModal
        }
      >
        <div className={styles.modalWrap}>
          <div className={styles.modalBox}>
            <button
              className={styles.worksModalCloseButton}
              onClick={() => {
                setWorkData(undefined);
              }}
            >
              <Image src="/close.png" width="22" height="22" alt="" />
            </button>
            {workData && (
              <>
                <div className={styles.workTopBox}>
                  <div className={styles.workTopImgWrap}>
                    <Image
                      className={styles.workTopImg}
                      width={workData?.work_img?.width ?? fallbackImgSize}
                      height={workData?.work_img?.height ?? fallbackImgSize}
                      src={workData?.work_img?.url || "/normal.png"}
                      alt={workData?.work_title || ""}
                    />
                  </div>
                  <div className={styles.workDescWrap}>
                    <div>
                      <p className={styles.modalSubHead}>
                        {workData?.work_title}
                      </p>
                    </div>
                    <div className={styles.workCatBox}>
                      <p className={styles.modalText}>カテゴリ:</p>
                      <p className={styles.modalText}>{workData?.category}</p>
                    </div>
                    <div className={styles.workDescBox}>
                      <p className={styles.modalText}>作品概要</p>
                      <p className={styles.modalText}>{workData?.work_desc}</p>
                    </div>
                    {workData.href && (
                      <div className={styles.workUrlBox}>
                        <p className={styles.modalText}>サイトURL</p>
                        <p
                          className={styles.modalText}
                          style={{ textDecoration: "underline" }}
                        >
                          {workData?.href}
                        </p>
                        <Image
                          style={{ transform: "translateY(3px)" }}
                          className={styles.nextArrow}
                          priority
                          src="/double-arrow.png"
                          width="26"
                          height="26"
                          alt=""
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.workBgWrap}>
                  <p className={styles.modalSubHead}>制作背景</p>
                  <p className={styles.modalText}>{workData.work_bg}</p>
                </div>
                <div className={styles.workSkillWrap}>
                  <p className={styles.modalSubHead}>技術選定</p>
                  <p className={styles.modalText}>{workData.work_tech}</p>
                </div>
                <div className={styles.workAboutWrap}>
                  <p className={styles.modalSubHead}>この作品について</p>
                  <p className={styles.modalText}>{workData.work_about}</p>
                </div>
                <div className={styles.worksSubImgWrap}>
                  {workData.work_sub_imgs &&
                    workData.work_sub_imgs.length > 0 &&
                    workData.work_sub_imgs.map((subImg, index) => {
                      return (
                        <Image
                          key={`workData?.work_title-${index}`}
                          className={styles.workBottomImg}
                          width={subImg.width}
                          height={subImg.height}
                          src={subImg.url}
                          alt={`workData?.work_title-${index}イメージ画像`}
                        />
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
