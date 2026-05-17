import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({
  checked,
  onChange,
  disabled = false
}: SwitchProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-all duration-300 relative outline-none disabled:opacity-50 disabled:pointer-events-none ${
        checked ? "bg-primary" : "bg-[#1c2122] border border-outline-variant"
      }`}
    >
      <div 
        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-sm ${
          checked ? "left-[22px]" : "left-1"
        }`}
      />
    </button>
  );
}
