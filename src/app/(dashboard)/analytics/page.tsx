"use client";

import React from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  // These should ideally come from React Query later
  const stats = [
    {
      label: "Total Users",
      value: "12,482",
      description: "Registered AuraPulse users",
    },
    {
      label: "Active Users",
      value: "3,214",
      description: "Users active in last 24h",
    },
    {
      label: "Therapy Sessions",
      value: "48,903",
      description: "Total AI therapy conversations",
    },
    {
      label: "Emergency Events",
      value: "312",
      description: "Triggered emergency alerts",
    },
  ];

  const recentActivity = [
    {
      type: "User Login",
      detail: "john.doe@example.com logged in",
      time: "2 min ago",
    },
    {
      type: "Session Started",
      detail: "Therapy session initiated",
      time: "10 min ago",
    },
    {
      type: "Emergency Triggered",
      detail: "User marked emergency escalation",
      time: "1 hour ago",
    },
    {
      type: "User Blocked",
      detail: "Admin blocked suspicious user",
      time: "3 hours ago",
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 w-full font-inter text-[#e0e3e4]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-xl font-medium tracking-tight text-on-surface">
            Operational Analytics
          </h2>
          <p className="text-xs text-on-surface-variant/80 mt-1.5">
            System usage, therapy activity, and emergency overview.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[16px]">
            file_download
          </span>
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-[#111516] border border-[#1c2122] p-5 rounded-xl shadow-sm"
          >
            <div className="text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">
              {item.label}
            </div>

            <div className="text-2xl font-bold text-on-surface mt-2">
              {item.value}
            </div>

            <div className="text-[11px] text-on-surface-variant/70 mt-1">
              {item.description}
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-[#111516] border border-[#1c2122] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {recentActivity.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start border-b border-[#1c2122] pb-3 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium text-on-surface">
                    {item.type}
                  </div>
                  <div className="text-xs text-on-surface-variant/70 mt-0.5">
                    {item.detail}
                  </div>
                </div>

                <div className="text-[10px] text-on-surface-variant/60 whitespace-nowrap">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-[#111516] border border-[#1c2122] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-on-surface">
              System Overview
            </h3>
            <p className="text-xs text-on-surface-variant/70 mt-1">
              High-level operational health of AuraPulse system.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant/70">System Status</span>
              <span className="text-primary font-semibold">Operational</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant/70">API Health</span>
              <span className="text-primary font-semibold">Stable</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant/70">Emergency System</span>
              <span className="text-primary font-semibold">Active</span>
            </div>
          </div>

          <Link href="/logs">
            <button className="w-full mt-6 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg text-xs font-semibold">
              View Detailed Logs
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}