"use client";

import React from "react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatNumber = (value: number) => value.toLocaleString();

const formatPercent = (value: number) => `${Math.round(value)}%`;

const formatMoodChange = (value: number) => `${value > 0 ? "+" : ""}${value}`;

const getLastTableY = (doc: jsPDF, fallback: number) => {
  const tableDoc = doc as jsPDF & { lastAutoTable?: { finalY?: number } };
  return tableDoc.lastAutoTable?.finalY ?? fallback;
};

const ensurePageSpace = (doc: jsPDF, y: number, requiredHeight: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + requiredHeight <= pageHeight - 18) return y;
  doc.addPage();
  return 18;
};

const addSectionTitle = (doc: jsPDF, title: string, y: number) => {
  const safeY = ensurePageSpace(doc, y, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(11, 15, 16);
  doc.text(title, 14, safeY);
  doc.setDrawColor(152, 203, 180);
  doc.setLineWidth(0.8);
  doc.line(14, safeY + 3, 196, safeY + 3);
  return safeY + 9;
};

const addWrappedText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 5) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
};

const addMetricCard = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  title: string,
  value: string,
  note: string,
  accent: [number, number, number] = [152, 203, 180]
) => {
  doc.setFillColor(248, 250, 249);
  doc.setDrawColor(220, 227, 224);
  doc.roundedRect(x, y, width, 24, 2, 2, "FD");
  doc.setFillColor(...accent);
  doc.rect(x, y, 2, 24, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(80, 88, 86);
  doc.text(title.toUpperCase(), x + 5, y + 6);
  doc.setFontSize(14);
  doc.setTextColor(11, 15, 16);
  doc.text(value, x + 5, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(95, 105, 102);
  doc.text(doc.splitTextToSize(note, width - 8), x + 5, y + 20);
};

export default function AnalyticsPage() {
  const { metrics, trends, isLoading } = useAnalytics();

  const exportToPDF = () => {
    const doc = new jsPDF();
    const generatedAt = new Date();
    const periodStart = new Date(generatedAt.getTime() - 7 * 24 * 60 * 60 * 1000);
    const reportPeriod = `${periodStart.toLocaleDateString()} - ${generatedAt.toLocaleDateString()}`;
    const moodCoverage = metrics.totalUsers > 0
      ? Math.round((metrics.outcomeTrackedUsers / metrics.totalUsers) * 100)
      : 0;

    const recommendations = [
      metrics.notRecoveredUsersThisWeek > 0
        ? `${metrics.notRecoveredUsersThisWeek} tracked user(s) are not recovered this week. Prioritize follow-up, review recent sessions, and encourage a low-friction check-in.`
        : "No tracked users met the not-recovered definition this week.",
      metrics.outcomeTrackedUsers < metrics.totalUsers
        ? `Only ${moodCoverage}% of total users had enough mood check-ins for outcome tracking. Prompt more users to log mood at least twice weekly.`
        : "Total users have enough mood data for stronger outcome tracking.",
      metrics.weeklyHighRiskSessions > 0 || metrics.escalationsThisWeek > 0
        ? "Review high-risk sessions and emergency logs to confirm safety workflows were completed and documented."
        : "No high-risk sessions or emergency escalations were detected in the weekly analytics window.",
      metrics.weeklyActivities > 0 && metrics.weeklyActivityCompletionRate < 60
        ? "Activity completion is below 60%. Consider shorter calming activities and clearer post-session nudges."
        : "Activity completion is stable. Keep surfacing activities after stressful or high-intensity conversations.",
    ];

    // Header
    doc.setFillColor(11, 15, 16);
    doc.rect(0, 0, 210, 38, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("AuraPulse", 14, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(218, 226, 222);
    doc.text("Weekly Operational Impact Report", 14, 26);
    doc.setFontSize(10);
    doc.text(`Report period: ${reportPeriod}`, 14, 32);
    doc.text(`Generated: ${generatedAt.toLocaleString()}`, 132, 32);

    // Executive summary
    let y = 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(11, 15, 16);
    doc.text("Executive Summary", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(70, 78, 76);
    const summaryText = metrics.outcomeTrackedUsers > 0
      ? `AuraPulse supported ${formatNumber(metrics.weeklyActiveUsers)} active user(s) this week across ${formatNumber(metrics.weeklySessions)} therapy session(s), ${formatNumber(metrics.weeklyMessageCount)} chat message(s), and ${formatNumber(metrics.weeklyActivities)} logged therapeutic activity item(s). Based on users with at least two mood check-ins this week, ${formatNumber(metrics.benefitedUsersThisWeek)} user(s) showed measurable benefit, while ${formatNumber(metrics.notRecoveredUsersThisWeek)} user(s) are not recovered and should be prioritized for follow-up.`
      : `AuraPulse supported ${formatNumber(metrics.weeklyActiveUsers)} active user(s) this week across ${formatNumber(metrics.weeklySessions)} therapy session(s), ${formatNumber(metrics.weeklyMessageCount)} chat message(s), and ${formatNumber(metrics.weeklyActivities)} logged therapeutic activity item(s). No users had enough mood check-ins for reliable weekly outcome classification, so recovery metrics should be treated as unavailable rather than zero-impact.`;
    y = addWrappedText(doc, summaryText, 14, y, 182, 5) + 6;

    addMetricCard(doc, 14, y, 42, "Benefited", formatNumber(metrics.benefitedUsersThisWeek), "Improved mood by 5+ points");
    addMetricCard(doc, 60, y, 42, "Not recovered", formatNumber(metrics.notRecoveredUsersThisWeek), "Low mood and no clear gain", [229, 115, 115]);
    addMetricCard(doc, 106, y, 42, "Weekly active", formatNumber(metrics.weeklyActiveUsers), "Sessions, moods, or activities");
    addMetricCard(doc, 152, y, 44, "Benefit rate", formatPercent(metrics.recoveryRate), "Of tracked mood users");
    y += 34;

    // Weekly impact outcomes
    y = addSectionTitle(doc, "Weekly Impact Outcomes", y);
    autoTable(doc, {
      startY: y,
      headStyles: { fillColor: [152, 203, 180], textColor: [11, 15, 16], fontStyle: "bold" },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 8, cellPadding: 2.2 },
      head: [["Outcome", "Value", "How to read it"]],
      body: [
        ["People benefited this week", formatNumber(metrics.benefitedUsersThisWeek), "Users with at least two weekly mood entries whose latest score improved by 5+ points."],
        ["People not recovered this week", formatNumber(metrics.notRecoveredUsersThisWeek), "Tracked users whose latest mood remains below 50 and did not improve by 5+ points."],
        ["Users needing follow-up", formatNumber(metrics.needsFollowUpUsers), "Tracked users whose latest weekly mood score is still below 50."],
        ["Tracked outcome users", formatNumber(metrics.outcomeTrackedUsers), "Users with enough mood data to compare first vs latest weekly mood."],
        ["Average mood change", formatMoodChange(metrics.averageMoodChange), "Average first-to-latest weekly mood movement among tracked users."],
        ["Weekly benefit rate", formatPercent(metrics.recoveryRate), "Benefited users divided by tracked outcome users."],
      ],
    });

    y = getLastTableY(doc, y) + 12;
    y = addSectionTitle(doc, "System Usage", y);
    autoTable(doc, {
      startY: y,
      headStyles: { fillColor: [152, 203, 180], textColor: [11, 15, 16], fontStyle: "bold" },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 8, cellPadding: 2.2 },
      head: [["Metric", "All time", "This week", "Notes"]],
      body: [
        ["Registered users", formatNumber(metrics.totalUsers), `+${formatNumber(metrics.newUsersThisWeek)}`, `${formatNumber(metrics.newUsersThisMonth)} new user(s) this month.`],
        ["Therapy sessions", formatNumber(metrics.totalSessions), formatNumber(metrics.weeklySessions), `${formatNumber(metrics.weeklyCompletedSessions)} completed this week.`],
        ["Chat messages", "-", formatNumber(metrics.weeklyMessageCount), `${formatNumber(metrics.avgMessagesPerSession)} average message(s) per weekly session.`],
        ["Therapeutic activities", formatNumber(metrics.totalActivities), formatNumber(metrics.weeklyActivities), `${formatPercent(metrics.weeklyActivityCompletionRate)} completion rate this week.`],
        ["Mood check-ins", formatNumber(metrics.totalMoodEntries), formatNumber(metrics.outcomeTrackedUsers), "Weekly value counts users with comparable mood data, not raw entries."],
        ["Average session duration", `${formatNumber(metrics.avgSessionMinutes)} min`, "-", "Average across sessions with two or more messages."],
      ],
    });

    y = getLastTableY(doc, y) + 12;
    y = addSectionTitle(doc, "Mood, Recovery, and Safety", y);
    autoTable(doc, {
      startY: y,
      headStyles: { fillColor: [152, 203, 180], textColor: [11, 15, 16], fontStyle: "bold" },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 8, cellPadding: 2.2 },
      head: [["Area", "Value", "Operational meaning"]],
      body: [
        ["Current weekly mood average", `${metrics.avgMoodScore}/100`, "Average mood score from all mood entries in the current 7-day window."],
        ["Previous weekly mood average", `${metrics.previousWeekAvgMoodScore}/100`, "Baseline from the 7 days before this report window."],
        ["Mood trend", formatMoodChange(metrics.avgMoodScore - metrics.previousWeekAvgMoodScore), "Difference between current and previous weekly mood averages."],
        ["High-risk therapy sessions", formatNumber(metrics.weeklyHighRiskSessions), "Weekly sessions with risk or crisis scores above the configured threshold."],
        ["Emergency escalations", formatNumber(metrics.escalationsThisWeek), `${formatNumber(metrics.totalEscalations)} total emergency events recorded.`],
      ],
    });

    y = getLastTableY(doc, y) + 12;
    y = addSectionTitle(doc, "Therapeutic Activity Breakdown", y);
    autoTable(doc, {
      startY: y,
      headStyles: { fillColor: [152, 203, 180], textColor: [11, 15, 16], fontStyle: "bold" },
      bodyStyles: { textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 8, cellPadding: 2.2 },
      head: [["Activity type", "Logged", "Completed", "Minutes"]],
      body: trends.activityBreakdown.length
        ? trends.activityBreakdown.map((item) => [
            item._id,
            formatNumber(item.count),
            formatNumber(item.completedCount),
            formatNumber(item.totalMinutes || 0),
          ])
        : [["No activity data", "0", "0", "0"]],
    });

    y = getLastTableY(doc, y) + 12;
    y = addSectionTitle(doc, "Recommended Admin Actions", y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 58, 56);
    recommendations.forEach((item) => {
      y = ensurePageSpace(doc, y, 12);
      doc.setFillColor(152, 203, 180);
      doc.circle(16, y - 1.5, 1.2, "F");
      y = addWrappedText(doc, item, 20, y, 176, 5) + 2;
    });


    y = addSectionTitle(doc, "Data Definitions", y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 78, 76);
    const definitions = [
      "Benefited users: users with at least two mood check-ins this week whose latest score improved by 5 or more points from their first weekly score.",
      "Not recovered users: tracked users whose latest weekly mood score remains below 50 and whose mood did not improve by at least 5 points.",
      "Needs follow-up users: tracked users whose latest weekly mood score is below 50, even if they improved.",
      "Weekly active users: unique users with a therapy session, mood check-in, or logged therapeutic activity in the report window.",
    ];
    definitions.forEach((item) => {
      y = ensurePageSpace(doc, y, 10);
      y = addWrappedText(doc, `- ${item}`, 14, y, 182, 4.5) + 1;
    });

    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page += 1) {
      doc.setPage(page);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120, 128, 126);
      doc.text(`AuraPulse Analytics Report - Page ${page} of ${totalPages}`, 14, 288);
      doc.text("Generated from live admin analytics data", 145, 288);
    }

    doc.save(`AuraPulse_Weekly_Impact_Report_${generatedAt.toISOString().split("T")[0]}.pdf`);
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

  const screenMoodCoverage = metrics.totalUsers > 0
    ? Math.round((metrics.outcomeTrackedUsers / metrics.totalUsers) * 100)
    : 0;

  const impactStats = [
    {
      label: "Benefited This Week",
      value: metrics.benefitedUsersThisWeek,
      description: "Mood improved by 5+ points",
    },
    {
      label: "Not Recovered",
      value: metrics.notRecoveredUsersThisWeek,
      description: "Low mood with no clear improvement",
    },
    {
      label: "Needs Follow-up",
      value: metrics.needsFollowUpUsers,
      description: "Latest mood is still below 50",
    },
    {
      label: "Mood Coverage",
      value: `${screenMoodCoverage}%`,
      description: "Total users with comparable mood data",
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
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface hover:bg-[#434A4C] transition-colors hover:text-white"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactStats.map((item) => (
          <div
            key={item.label}
            className="bg-[#111516] border border-[#1c2122] p-5 rounded-xl shadow-sm"
          >
            <div className="text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">
              {item.label}
            </div>

            <div className="text-2xl font-bold text-on-surface mt-2">
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </div>

            <div className="text-[11px] text-on-surface-variant/70 mt-1">
              {item.description}
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity Breakdown */}
        <div className="lg:col-span-2 bg-[#111516] border border-[#1c2122] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4">
            Therapeutic Activity Breakdown
          </h3>

          <div className="space-y-4">
            {trends.activityBreakdown.length === 0 ? (
              <p className="text-xs text-on-surface-variant/65">No activity data available.</p>
            ) : (
              trends.activityBreakdown.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-[#1c2122] pb-3 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-on-surface capitalize">
                      {item._id}
                    </div>
                    <div className="text-xs text-on-surface-variant/70 mt-0.5">
                      {formatNumber(item.totalMinutes || 0)} minutes spent
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs">
                    <div className="text-on-surface-variant/80">
                      <span className="font-semibold text-on-surface">{formatNumber(item.count)}</span> Started
                    </div>
                    <div className="text-on-surface-variant/80">
                      <span className="font-semibold text-primary">{formatNumber(item.completedCount)}</span> Completed
                    </div>
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
