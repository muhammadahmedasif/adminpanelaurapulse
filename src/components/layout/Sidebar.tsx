"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioWaveform } from "lucide-react";
import { useSidebarStore } from "@/hooks/useSidebarStore";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Users", href: "/users", icon: "group" },
  { name: "Sessions", href: "/sessions", icon: "medical_services" },
  { name: "Emergency", href: "/emergency", icon: "emergency", error: true },
  { name: "Analytics", href: "/analytics", icon: "analytics" },
  { name: "Logs", href: "/logs", icon: "description" },
];

const routePermissions: { [key: string]: string } = {
  "/users": "users.read",
  "/sessions": "sessions.read",
  "/emergency": "emergency.read",
  "/analytics": "analytics.read",
  "/logs": "logs.read",
  "/settings": "settings.read",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebarStore();
  const { adminUser } = useAuth();

  // Filter navigation items based on permissions
  const visibleNavItems = navItems.filter((item) => {
    const requiredPermission = routePermissions[item.href];
    if (!requiredPermission) return true;
    if (adminUser?.role === "superAdmin") return true;
    return adminUser?.permissions?.includes(requiredPermission);
  });

  const showSettings = adminUser?.role === "superAdmin" || adminUser?.permissions?.includes("settings.read");

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-full w-[260px] flex flex-col p-4 z-50 bg-[#0b0f10] border-r border-[#1c2122] shadow-xl transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
      <div className="flex items-center gap-2 mb-10 mt-4 px-2">
        <AudioWaveform className="h-7 w-7 text-primary animate-pulse" />
        <div className="flex flex-col">
          <span className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent leading-tight">
            AuraPulse
          </span>
          <span className="text-[10px] text-on-surface-variant">
            Your mental health Companion
          </span>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg duration-200 ease-in-out transform active:scale-[0.99] ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className={`material-symbols-outlined ${item.error ? 'text-error' : ''}`}>{item.icon}</span>
              <span className="font-label-md">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-outline-variant space-y-1">
        {showSettings && (
          <Link 
            href="/settings" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg duration-200 transition-all ${
              pathname === "/settings" 
                ? "bg-secondary-container text-on-secondary-container font-bold" 
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md">Settings</span>
          </Link>
        )}
        <Link 
          href="/profile" 
          className={`flex items-center gap-3 px-3 py-2 rounded-lg duration-200 transition-all ${
            pathname === "/profile" 
              ? "bg-secondary-container text-on-secondary-container font-bold" 
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-md">Profile</span>
        </Link>
        <Link 
          href="/profile"
          className="flex items-center gap-3 p-3 mt-4 bg-surface-container rounded-lg border border-outline-variant hover:border-primary/45 transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#111516] border border-outline-variant flex items-center justify-center font-bold text-xs text-primary shadow-sm group-hover:border-primary/60 transition-colors overflow-hidden flex-shrink-0">
            {adminUser?.profileImage ? (
              <img src={adminUser.profileImage} alt={adminUser.name} className="w-full h-full object-cover" />
            ) : (
              adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : "A"
            )}
          </div>
          <div className="overflow-hidden">
            <p className="font-label-md text-on-surface truncate group-hover:text-primary transition-colors">
              {adminUser?.name || "Admin User"}
            </p>
            <p className="text-[9px] uppercase tracking-wider text-outline">
              {adminUser?.role === "superAdmin" ? "Super Admin" : "Administrator"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
    </>
  );
}
