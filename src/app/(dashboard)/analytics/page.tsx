"use client";

import React from "react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLogs } from "@/hooks/useLogs";

export default function AnalyticsPage() {
  const { metrics, isLoading: isAnalyticsLoading } = useAnalytics();
  const { logs, isLoading: isLogsLoading } = useLogs({ limit: 10 });

  const isLoading = isAnalyticsLoading || isLogsLoading;

  const exportToCSV = () => {
    const csvRows = [];

    // Report Title
    csvRows.push(["AuraPulse Operational Analytics Report"]);
    csvRows.push([`Generated At: ${new Date().toLocaleString()}`]);
    csvRows.push([]);

    // Metrics Section
    csvRows.push(["METRICS OVERVIEW"]);
    csvRows.push(["Metric", "Value", "Description"]);
    csvRows.push(["Total Registered Users", metrics.totalUsers, "Registered AuraPulse users"]);
    csvRows.push(["Active Sessions", metrics.activeSessions, "Users active/active therapy sessions"]);
    csvRows.push(["Total Therapy Sessions", metrics.totalSessions, "Total AI therapy conversations"]);
    csvRows.push(["Emergency Events", metrics.totalEscalations, "Triggered emergency alerts"]);
    csvRows.push(["Weekly Emergencies", metrics.escalationsThisWeek, "Triggered emergency alerts this week"]);
    csvRows.push(["Average Mood Score", `${metrics.avgMoodScore}/100`, "Average user mood score this week"]);
    csvRows.push([]);

    // Logs Section
    csvRows.push(["RECENT SYSTEM ACTIVITIES"]);
    csvRows.push(["Timestamp", "Category", "Severity", "Description", "Operator/Called"]);
    logs.forEach((log: any) => {
      csvRows.push([
        new Date(log.timestamp).toLocaleString(),
        log.category,
        log.severity,
        log.description,
        log.operator || "System"
      ]);
    });

    // Convert arrays of rows into CSV string
    const csvContent = csvRows
      .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AuraPulse_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse font-inter text-[#e0e3e4]">
        <div className="h-10 w-64 bg-[#111516] rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-[#111516] border border-[#1c2122] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-[#111516] border border-[#1c2122] rounded-xl" />
          <div className="h-64 bg-[#111516] border border-[#1c2122] rounded-xl" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: metrics.totalUsers,
      description: "Registered AuraPulse users",
    },
    {
      label: "Active Sessions",
      value: metrics.activeSessions,
      description: "Users active in last 24h",
    },
    {
      label: "Therapy Sessions",
      value: metrics.totalSessions,
      description: "Total AI therapy conversations",
    },
    {
      label: "Emergency Events",
      value: metrics.totalEscalations,
      description: "Triggered emergency alerts",
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

        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface hover:bg-[#1c2122] transition-colors"
        >
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
              {item.value.toLocaleString()}
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
            {logs.length === 0 ? (
              <p className="text-xs text-on-surface-variant/65">No recent activity logs found.</p>
            ) : (
              logs.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-start border-b border-[#1c2122] pb-3 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-on-surface">
                      {item.category} Event
                    </div>
                    <div className="text-xs text-on-surface-variant/70 mt-0.5">
                      {item.description}
                    </div>
                  </div>

                  <div className="text-[10px] text-on-surface-variant/60 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
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