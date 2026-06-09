"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/contact.module.css";
import { handleEmailSubmit } from "@/hooks/submit";
import { ContactFormData } from "@/types/Types";

type Status = "success" | "error" | null;

export default function ContactForm({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [data, setData] = useState<ContactFormData>({
    name: "",
    company: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<Status>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setResponseMessage("");

    try {
      const result = await handleEmailSubmit(data);

      if (result?.success) {
        setResponseStatus("success");
        setResponseMessage("メール送信成功！");
        setData({
          name: "",
          company: "",
          email: "",
          subject: "",
          message: "",
        });
        closeTimerRef.current = setTimeout(() => {
          setIsModalOpen(false);
        }, 1500);
      } else {
        setResponseStatus("error");
        setResponseMessage(result?.message || "メール送信に失敗しました");
      }
    } catch (error) {
      setResponseMessage("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <>
      <div
        className={
          isModalOpen
            ? `${styles.contactForm} ${styles.open}`
            : styles.contactForm
        }
      >
        <form className={styles.contactFormWrap} onSubmit={onSubmit}>
          <div className={styles.contactFormBox}>
            <div>
              <p className={styles.contactFormHead}>CONTACT FORM</p>
              <p className={styles.contactFormMain}>
                お問い合わせの際は、氏名、会社名(ご所属先)、メールアドレス、メッセージ本文など必要事項をご入力の上、送信ください。
              </p>
            </div>
            <div>
              <div className={styles.formLabelWrap}>
                <label className={styles.contactFormLabel}>
                  Name:
                  <input
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div className={styles.formLabelWrap}>
                <label className={styles.contactFormLabel}>
                  Company:
                  <input
                    name="company"
                    value={data.company}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div className={styles.formLabelWrap}>
                <label className={styles.contactFormLabel}>
                  Subject:
                  <input
                    name="subject"
                    value={data.subject}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div className={styles.formLabelWrap}>
                <label className={styles.contactFormLabel}>
                  Email:
                  <input
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div className={styles.formLabelWrap}>
                <label className={styles.contactFormLabel}>
                  Message:
                  <textarea
                    name="message"
                    value={data.message}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </label>
              </div>
              <div className={styles.submitButtonWrap}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Now sending..." : "Submit"}
                  <Image
                    priority
                    className={styles.downloadIcon}
                    src="/back.png"
                    width="30"
                    height="30"
                    alt=""
                  />
                </button>
                <button
                  className={styles.contactFormCloseButton}
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  <Image
                    priority
                    className={styles.closeIcon}
                    src="/close-gray.png"
                    width="10"
                    height="10"
                    alt=""
                  />
                </button>
              </div>
              <div
                className={
                  isLoading
                    ? `${styles.submitLoadingBg} ${styles.open}`
                    : styles.submitLoadingBg
                }
              >
                <div
                  className={
                    isLoading
                      ? `${styles.submitLoadingModal} ${styles.open}`
                      : styles.submitLoadingModal
                  }
                >
                  <div className={styles.submitLoadingModalWrap}>
                    <div className={styles.loadingCircleBox}>
                      <div className={styles.spinner}>
                        <div className={styles.rect1}></div>
                        <div className={styles.rect2}></div>
                        <div className={styles.rect3}></div>
                        <div className={styles.rect4}></div>
                        <div className={styles.rect5}></div>
                      </div>
                    </div>
                    <p className={styles.submitLoadingText}>NOW SENDING...</p>
                  </div>
                </div>
              </div>
              <div
                className={
                  responseMessage
                    ? `${styles.submitResponseModal} ${styles.open}`
                    : styles.submitResponseModal
                }
              >
                <div>
                  {responseStatus === "success" ? (
                    <Image
                      className={styles.responseIcon}
                      priority
                      src="/back.png"
                      width="60"
                      height="60"
                      alt=""
                    />
                  ) : (
                    <Image
                      className={styles.responseIcon}
                      priority
                      src="/close.png"
                      width="60"
                      height="60"
                      alt=""
                    />
                  )}
                  <p className={styles.responseText}>{responseMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
