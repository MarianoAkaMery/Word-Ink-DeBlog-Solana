// SuccessModal.js
import React, { useEffect, useRef } from "react";
import { HiCheckCircle } from "react-icons/hi"; // Import the HiCheckCircle icon
import styles from "./modal.module.css";

interface SuccessModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export function SuccessModal({ isOpen, closeModal }: SuccessModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    if (e.target === dialogRef.current) {
      closeModal();
    }
  };

  return (
    <>
      {isOpen && (
        <dialog
          ref={dialogRef}
          onClick={handleBackdropClick}
          className={styles.modalBackdrop}
        >
          <div className={styles.modalContent}>
            <HiCheckCircle className={styles.icon} />
            <h1>Well done!</h1>
            <p>Keep up the great work with your articles!</p>
          </div>
        </dialog>
      )}
    </>
  );
}
