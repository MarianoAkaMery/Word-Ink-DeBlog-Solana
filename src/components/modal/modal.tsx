import React, { useEffect, useRef } from "react";
import styless from "./modal.module.css";

export function Modal({
  isOpen,
  closeModal,
  children,
}: {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

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
          className={styless.modalBackdrop}
        >
          <div>{children}</div>
        </dialog>
      )}
    </>
  );
}
