import React, { useEffect, useRef } from "react";
import styles from "./modal.module.css";

export function Modal({
  isOpen,
  closeModal,
  children,
  variant = "transparent",
}: {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  variant?: "transparent" | "opaque";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    // Add event listener when the modal is open
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup event listener when the modal is closed or component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDialogElement, MouseEvent>
  ) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <dialog
          ref={dialogRef}
          onClick={handleBackdropClick}
          className={` ${variant === "opaque" ? styles.opaqueBackdrop : styles.modalBackdrop}`}
        >
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            {children}
          </div>
        </dialog>
      )}
    </>
  );
}
