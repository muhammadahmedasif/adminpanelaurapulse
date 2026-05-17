"use client";

import React, { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { settings, isLoading, isUpdating, updateSettings } = useSettings();
  const { adminUser } = useAuth();

  // Permissions validation
  const canUpdate = adminUser?.role === "superAdmin" || adminUser?.permissions?.includes("settings.update");

  // Local state for form fields
  const [crisisEnabled, setCrisisEnabled] = useState(true);
  const [cooldownHours, setCooldownHours] = useState(6);
  const [maxPerDay, setMaxPerDay] = useState(3);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Keep local state in sync with fetched settings
  useEffect(() => {
    if (settings) {
      setCrisisEnabled(settings.crisisEnabled);
      setCooldownHours(settings.cooldownHours);
      setMaxPerDay(settings.maxPerDay);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdate) return;
    setSaveSuccess(false);
    setSaveError("");

    try {
      await updateSettings({
        crisisEnabled,
        cooldownHours,
        maxPerDay,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.response?.data?.message || "Failed to save settings. Please try again.");
    }
  };

  const hasChanges = settings
    ? crisisEnabled !== settings.crisisEnabled ||
      cooldownHours !== settings.cooldownHours ||
      maxPerDay !== settings.maxPerDay
    : false;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-[#111516] rounded-lg" />
        <div className="h-40 bg-[#111516] rounded-xl" />
        <div className="h-64 bg-[#111516] rounded-xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 w-full max-w-4xl font-inter text-[#e0e3e4]">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-on-surface">System Configuration</h2>
          <p className="text-xs text-on-surface-variant/80 mt-1">Configure real-time clinical guardrails and safety thresholds.</p>
        </div>

        {canUpdate ? (
          <button
            type="submit"
            disabled={!hasChanges || isUpdating}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              hasChanges 
                ? "bg-primary text-on-primary hover:opacity-90 cursor-pointer" 
                : "bg-[#1c2122] text-[#8e9192] cursor-not-allowed border border-[#2d3132]/30"
            }`}
          >
            {isUpdating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#e0e3e4]/30 border-t-[#e0e3e4] rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                Save Changes
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[#1c2122] px-3.5 py-1.5 rounded-lg border border-[#2d3132]/30 text-[10px] text-[#8e9192] uppercase font-bold tracking-wider">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            Read-Only Mode
          </div>
        )}
      </div>

      {/* Notifications */}
      {!canUpdate && (
        <div className="bg-[#1c2122] border border-outline-variant/60 text-on-surface-variant/85 px-4 py-3 rounded-lg flex items-center gap-2.5 text-xs shadow-sm">
          <span className="material-symbols-outlined text-[16px] text-primary">info</span>
          <span>You are logged in as a Standard Administrator. System-wide parameters are view-only.</span>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-lg flex items-center gap-2 text-xs">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>System settings updated and synchronized with MongoDB successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg flex items-center gap-2 text-xs">
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>{saveError}</span>
        </div>
      )}

      {/* Global Features Section */}
      <div className="bg-[#111516] border border-outline-variant rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">settings_system_daydream</span>
          Global System Features
        </h3>

        <div className="space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-[#1c2122]">
            <div>
              <p className="text-sm font-medium text-on-surface">Crisis Escalation Engine</p>
              <p className="text-xs text-on-surface-variant/70 mt-1 max-w-[500px]">
                Enables automated Twilio phone calls and SMS messages during high-risk mental health events.
              </p>
            </div>
            <div>
              <button
                type="button"
                disabled={!canUpdate}
                onClick={() => setCrisisEnabled(!crisisEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  crisisEnabled ? "bg-primary" : "bg-[#2d3132]"
                } ${!canUpdate ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    crisisEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-on-surface">Twilio Integration</p>
              <p className="text-xs text-on-surface-variant/70 mt-1 max-w-[500px]">
                Active Twilio API status. Configuration is derived from system environment credentials.
              </p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded text-[10px] font-semibold tracking-wide uppercase ${
                settings?.twilioConfigured ? "bg-primary/10 text-primary border border-primary/20" : "bg-error/10 text-error border border-error/20"
              }`}>
                {settings?.twilioConfigured ? "Configured" : "Missing Credentials"}
              </span>
              {settings?.twilioPhone && settings.twilioPhone !== "Not configured" && (
                <p className="text-[10px] text-on-surface-variant/60 mt-1.5 font-mono">{settings.twilioPhone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Tuning Section */}
      <div className="bg-[#111516] border border-outline-variant rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Escalation Tuning
        </h3>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[#1c2122]">
            <div>
              <p className="text-sm font-medium text-on-surface">Max Escalations Per Day</p>
              <p className="text-xs text-on-surface-variant/70 mt-1 max-w-[500px]">
                The maximum number of times the system can call emergency contacts for a single user in 24 hours.
              </p>
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="50"
                disabled={!canUpdate}
                value={maxPerDay}
                onChange={(e) => setMaxPerDay(parseInt(e.target.value) || 0)}
                className="w-20 text-sm font-mono text-center bg-[#0b0f10] border border-[#1c2122] focus:border-primary/50 focus:outline-none px-3 py-1.5 rounded text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm font-medium text-on-surface">Cooldown Hours</p>
              <p className="text-xs text-on-surface-variant/70 mt-1 max-w-[500px]">
                Hours to wait before escalating the same user again after a successful emergency contact.
              </p>
            </div>
            <div>
              <input
                type="number"
                min="0"
                max="168"
                step="0.5"
                disabled={!canUpdate}
                value={cooldownHours}
                onChange={(e) => setCooldownHours(parseFloat(e.target.value) || 0)}
                className="w-20 text-sm font-mono text-center bg-[#0b0f10] border border-[#1c2122] focus:border-primary/50 focus:outline-none px-3 py-1.5 rounded text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}