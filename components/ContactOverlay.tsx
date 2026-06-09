"use client";

import { useState } from "react";
import styles from "@/styles/contact.module.css";
import { useScrollContext } from "@/context/provider/ScrollProvider";
import ContactForm from "./ContactForm";

export const ContactOverlay = () => {
  const { section } = useScrollContext();
  const [contactModal, setContactModal] = useState(false);

  return (
    <>
      <div
        className={
          section === "contact"
            ? `${styles.contactContainer} ${styles.show}`
            : styles.contactContainer
        }
      >
        {section === "contact" && (
          <button onClick={() => setContactModal(true)}>
            <div>
              <p className={`${styles.overlayHead} ${styles.contact}`}>
                GET IN TOUCH
              </p>
              <p className={`${styles.overlaySubHead} ${styles.contact}`}>
                CLICK HERE!
              </p>
            </div>
          </button>
        )}
      </div>
      <ContactForm
        isModalOpen={contactModal}
        setIsModalOpen={setContactModal}
      />
    </>
  );
};
