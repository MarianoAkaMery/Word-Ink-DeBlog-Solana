// SuccessModal.js
import React, { useEffect, useRef } from "react";
import styles from "./modal.module.css";

interface NoContentModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export function NoContentModal({ isOpen, closeModal }: NoContentModalProps) {
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
            <h1>No Content!</h1>
            <p>Make sure to add some content before posting</p>
          </div>
        </dialog>
      )}
    </>
  );
}
