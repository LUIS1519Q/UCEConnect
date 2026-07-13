import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;

  size?: "sm" | "md" | "lg";
}