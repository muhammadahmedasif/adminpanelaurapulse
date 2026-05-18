"use client";

import React from "react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLogs } from "@/hooks/useLogs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AnalyticsPage() {
  const { metrics, isLoading: isAnalyticsLoading } = useAnalytics();
  const { logs, isLoading: isLogsLoading } = useLogs({ limit: 10 });

  const isLoading = isAnalyticsLoading || isLogsLoading;

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(11, 15, 16); // #0b0f10
    doc.text("AuraPulse", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Operational Analytics Report", 14, 28);
    
    doc.setFontSize(10);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 14, 34);

    // --- Metrics Overview ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("METRICS OVERVIEW", 14, 46);

    autoTable(doc, {
      startY: 50,
      headStyles: { fillColor: [152, 203, 180], textColor: [11, 15, 16], fontStyle: 'bold' }, // #98cbb4
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      head: [["Metric", "Value", "Description"]],
      body: [
        ["Total Registered Users", metrics.totalUsers, "Registered AuraPulse users"],
        ["Active Sessions", metrics.activeSessions, "Users active/active therapy sessions"],
        ["Total Therapy Sessions", metrics.totalSessions, "Total AI therapy conversations"],
        ["Emergency Events", metrics.totalEscalations, "Triggered emergency alerts"],
        ["Weekly Emergencies", metrics.escalationsThisWeek, "Triggered emergency alerts this week"],
        ["Average Mood Score", `${metrics.avgMoodScore}/100`, "Average user mood score this week"]
      ],
    });

    // --- Recent System Activities ---
    let finalY = (doc as any).lastAutoTable.finalY || 50;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("RECENT SYSTEM ACTIVITIES", 14, finalY + 12);

    const logData = logs.map((log: any) => [
      new Date(log.timestamp).toLocaleString(),
      log.category,
      log.severity,
      log.description,
      log.operator || "System"
    ]);

    autoTable(doc, {
      startY: finalY + 16,
      headStyles: { fillColor: [152, 203, 180], textColor: [11, 15, 16], fontStyle: 'bold' },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 25 },
      },
      head: [["Timestamp", "Category", "Severity", "Description", "Operator"]],
      body: logData,
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 2) {
          if (data.cell.raw === 'CRITICAL') {
            data.cell.styles.textColor = [220, 38, 38]; // error red
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.raw === 'WARNING') {
            data.cell.styles.textColor = [217, 119, 6]; // warning orange
          } else if (data.cell.raw === 'INFO') {
            data.cell.styles.textColor = [152, 203, 180]; // primary green
          }
        }
      }
    });

    doc.save(`AuraPulse_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
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
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface hover:bg-[#1c2122] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">
            picture_as_pdf
          </span>
          Download PDF Report
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