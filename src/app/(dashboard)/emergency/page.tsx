"use client";

import React, { useState } from "react";
import { useEmergency } from "@/hooks/useEmergency";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/providers";

export default function EmergencyPage() {
  const { showToast } = useToast();

  const {
    events = [],
    callLogs = [],
    twilioNumberStatus,
    isLoading,
    toggleGlobalEmergency,
  } = useEmergency();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingState, setPendingState] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const isEmergencyActive = twilioNumberStatus?.status === "Active & Secure";

  // Open confirmation modal
  const handleToggle = (checked: boolean) => {
    setPendingState(checked);
    setConfirmOpen(true);
  };

  // Confirm toggle action
  const handleConfirm = async () => {
    setLoadingAction(true);

    try {
      await toggleGlobalEmergency();

      showToast(
        pendingState
          ? "Emergency system enabled"
          : "Emergency system disabled",
        "success"
      );
    } catch {
      showToast("Failed to update emergency system", "error");
    } finally {
      setLoadingAction(false);
      setConfirmOpen(false);
    }
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

  return (
    <div className="flex flex-col gap-6 text-[#e0e3e4] font-inter">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium tracking-tight text-on-surface">
          Emergency Control Panel
        </h1>
        <p className="text-xs text-on-surface-variant/80 mt-1">
          Monitor and control system-level emergency response behavior.
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
            {isEmergencyActive ? "Enabled" : "Disabled"}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${isEmergencyActive ? "bg-primary animate-pulse" : "bg-error"
              }`}
          />
          <Switch
            checked={isEmergencyActive}
            onChange={handleToggle}
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
          <table className="w-full text-left">
            <thead className="bg-[#0b0f10]">
              <tr>
                <th className="px-6 py-3 text-xs text-on-surface-variant/70 font-semibold">
                  User
                </th>
                <th className="px-6 py-3 text-xs text-on-surface-variant/70 font-semibold">
                  Reason
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
              {events.map((event: any) => (
                <tr key={event.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-medium">
                    {event.userName}
                  </td>

                  <td className="px-6 py-4 text-xs text-on-surface-variant/80">
                    {event.triggerSource === "system" ? "Biometric Trigger" : "Manual Alert"}
                  </td>

                  <td className="px-6 py-4 text-xs text-on-surface-variant/60">
                    {event.timestamp}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-[10px] px-2 py-1 rounded font-semibold uppercase tracking-wider ${event.cooldownStatus === "active"
                        ? "bg-error/10 text-error"
                        : "bg-primary/10 text-primary"
                        }`}
                    >
                      {event.cooldownStatus}
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
              Phone Alerts
            </span>
            <span className="text-primary font-semibold">
              {isEmergencyActive ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant/70 font-normal">
              SMS Alerts
            </span>
            <span className="text-primary font-semibold">
              {isEmergencyActive ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant/70 font-normal">
              Emergency Number
            </span>
            <span className="text-on-surface font-mono">
              {twilioNumberStatus?.number}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant/70 font-normal">
              System Status
            </span>
            <span className="text-primary font-semibold">
              {twilioNumberStatus?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Call Logs */}
      <div className="bg-[#111516] border border-[#1c2122] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1c2122]">
          <h2 className="text-sm font-semibold text-on-surface">
            Communication Logs
          </h2>
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#0b0f10]">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold">ID</th>
              <th className="px-6 py-3 text-xs font-semibold">Time</th>
              <th className="px-6 py-3 text-xs font-semibold">Routing</th>
              <th className="px-6 py-3 text-xs font-semibold text-right">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1c2122]">
            {callLogs.map((log: any) => (
              <tr key={log.id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-xs font-mono">
                  {log.id}
                </td>

                <td className="px-6 py-4 text-xs text-on-surface-variant/70">
                  {log.timestamp}
                </td>

                <td className="px-6 py-4 text-xs">
                  {log.routing}
                </td>

                <td className="px-6 py-4 text-right text-[10px] text-primary uppercase font-semibold">
                  {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirm Emergency System Change"
        description={
          pendingState
            ? "Enable emergency system? Alerts will be activated immediately."
            : "Disable emergency system? All alerts will stop."
        }
        confirmText={pendingState ? "Enable" : "Disable"}
        isConfirming={loadingAction}
        variant={pendingState ? "primary" : "danger"}
      />
    </div>
  );
}