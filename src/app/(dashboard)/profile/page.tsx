"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers";
import { Edit2, Check, X } from "lucide-react";

export default function ProfilePage() {
  const { adminUser, logout, isLoggingOut, updateProfile, isUpdatingProfile } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    if (adminUser?.name) {
      setNameInput(adminUser.name);
    }
  }, [adminUser]);

  const handleSignOut = async () => {
    try {
      await logout();
      showToast("You have been signed out", "info");
      router.push("/login");
    } catch {
      showToast("Sign out failed", "error");
    }
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    try {
      await updateProfile(nameInput);
      setIsEditing(false);
      showToast("Name updated successfully", "success");
    } catch {
      showToast("Failed to update name", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-[#e0e3e4] font-inter space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-on-surface">
          Account Profile
        </h1>
        <p className="text-xs text-on-surface-variant/80 mt-1">
          Manage your admin account information and session access.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#111516] border border-[#1c2122] rounded-xl p-6 space-y-6">

        {/* Identity Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#0b0f10] border border-[#1c2122] flex items-center justify-center text-primary font-semibold">
            {adminUser?.name?.charAt(0) || "A"}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-[#0b0f10] border border-primary/30 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none w-full"
                  disabled={isUpdatingProfile}
                />
                <button
                  onClick={handleSaveName}
                  disabled={isUpdatingProfile}
                  className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors cursor-pointer"
                  title="Save changes"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setNameInput(adminUser?.name || "");
                    setIsEditing(false);
                  }}
                  disabled={isUpdatingProfile}
                  className="p-2 bg-error/10 hover:bg-error/20 text-error rounded-lg transition-colors cursor-pointer"
                  title="Cancel editing"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-on-surface">
                  {adminUser?.name || "Admin User"}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-[#1c2122] rounded text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  title="Edit name"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
            <p className="text-[11px] text-on-surface-variant/70 mt-0.5">
              {adminUser?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1c2122]">

          <div className="bg-[#0b0f10] p-4 rounded-xl border border-[#1c2122]">
            <p className="text-[10px] uppercase text-on-surface-variant/70">
              Email
            </p>
            <p className="text-xs font-medium mt-1 text-on-surface">
              {adminUser?.email || "Not available"}
            </p>
          </div>

          <div className="bg-[#0b0f10] p-4 rounded-xl border border-[#1c2122]">
            <p className="text-[10px] uppercase text-on-surface-variant/70">
              Role
            </p>
            <p className="text-xs font-medium mt-1 text-on-surface">
              {adminUser?.role || "Administrator"}
            </p>
          </div>

        </div>

        {/* Session Info (REALISTIC ONLY) */}
        <div className="bg-[#0b0f10] p-4 rounded-xl border border-[#1c2122] space-y-2">
          <p className="text-[10px] uppercase text-on-surface-variant/70">
            Session Information
          </p>

          <div className="flex justify-between text-[11px]">
            <span className="text-on-surface-variant/70">Status</span>
            <span className="text-primary font-semibold">Active</span>
          </div>

          <div className="flex justify-between text-[11px]">
            <span className="text-on-surface-variant/70">Last Login</span>
            <span className="text-on-surface font-mono">
              {adminUser?.lastLogin || "Unknown"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#1c2122] flex justify-between items-center">
          <p className="text-[10px] text-on-surface-variant/70">
            Manage your session securely
          </p>

          <Button
            variant="danger"
            isLoading={isLoggingOut}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>

      </div>
    </div>
  );
}