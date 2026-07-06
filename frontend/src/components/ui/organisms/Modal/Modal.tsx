import type { MouseEvent } from "react";

import type { ModalProps } from "./Modal.types";

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  closeOnOverlayClick = true,
}: ModalProps) {
  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose?.();
    }
  };

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-xl bg-surface shadow-xl"
        onClick={handleModalClick}
      >
        <header className="border-b border-border px-6 py-4">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-textPrimary"
          >
            {title}
          </h2>
        </header>

        <div className="px-6 py-4">
          {children}
        </div>

        {footer && (
          <footer className="border-t border-border px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}