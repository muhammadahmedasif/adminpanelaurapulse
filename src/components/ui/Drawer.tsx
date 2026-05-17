import React from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-inter">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#111516] border-l border-[#1c2122] shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#1c2122] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-on-surface">{title}</h3>
              {subtitle ? <p className="text-xs text-on-surface-variant/80 mt-0.5">{subtitle}</p> : null}
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
