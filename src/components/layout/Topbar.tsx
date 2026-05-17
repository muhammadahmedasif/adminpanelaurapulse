"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Bell, Search, Menu } from "lucide-react";
import { useSidebarStore } from "@/hooks/useSidebarStore";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { toggleSidebar } = useSidebarStore();

  // Avoid hydration mismatch by waiting for mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-16 z-40 bg-[#0b0f10]/95 dark:bg-[#0b0f10]/95 light:bg-[#ffffff]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f10]/80 border-b border-[#1c2122] dark:border-[#1c2122] light:border-[#e2e8f0] flex items-center justify-between px-4 md:px-6 transition-colors duration-200">
      {/* Left side actions and Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-sm">
        <button 
          onClick={toggleSidebar}
          className="md:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer active:scale-95"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center bg-[#111516] dark:bg-[#111516] light:bg-[#f1f5f9] px-3.5 py-1.5 rounded-lg border border-[#1c2122] dark:border-[#1c2122] light:border-[#cbd5e1] w-full transition-all focus-within:border-primary/50">
          <Search className="text-on-surface-variant w-4 h-4 mr-2" />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/60 text-on-surface outline-none"
            placeholder="Search patients, sessions, or logs..."
            type="text"
          />
        </div>
      </div>

      {/* Action Items */}
      <div className="flex items-center gap-3">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer active:scale-95 border border-[#1c2122] dark:border-[#1c2122] light:border-[#e2e8f0]"
            title="Toggle Light/Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-primary" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>
        )}

        <button 
          className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer active:scale-95 border border-[#1c2122] dark:border-[#1c2122] light:border-[#e2e8f0]"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
