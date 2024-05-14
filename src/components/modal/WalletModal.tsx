// WalletModal.js
import React, { useEffect, useRef } from "react";
import styles from "./modal.module.css";
import { MdError } from "react-icons/md";


interface WalletModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onConnect: () => void;
}

export function WalletModal({ isOpen, closeModal, onConnect }: WalletModalProps) {
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
            <MdError className={styles.icon} />
            <h1>Connect Wallet</h1>
            <p>Please connect your wallet to continue.</p>
            
          </div>
        </dialog>
      )}
    </>
  );
}
