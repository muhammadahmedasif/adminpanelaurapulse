"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Bell, Search, Menu, Loader2 } from "lucide-react";
import { useSidebarStore } from "@/hooks/useSidebarStore";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { toggleSidebar } = useSidebarStore();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    users: any[];
    sessions: any[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);

  // Avoid hydration mismatch by waiting for mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounced federated search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const [usersRes, sessionsRes] = await Promise.all([
          apiClient.get(`/users?search=${encodeURIComponent(searchQuery)}&limit=3`),
          apiClient.get(`/sessions?search=${encodeURIComponent(searchQuery)}&limit=3`)
        ]);
        setSearchResults({
          users: usersRes.data?.users || [],
          sessions: sessionsRes.data?.sessions || []
        });
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate to sessions page with the search query by default
    router.push(`/sessions?search=${encodeURIComponent(searchQuery)}`);
    setShowDropdown(false);
    setSearchQuery("");
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
        
        <form onSubmit={handleSearchSubmit} className="w-full relative" ref={dropdownRef}>
          <div className="flex items-center bg-[#111516] dark:bg-[#111516] light:bg-[#f1f5f9] px-3.5 py-1.5 rounded-lg border border-[#1c2122] dark:border-[#1c2122] light:border-[#cbd5e1] w-full transition-all focus-within:border-primary/50">
            <Search className="text-on-surface-variant w-4 h-4 mr-2" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/60 text-on-surface outline-none"
              placeholder="Search patients or sessions..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowDropdown(true);
              }}
            />
          </div>

          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0b0f10] border border-[#1c2122] rounded-xl shadow-2xl overflow-hidden z-50 py-2 max-h-[380px] overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-6 text-xs text-on-surface-variant/70 gap-2 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Searching database...
                </div>
              ) : !searchResults || (searchResults.users.length === 0 && searchResults.sessions.length === 0) ? (
                <div className="text-center py-6 text-xs text-on-surface-variant/60 font-mono">
                  No matching patients or sessions found.
                </div>
              ) : (
                <div className="space-y-3 p-1">
                  {searchResults.users.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-on-surface-variant/70 font-semibold font-mono">
                        Patients
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {searchResults.users.map((user) => (
                          <div
                            key={user._id || user.id}
                            onClick={() => {
                              router.push(`/users?search=${encodeURIComponent(user.name)}`);
                              setShowDropdown(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#111516] cursor-pointer transition-colors"
                          >
                            <div className="w-7 h-7 rounded-full bg-[#1c2122] flex items-center justify-center text-primary text-xs font-bold font-mono overflow-hidden flex-shrink-0">
                              {user.profileImage ? (
                                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                user.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs text-on-surface font-semibold truncate">{user.name}</p>
                              <p className="text-[10px] text-on-surface-variant/70 truncate">{user.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.sessions.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-on-surface-variant/70 font-semibold font-mono border-t border-[#1c2122] pt-3">
                        Therapy Sessions
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {searchResults.sessions.map((session) => (
                          <div
                            key={session.sessionId}
                            onClick={() => {
                              router.push(`/sessions?search=${encodeURIComponent(session.userName)}`);
                              setShowDropdown(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#111516] cursor-pointer transition-colors"
                          >
                            <div className="w-7 h-7 rounded bg-[#1c2122] flex items-center justify-center text-[#98cbb4] text-xs">
                              <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs text-on-surface font-semibold truncate">Session with {session.userName}</p>
                              <p className="text-[10px] text-on-surface-variant/70 truncate font-mono">
                                ID: {session.sessionId.substring(0, 8)}... • {session.duration || "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
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
