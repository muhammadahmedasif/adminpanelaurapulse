"use client";

import React from "react";
import { useEmergency } from "@/hooks/useEmergency";

export default function EmergencyPage() {
  const { status, logs, isLoading } = useEmergency();

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return "";
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-[#111516] rounded-lg" />
        <div className="h-40 bg-[#111516] rounded-xl" />
        <div className="h-64 bg-[#111516] rounded-xl" />
      </div>
    );
  }

  const isEmergencyActive = status?.system?.crisisEnabled ?? false;

  return (
    <div className="flex flex-col gap-6 text-[#e0e3e4] font-inter">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium tracking-tight text-on-surface">
          Emergency Control Panel
        </h1>
        <p className="text-xs text-on-surface-variant/80 mt-1">
          Monitor system-level emergency response behavior. (Read Only)
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-[#111516] border border-[#1c2122] rounded-xl p-5 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-on-surface">
            System Status
          </p>
          <p className="text-xs text-on-surface-variant/70 mt-1 font-normal">
            Emergency response system is currently{" "}
            <span className={`font-semibold ${isEmergencyActive ? "text-primary" : "text-error"}`}>
              {isEmergencyActive ? "Enabled" : "Disabled"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant/80 font-medium">
            {isEmergencyActive ? "Active" : "Inactive"}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${isEmergencyActive ? "bg-primary animate-pulse" : "bg-error"}`}
          />
        </div>
      </div>

      {/* Emergency Events Table */}
      <div className="bg-[#111516] border border-[#1c2122] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1c2122]">
          <h2 className="text-sm font-semibold text-on-surface">
            Emergency Events
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-[#0b0f10]">
              <tr>
                <th className="px-6 py-3 text-xs text-on-surface-variant/70 font-semibold">
                  User
                </th>
                <th className="px-6 py-3 text-xs text-on-surface-variant/70 font-semibold">
                  Reason
                </th>
                <th className="px-6 py-3 text-xs text-on-surface-variant/70 font-semibold">
                  Contact
                </th>
                <th className="px-6 py-3 text-xs text-on-surface-variant/70 font-semibold">
                  Time
                </th>
                <th className="px-6 py-3 text-xs text-on-surface-variant/70 font-semibold text-right">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1c2122]">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0b0f10] border border-outline-variant flex items-center justify-center font-semibold text-xs text-primary shadow-sm overflow-hidden flex-shrink-0">
                        {log.userProfileImage ? (
                          <img src={log.userProfileImage} alt={log.userName} className="w-full h-full object-cover" />
                        ) : (
                          (log.userName || "Unknown").charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-semibold text-on-surface">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant/80">
                    {log.escalationReason || log.riskLevel}
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant/60">
                    {log.contactCalled} ({log.contactPhone})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-on-surface-variant/95">{new Date(log.createdAt).toLocaleString()}</div>
                    <div className="text-[10px] text-[#8a938d] font-sans font-medium mt-0.5">{timeAgo(log.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-[10px] px-2 py-1 rounded font-semibold uppercase tracking-wider ${log.outcome === "completed"
                          ? "bg-primary/10 text-primary"
                          : "bg-error/10 text-error"
                        }`}
                    >
                      {log.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Communication Status */}
      <div className="bg-[#111516] border border-[#1c2122] rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4 text-on-surface">
          Communication System
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-on-surface-variant/70 font-normal">
              Twilio Configured
            </span>
            <span className={status?.system?.twilioConfigured ? "text-primary font-semibold" : "text-error font-semibold"}>
              {status?.system?.twilioConfigured ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant/70 font-normal">
              Emergency Number
            </span>
            <span className="text-on-surface font-mono">
              {status?.system?.twilioPhone || "Not Configured"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant/70 font-normal">
              Max Escalations / Day
            </span>
            <span className="text-primary font-semibold">
              {status?.system?.maxPerDay}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}