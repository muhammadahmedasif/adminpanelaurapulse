import React from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  variant?: "primary" | "danger";
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirming = false,
  variant = "primary"
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#111516] border border-[#1c2122] rounded-xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-semibold text-on-surface mb-2 font-inter">{title}</h3>
        <p className="text-xs text-on-surface-variant/80 mb-6 font-inter leading-relaxed">{description}</p>
        
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === "danger" ? "danger" : "primary"} 
            isLoading={isConfirming}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
