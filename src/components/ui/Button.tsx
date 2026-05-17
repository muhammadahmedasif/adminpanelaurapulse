import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold text-xs duration-200 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary text-[#0b0f10] hover:bg-primary/90",
    secondary: "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
    outline: "border border-outline-variant text-on-surface hover:bg-surface-container-high",
    danger: "bg-error text-on-error hover:bg-error/90"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : null}
      {children}
    </button>
  );
}
