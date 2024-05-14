// InputModal.js
import React, { useEffect, useRef } from "react";
import styles from "./modal.module.css";

interface InputModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  subtitle: string;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  onSubmit: () => void;
}

export function InputModal({
  isOpen,
  closeModal,
  title,
  subtitle,
  setTitle,
  setSubtitle,
  onSubmit,
}: InputModalProps) {
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtitle(e.target.value);
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
            <h1>Enter Title and Subtitle</h1>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Title"
              className={styles.input}
            />
            <input
              type="text"
              value={subtitle}
              onChange={handleSubtitleChange}
              placeholder="Subtitle"
              className={styles.input}
            />
            <button onClick={onSubmit} className={styles.button}>
              Submit
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
