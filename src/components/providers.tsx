"use client";

import React, { createContext, useContext, useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ToastContext.Provider value={{ showToast }}>
          {children}

          {/* Toast Notification HUD */}
          <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom font-inter text-xs pointer-events-auto ${
                  toast.type === "success"
                    ? "bg-[#111516] border-primary text-primary"
                    : toast.type === "error"
                    ? "bg-[#111516] border-error text-error"
                    : "bg-[#111516] border-outline-variant text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
                </span>
                <span className="font-semibold">{toast.message}</span>
              </div>
            ))}
          </div>
        </ToastContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
