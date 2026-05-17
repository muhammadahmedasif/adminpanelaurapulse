"use client";

import React from "react";
import { useSettings } from "@/hooks/useSettings";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers";

export default function SettingsPage() {
  const { showToast } = useToast();

  const {
    settings,
    isLoading,
    updateSettings,
    isUpdating,
  } = useSettings();

  const handleToggle = async (key: "aiChatEnabled" | "maintenanceMode", value: boolean) => {
    try {
      await updateSettings({ [key]: value });

      showToast(
        `${key === "aiChatEnabled" ? "AI Chat" : "Maintenance Mode"} updated`,
        "success"
      );
    } catch {
      showToast("Failed to update settings", "error");
    }
  };

  const handleThresholdUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const cooldownHours = Number(formData.get("cooldownHours"));
    const rateLimit = Number(formData.get("rateLimitThreshold"));

    // basic validation
    if (cooldownHours < 1 || cooldownHours > 72) {
      return showToast("Cooldown must be between 1–72 hours", "error");
    }

    if (rateLimit < 10 || rateLimit > 10000) {
      return showToast("Rate limit out of range", "error");
    }

    try {
      await updateSettings({
        cooldownHours,
        rateLimitThreshold: rateLimit,
      });

      showToast("System settings updated", "success");
    } catch {
      showToast("Failed to update system settings", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-[#111516] rounded-lg" />
        <div className="h-80 bg-[#111516] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-[#e0e3e4] font-inter">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-on-surface">
          System Settings
        </h1>
        <p className="text-xs text-on-surface-variant/80 mt-1">
          Manage system feature flags and operational limits.
        </p>
      </div>

      {/* Container */}
      <div className="bg-[#111516] border border-[#1c2122] rounded-xl p-6 space-y-8">

        {/* Feature Flags */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-on-surface">
            Feature Flags
          </h2>

          <div className="flex justify-between items-center p-4 bg-[#0b0f10] rounded-xl border border-[#1c2122]">
            <div>
              <p className="text-xs font-semibold">AI Therapy Chat</p>
              <p className="text-[11px] text-on-surface-variant/70">
                Enable AI chat functionality for users
              </p>
            </div>

            <Switch
              checked={!!settings?.aiChatEnabled}
              onChange={(v) => handleToggle("aiChatEnabled", v)}
            />
          </div>

          <div className="flex justify-between items-center p-4 bg-[#0b0f10] rounded-xl border border-[#1c2122]">
            <div>
              <p className="text-xs font-semibold">Maintenance Mode</p>
              <p className="text-[11px] text-on-surface-variant/70">
                Restrict user access during system updates
              </p>
            </div>

            <Switch
              checked={!!settings?.maintenanceMode}
              onChange={(v) => handleToggle("maintenanceMode", v)}
            />
          </div>
        </div>

        {/* System Limits */}
        <form onSubmit={handleThresholdUpdate} className="space-y-6">

          <h2 className="text-sm font-semibold text-on-surface">
            System Limits
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">

            <div>
              <label className="text-[10px] uppercase text-on-surface-variant/70">
                Rate Limit (requests/min)
              </label>
              <input
                name="rateLimitThreshold"
                type="number"
                defaultValue={settings?.rateLimitThreshold}
                className="w-full mt-2 bg-[#0b0f10] border border-[#1c2122] rounded-lg px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-on-surface-variant/70">
                Emergency Cooldown (hours)
              </label>
              <input
                name="cooldownHours"
                type="number"
                defaultValue={settings?.cooldownHours}
                className="w-full mt-2 bg-[#0b0f10] border border-[#1c2122] rounded-lg px-3 py-2 text-xs"
              />
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isUpdating}>
              Save Settings
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}